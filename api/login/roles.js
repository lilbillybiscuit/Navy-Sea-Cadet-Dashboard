var database = require("../db");
var tools = require("../tools");
var rolecollection = database.getdatabase().collection("roles");
async function initialize_roles() {
  await rolecollection.insertOne({
    name: "admin",
  });
  await rolecollection.insertOne({
    name: "moderator",
  });
  await rolecollection.insertOne({
    name: "user",
  });
}
