const TILE_SIZE = 64;
const GAP = 10;
const ANIM_DURATION = 0.22;
let screenW = 640, screenH = 480, animations = [];

export function init() {
  if (Screen.width) { screenW = Screen.width; screenH = Screen.height; }
}

function tileColor(v){const c={2:0xeee4da,4:0xede0c8,8:0xf2b179,16:0xf59563,32:0xf67c5f,64:0xf65e3b,128:0xedcf72,256:0xedcc61,512:0xedc850,1024:0xedc53f,2048:0xedc22e};return c[v]||0x3c3a32;}

export function render(state) {
  const now=os.clock?os.clock():(Date.now()/1000);
  const n=state.size;
  const bw=n*TILE_SIZE+(n+1)*GAP;
  const bx=(screenW-bw)/2,by=(screenH-bw)/2;

  Screen.clear();
  Draw.rect(bx,by,bw,bw,0x444444);
  state.animations.forEach(a=>animations.push({...a,start:now}));

  for(let y=0;y<n;y++)for(let x=0;x<n;x++){const t=state.grid[y][x];if(!t)continue;
    const a=findAnim(t,now);
    const {px,py,scale,alpha}=computePos(t,a,now,bx,by);
    Draw.setAlpha(alpha);
    Draw.rect(px,py,TILE_SIZE*scale,TILE_SIZE*scale,tileColor(t.value));
    Draw.text(t.value.toString(),px+TILE_SIZE*scale/3,py+TILE_SIZE*scale/3,0x000000);
    Draw.resetAlpha();
  }

  animations=animations.filter(a=>now-a.start<ANIM_DURATION);
  Draw.text("Score: "+state.score,bx,by-24,0xFFFFFF);
  Screen.flip();
}

function findAnim(t,now){for(let a of animations)if(a.tile===t||(a.to&&a.to===t))return a;return null;}

function computePos(t,a,now,bx,by){
  let p=1;if(a)p=Math.min((now-a.start)/ANIM_DURATION,1);
  let sx=t.x,sy=t.y,scale=1,alpha=1;
  if(a){
    if(a.type==="move"){sx=lerp(a.from.x,a.to.x,p);sy=lerp(a.from.y,a.to.y,p);}
    else if(a.type==="merge"){scale=1+0.25*(1-Math.abs(p*2-1));}
    else if(a.type==="appear"){scale=0.5+0.5*p;alpha=p;}
  }
  const px=bx+GAP+sx*(TILE_SIZE+GAP),py=by+GAP+sy*(TILE_SIZE+GAP);
  return {px,py,scale,alpha};
}
function lerp(a,b,t){return a+(b-a)*t;}
