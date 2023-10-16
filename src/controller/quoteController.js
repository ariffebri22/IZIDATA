const { getChuckNorrisJoke } = require("../model/quoteModel");

const getQuoteController = {
    getData: async (req, res, next) => {
        try {
            const joke = await getChuckNorrisJoke();
            res.status(200).json({ quote: joke.value, status: 200, source: joke.url });
            console.log(joke);
        } catch (error) {
            res.status(500).json({ message: "Failed to fetch Chuck Norris joke" });
        }
    },
};

module.exports = getQuoteController;
