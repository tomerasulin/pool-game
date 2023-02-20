const STICK_ORIGIN = new Vector(730, 10);
const STICK_SHOT_ORIGIN = new Vector(710, 10);
const MAX_POWER = 3000;

class Stick {
  constructor(position) {
    this.position = position;
    this.rotation = 0;
    this.origin = STICK_ORIGIN.copy();
    this.power = 0;
    this.shot = false;
  }

  update(whiteball) {
    this.updateRotation();
    if (!this.shot) {
      if (mouse.left.down) {
        this.increasePower();
      } else if (this.power > 0) {
        this.shoot(whiteball);
      }
    }
  }

  draw() {
    Canvas.drawImage(assets.stick, this.position, this.origin, this.rotation);
  }

  // this method gets the angle of the rotation based on the following article: https://sinepost.wordpress.com/2012/02/16/theyve-got-atan-you-want-atan2/
  updateRotation() {
    let opposite = mouse.position.y - this.position.y;
    let adjacent = mouse.position.x - this.position.x;

    this.rotation = Math.atan2(opposite, adjacent);
  }

  increasePower() {
    if (this.power > MAX_POWER) {
      return;
    }
    this.power += 100;
    this.origin.x += 5;
  }

  shoot(whiteball) {
    whiteball.shoot(this.power, this.rotation);
    this.power = 0;
    this.origin = STICK_SHOT_ORIGIN.copy();
    this.shot = true;
  }

  reposition(position) {
    this.position = position.copy();
    this.origin = STICK_ORIGIN.copy();
    this.shot = false;
  }
}
