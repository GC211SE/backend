var express = require('express');
var router = express.Router();
var path = require("path");

// For crawling target site
var axios = require("axios")
var cheerio = require("cheerio")
// https://velog.io/@yesdoing/Node.js-에서-웹-크롤링하기-wtjugync1m

const year = `2021`
const semester = `10` // 10, 11, 20, 21
const campus = `21` // "": all, 20: Global, 21: Medical
const link = `http://sg.gachon.ac.kr/main?attribute=timeTableJson&lang=ko&year=${year}&hakgi=${semester}&menu=1&p_group_cd=${campus}&p_isu_cd=3&p_gwamok_nm=%25%25&initYn=Y&_search=false&rows=-1&page=1&sord=asc`



/* GET home page. */
router.get('/test', async (req, res, next) => {

  console.log("=======================================")

  resHtml = await getHtml(link)
  // console.log(resHtml.data)
  // const $ = cheerio.load(resHtml.data)
  var dataS = JSON.stringify(resHtml.data)
  var data = JSON.parse(dataS)
  data = data.rows
  console.log(data[0])
  console.log(data[1])
  console.log(data[2])
  console.log(data.length)

  res.sendFile(path.join(__dirname, "../public/index.html"))
});



module.exports = router;
