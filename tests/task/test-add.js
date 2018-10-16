/**
 * Created by hendrik.hendrik on 12/1/16.
 */

var request = require('superagent');
var route = "localhost:8080/task/add/phase/";
const assert = require('assert');

// errors
describe('Errors cases', function(){

    it('should respond with 400 on get (phase id is not numeric)',
      function(done) {
        request.post(route + 'fsfds')
            .end(function (err, res) {
                assert.equal(res.status, 400);
                done();
            })
    });

    var data = {
        inputTaskName : '',
        inputStartDate : '2016/01/12',
        inputEndDate : '2016/01/30',
    };
    it('should respond with 400 code on post (task name is missing)',
      function(done) {
        request
            .post(route + '/1')
            .send(data)
            .end(function(err, res) {
                assert.equal(res.status, 400);
                done();
            });
    });

    var data = {
        inputTaskName : 'task1',
        inputStartDate : 'dsad',
        inputEndDate : '2016/01/30',
    };
    it('should respond with 400 code on post (task name is missing)',
      function(done) {
        request
            .post(route + '/1')
            .send(data)
            .end(function(err, res) {
                assert.equal(res.status, 400);
                done();
            });
    });

    var data = {
        inputTaskName : 'task1',
        inputStartDate : '2016/01/12',
        inputEndDate : '2016fdf/01/30',
    };
    it('should respond with 400 code on post (task name is missing)',
      function(done) {
        request
            .post(route + '/1')
            .send(data)
            .end(function(err, res) {
                assert.equal(res.status, 400);
                done();
            });
    });
});

