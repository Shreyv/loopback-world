describe('/user', function () {
  

    var server = require('../server')
    var request = require('supertest')(server);
    var assert = require('assert');
    var i = 1;

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


    it('Check name required', function (done) {
        request.post('/api/users')
        .send({email: 'abc@gmail.com'}).expect(422, done)
    })

    it('Check email required', function (done) {
        request.post('/api/users')
        .send({name: 'abc'}).expect(422, done)
    })

    it('Check name validations', function (done) {
        request.post('/api/users')
        .send({name: 'shrey3423',email: 'abc@gmail.com'}).expect(422, done)

    })

    it('Check email validations', function (done) {
        request.post('/api/users')
        .send({name: 'shrey',email: 'abcgmail.com'}).expect(422, done)

    })

    it('Too young check', function (done) {
        request.post('/api/users')
        .send({name: 'shrey',email: 'abc@gmail.com',dob: '2006-12-01'}).expect(422, done)

    })

    it('Too old check', function (done) {
        request.post('/api/users')
        .send({name: 'shrey',email: 'abc@gmail.com',dob: '1890-12-01'}).expect(422, done)

    })

    it('Latest user check', function (done) {
        request.post('/api/users')
        .send({name: 'latest',email: 'latest@gmail.com'}).
        end(function(){
            request.get('/api/users/latest')
            .send().expect(200).end(function(err,res){
                assert.equal(res.body.latest[0].name,'latest');
                assert.equal(res.body.latest[0].email,'latest@gmail.com');
                done();
            })
        })

    })

    var flag = true;
    var counter = 1;
    it('Retrieve all users and check the last user by latest and counter+1', function (done) {
    async function checkNthUser () {
        while(flag){
              let resp = await request.get('/api/users/'+counter).send();
              if(resp.body.latest.length == 0){
                flag = false;
              }
              else{
                counter = counter+1;
              }
              
        }
      }
     
    async function postUser(){
        request.post('/api/users')
        .send({name: 'check',email: 'check@gmail.com'}).expect(200)
    }
    
   function checkLastUser(){
    counter--;   
    request.get('/api/users/'+counter).
        end(function(err,res){
            
            var resp = res.body.latest[0];
            request.get('/api/users/latest')
            .send().expect(200).end(function(err,res){
                assert.equal(res.body.latest[0].name,resp.name);
                assert.equal(res.body.latest[0].email,resp.email);
                done();
            })
        })
    }
    async function helper(){
        //checks all users and stores the id in counter
        await checkNthUser();
        
        // creates a user to be the last created
        await postUser();
        
        //checks the last user by /latest api and /counter + 1 api
        checkLastUser();
    } 
    helper(); 

    })

})