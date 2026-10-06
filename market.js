const STALLS=[
  {id:'seeds',n:'Hạt giống',aw:['#3f9a4a','#e8f5d0'],goods:['hat_nep','hat_dau_xanh','hat_hanh']},
  {id:'ing',n:'Nguyên liệu',aw:['#3b6ea5','#d6e6f5'],goods:['duong','muoi','cam']},
  {id:'animals',n:'Vật nuôi',aw:['#c8462e','#f6d2c8'],goods:['ga','bo']},
  {id:'sell',n:'Thu mua',aw:['#d9a82a','#fff3c4'],goods:['coin','dua','trung']}
];
Z.market={bg:mkBg(b=>{
  grass(b);
  // Sàn chợ
  planks(b,28,78,364,78,'#c4a06a','#a8844a');
  rr(b,28,74,364,6,'#8b5a2b');
  // Cột mái
  [36,200,360].forEach(x=>{rr(b,x,36,6,44,'#5a3a20');rr(b,x+1,36,4,44,'#8b5a2b')});
  awn(b,24,28,372,'#c8462e','#fffaf0');
  river(b,198);
  // Thúng xếp góc
  rr(b,340,168,28,16,'#a07040');rr(b,346,160,22,12,'#c4a06a');rr(b,300,172,24,14,'#8b5a2b');
},420,240),
 draw(t){
  rip(t,204,420);
  STALLS.forEach((s,i)=>{
    const x=40+i*92,y=84;
    R(x,y,80,62,'#5a3a20');R(x+3,y+3,74,56,'#f6ecd2');
    R(x-2,y-16,84,8,s.aw[0]);R(x+2,y-22,76,8,s.aw[1]);R(x+8,y-26,64,5,s.aw[0]);
    R(x+4,y-8,4,14,'#6b4423');R(x+72,y-8,4,14,'#6b4423');
    s.goods.forEach((g,k)=>IM(g,x+8+k*22,y+22,18));
    TS(s.n,x+40,y+54,'#2a1a10',8);
    HOT(x,y-26,80,88,()=>{G.ui.modal=s.id;G.refreshUI()},{sx:x+40,sy:y+70,anim:'shop',dur:.4});
  });
  palm(18,196,t);palm(390,196,t+240);
  G.drawPOI(70,188,'','hub',70,188,1);
  G.P.draw(t);
}};
