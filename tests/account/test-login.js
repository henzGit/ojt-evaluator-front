/**
 * Created by hendrik.hendrik on 12/5/16.
 */
var request = require('superagent');
var route = "localhost:8080/account/login";
const assert = require('assert');

// errors
describe('Errors cases', function(){
    it('should respond with 400 on post (email is not valid)',
      function(done) {
        var data = {
            inputEmail : 'terstgmail.com',
            inputPassword : '123',
        };
        request.post(route)
            .send(data)
            .end(function (err, res) {
                assert.equal(res.status, 400);
                done();
            })
    });

    it('should respond with 400 on post (a field is empty)',
      function(done) {
        var data = {
            inputEmail : 'terst@gmail.com',
            inputPassword : '',
        };

        request.post(route)
            .send(data)
            .end(function (err, res) {
                assert.equal(res.status, 400);
                done();
            })
    });
});