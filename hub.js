Z.hub={bg:mkBg(b=>{
  grass(b);
  // Đường chữ thập
  for(let x=0;x<520;x+=4)rr(b,x,148,4,32,'#c4a06a');
  for(let y=30;y<270;y+=4)rr(b,236,y,32,4,'#c4a06a');
  rr(b,0,148,520,3,'#a8844a');rr(b,0,177,520,3,'#a8844a');
  river(b,250);
},520,300),
 draw(t){
  rip(t,255,520);
  // NPC đa dạng trên đường
  const npcs=[
    {x:90,key:'char2_walk',row:2},{x:170,key:'char3_walk',row:0},
    {x:270,key:'char5_walk',row:1},{x:350,key:'char1_walk',row:3}
  ];
  npcs.forEach((n,i)=>{
    const wx=n.x+Math.sin(t/900+i)*18,fr=((t/140+i)|0)%4;
    const ci=G.loadImg(G.ASSETS[n.key]);
    if(ci&&ci.complete){cx.imageSmoothingEnabled=false;cx.drawImage(ci,fr*16,n.row*16,16,16,wx,138,28,28)}
  });
  TS('LÀNG BẾN DỪA',260,28,'#f2d04a',14);
  // POI liên kết
  G.drawPOI(70,130,'Trại','farm',70,130,1);
  G.drawPOI(190,90,'Chợ','market',190,90,1);
  G.drawPOI(310,130,'Quán','shop',310,130,1);
  G.drawPOI(400,90,'Thú cưng','pets',400,90,1);
  G.drawPOI(130,200,'Bếp','kitchen',130,200,1);
  G.P.draw(t);
  palm(40,248,t);palm(470,248,t+300);
}};
