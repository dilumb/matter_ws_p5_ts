//Server

import { createServer, IncomingMessage, ServerResponse } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import fs from 'fs';
import Matter from 'matter-js';
import type { IElement } from './element.js';

import Boarder from './boarder.js';
import Ball from './ball.js';

//Create HTTP server
let server = createServer(handleRequest);
server.listen(8080);
console.log('Server started on port 8080');

//Directory path
let __dirname = path.resolve();

//Matter-js module alias
let Engine = Matter.Engine,
    World = Matter.World,
    Runner = Matter.Runner;

//Matter-js objects
let engine: Matter.Engine;
let world: Matter.World;
let runner: Matter.Runner;

//World elements
const boarders: Boarder[] = [];
const balls: Ball[] = [];
const clients: string[] = [];

//Setup engine
setup();

//Websocket server
const io = new Server(server);

//When new client connected
io.sockets.on('connection',
    function (socket) {
        clients.push(socket.id);    //Just used to give a unique id to each client
        console.log('New client connected: ' + socket.id);

        //Mouse pressed event from client
        socket.on('mouse',
            (data: { x: number, y: number }) => {
                //console.log("Received: 'mouse' " + data.x + " " + data.y);
                //Create a new ball and add to world and physics engine's world
                const ball = new Ball(data.x, data.y, clients.indexOf(socket.id));
                balls.push(ball);
                World.add(world, ball.body);
            }
        );

        //client disconnected
        socket.on('disconnect',
            () => {
                console.log('Client disconnected: ' + socket.id);
            }
        );

        //For every iteration of physics engine loop update web browser
        Matter.Events.on(runner, "afterTick", event => {
            const elements: IElement[] = [];
            boarders.forEach(b => {
                elements.push(b.element);
            });
            balls.forEach(b => {
                elements.push(b.element);
            });

            //Send to all clients including sender
            io.sockets.emit('elements', elements);
        });

        //Whenever 2 balls or ball and boarder collide in the physics engine, 
        //update ball's direction and angle
        Matter.Events.on(engine, "collisionStart", event => {
            let pairs = event.pairs;
            pairs.forEach((p: Matter.IPair) => {
                if (p.bodyA.label === 'ball') {
                    let vel = Ball.getNewVelocity();
                    Matter.Body.setVelocity(p.bodyA, vel.velocity);
                    Matter.Body.setAngle(p.bodyA, vel.angle);
                }
                if (p.bodyB.label === 'ball') {
                    let vel = Ball.getNewVelocity();
                    Matter.Body.setVelocity(p.bodyB, vel.velocity);
                    Matter.Body.setAngle(p.bodyB, vel.angle);
                }
            });
        });
    }
);

//Setup physics engine
function setup() {
    engine = Engine.create();
    world = engine.world;
    engine.world.gravity.y = 0; //No gravity

    addBoarders(600, 600);

    //Use runner as follows as physics engine runs its own loop.
    //This is an alternative to use of "Engine.run(engine)" where physics loop 
    //is triggered by server
    runner = Runner.create();
    Runner.run(runner, engine);
}

/*
 * Add baorders of the world
 * width - Width of canvas
 * height - Height of canvas
 */
function addBoarders(width: number, height: number) {
    const thickness = 20;
    const wide = width - thickness;
    const tall = height - thickness;

    let top = new Boarder(width / 2, thickness, wide, thickness, 1);
    let bottom = new Boarder(width / 2, height - thickness, wide, thickness, 2);
    let left = new Boarder(thickness, height / 2, thickness, tall, 3);
    let right = new Boarder(width - thickness, height / 2, thickness, tall, 4);

    World.add(world, [top.body, bottom.body, left.body, right.body]);
    boarders.push(top);
    boarders.push(bottom);
    boarders.push(left);
    boarders.push(right);
}

//Handle requests from web browser
function handleRequest(req: IncomingMessage, res: ServerResponse) {
    let pathname = req.url!;

    if (pathname == '/') {
        pathname = '/index.html';
    }

    const ext = path.extname(pathname);
    const typeExt: { [key: string]: string } = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css'
    };

    //If property is requested based on given string, 
    //{ [key: string]: string } definition is needed
    let contentType = typeExt[ext] || 'text\plain';

    fs.readFile(__dirname + pathname,
        (err, data) => {
            if (err) {
                console.log(err);
                res.writeHead(500);
                return res.end('Error loading ' + pathname);
            }

            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    );
}
