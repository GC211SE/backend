var express = require('express');
var router = express.Router();
var path = require("path");

// For crawling target site
var axios = require("axios")



// GET: /api/sign
//  - query: {id: "아이디", pw="패스워드"}
// Refered by https://gist.github.com/DokySp/7115187703fe5cb3e5bc629ee81cb5da
router.get('/', async (req, res, next) => {

  if(!Object.keys(req.query).includes("id") || !Object.keys(req.query).includes("pw")){
    error(res,"query error")
    return
  }

  var userId = req.query.id
  var userPw = req.query.pw

  var query = `?email=${userId}&password=${userPw}`

  var resHtml = await getHtml("https://wind.gachon.ac.kr/ko/process/member/login" + query)
  
  if(resHtml.length == 0){
    error(res,"login failed")
    return
  }

  var resData = resHtml.data.substring(0,10000)

  var name = resData.split("div class=\"info\"")[1]
  var dept = name.split("<small>")[1]
  var photoUrl = resData.split("i class=\"photo\"")[1]

  name = name.split("<b>")[1].split("</b>")[0]
  dept = dept.split("</small>")[0]
  photoUrl = photoUrl.split("style=\"background-image:url(")[1].split(");\"></i>")[0]
  photoUrl = "https://wind.gachon.ac.kr" + photoUrl

  res.json({
    "success": true,
    "id": userId,
    "name": name,
    "dept": dept,
    "photo": photoUrl
  })
  return
});



const getHtml = async (targetLink) => {
  var res

  try{
    res = await axios.get(targetLink)
    var isSuccess = res.data["success"]

    if(isSuccess){
      var setCookie = res.headers["set-cookie"][0].split(";")[0]
      return await axios.get("https://wind.gachon.ac.kr/", {
        headers: {
          cookie: setCookie
        }
      })
    }
    return ""
    
  } catch (e){
    console.log(e)
  }
}



var error = (res, msg) => {
  res.statusCode = 400;
  res.json({
    "success": false,
    "msg": msg
  })
  return
}

module.exports = router;
