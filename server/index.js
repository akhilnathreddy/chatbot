const express = require("express");

const app = express();
const PORT = 3000;

// Route
app.get("/", (req, res) => {
  res.send("Hello World 🚀");
});

// Server start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});