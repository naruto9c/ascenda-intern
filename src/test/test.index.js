const assert = require('assert');

const index = require("../../index");
const request = require("request");
const chai = require("chai");
const {expect} = chai;

const chaiHttp = require("chai-http");
const {dates, answers} = require("./test");

chai.use(chaiHttp);

/*
    Since the database is unchanged ( or idk how to change it), we tested out some differ customer check-in date,
        including the normal one, the wrong format, and the "can't find offer one".
    We import the dates array and answers array in test.js, so this is more clearly to see the process. 
*/
describe("Testing controller", () => {
    beforeEach(() => {
        console.log("----------------------------------------------------");
        console.log('\n');
    });


    for(let i = 0; i < dates.length-1; i++)
    {
        it("result with the customer date: " + dates[i], done => {
            chai
                .request(index)
                .get("/available/" + dates[i])
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.text).to.deep.equals(JSON.stringify(answers[i]));
                    done();
                });
        });
    }

    it("result with the wrong format customer date: " + dates[3], done =>{
        chai
            .request(index)
            .get("/available/" + dates[3])
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).to.deep.equals(answers[3]);
                done();
            });
    })


    it("return 2*3" , () => {
        assert.equal(2*3, 6);
    });
});