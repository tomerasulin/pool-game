// This class interact with the canvas element

class Canvas2D {
  constructor() {
    this._canvas = document.getElementById('screen');
    this._ctx = this._canvas.getContext('2d'); // drawing context on the canvas -- 2D
    this._player1 = document.getElementById('player1');
    this._player2 = document.getElementById('player2');
    this._player1Title = document.getElementById('player1-title');
    this._player2Title = document.getElementById('player2-title');
    this.colorDecision = true;
  }

  // this function will clear the specified pixels within a given rectangle
  // context.clearRect(x,y,width,height)
  clear() {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
  }

  // this function draw an image onto the canvas
  drawImage(image, position, origin, rotation = 0) {
    if (!position) {
      position = new Vector();
    }

    if (!origin) {
      origin = new Vector();
    }
    this._ctx.save(); // saves the entire state of the canvas by pushing the current state onto a stack
    this._ctx.translate(position.x, position.y); // adds a translation transformation to the current matrix
    this._ctx.rotate(rotation); // adds a rotation to the transformation matrix
    this._ctx.drawImage(image, -origin.x, -origin.y);
    this._ctx.restore(); //restore the most recently saved state of the canvas
  }

  drawScore(player, score, color) {
    if (this.colorDecision) {
      if (color === COLOR.RED) {
        this._player1Title.style.color = 'red';
        this._player2Title.style.color = 'yellow';
        this.colorDecision = false;
      } else if (color === COLOR.YELLOW) {
        this._player1Title.style.color = 'yellow';
        this._player2Title.style.color = 'red';
        this.colorDecision = false;
      }
    }

    if (player.player === 'player1') {
      this._player1.innerHTML = score;
    } else {
      this._player2.innerHTML = score;
    }
  }
}

let Canvas = new Canvas2D();
