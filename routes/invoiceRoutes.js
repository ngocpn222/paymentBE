const express = require("express");
const router = express.Router();

// Dummy route
router.get("/", (req, res) => {
  res.json({ message: "Invoice routes working!" });
});

module.exports = router;
