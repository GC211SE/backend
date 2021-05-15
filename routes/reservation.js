var express = require('express');
var router = express.Router();
var path = require("path");



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

// 10분 전, 시간 됬을 때, push 알림 및 테이블 드롭 기능 필요

router.delete("/", (req, res, next) => {
  // checkout
  // body
  // idx = 예약 인덱스

  res.json({})
})

// 예약 연장 기능 구현 X

var error = (res, msg) => {
  res.statusCode = 400;
  res.json({
    "success": false,
    "msg": msg
  })
  return
}

module.exports = router