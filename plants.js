// plants.js — hình cây trên ruộng: mỗi loại cây có sprite riêng, 5 giai đoạn (0 hạt gieo · 1 mầm · 2 nhỏ · 3 lớn · 4 chín).
// Vẽ bằng bộ công cụ G.paint của icons.js trên lưới 20×22 (+viền = 22×24). Gốc cây ở (10,19.5), ô đất rộng 24px nên sprite vừa ô.
// Thêm cây mới: thêm vào G.CROPS (core.js) rồi thêm 1 dòng vào PLANT bên dưới (dùng lại dạng cây có sẵn hoặc vẽ dạng mới).
// Giai đoạn theo % thời gian lớn (G.plantStage): <12% hạt · <35% mầm · <65% nhỏ · <100% lớn · đủ 100% chín.
(()=>{
const{px,rect,line,ell,ball,strip,tri,dots,sh,lf,build,toCanvas}=G.paint;
const W=20,H=22,BX=10,BY=19.5;
const soil=()=>{ell(10,20.3,5.4,1.7,'#5e3e20');ell(10,19.7,4.5,1.3,'#7a5430');px(7,19,'#9a6c3e');px(12,19,'#9a6c3e')};
const leaf=(x,y,w,c,bx=BX,by=BY)=>strip(bx,by,x,y,t=>w*lf(t)+.35,c);
const pick=(L,a)=>a[Math.min(L,a.length)-1];

// ---- các dạng cây ----
// hành lá: lá ống mảnh, gốc trắng
const blade=c=>L=>{const dx=pick(L,[[0],[-2,0,2],[-3,-1,1,3],[-4,-2,0,2,4]]),h=pick(L,[6,10,14,17]);
 dx.forEach((d,i)=>{const hh=h-Math.abs(d)*.6-(i%2);strip(BX+d*.35,BY,BX+d*1.05,BY-hh,t=>1.15*(1-t*.55)+.2,i%2?sh(c,.1):c)});
 if(L>=2)dx.forEach(d=>strip(BX+d*.35,BY,BX+d*.5,BY-3.5,t=>1.25,'#f4f0e0'));if(L>=4)ball(BX,BY,2.4,1.8,'#f4f0e0',0)};
// rau thơm: các cụm lá 3 thuỳ
const herb=c=>L=>{const cl=(x,y,r)=>{ball(x-r*.8,y+r*.4,r*.95,r*.8,c,0);ball(x+r*.8,y+r*.4,r*.95,r*.8,c,0);ball(x,y-r*.5,r,r*.9,sh(c,.14),0);px(x,y,sh(c,-.3))};
 line(BX,BY,BX,BY-pick(L,[3,6,9,11]),'#5a9a3c');
 const pos=pick(L,[[[10,15,1.5]],[[7,13,1.8],[13,13,1.8],[10,10,1.8]],[[6,14,2],[14,14,2],[8,10,2],[12,10,2],[10,6,2.2]],[[5,14,2.2],[15,14,2.2],[7,9,2.2],[13,9,2.2],[10,5,2.4],[10,12,2.2]]]);
 pos.forEach(([x,y,r])=>{line(BX,BY,x,y+1,'#5a9a3c')});pos.forEach(([x,y,r])=>cl(x,y,r))};
// rau muống: thân nhạt, lá mũi tên
const greens=c=>L=>{const l=pick(L,[[[7,15,1.5],[13,15,1.5]],[[6,13,1.9],[14,13,1.9],[10,10,1.9]],[[4,13,2.2],[16,13,2.2],[7,9,2.2],[13,9,2.2],[10,5,2.2]],[[3,13,2.4],[17,13,2.4],[6,8,2.4],[14,8,2.4],[10,3,2.5],[8,12,2],[12,12,2]]]);
 l.forEach(([x,y,w])=>{line(BX,BY,x,y+2,'#b4dc90');leaf(x,y,w,c,x,y+3.5)});l.forEach(([x,y,w],i)=>strip(x,y+3.5,x+(x<10?-1:1)*.2,y,t=>w*lf(t)+.3,i%2?sh(c,.1):c))};
// cà chua: thân + cọc, quả xanh rồi chín đỏ
const tomato=()=>L=>{const h=pick(L,[6,11,15,16]);if(L>=2)line(15,20,15,BY-h-1,'#a8803e');line(BX,BY,BX,BY-h,'#4a8a38');
 const lv=pick(L,[[[8,14],[12,13]],[[7,13],[13,12],[8,9],[12,8]],[[6,13],[14,12],[7,8],[13,7],[10,4]],[[6,13],[14,12],[7,8],[13,7],[10,4]]]);
 lv.forEach(([x,y])=>{ball(x,y,2.8,2.1,'#3f9a3c',0);px(x-1,y-1,'#6cc050')});
 if(L>=3){const c=L>=4?'#e2492f':'#7ab84a';[[7,11],[13,10],[9,15],[12,14]].forEach(([x,y])=>ball(x,y,1.9,1.9,c))}};
// ớt: bụi lá, quả dài rủ xuống
const chili=()=>L=>{const h=pick(L,[5,9,12,13]);line(BX,BY,BX,BY-h,'#4a8a38');
 pick(L,[[[8,14],[12,13]],[[7,13],[13,12],[10,8]],[[6,12],[14,11],[8,7],[12,7],[10,4]],[[6,12],[14,11],[8,7],[12,7],[10,4]]]).forEach(([x,y])=>{ball(x,y,2.5,1.9,'#3f9a3c',0);px(x-1,y-1,'#6cc050')});
 if(L>=3){const c=L>=4?'#d8301f':'#6ab04a';[[7,12],[13,11],[10,9],[9,15]].forEach(([x,y])=>strip(x,y,x-.8,y+5,t=>1.2*(1-t*.6)+.2,c))}};
// cà rốt: lá lông chim, củ lộ vai khi lớn
const carrot=()=>L=>{const n=pick(L,[2,3,5,6]),h=pick(L,[5,9,13,15]);
 for(let i=0;i<n;i++){const d=(i-(n-1)/2)*2.6,hh=h-Math.abs(d)*.55;strip(BX+d*.3,BY,BX+d*1.1,BY-hh,t=>.9,'#5aa84a');
  if(L>=2)for(let k=1;k<=3;k++){const y=BY-hh*k/3.4,x=BX+d*(.3+.8*k/3.4);px(x-1,y,'#7acb5a');px(x+1,y-1,'#4a9a3c')}}
 if(L>=3)ball(BX,BY+.3,pick(L,[2,2,2.2,3.2]),1.5,'#ee8a2a',0);if(L>=4){px(8,19,'#ffb060');px(11,20,'#c8661c')}};
// lúa / nếp: thân mảnh, bông xanh rồi vàng chín cúi xuống
const rice=(green,gold)=>L=>{const dx=pick(L,[[0],[-2,2],[-3,0,3],[-4,-1.5,1.5,4]]),h=pick(L,[5,9,13,15]);
 dx.forEach((d,i)=>{const hh=h-(i%2)*1.5,tx=BX+d*1.2;strip(BX+d*.3,BY,tx,BY-hh,t=>.85*(1-t*.6)+.25,green);
  if(L>=3){const c=L>=4?gold:'#a8c84a',n=L>=4?5:3;for(let k=0;k<n;k++){const x=tx+(L>=4?Math.min(k,3)*.6:0)+(k%2?.4:0),y=BY-hh+k*1.3+(L>=4?k*.5:0);rect(x-.5,y,2,2,k%2?c:sh(c,.15));px(x-.5,y+1,sh(c,-.3))}}
  if(L>=4&&i%2==0)px(tx+2,BY-hh+5,sh(gold,-.2))})};
// đậu xanh / đậu phộng: bụi lá ba chiều; đậu xanh có quả dài rủ, đậu phộng có hoa vàng rồi củ lộ gốc
const bean=(peanut)=>L=>{const h=pick(L,[5,8,11,12]);line(BX,BY,BX,BY-h,'#4a8a38');
 pick(L,[[[8,14],[12,13]],[[7,13],[13,12],[10,8]],[[6,13],[14,12],[7,8],[13,8],[10,4]],[[6,13],[14,12],[7,8],[13,8],[10,4]]]).forEach(([x,y])=>{[[-1.2,.6],[1.2,.6],[0,-.8]].forEach(([a,b])=>ball(x+a*1.4,y+b*1.2,1.7,1.4,'#4aa043',0));px(x-1,y-1,'#7acb5a')});
 if(L>=3){if(peanut){[[7,10],[13,9],[10,13]].forEach(([x,y])=>{px(x,y,'#f2d04a');px(x+1,y,'#f6e070')});if(L>=4)[[6.5,19],[10,19.6],[13.5,19]].forEach(([x,y])=>{ball(x,y,1.5,1.1,'#d8ac6c',0);px(x-1,y,'#a8803e')})}
  else{const c=L>=4?'#5fae44':'#9ad870';[[7,11],[13,10],[10,13],[12,14]].forEach(([x,y])=>strip(x,y,x-.6,y+5,t=>1.15*(1-t*.5)+.2,c))}}};
// chanh: cây bụi thân gỗ, tán tròn, quả xanh lúc chín
const lime=()=>L=>{const th=pick(L,[4,7,9,10]);strip(BX,BY,BX,BY-th,t=>1.1,'#7a4a24');
 const r=pick(L,[2.2,3.8,5.4,5.8]),cy=BY-th-r*.4;ball(BX,cy,r,r*.88,'#3f9a4a');if(L>=2){ball(BX-r*.55,cy+r*.3,r*.6,r*.5,'#4aa84a',0);ball(BX+r*.55,cy+r*.2,r*.6,r*.5,'#4aa84a',0)}
 dots([[BX-2,cy-r*.5],[BX+1,cy-r*.6]],'#7acb5a');if(L>=3)dots([[BX-r*.4,cy+1],[BX+r*.3,cy-1]],'#2f7a2f');
 if(L>=4)[[-3.2,.8],[2.8,-.8],[.2,2.4],[-1.4,-2]].forEach(([a,b])=>ball(BX+a,cy+b,1.6,1.4,'#b8d84a'))};
// chuối: thân to, tàu lá lớn, buồng chuối vàng
const banana=()=>L=>{const th=pick(L,[5,9,12,13]);strip(BX,BY,BX,BY-th,t=>1.6-t*.4,'#7ab04a');rect(BX-1,BY-th*.4,1,2,'#5a8a38');
 const top=BY-th,fr=pick(L,[[[-4,2],[4,2]],[[-5,1],[5,1],[0,-3]],[[-6,2],[6,2],[-3,-2],[3,-2],[0,-5]],[[-7,3],[7,3],[-5,-1],[5,-1],[0,-5],[-3,-3]]]);
 fr.forEach(([dx,dy],i)=>{strip(BX,top+1,BX+dx*1.1,top+dy+2,t=>2.3*lf(t)+.3,i%2?'#4aa043':'#5fb04a');line(BX,top+1,BX+dx*.9,top+dy+1.5,'#2f7a2f')});
 if(L>=4){line(BX+1,top+1,BX+3,top+6,'#6a8a3a');[[3,5],[4.6,6.2],[2.2,7]].forEach(([a,b])=>strip(BX+a,top+b-1,BX+a+.6,top+b+3.6,t=>1.1,'#f2d04a'));px(BX+3,top+10,'#6a4a1a')}};
// dừa: thân cong, tán lá kép, quả
const coco=()=>L=>{const th=pick(L,[4,8,12,14]);for(let i=0;i<th;i++)rect(BX-1+Math.sin(i*.35)*.8,BY-i,2,1,i%2?'#8a5a2b':'#9a6a3a');
 const tx=BX+Math.sin(th*.35)*.8,top=BY-th,fr=pick(L,[[[-4,-1],[4,-1]],[[-6,0],[6,0],[0,-4]],[[-8,1],[8,1],[-5,-3],[5,-3],[0,-5]],[[-9,2],[9,2],[-6,-2],[6,-2],[0,-6],[-3,-5],[3,-5]]]);
 fr.forEach(([dx,dy],i)=>{strip(tx,top,tx+dx,top+dy+(dx?2:0),t=>1.5*lf(t)+.3,i%2?'#3f9a4a':'#4aa84a');line(tx,top,tx+dx*.9,top+dy*.9+(dx?1.5:0),'#2f7a2f')});
 if(L>=4)[[-1.2,1.8],[1.4,2.2],[.2,3.8]].forEach(([a,b])=>ball(tx+a,top+b,1.5,1.5,'#8a5a2b'))};

const PLANT={
 hanh:blade('#3f9a4a'),rau_thom:herb('#5fb04a'),rau_muong:greens('#3f8a3a'),ca_chua:tomato(),ot:chili(),ca_rot:carrot(),
 nep:rice('#7aa83a','#e8cf6a'),gao:rice('#8ab044','#efe0a0'),dau_xanh:bean(false),dau_phong:bean(true),chanh:lime(),chuoi:banana(),dua:coco()
};

// ---- xuất sprite ----
G.plantStage=(p)=>{const g=p.t/G.CROPS[p.crop].time;return g>=1?4:g<.12?0:g<.35?1:g<.65?2:3};
const cacheP={},cacheC={};
G.plantPixels=(crop,st)=>{const k=crop+st;if(cacheP[k])return cacheP[k];
 return cacheP[k]=build(W,H,()=>{soil();if(st===0){const c=G.CROPS[crop]?G.CROPS[crop].color:'#c8a040';rect(9,18,2,1,sh(c,-.1));px(9,17,sh(c,.3));px(8,19,sh(c,-.3));return}(PLANT[crop]||PLANT.herb)(st)})};
G.plantSprite=(crop,st)=>{const k=crop+st;return cacheC[k]||(cacheC[k]=toCanvas(G.plantPixels(crop,st)))};
})();
