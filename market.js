const STALLS=[{id:'seeds',n:'Hạt giống',c:['#4a9a3c','#fffaf0'],g:['hat_nep','hat_dua','hat_hanh']},{id:'ing',n:'Nguyên liệu',c:['#3b6ea5','#fffaf0'],g:['duong','muoi','cam']},{id:'animals',n:'Vật nuôi',c:['#c8462e','#fffaf0'],g:['ga','bo']},{id:'sell',n:'Thu mua',c:['#d9a82a','#fffaf0'],g:['coin','dua','trung']}];

Z.market={bg:mkBg(b=>{
  grass(b);
  planks(b,40,40,340,100,'#c4a06a','#a8844a');
  awn(b,40,30,340,'#c8462e','#fffaf0');
  river(b,200);
},420,240),
 draw(t){
  rip(t,205,420);
  STALLS.forEach((s,i)=>{
    const x=50+i*90,y=50;
    R(x,y,80,70,'#2a1a10');R(x+2,y+2,76,66,'#e8d9b0');
    TS(s.n,x+40,y+18,'#2a1a10',9);
    HOT(x,y,80,70,()=>{G.ui.modal=s.id;G.refreshUI()},{sx:x+40,sy:y+80,anim:'shop',dur:.4});
  });
  G.drawPOI(50,190,'Làng','hub',50,190,1);
  G.P.draw(t);
}};
