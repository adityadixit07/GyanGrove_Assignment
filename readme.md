Repository Link: [EventFinder](https://github.com/adityadixit07/GyanGrove_Assignment)

# EventFinder

## Tech Stack and Database

- **Node.js**: Chosen for its asynchronous and event-driven architecture, making it suitable for handling multiple concurrent requests efficiently.
- **Express**: Used as the web application framework to simplify routing, middleware usage, and handling HTTP requests.
- **CSV File**: Chosen as the database for its simplicity and ease of use. Event data is stored in a CSV file, with each row representing an event.

## Design Decisions

- **CSV Database**: While not as scalable as traditional databases, a CSV file was chosen for simplicity and ease of setup, suitable for smaller-scale applications.
- **OpenWeatherMap API**: By integrating weather data into event information, users can make informed decisions about attending events based on weather conditions.
- **Pagination**: Implemented pagination for the find events endpoint to improve performance and usability, especially when dealing with a large number of events.
- **Error Handling**: Error codes and messages are provided for invalid requests or failed operations to enhance user experience and debugability.

## Prerequisites

- Node.js installed on your machine
- OpenWeatherMap API key

## Setup

1. Clone the repository:

```bash
git clone https://github.com/adityadixit07/GyanGrove_Assignment
```

2. Install dependencies:

```bash
cd Gyan_Grove
npm install
```

3. Set up environment variables:

```bash
# Create a .env file in the root directory
touch .env

# Add your OpenWeatherMap API key to the .env file
WEATHER_API_KEY=your-openweathermap-api-key
```

4. Start the server:

```bash
npm start
```

The server will start at http://localhost:4500.

## API Endpoints

### Add Event

**Endpoint**: `POST /api/events/add-event`

**Request Body**:
```json
{
  "event_name": "Event Name",
  "city_name": "City Name",
  "date": "YYYY-MM-DD",
  "time": "HH:MM:SS",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

**Response**:
```json
{
  "message": "Event added successfully."
}
```

### Find Events

**Endpoint**: `GET /api/events/find`

**Query Parameters**:
- `latitude`: Latitude of the user's location.
- `longitude`: Longitude of the user's location.
- `date`: Date in `YYYY-MM-DD` format.

**Example Request**:
```
GET /api/events/find?latitude=38.33354302&longitude=157.9579286&date=2024-03-01
```

**Example Response**:
```json
{
  "events": [
    {
      "event_name": "Event Name",
      "city_name": "City Name",
      "date": "YYYY-MM-DD",
      "weather": "Weather Details",
      "distance_km": 100.5
    }
  ],
  "page": 1,
  "pageSize": 10,
  "totalEvents": 1,
  "totalPages": 1
}
```

## Error Codes

- 400: Bad Request - Invalid or missing parameters in the request.

---

Feel free to customize this README file further based on your specific project requirements and preferences.
```