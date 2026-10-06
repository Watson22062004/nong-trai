const STALLS=[
  {id:'seeds',n:'Hạt giống',aw:['#3f9a4a','#e8f5d0'],goods:['hat_nep','hat_dau_xanh','hat_hanh']},
  {id:'ing',n:'Nguyên liệu',aw:['#3b6ea5','#d6e6f5'],goods:['duong','muoi','cam']},
  {id:'animals',n:'Vật nuôi',aw:['#c8462e','#f6d2c8'],goods:['ga','bo']},
  {id:'sell',n:'Thu mua',aw:['#d9a82a','#fff3c4'],goods:['coin','dua','trung']}
];
Z.market={bg:mkBg(b=>{
  grass(b);
  planks(b,24,82,372,76,'#c4a06a','#a8844a');
  rr(b,24,76,372,8,'#8b5a2b');
  [32,196,360].forEach(x=>{rr(b,x,34,6,46,'#5a3a20');rr(b,x+1,34,4,46,'#8b5a2b')});
  awn(b,20,26,380,'#c8462e','#fffaf0');
  river(b,198);
  rr(b,336,166,30,16,'#a07040');rr(b,342,158,22,12,'#c4a06a');rr(b,300,170,26,14,'#8b5a2b');
  // hoa mép chợ
  [[18,168,'#f2d04a'],[26,176,'#f1a0b0'],[390,168,'#fff']].forEach(([x,y,c])=>{rr(b,x,y,3,3,c);rr(b,x,y+3,1,4,'#3f7a32')});
},420,240),
 draw(t){
  rip(t,204,420);
  STALLS.forEach((s,i)=>{
    const x=36+i*94,y=86;
    R(x,y,82,60,'#5a3a20');R(x+3,y+3,76,54,'#fff6e4');
    R(x-2,y-14,86,8,s.aw[0]);R(x+4,y-20,74,8,s.aw[1]);R(x+10,y-24,62,5,s.aw[0]);
    R(x+4,y-8,4,14,'#6b4423');R(x+74,y-8,4,14,'#6b4423');
    s.goods.forEach((g,k)=>IM(g,x+8+k*22,y+18,18));
    TS(s.n,x+41,y+52,'#2a1a10',8);
    HOT(x,y-24,82,84,()=>{G.ui.modal=s.id;G.refreshUI()},{sx:x+41,sy:y+68,anim:'shop',dur:.4});
  });
  palm(16,196,t);palm(392,196,t+220);
  G.drawPOI(72,188,'','hub',72,188,1);
  G.P.draw(t);
}};
