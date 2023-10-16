const Pool = require("../config/db");

const transaction = async (data) => {
    const { trx_id, user_id, amount } = data;
    console.log("model regis");
    try {
        const queryString = `INSERT INTO transaction(trx_id, user_id, amount) 
        VALUES($1, $2, $3)`;
        const values = [trx_id, user_id, amount];

        const result = await Pool.query(queryString, values);

        if (result.rowCount === 1) {
            return "Transaction data inserted successfully.";
        } else {
            return "Transaction data insertion failed.";
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const checkTrxAvailability = async (trx_id) => {
    try {
        const queryString = `SELECT * FROM transaction WHERE trx_id = $1::text`; // Menunjukkan bahwa $1 adalah tipe data teks (string)
        const values = [trx_id];
        const result = await Pool.query(queryString, values);
        return result.rows[0];
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const checkAmount = async (user_id) => {
    try {
        const queryString = "SELECT * FROM balance WHERE user_id = $1";
        const values = [user_id];
        const result = await Pool.query(queryString, values);
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const putAmount = async (amount, user_id) => {
    try {
        const queryString = "UPDATE balance SET amount_available=$1 WHERE user_id=$2";
        const values = [amount, user_id];
        const result = await Pool.query(queryString, values);
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const getTransaction = async () => {
    try {
        const queryString = `SELECT
        b.user_id,
        u.username,
        b.amount_available as balance,
        json_agg(json_build_object('trx_id', t.trx_id, 'amount', t.amount)) AS transactions
    FROM
        balance AS b
    JOIN
        users AS u ON b.user_id = u.id
    LEFT JOIN
        transaction AS t ON b.user_id = t.user_id
    GROUP BY
        b.user_id, u.username, b.amount_available;`;
        const result = await Pool.query(queryString);
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

module.exports = { transaction, checkTrxAvailability, checkAmount, putAmount, getTransaction };
