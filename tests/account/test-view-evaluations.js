/**
 * Created by hendrik.hendrik on 12/1/16.
 */
var request = require('superagent');
var route = "localhost:8080/account/view-evaluations/";
const assert = require('assert');

// errors
describe('Errors cases', function(){
    it('should respond with 400 on get (phase id is not numeric)',
      function(done) {
        request.get(route + 'fsfds')
            .end(function (err, res) {
                assert.equal(res.status, 400);
                done();
            })
    });
});

