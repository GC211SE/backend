const assert = require("assert")
const app = require("../app")
const request = require("supertest")
const should = require("should")
const cipher = require('../cipher');


// Refered by https://velog.io/@wimes/node.js-REST-API-서버-만들기-5.-TDD-5hk418e6xu
// http://onsen.io.s3-website-us-east-1.amazonaws.com/blog/mocha-chaijs-unit-test-coverage-es6/

describe("Test schedule.js", () => {

    describe("GET: /api/schedule/buildings", () => {

        it("Get all buildings", (done) => {
            request(app)
                .get(`/api/schedule/buildings`)
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('result'))
                    res.body.result.should.be.an.instanceOf(Array)
                    done()
                })
        })

    })


    describe("GET: /api/schedule/classrooms", () => {
        
        it("Get all classrooms", (done) => {
            request(app)
                .get(`/api/schedule/classrooms?bd=IT%EB%8C%80%ED%95%99`)
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('result'))
                    res.body.result.should.be.an.instanceOf(Array)
                    res.body.result.length.should.be.above(0)
                    done()
                })
        })

        it("Handle get all classrooms error", (done) => {
            request(app)
                .get(`/api/schedule/classrooms?bd=0`)
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('result'))
                    res.body.result.should.be.an.instanceOf(Array)
                    res.body.result.should.be.empty
                    done()
                })
        })

        it("Handle query error", (done) => {
            request(app)
                .get(`/api/schedule/classrooms`)
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('success'))
                    res.body.success.should.not.be.ok
                    done()
                })
        })

    })


    describe("GET: /api/schedule", () => {

        it("Get all classroom's timetable", (done) => {
            request(app)
                .get(`/api/schedule?bd=IT%EB%8C%80%ED%95%99&crn=304`)
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('result'))
                    res.body.result.should.be.an.instanceOf(Array)
                    done()
                })
        })

        it("Handle get all classroom's timetable error", (done) => {
            request(app)
                .get(`/api/schedule?bd=00&crn=00`)
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('result'))
                    res.body.result.should.be.an.instanceOf(Array)
                    done()
                })
        })

        it("Handle query error (nothing)", (done) => {
            request(app)
                .get(`/api/schedule`)
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('success'))
                    res.body.success.should.not.be.ok
                    done()
                })
        })
        
    })

})

