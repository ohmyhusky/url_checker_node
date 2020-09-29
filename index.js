const fs = require("fs");
const { processFile } = require("./helper/log_helper");

const express = require("express");
const app = express();
const port = 3000;

var resultArray;
fs.readFile("./data/programming-task-example-data.log", "utf8", function (
  err,
  data
) {
  if (err) {
    throw err;
  }
  console.log(processFile(data.split(/\n/)));
  resultArray = processFile(data.split(/\n/));
});

app.get("/", (req, res) => {
  res.send(resultArray);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
