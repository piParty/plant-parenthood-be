# Mid Project for Career Track program at Alchemy Code Lab 
Tess Lameyer, Lisa Carpenter, Ian Andrewson, Alan Hermanns, Ben Beekman

## GOAL: 

## TECH STACK: 
Frameworks
-Node.js
-Python 

Database
- Mongoose/MongoDB on Heroku server



## HARDWARE: 




## Python: virtual environment, venv --> PIP needs its virutal environment to run; PyTest is a test environment for python 

## Raspberry Pi: 

-multiple pis/user ? 

- Specific kits: 
-shouldn't need virtual environment 
-how are we sending data from pi to server? HTTP requests (request library) to the express HTTP server on Heroku 

- vnc viewer (https://www.raspberrypi.org/documentation/remote-access/vnc/) as a way to visualize virtual environment for Python 


-user signs up 
-verification happens (ensureUserAuth) to get the user to the page on the front end where the user can define the parameters of the pi data session 
-user fills out form data for the session --> .post to the Heroku server (verify-session route) --> server sends back Token to the front end
-Token is sent from user front end computer to the raspberry pi directly via SSH command (shell command)
-Raspberry pi will use the token --> pulls info out of the token (id of session), verify that token was signed by our server --> uses this info to make the post to Heroku server via HTTP request (Python script)

-always a new token with every session!

