const STALLS=[
  {id:'seeds',n:'Hạt giống',aw:['#3f9a4a','#e8f5d0'],goods:['hat_nep','hat_dau_xanh','hat_hanh']},
  {id:'ing',n:'Nguyên liệu',aw:['#3b6ea5','#d6e6f5'],goods:['duong','muoi','cam']},
  {id:'animals',n:'Vật nuôi',aw:['#c8462e','#f6d2c8'],goods:['ga','bo']},
  {id:'sell',n:'Thu mua',aw:['#d9a82a','#fff3c4'],goods:['coin','dua','trung']}
];
Z.market={bg:mkBg(b=>{
  grass(b);
  for(let y=70;y<164;y+=8)for(let x=22;x<398;x+=12){const o=(y/8%2)*6;rr(b,x+o,y,11,7,['#d8c090','#cdb27c','#e0cb9c'][hs(x,y)%3]);rr(b,x+o,y+6,11,1,'#a8844a')}
  blk(b,20,62,380,9,'#8b5a2b');
  [36,200,360].forEach(x=>{blk(b,x,34,7,38,'#8b5a2b')});
  awn(b,24,28,372,'#c8462e','#fffaf0');
  rr(b,24,8,372,1,OL);for(let x=34;x<390;x+=36)A.lantern(b,x,10,['#d8402e','#f2a82a','#5fb04a'][(x/36|0)%3]);
  river(b,198);
  A.barrel(b,330,166);A.crate(b,350,172,16,12);A.crate(b,354,162,14,11,'#c49050');A.basket(b,300,172,'#f2d04a');A.basket(b,282,176,'#e8483a');
  A.sack(b,24,168);A.sack(b,38,174,'#d8c090');A.bush(b,380,160);A.bush(b,150,172,'#5fb04a');
  for(let x=60;x<280;x+=26)A.flower(b,x,176+hs(x,2)%6,['#f2d04a','#f6b0c0','#fff'][hs(x,4)%3]);
},420,240),
 draw(t){
  rip(t,204,420);
  STALLS.forEach((s,i)=>{
    const x=40+i*92,y=84;
    blk(cx,x,y,80,62,'#7a4a24');rr(cx,x+3,y+4,74,52,'#f6ecd2');
    for(let k=0;k<8;k++)blk(cx,x-2+k*10,y-22,11,14,k%2?s.aw[1]:s.aw[0]);
    for(let k=0;k<8;k++)orb(cx,x+3+k*10,y-8,4,k%2?s.aw[1]:s.aw[0]);
    blk(cx,x+2,y-4,4,12,'#6b4423');blk(cx,x+74,y-4,4,12,'#6b4423');blk(cx,x+4,y+40,72,5,'#a8733a');
    s.goods.forEach((g,k)=>IM(g,x+8+k*22,y+22,18));
    TS(s.n,x+40,y+49,'#2a1a10',8);
    HOT(x,y-26,80,88,()=>{G.ui.modal=s.id;G.refreshUI()},{sx:x+40,sy:y+70,anim:'shop',dur:.4});
  });
  palm(18,196,t);palm(390,196,t+240);
  G.drawPOI(210,198,'Về làng','hub',210,188);
  G.P.draw(t);
}};
