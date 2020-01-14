const inquirer = require('inquirer');

inquirer
  .prompt([`So, I see you want to grow a plant.
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
  What is your Pi's Username?`, `
   & IP address (sorry Jasmine)?
  `])
  .then((userName, IPAddress) => {
    console.log(userName);
    console.log(IPAddress);
  })
;
