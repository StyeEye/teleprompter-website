const express = require('express');
const router = express.Router();
const eventService = require('../services/events');

router.post("/", async (req, res, next) => {
    res.send(await eventService.getEvents(req));
});

router.post("/create", async (req, res, next) => {
    res.send(await eventService.addEvent(req));
});

router.delete("/", async (req, res, next) => {
    res.send(await eventService.removeEvent(req));
});

router.patch("/", async (req, res, next) => {
    res.send(await eventService.updateEvents(req));
});

module.exports = router;