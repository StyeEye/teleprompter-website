const express = require('express');
const router = express.Router();
const projectService = require('../services/projects');

router.post("/", async (req, res, next) => {
    res.send(await projectService.getProject(req));
});

module.exports = router;