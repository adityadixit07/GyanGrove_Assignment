const fs = require("fs");
const csv = require("csv-parser");
const axios = require("axios");

class EventController {
  // Method to add an event
  static addEvent(req, res) {
    const eventData = {
      event_name: req.body.event_name,
      city_name: req.body.city_name,
      date: req.body.date,
      time: req.body.time,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
    };
    if (
      !eventData.event_name ||
      !eventData.city_name ||
      !eventData.date ||
      !eventData.time ||
      !eventData.latitude ||
      !eventData.longitude
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Save the event to the CSV file
    EventController.saveEventToCSV(eventData); // Corrected method invocation

    res.status(201).json({ message: "Event added successfully." });
  }

  // Method to save event data to CSV file
  static saveEventToCSV(eventData) {
    const csvData = `${eventData.event_name},${eventData.city_name},${eventData.date},${eventData.time},${eventData.latitude},${eventData.longitude}\n`;

    // Append data to the CSV file
    fs.appendFile("./gg_dataset.csv", csvData, (err) => {
      if (err) {
        console.error("Error writing to CSV:", err);
      }
    });
  }

  // Method to find events within range of latitude, longitude, and specified date
  static async findEvent(req, res) {
    const { latitude, longitude, date } = req.query;

    // Validate latitude, longitude, and date
    if (!latitude || !longitude || !date) {
      return res
        .status(400)
        .json({ error: "Latitude, longitude, and date are required." });
    }

    const targetDate = new Date(date);
    const endDate = new Date(targetDate);
    endDate.setDate(endDate.getDate() + 14);

    const eventsWithinRange = [];

    fs.createReadStream("./gg_dataset.csv")
      .pipe(csv())
      .on("data", (row) => {
        const eventDate = new Date(row.date);
        if (
          eventDate >= targetDate &&
          eventDate <= endDate &&
          EventController.calculateDistance(
            latitude,
            longitude,
            row.latitude,
            row.longitude
          ) <= 100 // Adjust this distance as needed
        ) {
          eventsWithinRange.push(row);
        }
      })
      .on("end", async () => {
        // Sort events by the earliest event after the specified date
        eventsWithinRange.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Paginate events with a page size of 10
        const pageSize = 10;
        const pageNumber = req.query.page || 1;
        const startIndex = (pageNumber - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedEvents = eventsWithinRange.slice(startIndex, endIndex);

        // Fetch weather information and calculate distance for each event
        for (let event of paginatedEvents) {
          try {
            const weatherData = await EventController.getWeatherData(
              event.latitude,
              event.longitude
            );
            const distance = EventController.calculateDistance(
              latitude,
              longitude,
              event.latitude,
              event.longitude
            );

            event.weather = weatherData;
            event.distance = distance;
          } catch (error) {
            console.error("Error fetching weather data:", error);
          }
        }

        res.json(paginatedEvents);
      });
  }

  // Function to calculate the distance between two coordinates (in this case, using the Haversine formula)
  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = EventController.deg2rad(lat2 - lat1);
    const dLon = EventController.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(EventController.deg2rad(lat1)) *
        Math.cos(EventController.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  static deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  // Function to get weather data using latitude and longitude
  static async getWeatherData(latitude, longitude) {
    const apiKey = process.env.WEATHER_API_KEY; // Provide your API key here
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    const response = await axios.get(apiUrl);
    return response.data;
  }

  // get all events
  static async getEvents(req, res) {
    const events = [];
    fs.createReadStream("./gg_dataset.csv")
      .pipe(csv())
      .on("data", (row) => {
        events.push(row);
      })
      .on("end", async () => {
        res.json(events);
      });
  }
}

module.exports = EventController;
