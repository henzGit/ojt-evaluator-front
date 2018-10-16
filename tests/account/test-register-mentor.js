/**
 * Created by hendrik.hendrik on 12/5/16.
 */
var request = require('superagent');
var route = "localhost:8080/account/register-mentor";
const assert = require('assert');

// errors
describe('Errors cases', function(){
    it('should respond with 400 on post (a field is empty)',
      function(done) {
        var data = {
            selectMentorId : '',
        };
        request.post(route)
            .send(data)
            .end(function (err, res) {
                assert.equal(res.status, 400);
                done();
            })
    });
});
