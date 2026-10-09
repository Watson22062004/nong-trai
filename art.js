// art.js — bộ vẽ chibi pixel dùng chung: viền đậm, bo góc, sáng/tối. Mọi hàm nhận ctx `b` (bg hoặc cx).
const OL='#2a1a10';
const tn=(c,a)=>{const n=parseInt(c.slice(1),16),f=a<0?0:255,t=Math.abs(a),m=s=>Math.round((n>>s&255)*(1-t)+f*t).toString(16).padStart(2,'0');return'#'+m(16)+m(8)+m(0)};
const blk=(b,x,y,w,h,c)=>{rr(b,x+1,y,w-2,h,OL);rr(b,x,y+1,w,h-2,OL);rr(b,x+1,y+1,w-2,h-2,c);rr(b,x+2,y+1,w-4,1,tn(c,.4));rr(b,x+1,y+h-2,w-2,1,tn(c,-.22))};
const orb=(b,x,y,r,c)=>{for(let k=0;k<2;k++){const q=k?r:r+1;for(let j=-q;j<=q;j++)for(let i=-q;i<=q;i++)if(i*i+j*j<=q*q+q*.5)rr(b,x+i,y+j,1,1,!k?OL:i+j<-r*.6?tn(c,.38):i+j>r*.7?tn(c,-.24):c)}};
const disc=(b,x,y,r,c)=>{for(let j=-r;j<=r;j++){const w=Math.sqrt(r*r-j*j)|0;rr(b,x-w,y+j,w*2+1,1,c)}};
const ell=(b,x,y,rx,ry,c)=>{for(let j=-ry;j<=ry;j++){const w=Math.sqrt(1-j*j/(ry*ry))*rx|0;rr(b,x-w,y+j,w*2+1,1,c)}};
const A={
 cloud:(b,x,y)=>{disc(b,x+10,y+8,8,'#fff');disc(b,x+22,y+5,10,'#fff');disc(b,x+34,y+9,7,'#fff');rr(b,x+4,y+12,36,4,'#fff');rr(b,x+4,y+15,36,2,'#d8e8f2')},
 lantern:(b,x,y,c='#d8402e')=>{rr(b,x+3,y-8,1,8,OL);blk(b,x,y,8,10,c);rr(b,x+2,y+3,4,3,'#ffd86a');rr(b,x+2,y,4,1,'#f2d04a');rr(b,x+3,y+10,2,4,'#f2d04a')},
 jar:(b,x,y,c)=>{blk(b,x+1,y,6,3,'#c4a06a');blk(b,x,y+2,8,9,c);rr(b,x+2,y+5,2,3,tn(c,.5))},
 crate:(b,x,y,w=16,h=12,c='#b07a40')=>{blk(b,x,y,w,h,c);rr(b,x+2,(y+h/2)|0,w-4,1,tn(c,-.3));rr(b,x+(w>>1),y+2,1,h-4,tn(c,-.3))},
 barrel:(b,x,y,c='#8b5a2b')=>{blk(b,x,y,14,18,c);rr(b,x+1,y+4,12,1,'#3a2412');rr(b,x+1,y+12,12,1,'#3a2412')},
 sack:(b,x,y,c='#e8d9b0')=>{orb(b,x+7,y+9,7,c);blk(b,x+4,y,6,4,tn(c,-.1));rr(b,x+4,y+3,6,1,'#c8462e')},
 basket:(b,x,y,f)=>{blk(b,x,y+4,16,10,'#c49a50');for(let i=0;i<4;i++)rr(b,x+2+i*4,y+7,2,1,'#8a6428');if(f){orb(b,x+4,y+3,3,f);orb(b,x+9,y+2,3,tn(f,.1));orb(b,x+13,y+4,2,f)}},
 pot:(b,x,y,c='#c8643a')=>{orb(b,x+4,y+3,4,'#4a9a3c');orb(b,x+10,y+2,4,'#5fb04a');rr(b,x+7,y-2,2,2,'#f1a0b0');blk(b,x+1,y+8,12,8,c);blk(b,x,y+6,14,3,tn(c,.1))},
 bush:(b,x,y,c='#4a9a3c')=>{orb(b,x+6,y+7,6,c);orb(b,x+14,y+8,5,tn(c,.08));orb(b,x+10,y+4,5,tn(c,.14));[[5,4],[12,2],[16,7],[8,9]].forEach(([i,j])=>rr(b,x+i,y+j,2,2,'#f6b0c0'))},
 tree:(b,x,y,c='#3f9a4a')=>{blk(b,x+6,y+14,6,18,'#7a4a24');orb(b,x+9,y+8,9,c);orb(b,x+2,y+13,6,tn(c,.08));orb(b,x+16,y+13,6,tn(c,.05));orb(b,x+9,y+3,6,tn(c,.18));[[5,8],[14,5],[12,14]].forEach(([i,j])=>rr(b,x+i,y+j,2,2,'#e8483a'))},
 flower:(b,x,y,c)=>{rr(b,x+1,y+3,1,4,'#3f7a32');rr(b,x,y,3,3,c);rr(b,x+1,y+1,1,1,'#f2d04a')},
 stone:(b,x,y,w=10)=>blk(b,x,y,w,Math.max(4,w*.6|0),'#a8a8a0'),
 lily:(b,x,y,f)=>{ell(b,x+4,y+2,5,2,'#4a9a3c');rr(b,x+4,y,1,2,'#3a7a32');if(f){rr(b,x+2,y-2,4,3,'#f6b0c0');rr(b,x+3,y-3,2,2,'#fff0f4');rr(b,x+3,y-1,2,1,'#f2d04a')}},
 fence:(b,x,y,n,c='#c4a06a')=>{rr(b,x,y+3,n*8-3,2,'#8b5a2b');rr(b,x,y+8,n*8-3,2,'#8b5a2b');for(let i=0;i<n;i++)blk(b,x+i*8,y,5,13,c)},
 lamp:(b,x,y)=>{blk(b,x+3,y+12,4,26,'#5a3a20');blk(b,x,y,10,13,'#f2c23a');rr(b,x+2,y+3,6,6,'#fff3b0');blk(b,x-1,y-3,12,4,'#8b5a2b')},
 sign:(b,x,y)=>{blk(b,x+4,y+4,4,22,'#6b4423');blk(b,x-4,y,20,8,'#c4a06a');rr(b,x-2,y+3,14,1,'#8b5a2b');blk(b,x+6,y+10,16,7,'#d8b56a')},
 hut:(b,x,y,w,wall='#e8c888',roof='#c89a4a')=>{rr(b,x+6,y+42,3,6,'#5a3a20');rr(b,x+w-9,y+42,3,6,'#5a3a20');
  blk(b,x+4,y+22,w-8,21,wall);for(let i=0;i<w-14;i+=6)rr(b,x+8+i,y+25,1,16,tn(wall,-.18));
  blk(b,x,y+12,w,12,roof);blk(b,x+6,y+5,w-12,9,tn(roof,.1));blk(b,x+12,y,w-24,7,tn(roof,.2));
  for(let i=0;i<w-6;i+=4){rr(b,x+3+i,y+15,1,7,tn(roof,-.3));rr(b,x+9+i%(w-18),y+8,1,4,tn(roof,-.25))}
  blk(b,x+(w>>1)-4,y+29,8,14,'#6b4423');rr(b,x+(w>>1)+1,y+36,1,2,'#f2d04a');
  blk(b,x+8,y+29,9,8,'#9bd0e8');blk(b,x+w-17,y+29,9,8,'#9bd0e8');rr(b,x+7,y+37,11,2,'#8b5a2b');rr(b,x+9,y+36,2,1,'#f1a0b0');rr(b,x+13,y+36,2,1,'#f2d04a')},
 boards:(b,x,y,w,h,c1,c2)=>{for(let r=0,yy=y;yy<y+h;r++,yy+=14){rr(b,x,yy,w,14,r%2?c2:c1);rr(b,x,yy,w,1,tn(r%2?c2:c1,.25));rr(b,x,yy+13,w,1,tn(c2,-.3));for(let xx=x+(r%2)*30;xx<x+w;xx+=60)rr(b,xx,yy,1,14,tn(c2,-.3))}},
};
const dog=(x,y,t,c='#d89a58')=>{const bob=Math.sin(t/180)>0?1:0,wag=Math.sin(t/90)>0?1:0;
 blk(cx,x,y,13,8,c);blk(cx,x+9,y-5,9,8,c);rr(cx,x+10,y-6,2,3,tn(c,-.35));rr(cx,x+16,y-6,2,3,tn(c,-.35));
 rr(cx,x+13,y-2,1,2,OL);rr(cx,x+17,y,2,2,OL);rr(cx,x+2,y+8,2,3+bob,'#6b4423');rr(cx,x+9,y+8,2,4-bob,'#6b4423');rr(cx,x-3,y+1-wag,3,2,c)};
const cat=(x,y,t,c='#e8863a')=>{blk(cx,x,y,11,9,c);blk(cx,x+1,y-6,9,8,c);rr(cx,x+1,y-8,2,3,c);rr(cx,x+8,y-8,2,3,c);
 rr(cx,x+3,y-3,1,2,OL);rr(cx,x+7,y-3,1,2,OL);rr(cx,x+5,y-1,1,1,'#f1a0b0');rr(cx,x+11+(Math.sin(t/400)>0?1:0),y+5,4,2,c)};
const banana=(x,y,t)=>{const s=Math.sin(t/700+x)*1.5;blk(cx,x,y,5,22,'#6aa84a');
 [[-12,-4],[8,-6],[-8,-12],[4,-12]].forEach(([i,j],k)=>blk(cx,x+i+s*(k%2?1:-1)|0,y+j,14,6,k%2?'#5fb04a':'#4a9a3c'));orb(cx,x+7,y+10,2,'#f2d04a')};

const eo=x=>1-Math.pow(1-Math.max(0,Math.min(1,x)),3);                       // ease-out
const eb=x=>{x=Math.max(0,Math.min(1,x))-1;return 1+2.7*x*x*x+1.7*x*x};     // ease-out-back (nảy)

// ---- sprite lớn: cây trồng mới + vật nuôi mới
const mkSpr=(rows,pal)=>{const w=Math.max(...rows.map(r=>r.length)),h=rows.length,c=document.createElement('canvas');c.width=w+2;c.height=h+2;const x=c.getContext('2d');
  const q=(i,j)=>{const ch=(rows[j]||'')[i];return ch&&ch!=='.'?(pal[ch]||'#f0f'):null};
  for(let j=-1;j<=h;j++)for(let i=-1;i<=w;i++){const v=q(i,j);if(v){x.fillStyle=v;x.fillRect(i+1,j+1,1,1)}else if(q(i+1,j)||q(i-1,j)||q(i,j+1)||q(i,j-1)){x.fillStyle=OL;x.fillRect(i+1,j+1,1,1)}}
  return c};
const SPAL={g:'#7bc653',G:'#4a9a3c',H:'#2f6a2e',y:'#f2d04a',Y:'#d9a82a',k:OL,w:'#fff',n:'#b07a3a',B:'#5a3a20',p:'#f5a8b8',q:'#e48aa0',o:'#e8892a',a:'#6eb5e0'};
const FRU=['....g..g....','..g.gG.Gg.g.','.gGgGGGGgGGg','.GRHGGGGHRGG','.gGRHGGGHRGg','..GGHGRHGGG.','.gGGGGGGGGg.','..GGHGGHGG..','...GGGGGG...','....GGGG....','.....GG.....','.....GH.....','.....H......'];
Object.keys(G.CROPS).forEach(k=>{if(!G.SP[k])G.SP[k]=mkSpr(FRU,Object.assign({},SPAL,{R:G.CROPS[k].color}))});
G.SP.heo=mkSpr(['.qq......qq.','.pppppppppp.','pppkppppkppp','ppppqqqqpppp','pppqkqqkqppp','ppppqqqqpppp','.pppppppppp.','..pp....pp..'],SPAL);
G.SP.vit=mkSpr(['....yy....','...yyyy...','...ykyyoo.','...yyyyoo.','..yyyyy...','.yYyyyyyy.','.yyyyyyyy.','..yyyyyy..','...o..o...'],SPAL);
G.SP.caao=mkSpr(['....aaaa....','..aaaaaaa.aa','.aaakaaaaaaa','..aaaaaaa.aa','....aaaa....'],SPAL);
