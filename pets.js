Z.pets={bg:mkBg(b=>{
  grass(b);river(b,200);
  rr(b,40,40,300,120,'#6a9a4a');rr(b,42,42,296,116,'#7eb85c');
  // Hàng rào
  for(let x=40;x<340;x+=16){rr(b,x,40,4,16,'#8b5a2b');rr(b,x,140,4,16,'#8b5a2b')}
}),
 draw(t){rip(t,205);
  TS('Khu thú cưng',W/2,30,'#f2d04a',12);
  TS('Sắp mở thêm thú…',W/2,100,'#fff3d6',10);
  // Gà / heo demo
  const ci=G.loadImg(G.ASSETS.chicken);
  if(ci&&ci.complete){cx.drawImage(ci,80+Math.sin(t/400)*10,90,40,20);cx.drawImage(ci,160,100+Math.sin(t/300)*5,40,20)}
  D(G.SP.bo,240,90,2.5);D(G.SP.ga,300,100,2);
  G.drawPOI(50,180,'Làng','hub',50,180,1);
  G.P.draw(t)}};

