// This object will contain all the physical objects of the game
// will be responsible on each frame of animation to update and draw the objects on the canvas

const DELTA = 1 / 100;

class GameWorld {
  constructor() {
    this.balls = [
      [new Vector(650, 270), COLOR.YELLOW],
      [new Vector(680, 255), COLOR.YELLOW],
      [new Vector(680, 285), COLOR.RED],
      [new Vector(710, 240), COLOR.RED],
      [new Vector(710, 270), COLOR.BLACK],
      [new Vector(710, 300), COLOR.YELLOW],
      [new Vector(740, 225), COLOR.YELLOW],
      [new Vector(740, 255), COLOR.RED],
      [new Vector(740, 285), COLOR.YELLOW],
      [new Vector(740, 315), COLOR.RED],
      [new Vector(770, 210), COLOR.RED],
      [new Vector(770, 240), COLOR.RED],
      [new Vector(770, 270), COLOR.YELLOW],
      [new Vector(770, 300), COLOR.RED],
      [new Vector(770, 330), COLOR.YELLOW],
      [new Vector(270, 270), COLOR.WHITE],
    ].map((params) => new Ball(params[0], params[1]));

    this.whiteBall = this.balls[this.balls.length - 1];
    this.stick = new Stick(
      new Vector(270, 270),
      this.whiteBall.shoot.bind(this.whiteBall)
    );

    // Table borders
    this.table = {
      TopY: 39,
      RightX: 945,
      BottomY: 500,
      LeftX: 39,
    };
  }
  update() {
    this.handleCollisions();

    this.stick.update();

    for (let i = 0; i < this.balls.length; i++) {
      this.balls[i].update(DELTA);
    }

    if (!this.ballsMoving() && this.stick.shot) {
      this.stick.reposition(this.whiteBall.position); // reposition the stick to the new position of the white ball
    }
  }

  draw() {
    Canvas.drawImage(assets.background, { x: 0, y: 0 });

    for (let i = 0; i < this.balls.length; i++) {
      this.balls[i].draw();
    }

    this.stick.draw();
  }

  ballsMoving() {
    let ballsMoving = false;

    for (let i = 0; i < this.balls.length; i++) {
      if (this.balls[i].moving) {
        ballsMoving = true;
        break;
      }
    }

    return ballsMoving;
  }

  handleCollisions() {
    for (let i = 0; i < this.balls.length; i++) {
      this.balls[i].collideWith(this.table);
      for (let j = i + 1; j < this.balls.length; j++) {
        const firstBall = this.balls[i];
        const secondBall = this.balls[j];
        firstBall.collideWith(secondBall);
      }
    }
  }
}
