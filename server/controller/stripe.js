const express = require('express');
const router = express.Router();
const stripeService = require('../services/stripe');

router.post("/", async (req, res, next) => {
    res.send(await stripeService.stripeDonate(req));
})

module.exports = router;