var express = require('express');
var router = express.Router();
var path = require("path");



router.get("/", (req, res, next) => {


  res.json({})
})



var error = (res, msg) => {
  res.statusCode = 400;
  res.json({
    "success": false,
    "msg": msg
  })
  return
}

module.exports = router