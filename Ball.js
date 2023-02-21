const BALL_ORIGIN = new Vector(20, 20);
const BALL_DIAMETER = 30;
const BALL_RADIUS = BALL_DIAMETER / 2;

class Ball {
  constructor(position, color) {
    this.position = position;
    this.velocity = new Vector();
    this.moving = false; //indicator of ball movement
    this.ball = getBallImageByColor(color);
    this.inHole = false;
    this.visible = true;
    this.color = color;
    this.foul = false;
  }

  update(delta) {
    if (!this.moving || this.inHole) {
      return;
    }

    let newPosition = this.position.addTo(this.velocity.multiply(delta));
    if (poolGame.gameWorld.isInsideHole(newPosition)) {
      this.position = newPosition;
      this.inHole = true;
      this.velocity = new Vector();
      poolGame.gameWorld.handleBallIn(this);
      return;
    }
    this.velocity = this.velocity.multiply(0.98);

    if (this.velocity.length() < 5 && this.moving) {
      this.velocity = new Vector();
      this.moving = false;
    }
  }

  draw() {
    if (!this.visible) {
      return;
    }
    Canvas.drawImage(this.ball, this.position, BALL_ORIGIN);
  }

  shoot(power, rotation) {
    this.velocity = new Vector(
      power * Math.cos(rotation),
      power * Math.sin(rotation)
    );
    this.moving = true;
  }

  collideWith(object) {
    if (object instanceof Ball) {
      this.collideWithBall(object);
    } else {
      // collide with the table
      this.collideWithTable(object);
    }
  }

  collideWithTable(table) {
    if (!this.moving) {
      return;
    }

    let collided = false;

    if (this.position.y <= table.TopY + BALL_RADIUS) {
      this.velocity = new Vector(this.velocity.x, -this.velocity.y);
      this.position.y = table.TopY + BALL_RADIUS;
      collided = true;
    }

    if (this.position.x >= table.RightX - BALL_RADIUS) {
      this.velocity = new Vector(-this.velocity.x, this.velocity.y);
      this.position.x = table.RightX - BALL_RADIUS;
      collided = true;
    }

    if (this.position.y >= table.BottomY - BALL_RADIUS) {
      this.velocity = new Vector(this.velocity.x, -this.velocity.y);
      this.position.y = table.BottomY - BALL_RADIUS;
      collided = true;
    }

    if (this.position.x <= table.LeftX + BALL_RADIUS) {
      this.velocity = new Vector(-this.velocity.x, this.velocity.y);
      this.position.x = table.LeftX + BALL_RADIUS;
      collided = true;
    }

    if (collided) {
      this.velocity = this.velocity.multiply(0.98);
    }
  }

  // Elastic Collison
  /*
  The algorithm:

  step 1: finding a unit normal vector

  Normal Vector: n = <x2 - x1, y2 - y1>

  Unit Vector of n: un = n / sqrt(nx^2 + ny^2)


  step 2: finding the unit tangent vector

  unit tangent vector: ut = <-uny, unx>


  step 3: resolve the velocities into normal and tangential components
  * dot product

  v1n = un * v1
  v1t = ut * v1
  v2n = un * v2
  v2t = ut * v2


  step 4: find a new normal velocities(both of our objects have the same mass) after the collision

  v`1n = v2n

  v`2n = v1n


  step 5: convert the scalar normal and tangential velocities into vectors

  v`1n = v`1n * un
  v`1t = v`1t * ut
  v`2n = v`2n * un
  v`2t = v`2t * ut

  step 6: updating the velocities

  v`1 = v`1n + v`1t
  v`2 = v`2n + v`2t 
  */

  collideWithBall(ball) {
    if (ball.inHole) {
      return;
    }

    // normal vector
    const normalVector = this.position.subtract(ball.position);

    // distance(check whether a collision occurs)
    const dist = normalVector.length();

    if (dist + 1 > BALL_DIAMETER) {
      // no collison
      return;
    }

    // finding minimum translation distance
    // the minimum distance that a colliding object can be moved in order to not collide anymore with another object
    const mtd = normalVector.multiply((BALL_DIAMETER - dist) / dist);

    // Push-Pull balls apart
    this.position = this.position.add(mtd.multiply(1 / 2));
    ball.position = ball.position.subtract(mtd.multiply(1 / 2));

    // unit normal vector
    const unitNormalVector = normalVector.multiply(1 / normalVector.length());

    // unit tangent vector
    const unitTangentVector = new Vector(
      -unitNormalVector.y,
      unitNormalVector.x
    );

    // project velocities onto the unit normal and unit tangent vectors
    const v1n = unitNormalVector.dot(this.velocity);
    const v1t = unitTangentVector.dot(this.velocity);
    const v2n = unitNormalVector.dot(ball.velocity);
    const v2t = unitTangentVector.dot(ball.velocity);

    // find new normal velocities
    let v1nTag = v2n;
    let v2nTag = v1n;

    // convert scalar normal and tangential velocities into vectors
    v1nTag = unitNormalVector.multiply(v1nTag);
    const v1tTag = unitTangentVector.multiply(v1t);
    v2nTag = unitNormalVector.multiply(v2nTag);
    const v2tTag = unitTangentVector.multiply(v2t);

    // update the velocities
    this.velocity = v1nTag.add(v1tTag);
    ball.velocity = v2nTag.add(v2tTag);

    this.moving = true;
    ball.moving = true;
  }
}
