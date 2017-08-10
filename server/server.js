var express = require("express");
var app = express();
var parser = require("body-parser");
var routes = require("./routes");

app.use(parser.json());
app.use(express.static("client/build"));
app.use("/", routes);
app.listen(3000, console.log("Listening on 3000"));
