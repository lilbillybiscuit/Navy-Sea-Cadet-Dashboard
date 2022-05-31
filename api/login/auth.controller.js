const database = require("../../db");
const accountcollection = database.getdatabase().collection("accounts");
const tools = require("../../tools");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
exports.signup = async function (req, res) {
  const user = {
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  };
  accountcollection.insertOne(user, function (err, result) {
    if (err) {
      res.status(500).send({ message: "Unspecified Error" });
      return;
    }
  });
};

exports.signin = async function (req, res) {
  await accountcollection.findOne({ username: req.body.username });
};
