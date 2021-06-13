const assert = require("assert")
const app = require("../app")
const request = require("supertest")
const should = require("should")
const cipher = require('../cipher');


// Refered by https://velog.io/@wimes/node.js-REST-API-서버-만들기-5.-TDD-5hk418e6xu
// http://onsen.io.s3-website-us-east-1.amazonaws.com/blog/mocha-chaijs-unit-test-coverage-es6/

var reservationIdx = 0

describe("Test reservation.js", () => {

    describe("GET: /api/reservation/all", () => {

        it("Give all reservation of specific classroom", (done) => {
            request(app)
                .get(`/api/reservation/all?bd=IT%EB%8C%80%ED%95%99&crn=304`)
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('success'))
                    res.body.success.should.be.an.instanceOf(Array)
                    done()
                })
        })

        it("Handle wrong query", () => {
            request(app)
                .get(`/api/reservation/all?bd=00&crn=00`)
                .expect(400)
        })

        it("Handle query missing (crn)", () => {
            request(app)
                .get(`/api/reservation/all?bd=00&crn=`)
                .expect(400)
        })

        it("Handle query missing (bd)", () => {
            request(app)
                .get(`/api/reservation/all?bd=&crn=00`)
                .expect(400)
        })

        it("Handle query missing (all)", () => {
            request(app)
                .get(`/api/reservation/all`)
                .expect(400)
        })

    })



    describe("GET: /api/reservation/currtotal", () => {

        it("Give all number of reservation of specific classroom", (done) => {
            request(app)
                .get(`/api/reservation/currtotal?bd=IT%EB%8C%80%ED%95%99&crn=304`)
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('success'))
                    res.body.success.should.be.an.instanceOf(Object)
                    done()
                })
        })

        it("Handle wrong query", () => {
            request(app)
                .get(`/api/reservation/currtotal?bd=00&crn=00`)
                .expect(400)
        })

        it("Handle query missing (bd)", () => {
            request(app)
                .get(`/api/reservation/currtotal?bd=&crn=00`)
                .expect(400)
        })

        it("Handle query missing (crn)", () => {
            request(app)
                .get(`/api/reservation/currtotal?bd=00&crn=`)
                .expect(400)
        })

        it("Handle query missing (all)", () => {
            request(app)
                .get(`/api/reservation/currtotal`)
                .expect(400)
        })

    })



    describe("GET: /api/reservation/personal", () => {

        it("Give all personal reservations", (done) => {
            request(app)
                .get(`/api/reservation/personal?userid=${cipher.testid}`)
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('success'))
                    res.body.success.should.be.an.instanceOf(Array)
                    done()
                })
        })

        it("Handle wrong query", (done) => {
            request(app)
                .get(`/api/reservation/personal?userid=0`)
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('success'))
                    res.body.success.should.be.an.instanceOf(Array)
                    res.body.success.should.be.empty
                    done()
                })       
            })

        it("Handle wrong query (empty)", (done) => {
            request(app)
                .get(`/api/reservation/personal?userid=`)
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('success'))
                    res.body.success.should.not.be.ok
                    done()
                })       
            })

        it("Handle query missing", () => {
            request(app)
                .get(`/api/reservation/personal`)
                .expect(400)
        })

    })



    describe("GET: /api/reservation/current", () => {

        it("Give user's current reservations", (done) => {
            request(app)
                .get(`/api/reservation/current?userid=${cipher.testid}`)
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('success'))
                    res.body.success.should.be.an.instanceOf(Object)
                    done()
                })
        })

        it("Handle wrong query", (done) => {
            request(app)
                .get(`/api/reservation/current?userid=0`)
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('success'))
                    res.body.success.should.be.an.instanceOf(Object)
                    done()
                })       
            })

        it("Handle wrong query (empty)", (done) => {
            request(app)
                .get(`/api/reservation/current?userid=`)
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('success'))
                    res.body.success.should.be.an.instanceOf(Object)
                    done()
                })       
            })

        it("Handle query missing", () => {
            request(app)
                .get(`/api/reservation/current`)
                .expect(400)
        })
        
    })



    describe("GET: /api/reservation/targettotal", () => {

        it("Give targetred of reservation of specific classroom", (done) => {
            request(app)
                .get(`/api/reservation/targettotal?bd=IT%EB%8C%80%ED%95%99&crn=304&time=2020-01-01 12:00`)
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('success'))
                    res.body.success.should.be.an.instanceOf(Object)
                    done()
                })
        })

        it("Handle wrong query", () => {
            request(app)
                .get(`/api/reservation/targettotal?bd=00&crn=00&time=dd`)
                .expect(400)
        })

        it("Handle query missing (bd)", () => {
            request(app)
                .get(`/api/reservation/targettotal?bd=&crn=00&time=dd`)
                .expect(400)
        })

        it("Handle query missing (crn)", () => {
            request(app)
                .get(`/api/reservation/targettotal?bd=00&crn=&time=dd`)
                .expect(400)
        })

        it("Handle query missing (time)", () => {
            request(app)
                .get(`/api/reservation/targettotal?bd=00&crn=00&time=`)
                .expect(400)
        })

        it("Handle query missing (all)", () => {
            request(app)
                .get(`/api/reservation/targettotal`)
                .expect(400)
        })

    })







    describe("POST: /api/reservation", () => {

        it("Enroll user's reservations", (done) => {
            request(app)
                .post(`/api/reservation`)
                .send({
                    "userid": cipher.testid,
                    "start": "2030-01-01 10:00:00",
                    "end": "2030-01-01 11:00:00",
                    "bd": "IT대학",
                    "crn": "304",
                    "fb_key": "example-APd23ckDF",
                })
                .end((err, res) => {
                    if(err) throw err;
                    console.log(res.body)
                    assert(Object.keys(res.body).includes('success'))
                    assert(Object.keys(res.body).includes('idx'))
                    res.body.success.should.be.ok
                    reservationIdx = res.body.idx
                    done()
                })
        })

        it("Error handle; SQL Error", () => {
            request(app)
                .post(`/api/reservation`)
                .send({
                    "userid": cipher.testid,
                    "start": "2030-01-01 10:00:00",
                    "end": "2030-01-01 11:00:00",
                    "bd": "IT%EB%8C%80%ED%95%99",
                    "crn": "304",
                    "fb_key": "example-APd23ckDF",
                })
                .expect(400)
        })

        it("Handle wrong body (userid)", (done) => {
            request(app)
                .post(`/api/reservation`)
                .send({
                    "userid": "",
                    "start": "2030-01-01 10:00:00",
                    "end": "2030-01-01 11:00:00",
                    "bd": "IT대학",
                    "crn": "304",
                    "fb_key": "example-APd23ckDF",
                })
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('success'))
                    res.body.success.should.be.not.ok
                    done()
                })
        })

        it("Handle wrong body (start)", (done) => {
            request(app)
                .post(`/api/reservation`)
                .send({
                    "userid": cipher.testid,
                    "start": "",
                    "end": "2030-01-01 11:00:00",
                    "bd": "IT대학",
                    "crn": "304",
                    "fb_key": "example-APd23ckDF",
                })
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('success'))
                    res.body.success.should.be.not.ok
                    done()
                })
        })

        it("Handle wrong body (end)", (done) => {
            request(app)
                .post(`/api/reservation`)
                .send({
                    "userid": cipher.testid,
                    "start": "2030-01-01 10:00:00",
                    "end": "",
                    "bd": "IT대학",
                    "crn": "304",
                    "fb_key": "example-APd23ckDF",
                })
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('success'))
                    res.body.success.should.be.not.ok
                    done()
                })
        })

        it("Handle wrong body (bd)", (done) => {
            request(app)
                .post(`/api/reservation`)
                .send({
                    "userid": cipher.testid,
                    "start": "2030-01-01 10:00:00",
                    "end": "2030-01-01 11:00:00",
                    "bd": "",
                    "crn": "304",
                    "fb_key": "example-APd23ckDF",
                })
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('success'))
                    res.body.success.should.be.not.ok
                    done()
                })
        })

        it("Handle wrong body (crn)", (done) => {
            request(app)
                .post(`/api/reservation`)
                .send({
                    "userid": cipher.testid,
                    "start": "2030-01-01 10:00:00",
                    "end": "2030-01-01 11:00:00",
                    "bd": "IT대학",
                    "crn": "",
                    "fb_key": "example-APd23ckDF",
                })
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('success'))
                    res.body.success.should.be.not.ok
                    done()
                })
        })

        it("Handle wrong body (fb_key)", (done) => {
            request(app)
                .post(`/api/reservation`)
                .send({
                    "userid": cipher.testid,
                    "start": "2030-01-01 10:00:00",
                    "end": "2030-01-01 11:00:00",
                    "bd": "IT대학",
                    "crn": "304",
                    "fb_key": ""
                })
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('success'))
                    res.body.success.should.be.not.ok
                    done()
                })
        })

        it("Enable body test", (done) => {
            request(app)
                .post(`/api/reservation`)
                .send({
                    "userid": cipher.testid,
                    "start": "2030-01-01 10:00:00",
                    "end": "2030-01-01 11:00:00",
                    "bd": "IT대학",
                    "crn": "304",
                    "fb_key": "-",
                    "enable": ""
                })
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('success'))
                    res.body.success.should.be.not.ok
                    done()
                })
        })

        

        it("Handle body missing", (done) => {
            request(app)
                .post(`/api/reservation`)
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('success'))
                    res.body.success.should.be.not.ok
                    done()
                })
        })
        
    })



    describe("PATCH: /api/reservation/checkin", () => {

        it("Check-In", (done) => {
            request(app)
                .patch(`/api/reservation/checkin`)
                .send({
                    "userid": cipher.testid,
                    "idx": reservationIdx,
                })
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('success'))
                    res.body.success.should.be.ok
                    done()
                })
        })

        it("Check-In false", (done) => {
            request(app)
                .patch(`/api/reservation/checkin`)
                .send({
                    "userid": cipher.testid,
                    "idx": reservationIdx,
                })
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('success'))
                    res.body.success.should.not.be.ok
                    done()
                })
        })

        it("Handle query missing (userid)", (done) => {
            request(app)
                .patch(`/api/reservation/checkin`)
                .send({
                    "userid": "",
                    "idx": reservationIdx,
                })
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('success'))
                    res.body.success.should.not.be.ok
                    done()
                })
        })

        it("Handle query missing (idx)", (done) => {
            request(app)
                .patch(`/api/reservation/checkin`)
                .send({
                    "userid": "",
                    "idx": "",
                })
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('success'))
                    res.body.success.should.not.be.ok
                    done()
                })
        })

        it("Handle query missing", () => {
            request(app)
                .patch(`/api/reservation/checkin`)
                .expect(400)
        })

    })

    describe("PATCH: /api/reservation/checkout", () => {

        it("Check-Out", (done) => {
            request(app)
                .patch(`/api/reservation/checkout`)
                .send({
                    "userid": cipher.testid,
                })
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('success'))
                    res.body.success.should.be.ok
                    done()
                })
        })

        it("Check-Out false", (done) => {
            request(app)
                .patch(`/api/reservation/checkout`)
                .send({
                    "userid": "0",
                })
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('success'))
                    res.body.success.should.not.be.ok
                    done()
                })
        })

        it("Handle query missing (empty)", (done) => {
            request(app)
                .patch(`/api/reservation/checkout`)
                .send({
                    "userid": "",
                })
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('success'))
                    res.body.success.should.not.be.ok
                    done()
                })
        })

        it("Handle query missing", (done) => {
            request(app)
                .patch(`/api/reservation/checkout`)
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('success'))
                    res.body.success.should.not.be.ok
                    done()
                })
        })

    })


    








    describe("PATCH: /api/reservation/cancel", () => {

        it("cancel user's reservations", (done) => {
            request(app)
                .patch(`/api/reservation/cancel?userid=${cipher.testid}&idx=${reservationIdx}`)
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('success'))
                    done()
                })
        })

        it("Handle wrong query", (done) => {
            request(app)
                .patch(`/api/reservation/cancel?userid=0&idx=0`)
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('success'))
                    res.body.success.should.be.an.instanceOf(Object)
                    done()
                })        
            })

        it("Handle wrong query (userid)", (done) => {
            request(app)
                .patch(`/api/reservation/cancel?idx=0&userid=`)
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('success'))
                    res.body.success.should.be.an.instanceOf(Object)
                    done()
                })        
            })

        it("Handle wrong query (idx)", (done) => {
            request(app)
                .patch(`/api/reservation/cancel?userid=0&idx=dd`)
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('success'))
                    res.body.success.should.be.an.instanceOf(Object)
                    done()
                })        
            })

        it("Handle query missing", () => {
            request(app)
                .patch(`/api/reservation/cancel`)
                .expect(400)
        })
        
    })


})

