var express = require('express');
var router = express.Router();
var path = require("path");

// For crawling target site
var axios = require("axios")
var cheerio = require("cheerio")
// https://velog.io/@yesdoing/Node.js-에서-웹-크롤링하기-wtjugync1m


/* GET home page. */
router.get('/test', async (req, res, next) => {

  console.log("=======================================")

  await getHtml().then((resHtml) => {
    console.log(resHtml.data)
    const $ = cheerio.load(resHtml.data)

    // console.log($)

  })

  res.sendFile(path.join(__dirname, "../public/index.html"))
});



const getHtml = async () => {
  try{
    return await axios.get("https://doky.space/")
  } catch (e){
    console.log(e)
  }
}


module.exports = router;
