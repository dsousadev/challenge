require("dotenv").load();
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("mongo connected");
});

const queueSchema = new mongoose.Schema({
  queue: []
});

const Queue = db.model("Queue", queueSchema);

module.exports = {
  db,
  Queue
};
