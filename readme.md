## Server-side Matter.js with WebSockets, P5, and Typescript

This example shows how Matter.js can be used on the server-side while communicating via WebSockets. Further, it uses P5 as the renderer and is written in Typescript. It uses P5's Instanced mode.

Once launched, a circle gets generated for every mouse click on the canvas. Each circle randomly picks a velocity and move towards that direction. If it hits another ball or boundary, it picks another random velocity and moves on. You can open up multiple browsers/tabs and generate more circles, and see the movement of other client's circles.

### Getting Started
#### Installing
```
git clone https://github.com/dilumb/matter_ws_p5_ts.git
npm install
```

#### Usage
```
npm run start
```

This launches the webserver that you can access via ```http://localhost:8080/``` Open the webpage on multiple browsers or tabs. Then click on the canvas to generate a new circle.

#### Description
A more detailed description of the example is available at https://dilumbandara.medium.com/server-side-matter-js-with-socket-io-p5-and-typescript-bb55219ad754.
