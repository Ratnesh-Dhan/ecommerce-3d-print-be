const googleSheet = require("../services/googleSheet");

exports.saveQuote = async (req, res) => {
    try {

        console.log(req.body);

        await googleSheet.addRow(req.body);

        res.json({
            success: true,
            message: "Quote Saved Successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};