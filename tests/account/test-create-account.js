/**
 * Created by hendrik.hendrik on 12/1/16.
 */
var request = require('superagent');
var route = "localhost:8080/account/create";
const assert = require('assert');

// success
describe('Success cases', function(){
    var data = {
                    inputFirstName : 'hen',
                    inputLastName : 'test',
                    inputEmail : 'test@gmail.com',
                    inputPassword : '123',
                    inputConfirmPassword: '123',
                    selectAccountType: 1

                };
    it('should respond with 200 code on post (all params are valid)',
      function(done) {
      request.post(route)
        .send(data)
        .end(function(err, res) {
            assert.equal(res.status, 200);
            done();
        });
    });
});

// errors
describe('Errors cases', function(){
    it('should respond with 400 on post (firstName contains number)',
      function(done) {
        var data = {
            inputFirstName : 'hen0',
            inputLastName : 'test',
            inputEmail : 'terst@gmail.com',
            inputPassword : '123',
            inputConfirmPassword: '123',
            selectAccountType: 1
        };
        request.post(route)
            .send(data)
            .end(function (err, res) {
                assert.equal(res.status, 400);
                done();
            })
    });

    it('should respond with 400 on post (lastName contains number)',
      function(done) {
        var data = {
            inputFirstName : 'hen',
            inputLastName : 'test0',
            inputEmail : 'terst@gmail.com',
            inputPassword : '123',
            inputConfirmPassword: '123',
            selectAccountType: 1
        };

        request.post(route)
            .send(data)
            .end(function (err, res) {
                assert.equal(res.status, 400);
                done();
            })
    });

    it('should respond with 400 on post (email is not valid)',
      function(done) {
        var data = {
            inputFirstName : 'hen',
            inputLastName : 'test',
            inputEmail : 'terstgmail.com',
            inputPassword : '123',
            inputConfirmPassword: '123',
            selectAccountType: 1

        };

        request.post(route)
            .send(data)
            .end(function (err, res) {
                assert.equal(res.status, 400);
                done();
            })
    });

    it('should respond with 400 on post (input password is not the same as confirmed password)',
      function(done) {
        var data = {
            inputFirstName : 'hen',
            inputLastName : 'test',
            inputEmail : 'terst@gmail.com',
            inputPassword : '123',
            inputConfirmPassword: '1234',
            selectAccountType: 1

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
            inputFirstName : 'hen',
            inputLastName : '',
            inputEmail : 'terst@gmail.com',
            inputPassword : '123',
            inputConfirmPassword: '123',
            selectAccountType: 1

        };

        request.post(route)
            .send(data)
            .end(function (err, res) {
                assert.equal(res.status, 400);
                done();
            })
    });
});

