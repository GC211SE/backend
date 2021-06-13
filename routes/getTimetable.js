var fs = require('fs');

// For crawling target site
var axios = require("axios")
// https://velog.io/@yesdoing/Node.js-에서-웹-크롤링하기-wtjugync1m



var connSync = (query) => new Promise(resolve => {
  conn.query(query, (err,rows) => {
    if(err){
      // console.log(err)
      resolve(false)
    } else
      resolve(rows)
  })
})

var getLink = (year, semester, campus) => {
  // const year = `2021`
  // const semester = `10` // 10, 11, 20, 21
  // const campus = `21` // "": all, 20: Global, 21: Medical
  const link = `http://sg.gachon.ac.kr/main?attribute=timeTableJson&lang=ko&year=${year}&hakgi=${semester}&menu=1&p_group_cd=${campus}&p_isu_cd=3&p_gwamok_nm=%25%25&initYn=Y&_search=false&rows=-1&page=1&sord=asc`
  return link
}

var getTimetable = async () => {

  // console.log(data[i].subject_nm_kor) // 강의이름
  // console.log(data[0].member_no) // 이수번호 
  // console.log(data[i].let_room) // 강의실 
  // console.log(data[0].prof_nm) //교수이름 
  // console.log(data[0].lec_time) // 강의시간 -> fk

  // 0. Implement Spring semaster, 2021
  // 1. Administrator run this update code (Global, Medical campus) ~~Update per day~~
  //  1-1. DB drop
  //  1-2. DB add (source)
  //  1-3. Add timetable data into Database
  //   1-3-1. Get timetable information (Json)
  //   1-3-2. Add lecture table (subject_nm_kor, member_no, prof_nm)
  //   1-3-3. let_room -> "," Parse, trim -> "-" Parse -> lec_room ([글]로벌,[메]디컬) insert if not duplicated / insert lec_room_link 
  //   1-3-4. lec_time -> "," Parse, trim -> find idx in lec_time / insert lec_time_link

  // 1-1. / 1-2.
  // https://bleepcoder.com/ko/iosevka/33674462/how-to-use-sql-file-as-query-source
  var source = fs.readFileSync('/home/uhug/SE/backend/ddl.sql', 'utf8');
  await connSync(source)
  ///////////////////////////////////
  
  // 1-3.
  // for(var campusIdx = 20; campusIdx < 21; campusIdx++){
  for(var campusIdx = 20; campusIdx < 22; campusIdx++){
    console.log("=======================================")

    // 1-3-1.
    // year = `2021`
    // semester = `10` // 10, 11, 20, 21
    // campus = `21` // "": all, 20: Global, 21: Medical
    resHtml = await axios.get(getLink('2021', '10', campusIdx.toString()))
    var data = JSON.parse(JSON.stringify(resHtml.data)).rows
    
    for(var rn = 0; rn < data.length; rn++){
    // for(var rn = 200; rn < 300; rn++){
      // 1-3-2.
      await connSync(`insert into lecture(lecname, lecnum, profname) values(
        "${data[rn].subject_nm_kor}", "${data[rn].member_no}", "${data[rn].prof_nm}")`)
  
      var lectureIdx = await connSync(`select max(idx) as value from lecture;`)
      var lectureIdx = lectureIdx[0].value
  
      // 1-3-3.
      var lec_rooms = data[rn].let_room.split(",")
      var lecRoomIdx = -1;
      for(var i = 0; i<lec_rooms.length; i++){
        lec_rooms[i] = lec_rooms[i].trim()
        
        var lecroom_desc = lec_rooms[i].split("-")
        for(var j = 0; j < lecroom_desc.length; j++)
          lecroom_desc[j] = lecroom_desc[j].trim()
        
        
        if(lecroom_desc.length == 2){
          // console.log("강의실 O")
          await connSync(`insert into lec_room(building, classroom) values("${lecroom_desc[0]}", "${lecroom_desc[1]}")`)
          lecRoomIdx = await connSync(`select idx from lec_room where building = "${lecroom_desc[0]}" and classroom = "${lecroom_desc[1]}"`)
        } else {
          if(lecroom_desc[0] == ''){
            // console.log("강의실 없음")
            await connSync(`insert into lec_room(building, classroom) values("", "")`)
            lecRoomIdx = await connSync(`select idx from lec_room where building = "" and classroom = ""`)
          } else{
            // console.log("강의실 번호 없음")
            await connSync(`insert into lec_room(building, classroom) values("${lecroom_desc[0]}", "")`)
            lecRoomIdx = await connSync(`select idx from lec_room where building = "${lecroom_desc[0]}" and classroom = ""`)
          }
        }
        
        lecRoomIdx = lecRoomIdx[0].idx
        await connSync(`insert into lec_room_link values(${lectureIdx}, ${lecRoomIdx})`)
      }
  
      
  
      // 1-3-4.
      var lec_times = data[rn].lec_time.split(",")
      for(var i = 0; i<lec_times.length; i++){
        lec_times[i] = lec_times[i].trim()
  
        if(lec_times[0] == ''){
          // console.log("시간 없음")
          var lecTimeIdx = await connSync(`select idx from lec_time where name=0`)
          lecTimeIdx = lecTimeIdx[0].idx
          await connSync(`insert into lec_time_link values(${lectureIdx}, ${lecTimeIdx})`)
        } else {
          // console.log(lec_times)
          for(var t = 0; t < lec_times.length; t++){
            var dotw = 0;
            var dotwStr = lec_times[t][0]
            switch (dotwStr) {
              case '월': dotw = 1; break;
              case '화': dotw = 2;  break;
              case '수': dotw = 3;  break;
              case '목': dotw = 4;  break;
              case '금': dotw = 5;  break;
              case '토': dotw = 6;  break;
              default: break;
            }
            var name = lec_times[t].substring(1, lec_times[t].length)
            switch (name) {
              case 'A': name = 21; break;
              case 'B': name = 22; break;
              case 'C': name = 23; break;
              case 'D': name = 24; break;
              case 'E': name = 25; break;
              default: name = Number(name)
            }
  
            // console.log(`name=${name} and dotw=${dotw}`)
            var lecTimeIdx = await connSync(`select idx from lec_time where name=${name} and dotw=${dotw}`)
            lecTimeIdx = lecTimeIdx[0].idx
            
            await connSync(`insert into lec_time_link values(${lectureIdx}, ${lecTimeIdx})`)
          }
        }
      }
      
    }
    
  }
  console.log("=======================================")
}
  


module.exports = getTimetable