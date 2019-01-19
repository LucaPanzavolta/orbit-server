const expect = require("chai").expect;
var request = require("request");
const controller = require("./../controllers/categories.controller");

const URL = 'http://localhost:3000';

describe("Test `categories.controller.js` ", function() {
  describe("GET requests", function() {
    
    it("It returns status 200", function() {
      request.get( `${URL}/categories`)
      // .on('res', (err)=> {
      //   expect(body).to.equal("ffffff");
      // })
      .on('response', (response)=> {
        expect(response.statusCode).to.equal(200);
      });


    it("Should returns an array", function() {
      request.get( `${URL}/categories`)
      .on('response', (response)=> {
        expect(response.body).to.equal(200);
      });
    });

  });

  describe("POST requests", function() {
    it("Returns an object", function() {

    });
  });
});