// This object will contain all the physical objects of the game
// will be responsible on each frame of animation to update and draw the objects on the canvas

const DELTA = 1 / 100;
const HOLE_RADIUS = 20;

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
    this.blackBall = this.balls[this.balls.length - 12];
    this.stick = new Stick(
      new Vector(this.whiteBall.position.x, this.whiteBall.position.y)
    );

    // Table borders
    this.table = {
      TopY: 44,
      RightX: 942,
      BottomY: 502,
      LeftX: 43,
    };

    // table holes
    this.holes = {
      TopLeft: new Vector(50, 50),
      TopCenter: new Vector(490, 35),
      TopRight: new Vector(930, 50),
      BottomLeft: new Vector(50, 490),
      BottomCenter: new Vector(490, 505),
      BottomRight: new Vector(930, 490),
    };

    // players
    this.players = [new Player('player1'), new Player('player2')];
    this.turn = 0;
    this.switchTurn = false;

    // black ball handling
    this.blackBallFoul = false;

    this.collided = false;
  }
  update() {
    this.stick.update(this.whiteBall);

    this.handleCollisions();

    for (let i = 0; i < this.balls.length; i++) {
      this.balls[i].update(DELTA);
    }

    if (this.blackBallFoul) {
      this.blackBall.position = new Vector(710, 270);
      this.blackBall.inHole = false;
      this.blackBall.visible = true;
      this.blackBallFoul = false;
    }

    if (!this.whiteBall.moving && this.stick.shot && !this.ballsMoving()) {
      if (
        this.players[this.turn].totalScore ===
        this.players[this.turn].matchScore
      ) {
        this.switchTurn = true;
      }
      this.stick.reposition(this.whiteBall.position); // reposition the stick to the new position of the white ball
    } else if (this.whiteBall.foul) {
      setTimeout(() => {
        this.whiteBall.position = new Vector(270, 270);
        this.whiteBall.inHole = false;
        this.whiteBall.foul = false;
      }, 400);
    }

    if (this.switchTurn) {
      console.log(this.players);
      this.turn++;
      this.turn %= 2;
      this.players[this.turn].totalScore = this.players[this.turn].matchScore;
      this.switchTurn = false;
    }
  }

  draw() {
    Canvas.drawImage(assets.background, { x: 0, y: 0 });

    for (let i = 0; i < this.balls.length; i++) {
      this.balls[i].draw();
    }

    this.stick.draw();

    Canvas.drawScore(
      this.players[this.turn],
      this.getScore(),
      this.players[this.turn].color
    );

    Canvas.drawText(this.players[this.turn]);
  }

  ballsMoving() {
    let ballsMoving = false;

    for (let i = 0; i < this.balls.length; i++) {
      if (this.balls[i].moving) {
        ballsMoving = true;
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

  isInsideTopLeftHole(position) {
    return this.holes.TopLeft.distanceFrom(position) < HOLE_RADIUS;
  }

  isInsideTopRightHole(position) {
    return this.holes.TopRight.distanceFrom(position) < HOLE_RADIUS;
  }

  isInsideBottomLeftHole(position) {
    return this.holes.BottomLeft.distanceFrom(position) < HOLE_RADIUS;
  }

  isInsideBottomRightHole(position) {
    return this.holes.BottomRight.distanceFrom(position) < HOLE_RADIUS;
  }

  isInsideTopCenterHole(position) {
    return this.holes.TopCenter.distanceFrom(position) < HOLE_RADIUS + 6;
  }

  isInsideBottomCenterHole(position) {
    return this.holes.BottomCenter.distanceFrom(position) < HOLE_RADIUS + 6;
  }

  isInsideHole(position) {
    return (
      this.isInsideTopLeftHole(position) ||
      this.isInsideTopRightHole(position) ||
      this.isInsideBottomLeftHole(position) ||
      this.isInsideBottomRightHole(position) ||
      this.isInsideTopCenterHole(position) ||
      this.isInsideBottomCenterHole(position)
    );
  }

  handleBallIn(ball) {
    let currentPlayer = this.players[this.turn];
    let secondPlayer = this.players[(this.turn + 1) % 2];

    if (currentPlayer.color === undefined) {
      if (ball.color === COLOR.RED) {
        currentPlayer.color = COLOR.RED;
        secondPlayer.color = COLOR.YELLOW;
        currentPlayer.matchScore++;
        this.collided = true;
      } else if (ball.color === COLOR.YELLOW) {
        currentPlayer.color = COLOR.YELLOW;
        secondPlayer.color = COLOR.RED;
        currentPlayer.matchScore++;
        this.collided = true;
      } else if (ball.color === COLOR.BLACK) {
        // handle if black ball is entered before (FOUL)
        this.blackBallFoul = true;
        this.switchTurn = true;
      } else {
        ball.foul = true;
        // white ball entered = foul
      }
    } else if (currentPlayer.color === ball.color) {
      currentPlayer.matchScore++;
    } else if (ball.color === COLOR.WHITE) {
      ball.foul = true;
    } else {
      if (this.balls.length === 2) {
        currentPlayer.winner = true;
      } else if (ball.color === COLOR.BLACK) {
        this.blackBallFoul = true;
        this.switchTurn = true;
      } else {
        this.switchTurn = true;
      }
    }

    if (ball.color !== COLOR.WHITE && ball.color !== COLOR.BLACK) {
      this.balls.splice(
        this.balls.indexOf(this.balls.find((element) => element === ball)),
        1
      );
    }
  }

  // check if the white ball overlaps the other balls

  // whiteBallOverLapsBalls() {
  //   let ballsOverlap = false;
  //   for (let i = 0; i < this.balls.length; i++) {
  //     if (this.whiteBall !== this.balls[i]) {
  //       if (
  //         this.whiteBall.position.distanceFrom(this.balls[i].position) <
  //         BALL_DIAMETER
  //       ) {
  //         ballsOverlap = true;
  //       }
  //     }
  //   }

  //   return ballsOverlap;
  // }

  getScore() {
    return this.players[this.turn].matchScore;
  }
}
