# Example Websocket Projects

## Live Cursor Update

A quick example of Node Express + `ws` Websocket library to show the (x,y) position of all cursors connected to the 
server.

The cursor that is **bolded** is your cursor. It will always appear above other cursors

Inspiration: https://ably.com/blog/web-app-websockets-nodejs

### How to test

![Live Cursors example](figs/live-cursors.png)

1. Git clone this repo
1. `cd live-cursors`
1. `npm install`
1. `npm start`
1. Open Multiple browser tabs/windows to http://localhost:3000/
1. Move the mouse on all of them to see the live updating


## Pub/Sub Messages

A quick example of Node Express + `ws` Websocket library to show an implementation of publish/subscribe, with dynamic
subscriptions.

### How to test

![Pub Sub example](figs/pub-sub.png)

1. Git clone this repo
1. `cd pub-sub`
1. `npm install`
1. `npm start`
1. Open Multiple browser tabs/windows to http://localhost:3000/
1. Add and remove subscriptions
