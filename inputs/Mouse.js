// this object will handle mouse inputs

class Mouse {
  constructor() {
    this.left = new ButtonState();
    this.middle = new ButtonState();
    this.right = new ButtonState();
    this.touch = new ButtonState();

    this.position = new Vector();

    document.onmousemove = this.handleMouseMove;
    document.onmousedown = this.handleMouseDown;
    document.onmouseup = this.handleMouseUp;

    document.addEventListener('touchstart', (e) => {
      [...e.changedTouches].forEach(() => {
        this.touch.pressed = true;
      });
    });

    document.addEventListener('touchmove', (e) => {
      [...e.changedTouches].forEach((touch) => {
        let x = touch.pageY;
        let y = touch.pageX;
        this.position = new Vector(x, y);
        this.touch.down = true;
      });
    });

    document.addEventListener('touchend', (e) => {
      [...e.changedTouches].forEach(() => {
        this.touch.down = false;
      });
    });
  }

  handleMouseDown(e) {
    mouse.handleMouseMove(e);

    if (e.which === 1) {
      if (!mouse.left.down) {
        mouse.left.pressed = true;
      }
      mouse.left.down = true;
    } else if (e.which === 2) {
      if (!mouse.middle.down) {
        mouse.middle.pressed = true;
      }
      mouse.middle.down = true;
    } else if (e.which === 3) {
      if (!mouse.right.down) {
        mouse.right.pressed = true;
      }
      mouse.right.down = true;
    }
  }

  // get the X and Y coordinates of the mouse pointer
  handleMouseMove(e) {
    let x = e.pageX;
    let y = e.pageY;

    mouse.position = new Vector(x, y);
  }

  handleMouseUp(e) {
    mouse.handleMouseMove(e);

    if (e.which === 1) {
      mouse.left.down = false;
    } else if (e.which === 2) {
      mouse.middle.down = false;
    } else if (e.which === 3) {
      mouse.right.down = false;
    }
  }

  reset() {
    this.left.pressed = false;
    this.middle.pressed = false;
    this.right.pressed = false;
    this.touch.pressed = false;
  }
}

let mouse = new Mouse();
