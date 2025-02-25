const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://chinthagovardhana90:rxremMSXRKLthBvd@namastenode.hl2ce.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
