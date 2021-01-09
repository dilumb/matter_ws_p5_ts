//Web browser code to draw the elements and handle mouse events
//P5 is used in Instanced mode

import type { IElement } from './element.js';

let socket: any;

const s = (sketch: typeof p5) => {

    //For each iteration of physcis engine's loop send by server redraw
    sketch.setup = () => {
        sketch.createCanvas(600, 600);
        sketch.background(0);

        socket = io();

        socket.on('elements',
            (data: IElement[]) => {
                sketch.background(51);
                data.forEach(d => {
                    if (d.type === 'boarder') {
                        sketch.noStroke();
                        sketch.fill(170);
                        sketch.rectMode(sketch.CENTER);     // Set rectMode to CENTER 
                        sketch.push();
                        sketch.translate(d.x, d.y);
                        sketch.rotate(d.angle);
                        sketch.rect(0, 0, d.w, d.h);
                        sketch.pop();
                    }
                    else if (d.type === 'ball') {
                        //sketch.ellipseMode(sketch.CONRNERS);  // Set ellipseMode to CENTER
                        sketch.strokeWeight(1);
                        sketch.stroke(255);
                        switch (d.id % 3) {   //Color based on client id
                            case 0:
                                sketch.fill('red');
                                break;
                            case 1:
                                sketch.fill('green');
                                break;
                            case 2:
                                sketch.fill('blue');
                                break;
                            default:
                                sketch.fill('white');
                                break
                        }

                        sketch.push();
                        sketch.translate(d.x, d.y);
                        sketch.rotate(d.angle);
                        sketch.circle(0, 0, d.w * 2);           //P5 uses diameter
                        sketch.pop();
                    }
                });
            }
        );
    };

    //P5 draw fun. Not used as we are updating based on physcis engine's loop
    sketch.draw = () => {
    }

    //Mouse click event
    sketch.mouseClicked = () => {
        //console.log("Send mouse: " + mouseX + " " + mouseY);
        let data = {
            x: sketch.mouseX,
            y: sketch.mouseY
        };

        socket.emit('mouse', data); //Send to server
    }
};

//New P5 instance
let myp5 = new p5(s, document.getElementById('p5sketch')!);
