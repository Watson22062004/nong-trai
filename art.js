// art.js — bộ vẽ chibi pixel dùng chung: viền đậm, bo góc, sáng/tối. Mọi hàm nhận ctx `b` (bg hoặc cx).
const OL='#2a1a10';
const tn=(c,a)=>{const n=parseInt(c.slice(1),16),f=a<0?0:255,t=Math.abs(a),m=s=>Math.round((n>>s&255)*(1-t)+f*t).toString(16).padStart(2,'0');return'#'+m(16)+m(8)+m(0)};
const blk=(b,x,y,w,h,c)=>{rr(b,x+1,y,w-2,h,OL);rr(b,x,y+1,w,h-2,OL);rr(b,x+1,y+1,w-2,h-2,c);rr(b,x+2,y+1,w-4,1,tn(c,.4));rr(b,x+1,y+h-2,w-2,1,tn(c,-.22))};
const orb=(b,x,y,r,c)=>{for(let k=0;k<2;k++){const q=k?r:r+1;for(let j=-q;j<=q;j++)for(let i=-q;i<=q;i++)if(i*i+j*j<=q*q+q*.5)rr(b,x+i,y+j,1,1,!k?OL:i+j<-r*.6?tn(c,.38):i+j>r*.7?tn(c,-.24):c)}};
const disc=(b,x,y,r,c)=>{for(let j=-r;j<=r;j++){const w=Math.sqrt(r*r-j*j)|0;rr(b,x-w,y+j,w*2+1,1,c)}};
const ell=(b,x,y,rx,ry,c)=>{for(let j=-ry;j<=ry;j++){const w=Math.sqrt(1-j*j/(ry*ry))*rx|0;rr(b,x-w,y+j,w*2+1,1,c)}};
const A={
 // mây xốp nhiều khối: lớp bóng xanh nhạt phía dưới, khối trắng phía trên, đáy phẳng. s = tỉ lệ
 cloud:(b,x,y,s=1)=>{const P=[[9,10,7],[19,6,9],[31,8,8],[40,11,6],[22,12,8]],f=v=>Math.round(v*s);
  P.forEach(([cx_,cy,r])=>disc(b,x+f(cx_),y+f(cy)+2,f(r),'#cfe3f0'));
  P.forEach(([cx_,cy,r])=>disc(b,x+f(cx_),y+f(cy),f(r),'#fdfeff'));
  rr(b,x+f(4),y+f(15),f(42),f(3),'#cfe3f0');rr(b,x+f(6),y+f(14),f(38),f(2),'#fdfeff');
  P.forEach(([cx_,cy,r],i)=>{if(i<4)rr(b,x+f(cx_)-f(r*.4),y+f(cy)-f(r*.62),Math.max(2,f(r*.5)),1,'#ffffff')});
  rr(b,x+f(8),y+f(17),f(34),1,'#bcd6e6')},
 // bầu trời: 6 dải xanh đậm→nhạt, chuyển dải bằng 3 hàng rây điểm ảnh
 sky:(b,w,h)=>{const C=['#5aaee4','#74bfee','#8fcdf2','#aadcf6','#c3e6f9','#dbf1fa'],n=C.length,bh=h/n;
  for(let k=0;k<n;k++){const y0=Math.round(k*bh),y1=Math.round((k+1)*bh);rr(b,0,y0,w,y1-y0,C[k]);
   if(k<n-1)for(let j=0;j<3;j++)for(let q=0;q<w;q+=2)if(((q>>1)+j)%2===0)rr(b,q,y1-1-j,2,1,C[k+1])}},
 // mặt trời: quầng 2 lớp, lõi 3 tông, tia ngắn
 sun:(b,x,y,r)=>{disc(b,x,y,r+9,'#d4eefa');disc(b,x,y,r+5,'#e8f7fc');
  for(let a=0;a<8;a++){const t=a*Math.PI/4;for(let d=r+3;d<r+8;d++)rr(b,Math.round(x+Math.cos(t)*d),Math.round(y+Math.sin(t)*d),1,1,'#fff6c0')}
  disc(b,x,y,r,'#ffd95a');disc(b,x,y,r-1,'#ffe27a');disc(b,x-1,y-1,Math.max(2,r-4),'#fff2a8');rr(b,x-3,y-4,2,1,'#fffbe0')},
 // dãy đồi / núi xa: sườn lượn theo sin + nhiễu, vạch sáng ở sống đồi, vài cây nhỏ trên sườn
 hills:(b,x,y,w,h,c,seed=1)=>{for(let i=0;i<w;i++){const t=i+x,top=y+Math.round(Math.sin(t*.031+seed)*5+Math.sin(t*.07+seed*2)*2.5+((hs(t>>2,seed)%3)-1)*.8);
   rr(b,t,top,1,h,c);rr(b,t,top,1,1,tn(c,.3));rr(b,t,top+1,1,1,tn(c,.14));
   if(hs(t,seed+9)%37===0){const tc=tn(c,-.32);rr(b,t,top-3,3,3,tc);rr(b,t+1,top-4,1,1,tc)}}
  for(let i=0;i<w*h/80;i++){const t=x+hs(i,seed+3)%w,j=y+9+hs(i,seed+4)%Math.max(1,h-9);rr(b,t,j,2,1,tn(c,-.12))}},
 // nhà phố nền (không tương tác): vữa trát, đá góc, chân tường, gờ tầng, mái ngói + ống khói, cửa sổ chớp + hộp hoa, cửa chính + cửa kính, biển treo
 town:(b,x,y,w,gy,wall,roof,o={})=>{const h=gy-y,fl=y+Math.round(h*.46);
  blk(b,x,y,w,h,wall);for(let i=0;i<w*h/20;i++)rr(b,x+2+hs(i,1)%(w-4),y+2+hs(i,2)%(h-4),1,1,tn(wall,i%2?-.09:.12));
  rr(b,x+1,y+1,w-2,1,tn(wall,.28));rr(b,x+w-3,y+2,2,h-2,tn(wall,-.14));
  [x+1,x+w-3].forEach(q=>{for(let j=y+4;j<gy-8;j+=6)rr(b,q,j,2,3,tn(wall,-.22))});
  rr(b,x,gy-5,w,5,'#a39c90');for(let q=x;q<x+w;q+=6)rr(b,q,gy-5,5,2,'#b8b2a6');rr(b,x,gy-5,w,1,'#d0cabc');
  rr(b,x,fl,w,2,tn(wall,-.26));rr(b,x,fl,w,1,tn(wall,.3));
  A.tiles(b,x-2,y-11,w+4,11,roof);if(o.chim){blk(b,x+w-14,y-20,6,10,'#a8573a');rr(b,x+w-15,y-21,8,2,'#6b3a24');rr(b,x+w-13,y-19,2,5,'#c07a5a')}
  const n=Math.max(1,Math.floor((w-8)/20)),gap=(w-8)/n,wh=Math.max(7,Math.min(11,fl-y-9));
  for(let i=0;i<n;i++)A.win(b,Math.round(x+4+gap*i+gap/2-5),y+5,10,wh,{sh:o.sh||'#5f9a4a',box:i%2===0,cur:o.cur});
  const dh=Math.min(15,gy-fl-8);A.door(b,Math.round(x+w/2-(o.left?-6:5)),gy-5-dh,10,dh,o.door||'#6b4423');
  A.win(b,o.left?x+4:x+w-17,fl+5,13,Math.max(6,gy-fl-15),{sh:o.sh||'#5f9a4a'});
  if(o.sign){rr(b,x+w-4,fl-5,8,1,'#4a2e18');blk(b,x+w-2,fl-4,8,7,o.sign);rr(b,x+w,fl-2,4,1,'#fff')}},
 lantern:(b,x,y,c='#d8402e')=>{rr(b,x+3,y-8,1,8,OL);blk(b,x,y,8,10,c);rr(b,x+2,y+3,4,3,'#ffd86a');rr(b,x+2,y,4,1,'#f2d04a');rr(b,x+3,y+10,2,4,'#f2d04a')},
 jar:(b,x,y,c)=>{blk(b,x+1,y,6,3,'#c4a06a');blk(b,x,y+2,8,9,c);rr(b,x+2,y+5,2,3,tn(c,.5))},
 crate:(b,x,y,w=16,h=12,c='#b07a40')=>{blk(b,x,y,w,h,c);rr(b,x+2,(y+h/2)|0,w-4,1,tn(c,-.3));rr(b,x+(w>>1),y+2,1,h-4,tn(c,-.3))},
 barrel:(b,x,y,c='#8b5a2b')=>{blk(b,x,y,14,18,c);rr(b,x+1,y+4,12,1,'#3a2412');rr(b,x+1,y+12,12,1,'#3a2412')},
 sack:(b,x,y,c='#e8d9b0')=>{orb(b,x+7,y+9,7,c);blk(b,x+4,y,6,4,tn(c,-.1));rr(b,x+4,y+3,6,1,'#c8462e')},
 basket:(b,x,y,f)=>{blk(b,x,y+4,16,10,'#c49a50');for(let i=0;i<4;i++)rr(b,x+2+i*4,y+7,2,1,'#8a6428');if(f){orb(b,x+4,y+3,3,f);orb(b,x+9,y+2,3,tn(f,.1));orb(b,x+13,y+4,2,f)}},
 pot:(b,x,y,c='#c8643a')=>{orb(b,x+4,y+3,4,'#4a9a3c');orb(b,x+10,y+2,4,'#5fb04a');rr(b,x+7,y-2,2,2,'#f1a0b0');blk(b,x+1,y+8,12,8,c);blk(b,x,y+6,14,3,tn(c,.1))},
 bush:(b,x,y,c='#4a9a3c')=>{orb(b,x+6,y+7,6,c);orb(b,x+14,y+8,5,tn(c,.08));orb(b,x+10,y+4,5,tn(c,.14));[[5,4],[12,2],[16,7],[8,9]].forEach(([i,j])=>rr(b,x+i,y+j,2,2,'#f6b0c0'))},
 tree:(b,x,y,c='#3f9a4a',s=1)=>{const f=v=>Math.round(v*s);blk(b,x+f(6),y+f(14),f(6),f(18),'#7a4a24');rr(b,x+f(6)+1,y+f(14)+1,1,f(18)-2,'#9a6a3a');
  orb(b,x+f(9),y+f(8),f(9),c);orb(b,x+f(2),y+f(13),f(6),tn(c,.08));orb(b,x+f(16),y+f(13),f(6),tn(c,.05));orb(b,x+f(9),y+f(3),f(6),tn(c,.18));
  [[5,8],[14,5],[12,14],[8,16],[18,10],[3,12]].slice(0,s>1.2?6:3).forEach(([i,j])=>rr(b,x+f(i),y+f(j),2,2,'#e8483a'))},
 flower:(b,x,y,c)=>{rr(b,x+1,y+3,1,4,'#3f7a32');rr(b,x,y,3,3,c);rr(b,x+1,y+1,1,1,'#f2d04a')},
 stone:(b,x,y,w=10)=>blk(b,x,y,w,Math.max(4,w*.6|0),'#a8a8a0'),
 lily:(b,x,y,f)=>{ell(b,x+4,y+2,5,2,'#4a9a3c');rr(b,x+4,y,1,2,'#3a7a32');if(f){rr(b,x+2,y-2,4,3,'#f6b0c0');rr(b,x+3,y-3,2,2,'#fff0f4');rr(b,x+3,y-1,2,1,'#f2d04a')}},
 fence:(b,x,y,n,c='#c4a06a')=>{rr(b,x,y+3,n*8-3,2,'#8b5a2b');rr(b,x,y+8,n*8-3,2,'#8b5a2b');for(let i=0;i<n;i++)blk(b,x+i*8,y,5,13,c)},
 lamp:(b,x,y)=>{blk(b,x+3,y+12,4,26,'#5a3a20');blk(b,x,y,10,13,'#f2c23a');rr(b,x+2,y+3,6,6,'#fff3b0');blk(b,x-1,y-3,12,4,'#8b5a2b')},
 sign:(b,x,y)=>{blk(b,x+4,y+4,4,22,'#6b4423');blk(b,x-4,y,20,8,'#c4a06a');rr(b,x-2,y+3,14,1,'#8b5a2b');blk(b,x+6,y+10,16,7,'#d8b56a')},
 // ---- BỘ DỰNG CẢNH NƯỚC: lau sậy, đá, lá sen, hoa sen, ao, mương, giếng + thuyền / cá chép / vòng sóng (vẽ động) ----
 // lau sậy: thân mảnh, lá, bông nâu hình điếu (cách một cây có bông)
 reeds:(b,x,y,n=4,seed=1)=>{for(let k=0;k<n;k++){const h=8+hs(x+k,seed)%7,sx=x+k*2-n;rr(b,sx,y-h,1,h,k%2?'#5a8a3a':'#6aa046');rr(b,sx+(k%2?-1:1),y-(h>>1),1,3,'#6aa046');
   if(k%2===0){rr(b,sx-1,y-h-3,3,4,'#7a4a24');rr(b,sx,y-h-4,1,1,'#5a3418');rr(b,sx-1,y-h-3,1,2,'#9a6a3a')}else rr(b,sx,y-h-2,1,2,'#8ab85a')}},
 // đá nhô khỏi mặt nước, có bọt trắng quanh chân
 rockW:(b,x,y,r)=>{const ry=Math.max(2,(r*.7)|0);ell(b,x,y+2,r+2,2,'#e8f6fc');ell(b,x,y,r+1,ry+1,OL);ell(b,x,y,r,ry,'#8f8f96');ell(b,x-1,y-1,Math.max(1,r-2),Math.max(1,ry-1),'#b0b0b8');rr(b,x-r+1,y-1,2,1,'#d8d8de')},
 // lá sen to: bóng đổ, mặt lá, vùng sáng, gân lá
 pad:(b,x,y,r,c='#3f9a4a')=>{const ry=Math.max(2,(r*.5)|0);ell(b,x,y+1,r,ry,tn(c,-.3));ell(b,x,y,r,ry,c);ell(b,x-1,y-1,Math.max(1,r-3),Math.max(1,ry-1),tn(c,.18));rr(b,x,y,r,1,tn(c,-.35));rr(b,x-r+1,y-1,r-1,1,tn(c,-.2))},
 // hoa sen: 3 lớp cánh, nhuỵ vàng, cuống
 lotus:(b,x,y,c='#f6b0c0')=>{rr(b,x,y,1,5,'#3a7a32');ell(b,x-3,y-3,2,3,tn(c,-.14));ell(b,x+3,y-3,2,3,tn(c,-.14));ell(b,x,y-5,2,4,c);ell(b,x-2,y-2,2,2,tn(c,.2));ell(b,x+2,y-2,2,2,tn(c,.2));
  rr(b,x-1,y-3,2,2,'#f2d04a');rr(b,x,y-8,1,1,tn(c,.5));rr(b,x-1,y-6,1,2,tn(c,.4))},
 // ao: bờ không tròn đều (đất ướt, đá, lau sậy), nước 4 tông từ lòng ao ra mép, bọt mép, lá và hoa sen
 pond:(b,cx0,cy0,rx,ry,seed=1)=>{const Rr=a=>1+.1*Math.sin(a*3+seed)+.07*Math.sin(a*5+seed*2.3);
  for(let y=cy0-ry-8;y<=cy0+ry+8;y++)for(let x=cx0-rx-10;x<=cx0+rx+10;x++){const dx=(x+.5-cx0)/rx,dy=(y+.5-cy0)/ry,r=Rr(Math.atan2(dy,dx)),d=(dx*dx+dy*dy)/(r*r);
   if(d>1.4)continue;
   if(d>1){rr(b,x,y,1,1,d<1.08?'#6a4a2a':['#8a6a42','#9a7a4e','#7a5a38'][hs(x,y)%3]);continue}
   let c=d<.3?'#3b88c0':d<.6?'#4a9ad0':d<.85?'#5aaee0':'#78c0e4';
   if(d>.9&&hs(x,y)%2)c='#e8f6fc';else if(dy<-.5&&hs(x,y)%3===0)c='#8ccaec';else if(hs(x,y)%23===0)c='#a8dcf2';
   rr(b,x,y,1,1,c)}
  const pos=(i,s,lo,hi)=>{const a=hs(i,seed+s)%628/100,t=lo+(hs(i,seed+s+1)%100)/100*(hi-lo);return[Math.round(cx0+Math.cos(a)*rx*t),Math.round(cy0+Math.sin(a)*ry*t*.9)]};
  for(let i=0;i<7;i++){const[x,y]=pos(i,10,.15,.7);A.pad(b,x,y,4+hs(i,seed)%3,i%2?'#3f9a4a':'#4aa84a')}
  for(let i=0;i<4;i++){const[x,y]=pos(i,40,.1,.55);A.lotus(b,x,y,['#f6b0c0','#fff0f4','#f08aa8','#fff0f4'][i])}
  [-2.4,-.7,2.3].forEach((a,i)=>A.reeds(b,Math.round(cx0+Math.cos(a)*rx*1.3),Math.round(cy0+Math.sin(a)*ry*1.3),4,seed+i));
  for(let i=0;i<13;i++){const a=i/13*6.283,r=Rr(a)*1.2;A.stone(b,Math.round(cx0+Math.cos(a)*rx*r)-3,Math.round(cy0+Math.sin(a)*ry*r)-2,6+hs(i,seed)%3)}},
 // mặt nước hình chữ nhật (mương): 4 dải nước, vệt sáng, bọt mép, bờ đất + đá hai bên
 waterRect:(b,x,y,w,h)=>{const C=['#78c0e4','#5aaee0','#4a9ad0','#3f90c8'],n=C.length,bh=h/n;
  for(let k=0;k<n;k++){const y0=y+Math.round(k*bh),y1=y+Math.round((k+1)*bh);rr(b,x,y0,w,y1-y0,C[k]);if(k<n-1)for(let q=x+(k&1);q<x+w;q+=2)rr(b,q,y1-1,1,1,C[k+1])}
  for(let i=0;i<w*h/60;i++)rr(b,x+hs(i,81)%Math.max(1,w-3),y+3+hs(i,82)%Math.max(1,h-5),3,1,i%3?'#8ccaec':'#3b88c0');
  rr(b,x,y,w,1,'#e8f6fc');rr(b,x-2,y-5,w+4,5,'#8a6a42');rr(b,x-2,y-5,w+4,1,'#a8855a');rr(b,x-2,y+h,w+4,4,'#8a6a42');rr(b,x-2,y+h+3,w+4,1,'#6a4a2a');
  for(let q=x-2;q<x+w+2;q+=6){A.stone(b,q+1,y-4,5);A.stone(b,q+2,y+h,5)}},
 // giếng làng: thành đá xây có rêu, hai trụ gỗ + xà, mái rơm nhỏ, tời quay, dây gàu, vũng nước
 well:(b,x,y)=>{ell(b,x,y,16,3,'#5a9a44');ell(b,x+11,y+1,7,2,'#5a8ab8');rr(b,x+7,y,6,1,'#a8d0e8');
  blk(b,x-14,y-9,28,10,'#9a9aa2');for(let r=0;r<3;r++){const y0=y-9+r*3;rr(b,x-14,y0+2,28,1,'#7a7a82');for(let q=x-14+((r%2)*3);q<x+14;q+=7)rr(b,q,y0,1,3,'#6a6a72')}
  rr(b,x-14,y-9,28,1,'#c4c4cc');[[x-10,y-4],[x-3,y-2],[x+6,y-5],[x+11,y-3]].forEach(([a,c])=>{rr(b,a,c,2,1,'#5a8a3a');rr(b,a+1,c-1,1,1,'#7aaa4a')});
  ell(b,x,y-10,12,4,'#8a8a92');ell(b,x,y-10,10,3,'#2a5a80');ell(b,x,y-10,9,2,'#3f8fc4');rr(b,x-4,y-11,4,1,'#8ccaec');
  blk(b,x-12,y-30,3,23,'#6b4423');blk(b,x+9,y-30,3,23,'#6b4423');rr(b,x-11,y-28,1,19,'#8b5a2b');rr(b,x+10,y-28,1,19,'#8b5a2b');
  blk(b,x-14,y-31,29,3,'#8b5a2b');rr(b,x-13,y-30,27,1,'#a8733a');A.thatch(b,x-18,y-41,37,10,'#d8b050');
  rr(b,x+4,y-26,8,1,'#5a3a20');blk(b,x+11,y-27,2,6,'#5a3a20');rr(b,x,y-29,1,13,'#c8a060');blk(b,x-3,y-17,7,5,'#8b5a2b');rr(b,x-3,y-17,7,1,'#c89a5a');rr(b,x-2,y-16,5,1,'#3f8fc4');rr(b,x-3,y-14,7,1,'#6b4423')},
 // thuyền nan có mui tre, bập bềnh theo sóng, vệt nước sau lái, đèn lồng ở mũi (vẽ động: b = cx)
 sampan:(b,x,y,t)=>{x=Math.round(x);y+=Math.round(Math.sin(t/520+x/50));
  for(let i=0;i<3;i++)rr(b,x-8-i*7,y+9+(i%2),5,1,'#e8f6fc');
  blk(b,x,y+3,44,6,'#8a5a30');rr(b,x-3,y+1,5,4,'#8a5a30');rr(b,x+42,y,5,5,'#8a5a30');rr(b,x+1,y+4,42,1,'#a8733a');
  for(let q=x+6;q<x+42;q+=8)rr(b,q,y+4,1,5,'#6b4423');rr(b,x+2,y+8,40,1,'#5a3a20');
  ell(b,x+19,y+1,13,5,OL);ell(b,x+19,y+1,12,4,'#d8b050');for(let q=x+9;q<x+30;q+=3)rr(b,q,y-3,1,8,'#b88a28');rr(b,x+11,y-2,6,1,'#f0d078');
  for(let i=0;i<8;i++)rr(b,x+2-i,y+5+i,1,1,'#6b4423');
  rr(b,x+45,y-12,1,12,'#6b4423');A.lantern(b,x+42,y-6,'#f2a82a')},
 // cá chép bơi (dir: 1 sang phải, -1 sang trái), đuôi vẫy theo t
 koi:(b,x,y,dir,t,c='#f08a3a')=>{x=Math.round(x);y=Math.round(y);const w=Math.round(Math.sin(t/110));
  rr(b,x-3,y-1,7,3,c);rr(b,x-2,y-2,5,1,tn(c,.2));rr(b,x-3,y+1,7,1,tn(c,-.2));rr(b,x+(dir>0?-1:-2),y-1,2,2,'#fff6e4');
  const tx=dir>0?x-5:x+5;rr(b,tx,y-1+w,2,3,tn(c,-.1));rr(b,tx-(dir>0?1:-1),y-2+w,1,5,tn(c,-.25));rr(b,dir>0?x+3:x-3,y-1,1,1,OL)},
 // vòng sóng loang ra từ một điểm (vẽ động)
 ring:(b,x,y,r)=>{x=Math.round(x);y=Math.round(y);const c='#d4f0fa';rr(b,x-r,y,1,1,c);rr(b,x+r,y,1,1,c);rr(b,x-(r>>1),y-((r*.45)|0),r,1,c);rr(b,x-(r>>1),y+((r*.45)|0),r,1,c)},
 // ---- BỘ DỰNG NHÀ: mái rơm / mái ngói, vách ván, cửa sổ, cửa gỗ, đồ treo. A.hut và các cổng ở core.js (poi*) đều dùng bộ này ----
 // mái rơm hình thang: thớ rơm dọc, 3 dải đậm nhạt, mép dưới tua tủa, gờ nóc có hai cọc chéo
 thatch:(b,x,y,w,h,c)=>{const ins=w*.24,ext=j=>{const f=1-j/(h-1),d=(ins*f)|0;return[x+d,x+w-d]};
  for(let j=0;j<h;j++){const[l,r]=ext(j);rr(b,l-1,y+j,r-l+2,1,OL)}
  for(let j=0;j<h;j++){const[l,r]=ext(j);rr(b,l,y+j,r-l,1,tn(c,[.14,0,-.1][((j/3)|0)%3]))}
  for(let i=0;i<w*1.2;i++){const q=x+((i*7+hs(i,3))%w),j0=hs(i,5)%Math.max(1,h-4),n=3+hs(i,7)%5;for(let j=j0;j<Math.min(h,j0+n);j++){const[l,r]=ext(j);if(q>l&&q<r-1)rr(b,q,y+j,1,1,i%3?tn(c,-.24):tn(c,.3))}}
  const[l,r]=ext(h-1);for(let q=l;q<r;q+=2){const n=1+hs(q,9)%3;rr(b,q,y+h,1,n,OL);rr(b,q,y+h,1,n-1,tn(c,-.18))}
  const rl=x+((w*.27)|0),rw=(w*.46)|0;blk(b,rl,y-3,rw,5,tn(c,.12));for(let k=2;k<rw-2;k+=3)rr(b,rl+k,y-2,1,3,tn(c,-.22));
  rr(b,rl-1,y-6,1,5,'#6b4423');rr(b,rl+rw,y-6,1,5,'#6b4423');rr(b,rl-2,y-7,1,2,'#8b5a2b');rr(b,rl+rw+1,y-7,1,2,'#8b5a2b')},
 // mái ngói đỏ: các hàng ngói lợp so le, bóng dưới mép, gờ nóc
 tiles:(b,x,y,w,h,c)=>{const ins=w*.12,ext=j=>{const f=1-j/(h-1),d=(ins*f)|0;return[x+d,x+w-d]};
  for(let j=0;j<h;j++){const[l,r]=ext(j);rr(b,l-1,y+j,r-l+2,1,OL)}rr(b,x-1,y+h,w+2,1,OL);
  for(let j=0;j<h;j++){const[l,r]=ext(j),row=(j/4)|0,off=(row%2)*3;rr(b,l,y+j,r-l,1,tn(c,j%4===3?-.3:j%4===0?.18:0));
   if(j%4!==3)for(let q=l+off;q<r;q+=6)rr(b,q,y+j,1,1,tn(c,-.32))}
  for(let q=x+2;q<x+w-2;q+=6)rr(b,q,y+h-1,4,1,tn(c,.25));rr(b,x,y+h,w,2,tn(c,-.5));
  blk(b,x+((w*.1)|0),y-3,(w*.8)|0,5,tn(c,-.12));rr(b,x+((w*.1)|0)+1,y-2,((w*.8)|0)-2,1,tn(c,.3))},
 // vách ván đứng: khe ván, vân gỗ, bóng dưới mái, nền đá (stone=0 thì không có nền đá)
 walls:(b,x,y,w,h,c,stone=1)=>{blk(b,x,y,w,h,c);for(let q=x+4;q<x+w-2;q+=5){rr(b,q,y+2,1,h-3,tn(c,-.24));rr(b,q+1,y+2,1,h-3,tn(c,.14))}
  for(let i=0;i<w*h/38;i++){const q=x+2+hs(i,1)%(w-4),j=y+3+hs(i,2)%Math.max(1,h-5);rr(b,q,j,1,2,tn(c,-.16))}
  rr(b,x+1,y+1,w-2,2,tn(c,-.32));if(stone){const sy=y+h-4;rr(b,x,sy,w,4,'#8f8a80');for(let q=x;q<x+w;q+=7){rr(b,q,sy,6,2,'#a8a398');rr(b,q+3,sy+2,6,2,'#9d988d');rr(b,q+6,sy,1,4,'#6f6a60')}rr(b,x,sy,w,1,'#c4bfb2')}},
 // cửa sổ: khung gỗ, kính 2 tông + ô chia + vệt sáng, chớp hai bên (sh), rèm (cur), hộp hoa (box)
 win:(b,x,y,w,h,o={})=>{if(o.sh){const sw=Math.max(3,(w/3)|0);[x-sw-1,x+w+1].forEach((sx,k)=>{blk(b,sx,y-1,sw,h+2,o.sh);for(let j=y+1;j<y+h;j+=2)rr(b,sx+1,j,sw-2,1,tn(o.sh,-.28))})}
  blk(b,x-1,y-1,w+2,h+2,'#8b5a2b');rr(b,x,y,w,h,'#a8dcf0');rr(b,x,y+(h>>1),w,h-(h>>1),'#cfeaf6');
  if(w>=7){rr(b,x+(w>>1),y,1,h,'#8b5a2b');rr(b,x,y+(h>>1),w,1,'#8b5a2b')}
  rr(b,x+1,y+1,2,1,'#fff');rr(b,x+1,y+2,1,2,'#fff');
  if(o.cur){rr(b,x,y,3,h>>1,o.cur);rr(b,x+w-3,y,3,h>>1,o.cur);rr(b,x+1,y+(h>>1)-1,1,1,tn(o.cur,-.3))}
  rr(b,x-2,y+h,w+4,1,'#6b4423');if(o.box){blk(b,x-2,y+h+1,w+4,3,'#8b5a2b');for(let q=0;q<w+2;q+=2){rr(b,x-1+q,y+h-1,2,2,['#f6b0c0','#f2d04a','#fff','#e8483a'][(q/2+(x>>1))%4]);rr(b,x-1+q,y+h+1,1,1,'#3f9a3c')}}},
 // cửa gỗ: khung, ván đứng, tay nắm vàng, ô kính nhỏ (w>=10), bậc đá + thảm chùi chân
 door:(b,x,y,w,h,c='#6b4423')=>{blk(b,x-1,y-1,w+2,h+1,'#4a2e18');rr(b,x,y,w,h,c);for(let q=x+3;q<x+w-1;q+=3){rr(b,q,y+1,1,h-1,tn(c,-.28));rr(b,q+1,y+1,1,h-1,tn(c,.14))}
  rr(b,x+1,y+1,w-2,1,tn(c,.25));rr(b,x+w-3,y+(h>>1),2,2,'#f2d04a');rr(b,x+w-3,y+(h>>1),1,1,'#fff2a8');
  if(w>=10){rr(b,x+2,y+2,w-4,4,'#a8dcf0');rr(b,x+(w>>1),y+2,1,4,'#4a2e18');rr(b,x+2,y+2,2,1,'#fff')}
  rr(b,x-2,y+h,w+4,2,'#b8aea0');rr(b,x-2,y+h,w+4,1,'#d8d0c0');rr(b,x+1,y+h+2,w-2,1,'#c8462e')},
 // dây ớt / tỏi / bắp treo tường
 hang:(b,x,y,k=0)=>{rr(b,x,y,1,11,'#6b4423');for(let j=1;j<11;j+=2){const c=k===0?'#d8301f':k===1?'#f6f0d0':'#f2c030';rr(b,x-1,y+j,1,2,c);rr(b,x+1,y+j+(k===0?0:1),1,2,tn(c,-.2))}},
 // bó rơm tròn: các vòng thớ + dây buộc
 hay:(b,x,y,r)=>{orb(b,x,y,r,'#e0b848');for(let i=1;i<r;i+=2)rr(b,x-((r*r-i*i)**.5|0)+1,y+i-r+(r>>1),Math.max(1,2*((r*r-i*i)**.5|0)-2),1,'#b88a28');rr(b,x-r+2,y-1,2*r-4,1,'#8b5a2b');rr(b,x-1,y-r+1,1,2*r-2,'#c89a38');rr(b,x-r+3,y-r+3,2,1,'#fff2a8')},
 // mái hiên vải sọc có viền lượn sóng, nếp gấp, bóng đổ
 awning:(b,x,y,w,h,c1='#d8402e',c2='#fffaf0')=>{const n=Math.round(w/8),sw=w/n;
  for(let i=0;i<n;i++){const c=i%2?c2:c1,xi=Math.round(x+i*sw),wi=Math.round(sw);blk(b,xi,y,wi+1,h,c);rr(b,xi+1,y+1,1,h-2,tn(c,.22));rr(b,xi+wi-1,y+2,1,h-3,tn(c,-.2));
   const sc=wi>>1;orb(b,xi+sc,y+h,sc,c);rr(b,xi+sc-1,y+h-2,2,1,tn(c,.25))}
  rr(b,x,y,w,2,tn(c1,-.25));rr(b,x,y+2,w,1,tn(c1,-.1))},
 hut:(b,x,y,w,wall='#e8c888',roof='#c89a4a')=>{
  // chân sàn + giằng + bậc thang
  [x+6,x+w-9].forEach(px=>{rr(b,px,y+42,3,8,OL);rr(b,px+1,y+42,1,7,'#7a5230')});rr(b,x+8,y+46,w-16,1,'#5a3a20');
  A.walls(b,x+4,y+22,w-8,21,wall,0);rr(b,x+4,y+41,w-8,2,tn(wall,-.35));
  A.thatch(b,x-3,y+3,w+6,24,roof);
  // cửa sổ tròn nhỏ trên mái (gác mái)
  orb(b,x+(w>>1),y+13,3,'#9bd0e8');rr(b,x+(w>>1)-1,y+11,2,1,'#fff');rr(b,x+(w>>1)-3,y+13,6,1,'#8b5a2b');
  A.door(b,x+(w>>1)-4,y+29,8,13);
  A.win(b,x+7,y+28,8,7,{sh:'#5f9a4a',box:1});A.win(b,x+w-15,y+28,8,7,{sh:'#5f9a4a',box:1});
  A.hang(b,x+(w>>1)+6,y+25,0);A.lantern(b,x+(w>>1)-9,y+22,'#f2a82a')},
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

// ---- sprite lớn: vật nuôi mới (hình cây trồng theo giai đoạn ở js/plants.js)
const mkSpr=(rows,pal)=>{const w=Math.max(...rows.map(r=>r.length)),h=rows.length,c=document.createElement('canvas');c.width=w+2;c.height=h+2;const x=c.getContext('2d');
  const q=(i,j)=>{const ch=(rows[j]||'')[i];return ch&&ch!=='.'?(pal[ch]||'#f0f'):null};
  for(let j=-1;j<=h;j++)for(let i=-1;i<=w;i++){const v=q(i,j);if(v){x.fillStyle=v;x.fillRect(i+1,j+1,1,1)}else if(q(i+1,j)||q(i-1,j)||q(i,j+1)||q(i,j-1)){x.fillStyle=OL;x.fillRect(i+1,j+1,1,1)}}
  return c};
const SPAL={g:'#7bc653',G:'#4a9a3c',H:'#2f6a2e',y:'#f2d04a',Y:'#d9a82a',k:OL,w:'#fff',n:'#b07a3a',B:'#5a3a20',p:'#f5a8b8',q:'#e48aa0',o:'#e8892a',a:'#6eb5e0'};

G.SP.heo=mkSpr(['.qq......qq.','.pppppppppp.','pppkppppkppp','ppppqqqqpppp','pppqkqqkqppp','ppppqqqqpppp','.pppppppppp.','..pp....pp..'],SPAL);
G.SP.vit=mkSpr(['....yy....','...yyyy...','...ykyyoo.','...yyyyoo.','..yyyyy...','.yYyyyyyy.','.yyyyyyyy.','..yyyyyy..','...o..o...'],SPAL);
G.SP.caao=mkSpr(['....aaaa....','..aaaaaaa.aa','.aaakaaaaaaa','..aaaaaaa.aa','....aaaa....'],SPAL);
