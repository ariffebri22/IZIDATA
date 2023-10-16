const Pool = require("../config/db");

const regis = async (data) => {
    const { email, username, password } = data;
    console.log("model regis");
    try {
        const queryString = `INSERT INTO users(email, username, password) 
        VALUES($1, $2, $3) RETURNING id`;
        const values = [email, username, password];

        const result = await Pool.query(queryString, values);
        return result.rows[0];
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const login = async (data) => {
    const { email } = data;
    console.log("model login");
    try {
        const queryString = "SELECT * FROM users WHERE email=$1";
        const values = [email];

        const result = await Pool.query(queryString, values);
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const checkEmailAvailability = async (email) => {
    try {
        const queryString = "SELECT * FROM users WHERE email=$1";
        const values = [email];
        const result = await Pool.query(queryString, values);
        return result.rows.length === 0;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

module.exports = {
    regis,
    login,
    checkEmailAvailability,
};
