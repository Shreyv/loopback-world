describe('/user', function () {
  

    var server = require('../server')
    var request = require('supertest')(server);
    var app;

    beforeEach(function(done) {
      app = server.listen(done);
    });
  
    afterEach(function(done) {
      app.close(done);
    });

    it('Post a new user', function (done) {
        request.post('/api/users')
        .send({name: 'shrey',email: 'abc@gmail.com'}).expect(200, done)

    })

    it('Fetch all users', function (done) {
        request.get('/api/users')
        .send().expect(200,done)

    })

    it('Get xth user', function (done) {
        request.get('/api/users/1')
        .send().expect(200,done)
    })

    it('Get latest user', function (done) {
        request.get('/api/users/latest')
        .send().expect(200,done)
    })


})