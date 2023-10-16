const express = require("express");
const router = express.Router();
const { getData } = require("../controller/quoteController");

router.get("/", getData);

module.exports = router;
