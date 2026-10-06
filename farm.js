Z.farm={bg:mkBg(b=>{grass(b);
  // chuồng vật nuôi bên phải
  rr(b,400,16,110,140,'#2a1a10');rr(b,403,19,104,134,'#b98a52');
  for(let y=19;y<153;y+=6)rr(b,403,y,104,1,'#a77a45');
  for(let i=0;i<40;i++)rr(b,404+hs(i,5)%90,20+hs(i,6)%120,5,1,'#e8cd6e');
  rr(b,400,12,110,4,'#c08a4c');rr(b,400,156,110,4,'#c08a4c');
  for(let x=400;x<510;x+=28){rr(b,x,6,5,18,'#2a1a10');rr(b,x+1,7,3,16,'#9a6a38');rr(b,x,150,5,14,'#2a1a10');rr(b,x+1,151,3,12,'#9a6a38')}
  // đường đất + hàng rào
  rr(b,0,200,520,30,'#c4a06a');rr(b,0,200,520,4,'#a8844a');
  river(b,250);
  // POI cổng chợ
  rr(b,470,210,40,30,'#2a1a10');rr(b,472,212,36,26,'#8b5a2b');
 },520,300),
 draw(t){const S=G.S,SP=G.SP;rip(t,255,520);
  // Ô đất kiểu Tiny Farm (bo tròn, đất nâu mềm)
  S.plots.forEach((p,i)=>{const{x,y}=G.plotPos(i);
   // bóng + viền đất
   R(x+1,y+2,24,24,'#0003');
   R(x,y,24,24,'#5a3a20');
   R(x+1,y+1,22,22,'#b07a42');R(x+2,y+2,20,20,'#c48a52');
   // đường đất nhẹ
   R(x+3,y+6,18,1,'#9a6a38');R(x+3,y+12,18,1,'#9a6a38');R(x+3,y+18,18,1,'#9a6a38');
   if(p){const c=G.CROPS[p.crop],g=p.t/c.time,s=g<.33?SP.sprout:g<1?SP.grow:SP[p.crop];
    D(s,x+12-s.width/2,y+22-s.height)}
   HOT(x,y,24,24,()=>G.plotClick(i),{sx:x+12,sy:y+28,anim:'dig'})});
  S.plots.forEach((p,i)=>{if(p&&p.t>=G.CROPS[p.crop].time){const{x,y}=G.plotPos(i),by=y-8+Math.sin(t/200+i)*2;BUB(x+1,by,p.crop)}});
  // vật nuôi trong chuồng bên phải
  S.animals.forEach((a,i)=>{const bx=410+(i%2)*48,by=30+Math.floor(i/2)*30,wk=Math.sin(t/900+i*2)*4;
   R(bx+wk+4,by+28,20,4,'#0003');
   if(a.type==='ga'){const ci=G.loadImg(G.ASSETS.chicken);if(ci.complete)cx.drawImage(ci,bx+wk,by+Math.abs(Math.sin(t/180+i))*2,32,16);else D(SP.ga,bx+wk,by,2)}
   else{D(SP.bo,bx+wk,by,2,Math.cos(t/900+i*2)<0)}
   if(a.ready||!a.fed)BUB(bx+6,by-18+(a.ready?Math.sin(t/200)*2:0),a.ready?G.ANIMALS[a.type].make:'cam',a.ready?'#3ba56e':'#c8462e');
   HOT(bx-4,by-20,48,48,()=>a.ready?G.collect(i):a.fed?G.msg('Đang lớn…'):G.feed(i),{sx:bx+20,sy:by+36,anim:a.ready?'dig':'feed'})});
  // ===== NHÀ BẾP (gấp đôi diện tích) =====
  const hx=8,hy=40,hs=144; // 72→144
  const houseImg=G.loadImg(G.ASSETS.house_red);
  R(hx+10,hy+hs-8,hs-16,14,'#0004');R(hx+20,hy+hs-4,hs-36,8,'#0003');
  if(houseImg.complete){cx.imageSmoothingEnabled=false;cx.drawImage(houseImg,hx,hy,hs,hs)}
  else R(hx,hy,hs,hs,'#c8462e');
  TS('Nhà Bếp',hx+hs/2,hy-6,'#f2d04a',10);
  HOT(hx,hy,hs,hs,()=>G.goZone('kitchen'),{sx:hx+hs/2,sy:hy+hs-8});

  // Cây cối — chỉ bên phải / xa nhà bếp (nhà chiếm x≈8–152)
  D(G.SP.tree,380,40,2.2);D(G.SP.tree2,450,70,1.9);D(G.SP.tree,480,150,2);
  D(G.SP.tree2,340,160,1.6);D(G.SP.tree,500,50,1.8);
  D(G.SP.bush,360,185,1.4);D(G.SP.bush,420,190,1.5);D(G.SP.bush,500,90,1.3);
  D(G.SP.bush,320,180,1.3);
  for(let i=0;i<10;i++){const fx=280+i*24+(i%3)*4,fy=195+(i%2)*8;D([G.SP.flower,G.SP.flower2,G.SP.flower3][i%3],fx,fy,1.3)}
  D(G.SP.barrel,300,165,1.5);D(G.SP.barrel,320,168,1.5);
  // Đường ra map chung (bên phải)
  for(let i=0;i<8;i++)R(480+i*4,200,6,16,'#c4a06a');
  G.drawPOI(470,200,'Làng','hub',470,200,1);
  G.P.draw(t);
  palm(30,248,t);palm(180,252,t+200);palm(350,250,t+500);palm(480,248,t+700);palm(100,245,t+100);palm(420,255,t+400)}
};
// ===== CHỢ =====
