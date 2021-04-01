const width = 400, height = 400;
const N = 10;
const G = 9.8;
var initial_total_energy = 0;
var bodies;

function compute_potential_energy(bodies) {
  let e = 0;
  for (let i = 0; i < bodies.length; ++i) {
    for (let j = 0; j < i; ++j) {
      const r = bodies[i].pos.copy().sub(bodies[j].pos)
      e += - G * bodies[i].mass * bodies[j].mass / r.mag();
    }
  }
  return e;
}

function compute_kinetic_energy(bodies) {
  let e = 0;
  for (let i = 0; i < bodies.length; ++i) {
    e += bodies[i].kinetic_energy();
  }
  return e;
}

function compute_total_energy(bodies) {
  return compute_potential_energy(bodies) + compute_kinetic_energy(bodies);
}

function setup() {
  createCanvas(width, height);
  noStroke();
  bodies = new Array(N);
  for (i = 0; i < N; ++i) {
    bodies[i] = new Dot();
  }
  initial_total_energy = compute_total_energy(bodies);
}

var iter = 0;



function conserve_energy(bodies) {
  const KE = compute_kinetic_energy(bodies);
  const PE = compute_potential_energy(bodies);
  const expectedKE = initial_total_energy-PE;
  const KEFactor = Math.sqrt(expectedKE/KE);
  for (let i = 0; i < bodies.length; ++i) {
    bodies[i].vel.mult(KEFactor);
  } 
}

// How fast does the draw loop run and can we control it?
// what is the 
function draw() {
  // if (iter > 0) return;

  background(20);
  noStroke();
  textSize(10);
  const KE = compute_kinetic_energy(bodies);
  const PE = compute_potential_energy(bodies);
  text("Kinetic Energy: " + KE.toFixed(2), 10, 30);
  text("Potential Energy: " + PE.toFixed(2), 10, 45);
  text("Total Energy: " + (PE + KE).toFixed(2),10, 60);
  for (let i = 0; i < bodies.length; ++i) {
    const body = bodies[i];
    body.updateAccel(bodies);
  }
  for (let i = 0; i < bodies.length; ++i) {
    const body = bodies[i];
    body.move(i);
  }
  conserve_energy(bodies);
  for (let i = 0; i < bodies.length; ++i) {
    const body = bodies[i];
    body.draw();
  }
  ++iter;
}

// Jitter class
class Dot {
  constructor() {
    this.pos = new p5.Vector(width / 2 + random(-200, 200), height / 2 + random(-200, 200));
    this.vel = new p5.Vector(random(-1, 1), random(-1, 1));
    this.accel = new p5.Vector(0, 0);
    this.mass = 1; //random(5, 20);
  }

  updateAccel(bodies) {
    this.accel = new p5.Vector(0, 0);
    for (const body of bodies) {
      const r = body.pos.copy().sub(this.pos);
      const num = body.mass;
      const denom = r.magSq();
      if (denom > 0) {
        r.normalize();
        this.accel.add(r.mult(G * num / denom));
      }
    }
  }

  move(i) {
    // must call updateAccel to compute the new accerlation before calling move
    this.pos.add(this.vel);
    this.vel.add(this.accel);
    this.constrain();
  }

  constrain() {
    if (this.pos.x < 0)  {
      this.vel.x = -this.vel.x;
      this.pos.x = -this.pos.x;
    }
    if (this.pos.x > width) {
      this.vel.x = -this.vel.x;
      this.pos.x = 2*width - this.pos.x;
    }
    if (this.pos.y < 0)  {
      this.vel.y = -this.vel.y;
      this.pos.y = -this.pos.y;
    }
    if (this.pos.y > height) {
      this.vel.y = -this.vel.y;
      this.pos.y = 2*height - this.pos.y;
    }
  }

  kinetic_energy() {
    return this.mass*this.vel.magSq()/2;
  }

  draw() {
    noStroke();
    fill(0, 256, 100, 256);
    ellipse(this.pos.x, this.pos.y, this.mass, this.mass);
    strokeWeight(5);
    stroke(255, 255, 255);
    const unitvel = this.vel.copy().normalize();
    line(this.pos.x, this.pos.y, this.pos.x + this.mass * unitvel.x, this.pos.y + this.mass * unitvel.y);
    // ellipse(this.x-5*this.xdot, this.y-5*this.ydot, this.diameter/2, this.diameter/2);
  }
}
