var EmailService = {};
var API_KEY = 'af456582471a76b806aad64509be7ad8-2d27312c-b02037de';
var DOMAIN = 'sandbox7506262a89b54455b541c081b22f332e.mailgun.org';
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