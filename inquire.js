const inquirer = require('inquirer');

inquirer
  .prompt([
    {
      name : 'userName',
      message :`So, I see you want to grow a plant.
  Ha.
  That's good buisness.
  What kind of plant?
  If it's not a plant you are trying to grow, why download this app at all?
  Are you trying to connect to the earth?
  Solidy, you're Pi better be grounded & connected,
  Ready and Protected--
  But don't worry- Since you're here, our Pi is awakin' snakin', using a lovely python script
  and json web tokens to make sure the creators of this app, and the creators of this app only have access to everything you care to entrust to it.
  So be astounded and whether up close, and right here, or far, far away,
  Your Pi and Our's will save your arrays
  Of data and objects,
  for days and days
  and days.
  What is your Pi's Username?`
    },
    {
      name: 'IPAddress',
      message : 'what is your pi\'s IP Address?'
    },
    {
      type: 'checkbox',
      name: 'sensors',
      message: 'Select sensors you have attached to your Pi and want to use.',
      choices:['light', 'temperature/humidity', 'light-hdr']
    }])
  .then(answers => {
    console.info('ooooooOh!', `So, I hope you know what you're getting yourself into, because we won't tell you, but... We'd like to get this Pi party started, so...
    please, find it in your heart to enter the following into the command line after we end this line of inquiry.
    It might give you a disconcerting message. Just enter yes.
    Then after you enter your password enter the ssh command again.
    ssh ${answers.userName}@${answers.IPAddress} ,
    then enter
    '<link to github python script here>'
    then enter,
    '<command to run python script>'
     `);
  })
;
