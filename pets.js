Z.pets={bg:mkBg(b=>{
  grass(b);
  river(b,198);
  // Sân cỏ có hàng rào tre
  rr(b,36,36,250,120,'#68b048');rr(b,40,40,242,112,'#7ec85e');
  for(let x=36;x<286;x+=12){rr(b,x,36,3,14,'#c4a06a');rr(b,x,142,3,14,'#8b5a2b')}
  for(let y=36;y<156;y+=12){rr(b,36,y,3,10,'#c4a06a');rr(b,282,y,3,10,'#8b5a2b')}
  rr(b,36,48,250,3,'#8b5a2b');rr(b,36,142,250,3,'#8b5a2b');
  // Chuồng nhỏ + máng
  rr(b,196,52,70,36,'#8b5a2b');rr(b,200,56,62,28,'#c4a06a');rr(b,192,46,78,8,'#d8b56a');
  rr(b,52,118,36,10,'#6b4423');rr(b,56,116,28,6,'#8fc8e0');
  // Bụi hoa
  [[48,78,'#f2d04a'],[64,86,'#f1a0b0'],[150,70,'#fff'],[168,84,'#f2d04a']].forEach(([x,y,c])=>{rr(b,x,y,3,3,c);rr(b,x,y+3,1,4,'#3f7a32')});
},400,230),
 draw(t){rip(t,204,400);
  const bob=Math.sin(t/180);
  // Gà thả
  const ci=G.loadImg(G.ASSETS.chicken);
  if(ci&&ci.complete){cx.drawImage(ci,70+Math.sin(t/400)*12,88,28,14);cx.drawImage(ci,120,96+Math.sin(t/300)*3,28,14)}
  D(G.SP.ga,150,100,1.6);D(G.SP.bo,214,62,2);
  // Chó
  const dx=90+Math.sin(t/600)*16;
  R(dx,124,12,6,'#c08a4c');R(dx-3,120,6,5,'#c08a4c');R(dx-2,122,1,1,'#2a1a10');
  R(dx+1,129,2,3+(bob>0?1:0),'#6b4423');R(dx+7,129,2,3+(bob>0?0:1),'#6b4423');
  // Mèo trên hàng rào
  R(236,132,11,6,'#e07a3a');R(238,128,6,5,'#e07a3a');R(237,127,2,3,'#e07a3a');R(242,127,2,3,'#e07a3a');R(240,130,1,1,'#2a1a10');
  palm(330,196,t);palm(20,196,t+180);
  G.drawPOI(340,176,'','hub',340,176,1);
  G.P.draw(t)}};
