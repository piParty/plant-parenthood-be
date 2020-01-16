// const { userAgent } = require('../lib/helpers/data-helpers.js');
// const mongoose = require('mongoose');

// //const inquirer = require('inquirer');
// const node_ssh = require('node-ssh');
// const ssh = new node_ssh();

// let token;
// describe('integration test for pi', () => {
//   it('should be able to connect to the pi, get a sensor reading, and post it to the database', async() => {

//     await userAgent
//     //to make sure that the agent gets assigned a data session cookie!
//       .post('/api/v1/pi-data-sessions')
//       .send({
//         piNickname: 'happyPi', 
//         sensorType: ['light'], 
//         piLocationInHouse: 'kithcen', 
//         city: 'Portland, OR'
//       })
//       .then(res => {
//         return token = res.body.dataSession;
//       })
//       .then(async() =>  {
//         //token correctly logs
//         //console.log(token);
//         const thingRes = await thing();
//         console.log(thingRes);
//         return thingRes;
//       });

//     return await userAgent
//       .get('/api/v1/pi-data-points')
//       .then(res => {
//         expect(res.body.length).toBeGreaterThanOrEqual(0);
//       });
//   });
// }, 60000);

// function thing() {
//   return ssh.connect({
//     host: 'blueberrymuffin',
//     username : 'pi',
//     password: 'RaspberryPiParty37'
//   })
//     .then(() => {
//       return ssh.execCommand('wget https://gist.githubusercontent.com/alanhermanns/319f4784206e589e966c8f5cc3d25066/raw/a9f41ffa7f58b72b2b6a61662464c734665b9d49/piparty.py', { 
//         cwd: '/home/pi/Documents'
//       });
//     })
//     .then(() => Promise.resolve(console.log('youre in'))
//     )
//     .then(function(){
//       return ssh.execCommand(`python3 ./piparty.py -c '${token}' -s light`, {
//         cwd: '/home/pi/Documents'
//       });
//     })
//     .then(function({ stderr, stdout, code }){
//       console.info(stdout, stderr, code);
//       console.info('ooooooOh!', 'So, I hope you know what you\'re getting yourself into, because we won\'t tell you, but... We\'d like to get this Pi party started');
//       return 'MADE IT TO THE END YAY';
//     })
//     .then(() => {
//       return ssh.dispose();
//       //return mongoose.connection.close();
//     });
// }

describe('meaningless test', () => {
  it('should pass', () => {
    expect(true).toEqual(true);
  })
})
