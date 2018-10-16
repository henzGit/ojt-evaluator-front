/**
 * Created by hendrik.hendrik on 12/1/16.
 */
var request = require('superagent');
var route = "localhost:8080/phase/submit";
const assert = require('assert');

// errors
describe('Errors cases', function(){
    it('should respond with 400 on post (phase id is missing)',
      function(done) {
        var data = {
            inputPhaseId : '',
        };
        request.post(route)
            .send(data)
            .end(function (err, res) {
                assert.equal(res.status, 400);
                done();
            })
    });

    it('should respond with 400 on post (phase id is not numeric)',
      function(done) {
        var data = {
            inputPhaseId : 'y',
        };
        request.post(route)
            .send(data)
            .end(function (err, res) {
                assert.equal(res.status, 400);
                done();
            })
    });
});