const axios = require("axios");

const getChuckNorrisJoke = async () => {
    try {
        const response = await axios.get("https://api.chucknorris.io/jokes/random");
        const joke = response.data;
        return joke;
    } catch (error) {
        throw error;
    }
};

module.exports = { getChuckNorrisJoke };
