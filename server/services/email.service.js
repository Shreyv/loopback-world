var EmailService = {};
var API_KEY = 'API_KEY';
var DOMAIN = '';
var mailgun = require('mailgun-js')({apiKey: API_KEY, domain: DOMAIN}); 


EmailService.sendWelcomeEmail = function(user){   
const data = {
  from:'Shrey <noreply@smtp.mailgun.org>',
  to: 'shreyv991995@gmail.com',
  subject: 'Welcome to loop-world',
  text: `Hi ${user.name}
         
Welcome to our network! Here’s your profile informations:
Email: ${user.email}
Date of Birth: ${user.dob} 
Server used:  ${user.host}
  `
};

mailgun.messages().send(data, (error, body) => {
  if(error) throw error;  
  console.log('welcome mail sent to :',user.email);
});

}

module.exports = EmailService;
