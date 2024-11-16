const express = require("express");
const app = express();
app.use("/test", (req, res) => {
  res.send("hello nodejs");
});
app.listen(3000, () => {
  console.log("Hello Node jbv");
});
