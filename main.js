// {"name":"2048 (Athena)","author":"You","version":"1.0","icon":"assets/icon.png","file":"main.js"}
import * as Game from './game_logic.js';
import * as Renderer from './renderer.js';
import * as Input from './input.js';

const FPS = 30;
const FRAME_MS = Math.floor(1000 / FPS);

function start() {
  Renderer.init();
  Game.init();
  Input.init();

  os.setInterval(() => {
    const action = Input.poll();
    if (action) {
      if (action === 'restart') {
        Game.reset();
      } else {
        if (Game.move(action)) {
          Game.addRandomTile();
        }
      }
    }
    Renderer.render(Game.getState());
  }, FRAME_MS);

  Renderer.render(Game.getState());
}

start();
