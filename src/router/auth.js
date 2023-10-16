const express = require("express");
const router = express.Router();
const { login, regis } = require("../controller/authController");

router.post("/login", login);
router.post("/register", regis);

module.exports = router;
