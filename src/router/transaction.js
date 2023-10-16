const express = require("express");
const router = express.Router();
const { postData, getData } = require("../controller/transactionController");
const { Protect } = require("./../middleware/Protect");

router.post("/", Protect, postData);
router.get("/get", Protect, getData);

module.exports = router;
