const inquirer = require('inquirer');
const User = require('./lib/models/User');
const PiDataSession = require('./lib/models/PiDataSession');
const superagent = require('superagent');
const node_ssh = require('node-ssh');
const ssh = new node_ssh();
const connect = require('./lib/utils/connect')();
let cookie;

const user = await fetch('', {
  'TYPE': 'Application/JSON',
  'METHOD': 'POST'
}, {
    email: 'me@me.com',
    password: 'password',
    role: 'user',
    myPis:[{ piNickname : 'testPi' }]
  })
//to make sure that the agent gets assigned a data session cookie!
  .post('/api/v1/pi-data-sessions')
  .send({
    piNickname: 'happyPi', 
    sensorType: ['light'], 
    piLocationInHouse: 'kithcen', 
    city: 'Portland, OR'
  })
  .then(res => {
    return cookie = res.headers['set-cookie'][0];
  })
  .then(() =>  {
    thing();
  });

const thing = () => {
  return ssh.connect({
    host: 'blueberrymuffin',
    username : 'pi',
    password: 'RaspberryPiParty37'
  })
    .then(() => {
      return ssh.execCommand('wget https://gist.githubusercontent.com/alanhermanns/319f4784206e589e966c8f5cc3d25066/raw/3250ec38fca492c03736a7dceeda1183b44a2413/piparty.py', { 
        cwd: '/home/pi/Documents'
      });
    })
    .then(() => Promise.resolve(console.log('youre in'))
    )
    .then(function(){
      return ssh.execCommand(`python3 ./piparty.py -c ${cookie} -s light`, {
        cwd: '/home/pi/Documents'
      });
    })
    .then(function({ stderr, stdout, code }){
      console.info(stdout, stderr, code);
      console.info('ooooooOh!', 'So, I hope you know what you\'re getting yourself into, because we won\'t tell you, but... We\'d like to get this Pi party started');
    });
};
