// controllers/shop.js
// This controller provides a list of available 3D printed designs for the shop page.

// Hard‑coded catalogue of designs. In a real application this would likely come from a database.
const designs = [
  "Lithophane Lamps",
  "Personalized Lithophane Photo Frames",
  "Spiral Vases",
  "Modern Planters",
  "Personalized Nameplates",
  "Custom Keychains",
  "Mobile Phone Stands",
  "Desk Organizers",
  "Cable Organizers",
  "Headphone Stands",
  "Controller Stands",
  "Articulated Dragons",
  "Articulated Octopus",
  "Raspberry Pi & Arduino Cases"
];

// GET /shop – returns the list of designs as JSON.
const getDesigns = (req, res) => {
  try {
    res.status(200).json({ designs });
  } catch (e) {
    console.error(e);
    res.status(500).send('Server error while fetching designs');
  }
};

module.exports = {
  getDesigns,
};
