const express = require("express")
const router = express.Router();
const userService = require("../services/user");

router.post("/login", async (req, res, next) => {
	let test = await userService.login(req);
	console.log(test);
	res.send(test);
})

router.post("/register", async (req, res, next) => {
	res.send(await userService.register(req))
})

router.post("/logout", (req, res, next) => {
	res.send(userService.logout(req))
})

router.get("/me", (req, res, next) => {
	res.send(userService.me(req))
})

module.exports = router;