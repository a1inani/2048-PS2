export function init() {}

export function poll() {
  if (typeof Pad !== 'undefined' && Pad.read) {
    const pad = Pad.read(0);
    if (pad.left) return 'left';
    if (pad.right) return 'right';
    if (pad.up) return 'up';
    if (pad.down) return 'down';
    if (pad.start) return 'restart';
  }
  if (typeof Keyboard !== 'undefined' && Keyboard.read) {
    const keys = Keyboard.read();
    if (keys.isPressed && keys.isPressed('ArrowLeft')) return 'left';
    if (keys.isPressed && keys.isPressed('ArrowRight')) return 'right';
    if (keys.isPressed && keys.isPressed('ArrowUp')) return 'up';
    if (keys.isPressed && keys.isPressed('ArrowDown')) return 'down';
    if (keys.isPressed && keys.isPressed('r')) return 'restart';
  }
  return null;
}
