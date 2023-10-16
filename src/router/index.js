const app = require("express");
const router = app.Router();
const auth = require("./auth");
const quote = require("./quote");
const transaction = require("./transaction");

router.use("/api/v1/auth", auth);
router.use("/api/v1/quote", quote);
router.use("/api/v1/transaction", transaction);

module.exports = router;
