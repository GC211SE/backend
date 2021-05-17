var express = require('express');
var router = express.Router();
var path = require("path");
var {google} = require('googleapis');
var cron = require('node-cron');
var admin = require("firebase-admin");
require('dotenv').config({ path: "../fbconfig" });



let testset = [];

router.get("/", (req, res, next) => {
  // 현재 예약 정보 response
  // param
  // uid = 사용자 아이디

  res.json({})
})

router.post("/", (req, res, next) => {
  // 예약 정보 등록
  // body
  // uid = 사용자 아이디 (없으면 anonimus 등록) -> 현 시간 기준 30분 자동 등록
  // restime = 예약 시간(분단위)
  // lecroom_idx = 강의실 idx
  // fb_key = 푸시 알람을 위한 Firebase key

  res.json({})
})

router.post('/pushtest', function(req, res, next) {

  console.log(req.body.appToken);

  testset.push(req.body.appToken);

  console.log(testset)

  res.json({
    "success": true
  });
});

// 10분 전, 시간 됬을 때, push 알림 및 테이블 드롭 기능 필요
router.delete("/", (req, res, next) => {
  // checkout
  // body
  // idx = 예약 인덱스

  res.json({})
})

// 예약 연장 기능 구현 X





// Initialize FB
var serviceAccount = require("../keystore/gcse211-firebase-adminsdk.json");

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

  var nowDate = new Date();
  let curTime = String(nowDate.getHours()+9) + ":" + String(nowDate.getMinutes());

  console.log("currentTime", curTime);

  for (var idx = 0; idx < testset.length; idx++){
    
    console.log("alarmTargetToken", testset[idx]);

    await getAccessToken()
    var message = {
      notification: {
        "title": "Notification",
        "body": "알람 테스트중입니다"
      },
      token: testset[idx]
    };
  
    // Send a message to the device corresponding to the provided
    // registration token.
    admin.messaging().send(message)
      .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        // 사용자가 앱 삭제 시, 해당 appToken으로 메시지 발송 시 catch됨
        console.log('Error sending message:', error);
      });
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