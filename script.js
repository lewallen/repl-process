/*
Sam's space
*/

const width = 400, height = 400;
const N = 3;
var bodies;

function setup() {
  createCanvas(width, height);
  noStroke();
  bodies = new Array(N);
  for (i = 0; i < N; ++i) {
    bodies[i] = new Dot();
  }
}

// How fast does the draw loop run and can we control it?
// what is the 
function draw() {
  background(20);
  for (const body of bodies) {
    body.move(bodies);
    body.draw();
  }
}

function wrap(x, max) {
  x = x % max;
  if (x < 0)
    x += max;
  return x;
}

var iter = 0;

// Jitter class
class Dot {
  constructor() {
    this.pos = new p5.Vector(width / 2 + random(20), height / 2 + random(20));
    console.log(this.pos);
    this.vel = new p5.Vector(random(5), random(5));
    this.accel = new p5.Vector(.00001, -.00001);
    this.mass = random(10, 30);
  }

  updateAccel(bodies) {
    this.accel = new p5.Vector(0, 0);
    for (const body of bodies) {
      const r = body.pos.sub(this.pos);
      const num = this.mass * body.mass;
      /*
      const denom = r.magSq();
      if (denom > 0) {
        const rhat = r.normalize();
        this.accel = this.accel + 0; //rhat.mult(num / denom);
      }
      */
    }
  }

  move(bodies) {
    // this.updateAccel(bodies);
    this.vel = this.vel.add(this.accel);
    this.pos = this.pos.add(this.vel);
    this.pos = new p5.Vector(
      wrap(this.pos.x, width), wrap(this.pos.y, height));
  }

  draw() {
    noStroke();
    fill(0, 256, 100, 256);
    ellipse(this.pos.x, this.pos.y, this.mass, this.mass);
    strokeWeight(5);
    stroke(255, 255, 255);
    const unitvel = this.vel.normalize();
    line(this.pos.x, this.pos.y, this.pos.x + this.mass * unitvel.x, this.pos.y + this.mass * unitvel.y);

    // ellipse(this.x-5*this.xdot, this.y-5*this.ydot, this.diameter/2, this.diameter/2);

    iter += 1;
  }
}

