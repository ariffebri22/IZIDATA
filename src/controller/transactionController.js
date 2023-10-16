require("dotenv").config();
const jwt = require("jsonwebtoken");
const xss = require("xss");
const { transaction, checkTrxAvailability, checkAmount, putAmount, getTransaction } = require("../model/transactionModel");

const transactionController = {
    postData: async (req, res, next) => {
        try {
            const { trx_id, amount } = req.body;
            const token = req.headers.authorization.split(" ")[1];
            const decodedToken = jwt.decode(token);
            const user_id = decodedToken.data.id;
            const amountAvailable = await checkAmount(user_id);
            const balance = amountAvailable.rows[0].amount_available;

            console.log("this balance", balance);
            console.log(user_id);

            console.log("post data");
            console.log(trx_id, amount);

            if (!trx_id || !amount) {
                return res.status(400).json({ status: 400, message: "Input Trx_id and Amount are required" });
            }

            const isTrxAvailable = await checkTrxAvailability(trx_id);
            if (isTrxAvailable) {
                console.log("cek trx", isTrxAvailable);
                return res.status(400).json({ status: 400, message: "Transaction with this Trx_id already exists." });
            }

            if (amount <= 0 || balance < amount) {
                return res.status(400).json({ status: 400, message: "Transaction failed, make sure your balance is sufficient" });
            }

            console.log("data");
            const data = {
                trx_id: xss(trx_id),
                user_id,
                amount: xss(amount),
            };

            const newAmount = balance - amount;

            console.log(data);
            const result = await transaction(data);
            const updateAmount = await putAmount(newAmount, user_id);
            console.log(result);
            console.log(updateAmount);

            setTimeout(() => {
                res.status(200).json({ trx_id, amount });
            }, 30000);
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: 500, message: "Something Wrong" });
        }
    },
    getData: async (req, res, next) => {
        try {
            const result = await getTransaction();
            res.status(200).json({ status: 200, data: result.rows });
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: 500, message: "Something Wrong" });
        }
    },
};

module.exports = transactionController;
