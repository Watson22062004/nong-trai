Z.pets={bg:mkBg(b=>{
  grass(b);
  river(b,198);
  rr(b,36,36,250,120,'#68b048');rr(b,40,40,242,112,'#7ec85e');
  for(let i=0;i<60;i++){const x=42+hs(i,7)%236,y=44+hs(i,9)%104;rr(b,x,y,1,3,'#4a9a3c');rr(b,x+2,y+1,1,2,'#5fb04a')}
  A.fence(b,36,32,32);A.fence(b,36,142,32,'#b08a54');
  for(let y=44;y<146;y+=14){blk(b,34,y,5,12,'#c4a06a');blk(b,282,y,5,12,'#b08a54')}
  // chuồng
  blk(b,194,44,76,46,'#a8573a');for(let x=198;x<268;x+=8)rr(b,x,48,1,40,'#8a4228');
  blk(b,188,32,88,14,'#d8553a');blk(b,196,24,72,10,'#e86848');for(let x=192;x<272;x+=6)rr(b,x,36,1,8,'#a8402a');
  rr(b,206,56,34,34,OL);rr(b,208,58,30,32,'#3a2412');rr(b,208,58,30,2,'#5a3a20');
  blk(b,248,64,16,14,'#e8c050');rr(b,250,68,12,1,'#c89a30');
  // máng nước + cỏ khô
  blk(b,50,116,40,12,'#6b4423');rr(b,54,118,32,6,'#8fd0f0');rr(b,58,119,10,1,'#d8f0fa');
  A.crate(b,246,118,18,14,'#d8b050');A.crate(b,264,124,14,12,'#e8c050');
  for(let i=0;i<10;i++)A.flower(b,50+hs(i,3)%220,50+hs(i,5)%36+(i%3)*30,['#f2d04a','#f6b0c0','#fff','#b8a0e8'][i%4]);
  // ngoài hàng rào
  A.tree(b,300,40);A.tree(b,350,60,'#4a9a3c');A.bush(b,310,100,'#5fb04a');A.bush(b,372,120);A.tree(b,6,60);A.bush(b,6,110,'#5fb04a');
  A.sign(b,262,160);A.flower(b,300,160,'#f6b0c0');A.flower(b,356,160,'#f2d04a');
},400,230),
 draw(t){rip(t,204,400);
  const bob=Math.sin(t/180);
  // Gà thả
  const ci=G.loadImg(G.ASSETS.chicken);
  if(ci&&ci.complete){cx.drawImage(ci,70+Math.sin(t/400)*12,88,28,14);cx.drawImage(ci,120,96+Math.sin(t/300)*3,28,14)}
  D(G.SP.ga,150,100,1.6);D(G.SP.bo,214,62,2);
  dog(90+Math.sin(t/600)*16,124,t);cat(236,132,t);
  palm(330,196,t);palm(20,196,t+180);
  G.drawPOI(340,176,'','hub',340,176,1);
  G.P.draw(t)}};
