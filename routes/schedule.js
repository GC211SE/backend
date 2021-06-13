var express = require('express');
var router = express.Router();
var path = require("path");



var connSync = (query) => new Promise(resolve => {
  conn.query(query, (err,rows) => {
    if(err){
      // console.log(err)
      resolve(false)
    } else
      resolve(rows)
  })
})



// GET: /api/schedule/buildings
//  - query: {}
router.get('/buildings', async (req, res, next) => {
  // Response all buildings
  var rows = await connSync(`select distinct(building) as name from lec_room;`)
  var result = [];
  for(var item of rows){
    if(item.name == '') continue;
    result.push(item.name)
  }
  
  res.json({result: result})
})



// GET: /api/schedule/classrooms
//  - query: {bd: "건물이름 ex> IT대학"}
router.get('/classrooms', async (req, res, next) => {
  // response all classroom name 
  // param
  // bd = building name

  if(!Object.keys(req.query).includes("bd")){
    error(res, "query error")
    return
  }

  var rows = await connSync(`select classroom as name from lec_room where building="${req.query.bd}";`)
  var result = [];
  for(var item of rows){
    if(item.name == '') continue;
    result.push(item.name)
  }

  res.json({result: result})
})



// GET: /api/schedule
//  - query: {bd: "건물이름 ex> IT대학", crn="강의실 번호 ex> 304"}
router.get('/', async (req, res, next) => {
  // param
  // bd = building name
  // crn = classroom name

  if(!Object.keys(req.query).includes("bd") || !Object.keys(req.query).includes("crn")){
    error(res, "query error")
    return
  }

  var sqlQuery = `
    select g4.lecname, g4.profname, lec_time.name, lec_time.dotw, lec_time.start, lec_time.end from (
        select g3.idx, g3.lecname, g3.profname, lec_time_idx from (
            select idx, lecname, profname from (
                select lecture_idx from (select idx, building, classroom from lec_room) g1 
                    join lec_room_link on lec_room_link.lec_room_idx = g1.idx where g1.building="${req.query.bd}" and g1.classroom="${req.query.crn}"
            ) g2 join lecture on g2.lecture_idx=lecture.idx
        ) g3 join lec_time_link on g3.idx=lec_time_link.lecture_idx
    ) g4 join lec_time on g4.lec_time_idx=lec_time.idx;
  `
  var rows = await connSync(sqlQuery)
  
  res.json({result: rows})
});



// SQL query executor (Promise)
var connSync = (query) => new Promise(resolve => {
  conn.query(query, (err,rows) => {
    if(err){
      // console.log(err)
      resolve(false)
    } else
      resolve(rows)
  })
})

// Error handler
var error = (res, msg) => {
  res.statusCode = 400;
  res.json({
    "success": false,
    "msg": msg
  })
  return
}

module.exports = router;




