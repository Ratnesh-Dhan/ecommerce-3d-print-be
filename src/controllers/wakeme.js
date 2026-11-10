const wakeme = async (req, res) => {
  try {
    res.status(200).send("I am wake...!");
  } catch (e) {
    console.log(e);
    res.status(500).send("Server is sleeping...!");
  }
};

module.exports = {
  wakeme,
};
