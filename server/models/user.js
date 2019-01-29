'use strict';
var os = require('os');
var emailService = require('../services/email.service');

module.exports = function(User) {
    User.validatesFormatOf('name', {with: /^[A-Za-z ,.'-]+$/});
    User.validatesFormatOf('email', {with: /\S+@\S+\.\S+/});
    User.validate('dob',customDobValidator,{message : 'Not valid date format'});
    User.validate('dob', customAgeValidator, {message: 'Invalid Date Range'});
    
    function customAgeValidator(err) {        
        var age = new Date().getFullYear() - new Date(this.dob).getFullYear();
        if(age < 16 || age > 120){
            err();
        }
    };

    function customDobValidator(err){
        if(this.dob){
           if(!/^\d{4}\-\d{1,2}\-\d{1,2}$/.test(this.dob)){
               err();
           }
        }
    }

    User.findLatest = function(cb){
        User.find({
            order: 'id DESC',
            limit: 1
          },function(err,data){              
              cb(null,data);
          });
    }

    User.remoteMethod (
        'findLatest',
        {
          http: {path: '/latest', verb: 'get'},
          returns: {arg: 'latest', type: 'object'}
        }
    );

    User.getNthUser = function(n,cb){
        User.find({
            order: 'id ASC',
            limit: 1,
            skip: n-1 
          },function(err,data){      
              cb(null,data);
          });
    }

    User.remoteMethod (
        'getNthUser',
        {
          http: {path: '/:x', verb: 'get'},
          accepts: [
            {arg: 'x', type: 'number', required: true}
          ],
          returns: {arg: 'latest', type: 'object'}
        }
    );

    User.afterRemote('create', function(ctx, user, next) {
        var mailData = JSON.parse(JSON.stringify(user))
        mailData.host = os.hostname();
        emailService.sendWelcomeEmail(mailData);
        next();
      });

};  
