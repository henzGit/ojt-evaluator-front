/**
 * Created by hendrik.hendrik on 12/1/16.
 */
var request = require('superagent');
var route = "localhost:8080/phase/add";
const assert = require('assert');

// errors
describe('Errors cases', function(){
    it('should respond with 400 on post (phase name contains special character)',
      function(done) {
        var data = {
            inputPhaseName : '!fds',
            inputStartDate : '2016/11/01',
            inputEndDate : '2016/11/05',
        };

        request.post(route)
            .send(data)
            .end(function (err, res) {
                assert.equal(res.status, 400);
                done();
            })
    });

    it('should respond with 400 on post (start date is invalid)',
      function(done) {
        var data = {
            inputPhaseName : 'phase1',
            inputStartDate : '2016/11d/01',
            inputEndDate : '2016/11/05',
        };
        request.post(route)
            .send(data)
            .end(function (err, res) {
                assert.equal(res.status, 400);
                done();
            })
    });

    it('should respond with 400 on post (end date is invalid)',
      function(done) {
        var data = {
            inputPhaseName : 'phase1',
            inputStartDate : '2016/11/01',
            inputEndDate : '2016/11/052',
        };
        request.post(route)
            .send(data)
            .end(function (err, res) {
                assert.equal(res.status, 400);
                done();
            })
    });
});

