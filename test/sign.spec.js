const assert = require("assert")
const app = require("../app")
const request = require("supertest")
const should = require("should")
const cipher = require('../cipher');


// Refered by https://velog.io/@wimes/node.js-REST-API-서버-만들기-5.-TDD-5hk418e6xu
// http://onsen.io.s3-website-us-east-1.amazonaws.com/blog/mocha-chaijs-unit-test-coverage-es6/

describe("Test sign.js", () => {
    
    describe("GET: /api", () => {
        it("Handle no query", (done) => {
            request(app)
                .get(`/api/sign`)
                .expect(400)
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('success'))
                    done()
                })
        })
        

        it("Handle wrong Password", (done) => {
            request(app)
                .get(`/api/sign?id=${cipher.testid}&pw=11111`)
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('success'))
                    done()
                })
        })


        it("Handle login", (done) => {
            request(app)
                .get(`/api/sign?id=${cipher.testid}&pw=${cipher.testpw}`)
                .end((err, res) => {
                    if(err) throw err;
                    assert(Object.keys(res.body).includes('success'))
                    assert(Object.keys(res.body).includes('id'))
                    assert(Object.keys(res.body).includes('name'))
                    assert(Object.keys(res.body).includes('photo'))
                    assert(Object.keys(res.body).includes('dept'))
                    done()
                })
        })


    })
})

