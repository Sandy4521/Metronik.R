var express = require("express");
var MongoClient = require("mongodb").MongoClient;
var cors = require("cors");
const multer = require("multer");

const app = express();
app.use(cors());

var CONNECTION_STRING =
  "mongodb+srv://sandorp:wAuaaHTK4McuIPcH@cluster0.97n9xxm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
var DATABASE_NAME = "v2";
var database;

app.listen(5038, () => {
  MongoClient.connect(CONNECTION_STRING, (error, client) => {
    database = client.db(DATABASE_NAME);
    console.log("Mongo DB is working fine");
  });
});

app.get("/api/v2/GetNotes", (request, response) => {
  database
    .collection("metronik db")
    .find({})
    .toArray((error, result) => {
      response.json(result);
    });
});

app.post("/api/v2/AddNotes", multer().none(), (request, response) => {
  database.collection("metronik db").count({}, function (error, numOfDocs) {
    database.collection("metronik db").insertOne({
      id: (numOfDocs + 1).toString(),
      description: request.body.newNotes,
    });
    response.json("Order Successfully");
  });
});

app.delete("/api/v2/DeleteNotes", (request, response) => {
  database.collection("metronik db").deleteOne({
    id: request.query.id,
  });
  response.json("Order Deleted");
});
