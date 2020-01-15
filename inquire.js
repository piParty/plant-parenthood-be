const inquirer = require('inquirer');
const User = require('./lib/models/User');
const PiDataSession = require('./lib/models/PiDataSession');
const superagent = require(superagent);
const node_ssh = require('node-ssh');
const ssh = new node_ssh();

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
      name: 'nickName',
      message: 'Give your Pi a nick name. This will be used for authentication purposes.'
    },
    {
      type: 'checkbox',
      name: 'sensors',
      message: 'Select sensors you have attached to your Pi and want to use.',
      choices:['light', 'temperature/humidity', 'light-hdr']
    },
    {
      name : 'piLocationInHouse',
      message: 'Where is the Pi in your house? This has nothing to do with the security of your Pi.'
    },
    {
      name: 'city',
      message: 'What city is your Pi in?'
    },
    {
      name: 'appUserName',
      message:'Please enter your login credentials, email:'
    },
    {
      type: 'password',
      name: 'appPassword',
      message: 'Password:'
    }])
  .then(async answers => {
    const newUser = await superagent('<signup route>', {
      'TYPE': 'Application/JSON',
      'METHOD': 'POST'
    }, { 
      email: answers.email,  
      password: answers.password, 
      role: 'user' 
    });
    const dataSesssion = await superagent('<pidatasessions route>', {
      'TYPE': 'Application/JSON',
      'METHOD': 'POST'
    }, {
      piNickname: answers.nickName, 
      sensorType: answers.sensors,
      piLocationInHouse: answers.piLocationInHouse,
      city: answers.city
    });
    const piDataSession = dataSesssion.headers.cookies.piDataSession;

    ssh.connect({
      host: answers.IPAddress,
      username : answers.userName,
      privateKey: answers.password
    })
      .then(function(){
        ssh.execCommand(`wget (link to gist python script with ${piDataSession})`);
      })
      .then(function(){
        ssh.dispose();
      });
  });
//    execFilePromise(`python -c${piDataSession} -s${(answers.sensors).map(sensor => sensor)}`);


// console.info('ooooooOh!', `So, I hope you know what you're getting yourself into, because we won't tell you, but... We'd like to get this Pi party started, so...
// please, find it in your heart to enter the following into the command line after we end this line of inquiry.
// It might give you a disconcerting message. Just enter yes.
// Then after you enter your password enter the ssh command again.
// ssh ${answers.userName}@${answers.IPAddress} ,
// then enter
// '< scp link to github python script here ./downloads>'
// then enter,
// <command to run -c ${piDataSession} etc.. python script>'
//  `);

