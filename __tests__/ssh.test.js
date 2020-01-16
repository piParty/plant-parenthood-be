const { userAgent } = require('../lib/helpers/data-helpers.js');

//const inquirer = require('inquirer');
const node_ssh = require('node-ssh');
const ssh = new node_ssh();

let token;
describe('integration test for pi', () => {
  it('should be able to connect to the pi, get a sensor reading, and post it to the database', async() => {

    await userAgent
    //to make sure that the agent gets assigned a data session cookie!
      .post('/api/v1/pi-data-sessions')
      .send({
        piNickname: 'happyPi', 
        sensorType: ['light'], 
        piLocationInHouse: 'kithcen', 
        city: 'Portland, OR'
      })
      .then(res => {
        return token = res.headers['set-cookie'][0].split('=')[1].split(';')[0];
      })
      .then(async() =>  {
        //token correctly logs
        console.log(token);
        return thing();
      });

    return userAgent
      .get('/api/v1/pi-data-points')
      .then(res => {
        expect(res.body.length).toEqual(1);
      });
  });
});

function thing() {
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
      return ssh.execCommand(`python3 ./piparty.py -c '${token}' -s light`, {
        cwd: '/home/pi/Documents'
      });
    })
    .then(function({ stderr, stdout, code }){
      console.info(stdout, stderr, code);
      console.info('ooooooOh!', 'So, I hope you know what you\'re getting yourself into, because we won\'t tell you, but... We\'d like to get this Pi party started');
      return 'MADE IT TO THE END YAY';
    });
}
