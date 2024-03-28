const express = require("express");
const {
  addEvent,
  findEvent,
  getEvents,
} = require("../controllers/EventController");

const EventRoutes = express.Router();

EventRoutes.route("/add-event").post(addEvent); //add event
EventRoutes.route("/find").get(findEvent); //find event
EventRoutes.route("/all").get(getEvents); //get all events

module.exports = EventRoutes;
