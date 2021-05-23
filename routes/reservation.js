var express = require('express');
var router = express.Router();
var path = require("path");
var {google} = require('googleapis');
var cron = require('node-cron');
var admin = require("firebase-admin");
require('dotenv').config({ path: "../fbconfig" });



let testset = [];


var getQuery = (bd, crn) => `
  select g4.lecname, g4.profname, lec_time.name, lec_time.dotw, lec_time.start, lec_time.end, g4.roomidx from (
      select g3.idx, g3.lecname, g3.profname, lec_time_idx, g3.roomidx from (
          select idx, lecname, profname, g2.roomidx from (
              select lecture_idx, g1.idx as roomidx from (select idx, building, classroom from lec_room) g1 
                  join lec_room_link on lec_room_link.lec_room_idx = g1.idx where g1.building="${bd}" and g1.classroom="${crn}"
          ) g2 join lecture on g2.lecture_idx=lecture.idx
      ) g3 join lec_time_link on g3.idx=lec_time_link.lecture_idx
  ) g4 join lec_time on g4.lec_time_idx=lec_time.idx;
  `

var connSync = (query) => new Promise(resolve => {
  conn.query(query, (err,rows) => {
    if(err){
      console.log(err)
      resolve(false)
    } else
      resolve(rows)
  })
})

// FCM
var sendFCMMsg = (msg) => {
  // Send a message to the device corresponding to the provided
  admin.messaging().send(msg)
  .then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    // 사용자가 앱 삭제 시, 해당 appToken으로 메시지 발송 시 catch됨
    console.log('Error sending message:', error);
  });
}



// 예약 생성 
// - int        / idx
// - str        / userid
// - timestamp  / start
// - timestamp  / end
// - int        / lec_room_idx
// - int        / enable
// - str        / fb_key
//
router.post("/", async (req, res, next) => {

  if(!Object.keys(req.body).includes("userid") || 
    !Object.keys(req.body).includes("start") || 
      !Object.keys(req.body).includes("end") || 
        !Object.keys(req.body).includes("bd") || 
          !Object.keys(req.body).includes("crn") || 
            !Object.keys(req.body).includes("fb_key")) {
    error(res, "query error")
    return
  }

  // uid = 사용자 아이디 (없으면 anonimus 등록)
  //  -> 현 시간 기준 30분 자동 등록 (프론트에서 처리)
  if(req.body.userid.length == 0){
    error(res, "query error: userid")
    return
  }
  var userid = req.body.userid

  if(req.body.start.length == 0){
    error(res, "query error: start")
    return
  }
  var startTime = req.body.start
  
  if(req.body.end.length == 0){
    error(res, "query error: end")
    return
  }
  var endTime = req.body.end

  if(req.body.bd.length == 0){
    error(res, "query error: bd")
    return
  }
  var building = req.body.bd

  if(req.body.crn.length == 0){
    error(res, "query error: crn")
    return
  }
  var classroom = req.body.crn

  if(req.body.fb_key == 0){
    error(res, "query error: fb_key")
    return
  }
  var firebaseKey = req.body.fb_key

  var enable = 0
  if(Object.keys(req.body).includes('enable')){
    enable = req.body.enable
  }


  var result = await connSync(getQuery(building, classroom))
  if(!result || result.length == 0){
    error(res, "sql error")
    return
  }

  var roomIdx = result[0].roomidx

  result = await connSync(`insert into reservation(userid, start, end, lec_room_idx, fb_key, enable) 
    value("${userid}", "${startTime}", "${endTime}", ${roomIdx}, "${firebaseKey}", ${enable})`)

  console.log(result.insertId)

  if(!result){
    error(res, "sql error")
    return
  }

  res.json({
    "success": true,
    "idx": result.insertId
  })
})



// 예약 확인: Check-In
router.patch("/checkin", async (req, res, next) => {
  // 실제 예약 idx를 활성화시킴!
  // idx
  // userid
  if(!Object.keys(req.body).includes("idx") || !Object.keys(req.body).includes("userid")){
    error(res, "query error")
    return
  }
  if(isNaN(req.body.idx)){
    error(res, "query error: idx")
    return
  }
  var idx = Number(req.body.idx)

  if(req.body.userid.length == 0){
    error(res, "query error: userid")
    return
  }
  var userid = req.body.userid

  // 이미 활성화된 예약이 있는지 확인 
  var result = await connSync(`select count(enable) as count from reservation where userid = "${userid}" and enable = 1`)
  if(!result){
    error(res, "sql error")
    return
  }

  console.log(result[0].count)
  if(result[0].count != 0){
    error(res, "have another activated reservation")
    return
  }


  result = await connSync(`update reservation set enable = 1 where idx = ${idx}`)

  if(!result){
    error(res, "sql error")
    return
  }

  result = await connSync(`select fb_key from reservation where idx = ${idx}`)
  for(var i of result){
    console.log(i.fb_key)
    var message = {
      notification: {
        "title": "체크인 되었습니다.",
        "body": "강의실 사용이 시작되었습니다."
      },
      token: i.fb_key
    };
    sendFCMMsg(message)
  }

  res.json({
    "success": true,
  })
})

// 예약 가져오기: 해당 강의실의 모든 예약 및 사용중
router.get("/all", async (req, res, next) => {
  // bd = 빌딩이름
  // crn = 강의실 번호
  if(!Object.keys(req.query).includes("bd") || !Object.keys(req.query).includes("crn")){
    error(res, "query error")
    return
  }
  var building = req.query.bd
  var classroom = req.query.crn

  var result = await connSync(getQuery(building, classroom))
  if(!result){
    error(res, "sql error")
    return
  }

  var roomIdx = result[0].roomidx

  result = await connSync(`select userid, start, end, enable from reservation where lec_room_idx=${roomIdx} and enable <= 1`)
  if(!result){
    error(res, "sql error")
    return
  }

  res.json({success: result})
})



// 예약 가져오기: 현재 시간 해당 강의실 총 예약 및 사용중 수 가져오기
router.get("/currtotal", async (req, res, next) => {
  // bd = 빌딩이름
  // crn = 강의실 번호
  if(!Object.keys(req.query).includes("bd") || !Object.keys(req.query).includes("crn")){
    error(res, "query error")
    return
  }
  var building = req.query.bd
  var classroom = req.query.crn

  var result = await connSync(getQuery(building, classroom))
  if(result.length == 0){
    error(res, "sql error")
    return
  }

  var roomIdx = result[0].roomidx
  
  var nowTimeString = new Date(Date.now()+32400000).toISOString().replace("T", " ").replace("Z", "")
  
  var result0 = await connSync(`select count(enable) as reservation from reservation 
    where start >= "${nowTimeString}" and lec_room_idx=${roomIdx} and enable = 0`)

  var reserved
  if(reserved != false)
    reserved = result0[0].reservation
  else {
    error(res, "sql error")
    return
  }

  var result1 = await connSync(`select count(enable) as uses from reservation 
    where start <= "${nowTimeString}" and end >= "${nowTimeString}" and lec_room_idx=${roomIdx} and enable = 1`)
  var using
  if(using != false)
    using = result1[0].uses 
  else {
    error(res, "sql error")
    return
  }
  
  res.json({success: {reserved: reserved, using: using}})
})

// 예약 가져오기: 지정 시간 해당 강의실 총 예약 및 사용중 수 가져오기
router.get("/targettotal", async (req, res, next) => {
  // bd = 빌딩이름
  // crn = 강의실 번호
  // time = 지정시간
  if(!Object.keys(req.query).includes("bd") || !Object.keys(req.query).includes("crn") || !Object.keys(req.query).includes("time")){
    error(res, "query error")
    return
  }
  var building = req.query.bd
  var classroom = req.query.crn
  var targetTime = req.query.time

  var result = await connSync(getQuery(building, classroom))
  if(result.length == 0){
    error(res, "sql error")
    return
  }

  var roomIdx = result[0].roomidx
  
  var result0 = await connSync(`select count(enable) as reservation from reservation 
    where start >= "${targetTime}" and lec_room_idx=${roomIdx} and enable = 0`)
  var reserved
  if(reserved != false)
    reserved = result0[0].reservation
  else {
    error(res, "sql error")
    return
  }
  
  res.json({success: {reserved: reserved}})
})



// 예약 가져오기: 개인 예약 및 사용중 모두 가져오기 
router.get("/personal", async (req, res, next) => {
  // uid = 사용자 아이디
  if(!Object.keys(req.query).includes("userid")){
    error(res, "query error")
    return
  }
  if(req.query.userid.length == 0){
    error(res, "query error: userid")
    return
  }
  var userid = req.query.userid

  var result = await connSync(`select reservation.idx, userid, start, end, building, classroom, enable from 
    (select * from lec_room) g1 join reservation on g1.idx = lec_room_idx where userid="${userid}" order by start`)
  if(!result) {
    error(res, "sql error")
    return
  }

  res.json({success: result})
})

// 예약 가져오기: 개인 현재 예약정보 가져오기
router.get("/current", async (req, res, next) => {
  // userid = 사용자 아이디
  // ~~idx = 현재 예약 인덱스~~

  // if(!Object.keys(req.query).includes("idx") || !Object.keys(req.query).includes("userid")){
  if(!Object.keys(req.query).includes("userid")){
    error(res, "query error")
    return
  }
  // if(isNaN(req.query.idx)){
  //   error(res, "query error: idx")
  //   return
  // }
  // var idx = Number(req.query.idx)

  if(req.query.userid.length == 0){
    error(res, "query error: userid")
    return
  }
  var userid = req.query.userid

  var result = await connSync(`select reservation.idx, userid, start, end, building, classroom, enable from 
  (select * from lec_room) g1 join reservation on g1.idx = lec_room_idx where userid="${userid}" and enable=1`)
  if(!result) {
    error(res, "sql error")
    return
  }

  if(result.length == 1)
    res.json({success: result[0]})
  else 
    res.json({success: {}})
})


// checkout
router.patch("/checkout", async (req, res, next) => {
  // uid = 사용자 아이디
  // ~~idx = 현재 예약 인덱스~~ => enable 1인 것을 전부 2로 변경

  // if(!Object.keys(req.body).includes("idx") || !Object.keys(req.body).includes("userid")){
  if(!Object.keys(req.body).includes("userid")){
    error(res, "query error")
    return
  }
  // if(isNaN(req.body.idx)){
  //   error(res, "query error: idx")
  //   return
  // }
  // var idx = Number(req.body.idx)

  if(req.body.userid.length == 0){
    error(res, "query error: userid")
    return
  }
  var userid = req.body.userid
  var resultMsg = await connSync(`select fb_key from reservation where userid="${userid}" and enable=1`)

  var result = await connSync(`update reservation set enable=2 where userid="${userid}" and enable=1`)
  if(!result) {
    error(res, "sql error")
    return
  }

  for(var i of resultMsg){
    console.log(i.fb_key)
    var message = {
      notification: {
        "title": "체크아웃 되었습니다.",
        "body": "서비스를 이용해주셔서 감사합니다."
      },
      token: i.fb_key
    };
    sendFCMMsg(message)
  }


  res.json({success: true})
})

// cancel
router.patch("/cancel", async (req, res, next) => {
  // uid = 사용자 아이디
  // idx = 현재 예약 인덱스

  if(!Object.keys(req.body).includes("idx") || !Object.keys(req.body).includes("userid")){
    error(res, "query error")
    return
  }
  if(isNaN(req.body.idx)){
    error(res, "query error: idx")
    return
  }
  var idx = Number(req.body.idx)

  if(req.body.userid.length == 0){
    error(res, "query error: userid")
    return
  }
  var userid = req.body.userid

  var result = await connSync(`update reservation set enable=2 where userid="${userid}" and idx=${idx}`)
  if(!result) {
    error(res, "sql error")
    return
  }

  res.json({success: true})
})




// 예약 연장 기능 구현 X

// Test API for viewing MySQL table
router.get('/showtable', async (req, res, next) => {

  var result = await connSync(`select * from reservation`)
  if(!result) {
    error(res, "sql error")
    return
  }

  res.json(result);
});

// Test API for testing Firebase Cloud Messaging
router.post('/pushtest', function(req, res, next) {

  console.log(req.body.appToken);

  testset.push(req.body.appToken);

  console.log(testset)

  res.json({
    success: true
  });
});

// Initialize FB
var serviceAccount = require("../keystore/gcse211-firebase-adminsdk.json");
const { containeranalysis } = require('googleapis/build/src/apis/containeranalysis');

function getAccessToken() { // Get JWT access token
  return new Promise(function(resolve, reject) {
    const jwtClient = new google.auth.JWT(
        serviceAccount.client_email,
        null,
        serviceAccount.private_key,
        [
          'https://www.googleapis.com/auth/gmail.readonly',
          'https://www.googleapis.com/auth/admin.directory.user.readonly',
          'https://www.googleapis.com/auth/admin.directory.group'
        ],
        null
    );
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens.access_token);
    });
  });
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});









// node-cron
// run in each minutes
cron.schedule('* * * * *', async () => {
  // - 입실하면 노티
  //   - check in 에다가!

  // - 예약시간 10분 전 noti
  // - 예약시간 되면 입실 안내 noti
  // - 예약 시간 후 10분 안에 입실 안하면 noti 보내고 자동취소
  //   - Checkout: 10분 전, 시간 됬을 때, push 알림 및 테이블 드롭 기능 필요
  //   - 시간 이미 지났는데 enable = 0인 경우 2로 변경
  // - 퇴실 10분 전 noti
  // - 끝나면 noti

  var now = new Date();
  now.setHours(now.getHours()+9) // GMT+9
  now.setSeconds(0) // Ignore second
  now.setMilliseconds(0) // Ignore millisecond
  console.log("currentTime", `${now.getFullYear()}.${now.getMonth()}.${now.getDate()} ${now.getHours()}:${now.getMinutes()}`);

  await getAccessToken()

  // 1. 예약시간 10분 전 noti
  // 2. 예약시간 되면 입실 안내 noti
  var rows = await connSync(`select * from reservation where enable = 0`);
  
  for(var i of rows){
    var target = new Date(i.start)
    var targetBefore10 = new Date(i.start)
    var targetAfter10 = new Date(i.start)
    targetBefore10.setMinutes(targetBefore10.getMinutes() - 10)
    targetAfter10.setMinutes(targetAfter10.getMinutes() + 10)


    if(now.valueOf() == targetBefore10.valueOf()){
      // 1. 예약 10분 전
      var message = {
        notification: {
          "title": "예약 10분 전입니다",
          "body": "강의실에 늦지 않게 입장해주세요. 예약시간이 10분 지나면 자동으로 예약이 취소됩니다."
        },
        token: i.fb_key
      };

      sendFCMMsg(message)
    }
    if(now.valueOf() == target.valueOf()){
      // 2. 예약 시간
      var message = {
        notification: {
          "title": "예약 시간입니다",
          "body": "강의실에 입장 후 체크인을 해주세요."
        },
        token: i.fb_key
      };

      sendFCMMsg(message)
    }


    // 3. 예약 시간 후 10분 안에 입실 안하면 noti 보내고 자동취소
    //   - Checkout: 10분 전, 시간 됬을 때, push 알림 및 테이블 드롭 기능 필요
    //   - 시간 이미 지났는데 enable = 0인 경우 2로 변경
    if(now.valueOf() >= targetAfter10.valueOf()){
      var message = {
        notification: {
          "title": "예약이 취소되었습니다.",
          "body": "예약시간이 10분 지나 자동으로 취소되었습니다."
        },
        token: i.fb_key
      };
      
      await connSync(`update reservation set enable = 2 where idx = ${i.idx}`)

      sendFCMMsg(message)
    }
  }


  // 4. 퇴실 10분 전 noti
  // 5. 끝나면 noti
  var rows = await connSync(`select * from reservation where enable = 1`);
  
  for(var i of rows){
    var target = new Date(i.end)
    var targetBefore10 = new Date(i.end)
    targetBefore10.setMinutes(targetBefore10.getMinutes() - 10)
    

    if(now.valueOf() == targetBefore10.valueOf()){
      // 퇴실 10분 전
      var message = {
        notification: {
          "title": "예약 종료 10분 전입니다",
          "body": "10분 후 예약을 연장하거나 퇴실 준비를 해주세요."
        },
        token: i.fb_key
      };

      sendFCMMsg(message)
    }
    if(now.valueOf() >= target.valueOf()){
      // Checkout
      var message = {
        notification: {
          "title": "예약 시간이 종료되었습니다.",
          "body": "추가로 예약하시거나 강의실 정리 후 퇴실해주세요."
        },
        token: i.fb_key
      };
      
      // Checkout reservation
      await connSync(`update reservation set enable = 2 where idx = ${i.idx}`)

      sendFCMMsg(message)
    }
  }
});



var error = (res, msg) => {
  res.statusCode = 400;
  res.json({
    "success": false,
    "msg": msg
  })
  return
}

module.exports = router