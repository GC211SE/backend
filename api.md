# API Document

## SIGN

**GET: `/api/sign?id=&pw=`**
 - Verify user data
 - parameter
   - `id`: (mandatory) user id to get data
   - `id`: (mandatory) user id to get data
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

## DATA

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
   - "name": 1: 9:00~9:50, 2: 10:00~10:50, ... 21: 9:30~10:45, ...
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
