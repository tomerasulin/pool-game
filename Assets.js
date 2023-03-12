// this file handle to load all assets for the game

let assets = {};
let assetsStillLoading = 0;

function assetsLoadingLoop(callback) {
  if (assetsStillLoading) {
    // this function tells the browser that it calls another function to update an animation before the next repaint
    requestAnimationFrame(assetsLoadingLoop.bind(this, callback));
  } else {
    callback();
  }
}

function loadAssets(callback) {
  function loadImage(filename) {
    assetsStillLoading++;

    let img = new Image();
    img.src = './assets/images/' + filename;

    img.onload = function () {
      // once the image has been loaded we decrease the 'assetsStillLoading' variable
      assetsStillLoading--;
    };

    return img;
  }

  // loading the assets
  assets.background = loadImage('poolBackground.png');
  assets.stick = loadImage('stick.png');
  assets.whiteBall = loadImage('whiteBall.png');
  assets.redBall = loadImage('redBall.png');
  assets.yellowBall = loadImage('yellowBall.png');
  assets.blackBall = loadImage('blackBall.png');

  assetsLoadingLoop(callback);
}

function getBallImageByColor(color) {
  switch (color) {
    case COLOR.RED:
      return assets.redBall;
    case COLOR.YELLOW:
      return assets.yellowBall;
    case COLOR.BLACK:
      return assets.blackBall;
    case COLOR.WHITE:
      return assets.whiteBall;
  }
}
