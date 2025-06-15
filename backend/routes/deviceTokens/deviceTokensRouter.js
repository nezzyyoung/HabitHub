const express = require("express");
const router = express.Router();
const { registerDeviceToken } = require("../../controllers/deviceTokens.controller");
const bindUser = require("../../middleware/bindUser");

router.post("/register", bindUser, registerDeviceToken);

module.exports = router;
