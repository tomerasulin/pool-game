class Game {
  init() {
    this.gameWorld = new GameWorld();
  }

  start() {
    poolGame.init();

    poolGame.mainLoop();
  }

  mainLoop() {
    Canvas.clear();

    poolGame.gameWorld.update();
    poolGame.gameWorld.draw();
    mouse.reset();

    requestAnimationFrame(poolGame.mainLoop);
  }
}

let poolGame = new Game();
