//Boarder class represents the boundary that bodies can move around

import { Element } from './element.js';

export default class Boarder extends Element {

  constructor(x: number, y: number, w: number, h: number, id: number) {
    let options = {
      isStatic: true,   //Static body
      restitution: 0.7, //Kinetic energy for bounce back
      label: 'boarder'  //Element type
    }

    super(x, y, w, 'boarder', id, options, h);
  };
}