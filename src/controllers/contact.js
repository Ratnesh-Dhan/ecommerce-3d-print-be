const { addContactRow } = require("../services/contactSheet");
const contact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // sending details to spread Sheet
    if (!name || !email) {
      return res.status(400).json({ error: "Missing fields" });
    }

    await addContactRow({ name, email, message });

    res.status(200).json({ message: "success" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "API failed" });
  }
};

module.exports = {
  contact,
};
