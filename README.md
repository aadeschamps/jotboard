# JotBoard

## Introduction
JotBoard is a application that gives you real-time collaborative white board space. I've been in many a situtation where I have wished I had a whiteboard around, or someone wasnt in the area and we were using white boards to facilitate presentations. This application solves both problems. 

JotBoard was built both in Ruby and in JavaScript. Sinatra was used for the backend http server, and handled sessions and most of the database calls. A WebSocket implementation in Node.js was used to allows the real-time collaboration.

## Using Locally

If you want to test out the code locally, or play around with the source code to improve it, simply clone this repo and issue a few commands. First, you'll need the node dependencies.

```
	$ npm install
```

Second, you'll need to make sure you have all of the gems installed

```
	$ bundle install
```

After you have all of the dependencies, you will need to run both of the servers. Open up two terminal windows and run each of these commands.

This one for the Sinatra server:

```
	$ unicorn
```

and this one for the WebSocket server:

```
	$ node socket.js
```

Now you can view in the browser via local host port 8080. 


## Things that need to be Fixed/Completed
* Color starts of blue, need to add black (done)
* Changing sizes does not work (done)
* need confirmation of invite (done, in a crude way)
* only allow one person to draw at a given time (done)
* add mongoDb to socket server



## Later things to change/add
* Want to make dashboard use ajax instead of refreshes
* change the stroke sizes to a slider
* add in ability to write text
* add color pallete
* create a panel to see current users on (hard)
* show invites and such in that same panel
* save pixel data rather than pathing information
