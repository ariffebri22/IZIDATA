require("dotenv").config();
const { regis, login, checkEmailAvailability } = require("../model/authModel");
const { hash, verify } = require("../helper/hashPassword");
const jwt = require("jsonwebtoken");
const xss = require("xss");

const secretKey = process.env.SECRET_KEY;

const authController = {
    regis: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            console.log("post data");
            console.log(email, password);

            if (!email || !password) {
                return res.status(400).json({ status: 400, message: "Input Email and Password are required" });
            }

            if (!email.includes("@")) {
                return res.status(400).json({ status: 400, message: "Please enter the appropriate email" });
            }

            const isUsernameAvailable = await checkEmailAvailability(email);
            if (!isUsernameAvailable) {
                return res.status(400).json({ message: "Email already exists, login or enter another email" });
            }

            const hashedPassword = await hash(password);

            const username = email.split("@")[0];

            console.log("data");
            const data = {
                email: xss(email),
                username: xss(username),
                password: xss(hashedPassword),
            };

            console.log(data);
            const result = await regis(data);
            console.log(result);

            res.status(200).json({ user_id: result.id, status: 200, message: "Registration success" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: 500, message: "Internal server error" });
        }
    },

    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ status: 400, message: "Input Email and Password are required" });
            }

            const dataUsers = await login({ email });

            if (dataUsers && dataUsers.rows.length > 0) {
                const storedPassword = dataUsers.rows[0].password;
                if (typeof storedPassword === "string" && typeof password === "string") {
                    const isPasswordValid = await verify(storedPassword, password);
                    if (isPasswordValid) {
                        const token = jwt.sign({ data: dataUsers.rows[0] }, secretKey, { expiresIn: "24h" });

                        return res.status(200).json({ status: 200, message: "Login Successfully", token });
                    } else {
                        return res.status(401).json({ status: 401, message: "Wrong password" });
                    }
                } else {
                    return res.status(500).json({ status: 500, message: "Internal server error: Invalid password format" });
                }
            } else {
                return res.status(404).json({ status: 404, message: "Email not found, please register first" });
            }
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ status: 500, message: "Internal server error" });
        }
    },
};

module.exports = authController;
