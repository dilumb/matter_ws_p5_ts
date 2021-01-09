//Generic class for objects to be managed by server

import Matter from 'matter-js'

//Velocity of an Element
export interface Velocity {
  velocity: { x: number, y: number },
  angle: number
};

//Interface of Element
export interface IElement {
  type: string,
  id: number,
  x: number, y: number,
  w: number,
  h: number,
  angle: number
};

//Element tracked by the world
export abstract class Element {

  _body: Matter.Body; //Body tracked by physics engine

  /*
   * x: number - x-axis position of element
   * y: number - y-axis position of element
   * w: number - Width/radious of element
   * h: number - Height of element
   * type: string - Type of element. Useful in deciding collision action
   * id: number - Unique ID of element (not essential for this example)
   * options: object - Options to be passed while crearing Matter-js body
   */
  constructor(
    protected x: number,
    protected y: number,
    protected w: number,
    protected type: string,
    protected id: number,
    options: object,
    protected h?: number) {

    //create Matter-js body
    if (h) { //Rectange
      this._body = Matter.Bodies.rectangle(x, y, w, h, options);
    }
    else {   //Circle
      this._body = Matter.Bodies.circle(x, y, w, options);
    }
  }

  /*
   * Getter Matter-js body
   */
  get body(): Matter.Body {
    return this._body;
  }

  /*
   * Get element that is to be send to web browser
   */
  get element(): IElement {
    let tmp_element = {
      type: this.type,
      id: this.id,
      x: this.body.position.x,
      y: this.body.position.y,
      w: this.w,
      h: 0,
      angle: this._body.angle
    }

    if (this.h) {
      tmp_element.h = this.h;
    }
    return tmp_element;
  }

};
