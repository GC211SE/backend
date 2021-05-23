# API Document

## SIGN

**GET: `/api/sign?id=&pw=`**
 - Verify user data
 - parameter
   - `id`: (mandatory) user id to get data
   - `pw`: (mandatory) user password to get data
 - example: `https://gcse.doky.space/api/sign?id=gdhong&pw=11111`
 - response [Success]
    ```json
    {
        "success": true,
        "id": "gdhong",
        "name": "홍길동",
        "dept": "IT융합대학 소프트웨어학과",
        "photo": "https://wind.gachon.ac.kr/ko/module/member/photo/000000/profile.jpg"
    }
    ```
 - response [Failed]
    ```
    {
        "success": false,
        "msg": "login failed"
    }
    ```

<br><br><br>

## SCHEDULE

**GET: `/api/schedule/buildings`**
 - Give all building names
 - example: `https://gcse.doky.space/api/schedule/buildings`
 - response
    ```json
    {
        "result": [
            "(M)간호대학",
            "(M)보건과학대학",
            "(M)약학대학",
            "(M)의과대학",
            "IT대학",
            "가천관",
            ...
        ]
    }
    ```

<br>

**GET: `/api/schedule/classrooms?bd=`**
 - Give all classroom of certain building
 - parameter
   - `bd`: (mandatory) building name
 - example: `https://gcse.doky.space/api/schedule/classrooms?bd=IT대학`
 - response
    ```json
    {
        "result": [
            "117",
            "211B",
            "220",
            "224",
            "227",
            "233",
            "301",
            "302",
            "304",
            ...
        ]
    }
    ```
<br>

**GET: `/api/schedule?bd=&crn=`**
 - Give timetable of certain classroom in certain building
 - parameter
   - `bd`: (mandatory) building name
   - `crn`: (mandatory) classroom name
 - example: `https://gcse.doky.space/api/schedule?bd=IT대학&crn=304`
 - description
   - "name": 1: 9:00\~9:50, 2: 10:00\~10:50, ... 21: 9:30\~10:45, ...
   - "dotw": Date of the week -> 1: Monday, 2: Tuesday, ... 6: Saturday
 - response
    ```json
    {
        "result": [
            {
                "lecname": "웹프로그래밍 (영어강의)",
                "profname": "강상우",
                "name": 6,
                "dotw": 3,
                "start": "2000-01-01T14:00:00.000Z",
                "end": "2000-01-01T14:50:00.000Z"
            },
            {
                "lecname": "객체지향프로그래밍 (영어강의)",
                "profname": "노웅기",
                "name": 3,
                "dotw": 1,
                "start": "2000-01-01T11:00:00.000Z",
                "end": "2000-01-01T11:50:00.000Z"
            },
            {
                "lecname": "경영학원론",
                "profname": "김학진",
                "name": 22,
                "dotw": 4,
                "start": "2000-01-01T11:00:00.000Z",
                "end": "2000-01-01T12:15:00.000Z"
            },
            ...
        ]
    }
    ```

<br><br><br>

## RESERVATION

**POST: `/api/reservation`**
 - Give all building names
 - example: `https://gcse.doky.space/api/reservation`
 - body
   - `userid`: (mandatory) user id
   - `start`: (mandatory) `DateTime.now()`
   - `end`: (mandatory) `DateTime.now()`
   - `bd`: (mandatory) building name
   - `crn`: (mandatory) classroom name
   - `fb_key`: (mandatory) Firebase API Key
 - body example:
    ```json
    {
        "userid": "uhug",
        "start": "2021-05-10 10:00:00",
        "end": "2021-05-10 11:00:00",
        "bd": "IT대학",
        "crn": "304",
        "fb_key": "example-APd23ckDF",
    }
    ```
 - response [True]
    ```json
    {
        "success": true,
        "idx": 23
    }
    ```
 - response [False]
    ```json
    {
        "success": false,
        "msg": "sql error" or "query error"
    }
    ```
<br>

**PATCH: `/api/reservation/checkin`**
 - Check in specific reservation
 - example: `https://gcse.doky.space/api/reservation/checkin`
 - body
   - `userid`: (mandatory) user id
   - `idx`: (mandatory) reservation idx for activation
 - body example:
    ```json
    {
        "userid": "uhug",
        "idx": 3
    }
    ```
 - response [True]
    ```json
    {
        "success": true
    }
    ```
 - response [False]
    ```json
    {
        "success": false,
        "msg": "have another activated reservation"
    }
    ```
<br>

**PATCH: `/api/reservation/checkout`**
 - Checkout all current reservations
 - example: `https://gcse.doky.space/api/reservation/checkout`
 - body
   - `userid`: (mandatory) user id
 - body example:
    ```json
    {
        "userid": "uhug"
    }
    ```
 - response [True]
    ```json
    {
        "success": true
    }
    ```
 - response [False]
    ```json
    {
        "success": false,
        "msg": "sql error" or "query error"
    }
    ```
<br>

**GET: `/api/reservation/all?bd=&crn=`**
 - Give all reservation of specific classroom
 - example: `https://gcse.doky.space/api/reservation/all?bd=IT대학&crn=304`
 - query
   - `bd`: (mandatory) building name
   - `crn`: (mandatory) classroom name
 - response [True]
    ```json
    {
        "success": [
            {
                "userid": "d",
                "start": "2021-05-18T12:53:46.000Z",
                "end": "2021-05-18T12:54:06.000Z",
                "enable": 0  // 0: reserve, 1: using, 2: used or canceled
            },
            {
                "userid": "d",
                "start": "2021-05-18T12:53:46.000Z",
                "end": "2021-05-18T12:54:06.000Z",
                "enable": 1
            },
            {
                "userid": "d",
                "start": "2021-05-18T12:53:46.000Z",
                "end": "2021-05-18T12:54:06.000Z",
                "enable": 0
            },
            ...
        ]
    }
    ```
 - response [Empty]
    ```json
    {
        "success": []
    }
    ```
<br>

**GET: `/api/reservation/currtotal?bd=&crn=`**
 - Give specific classrooms status
 - example: `https://gcse.doky.space/api/reservation/currtotal?bd=IT대학&crn=304`
 - query
   - `bd`: (mandatory) building name
   - `crn`: (mandatory) classroom name
 - response
    ```json
    {
        "success": {
            "reserved": 1, // How many people reserve this room
            "using": 0     // How many people using this room
        }
    }
    ```

<br>

**GET: `/api/reservation/personal?userid=`**
 - Give all of reservation data of user
 - example: `https://gcse.doky.space/api/reservation/personal?userid=uhug`
 - query
   - `userid`: (mandatory) user id
 - response [True]
    ```json
    {
        "success": [
            {
                "idx": 2,
                "userid": "uhug",
                "start": "2021-05-18T12:42:38.000Z",
                "end": "2021-05-18T12:42:38.000Z",
                "building": "IT대학",
                "classroom": "304",
                "enable": 2
            },
            {
                "idx": 16,
                "userid": "uhug",
                "start": "2021-05-19T16:53:46.000Z",
                "end": "2021-05-19T18:54:06.000Z",
                "building": "IT대학",
                "classroom": "304",
                "enable": 0
            },
            {
                "idx": 17,
                "userid": "uhug",
                "start": "2021-05-19T12:53:46.000Z",
                "end": "2021-05-19T18:54:06.000Z",
                "building": "IT대학",
                "classroom": "304",
                "enable": 0
            },
            ...
        ]
    }
    ```
 - response [Empty]
    ```json
    {
        "success": []
    }
    ```
<br>

**GET: `/api/reservation/current?userid=`**
 - Give current reservation information of user
 - example: `https://gcse.doky.space/api/reservation/current?userid=uhug`
 - query
   - `userid`: (mandatory) user id
 - response
    ```json
    {
        "success": {
            "userid": "uhug",
            "start": "2021-05-18T12:53:46.000Z",
            "end": "2021-05-18T12:54:06.000Z",
            "building": "IT대학",
            "classroom": "304",
            "enable": 1
        }
    }
    ```
 - response [Empty]
    ```json
    {
        "success": {}
    }
    ```
<br>



**GET: `/api/reservation/targettotal`**
 - .
 - query
 - response
    ```json

    ```
<br>

**GET: `/api/reservation/cancel`**
 - .
 - query
 - response
    ```json

    ```
<br>