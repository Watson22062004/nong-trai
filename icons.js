// icons.js — ICON vật phẩm / nguyên liệu / món ăn vẽ pixel-art bằng code, lưới 16×16 (+1px viền đậm mỗi phía = ảnh 18×18).
// Mỗi icon là 1 hàm trong PAINT[id]: vẽ lên lưới bằng ball (khối tròn có sáng/tối), strip (lá, củ, trái dài), rect, line...
// Ánh sáng luôn từ trên-trái. Thêm icon mới: thêm 1 hàm vào PAINT. Icon chưa có trong PAINT rơi về bộ icon cũ ở core.js (balo, sách, sao...).
(()=>{
let N=16,M=16; // kích thước lưới hiện tại (icon 16×16; sprite cây do plants.js đặt qua G.paint.build)
const OL='#2a1a10';
const hex=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16));
const sh=(c,a)=>{const f=a<0?0:255,t=Math.abs(a);return'#'+hex(c).map(n=>Math.round(n*(1-t)+f*t).toString(16).padStart(2,'0')).join('')};
let g;
const px=(x,y,c)=>{x=Math.floor(x);y=Math.floor(y);if(x>=0&&y>=0&&x<N&&y<M)g[y*N+x]=c};
const rect=(x,y,w,h,c)=>{for(let j=0;j<h;j++)for(let i=0;i<w;i++)px(x+i,y+j,c)};
const line=(x0,y0,x1,y1,c)=>{x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;
 for(;;){px(x0,y0,c);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx}if(e2<=dx){e+=dx;y0+=sy}}};
// ellipse phẳng
const ell=(cx,cy,rx,ry,c)=>{for(let y=0;y<M;y++)for(let x=0;x<N;x++){const dx=(x+.5-cx)/rx,dy=(y+.5-cy)/ry;if(dx*dx+dy*dy<=1)px(x,y,c)}};
// khối tròn có sáng/tối (sáng trên-trái, tối dưới-phải, có điểm bóng)
const ball=(cx,cy,rx,ry,c,spec=1)=>{for(let y=0;y<M;y++)for(let x=0;x<N;x++){const dx=(x+.5-cx)/rx,dy=(y+.5-cy)/ry,d=dx*dx+dy*dy;if(d>1)continue;
 const v=dx*.5+dy*.75;let col=c;if(v>.55)col=sh(c,-.3);else if(v>.22)col=sh(c,-.14);else if(v<-.5&&d>.08)col=sh(c,.22);px(x,y,col)}
 if(spec&&rx>2.4)px(cx-rx*.42,cy-ry*.46,sh(c,.6))};
// dải có độ rộng thay đổi dọc theo đoạn thẳng: prof(t)= bán kính tại vị trí t∈[0,1]; tô sáng/tối theo mặt
const strip=(x0,y0,x1,y1,prof,c,flat)=>{const dx=x1-x0,dy=y1-y0,L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L;
 for(let y=0;y<M;y++)for(let x=0;x<N;x++){const ax=x+.5-x0,ay=y+.5-y0,t=(ax*ux+ay*uy)/L;if(t<0||t>1)continue;const s=ax*-uy+ay*ux,r=prof(t);if(Math.abs(s)>r)continue;
  const k=s/Math.max(r,.01);px(x,y,flat?c:k>.45?sh(c,-.22):k<-.45?sh(c,.2):c)}};
const lf=t=>Math.sin(Math.PI*Math.min(1,t*.92+.04));      // dáng lá (nhọn hai đầu)
const tp=t=>1-t*.9;                                           // dáng củ (to rồi nhọn)
const bar=t=>1;                                               // đều
const dots=(a,c)=>a.forEach(([x,y])=>px(x,y,c));
const tri=(x0,y0,x1,y1,x2,y2,c)=>{const A=(x,y)=>(x1-x0)*(y-y0)-(y1-y0)*(x-x0);const s=Math.sign((x1-x0)*(y2-y0)-(y1-y0)*(x2-x0));
 for(let y=0;y<M;y++)for(let x=0;x<N;x++){const px_=x+.5,py=y+.5,a=((x1-x0)*(py-y0)-(y1-y0)*(px_-x0))*s,b=((x2-x1)*(py-y1)-(y2-y1)*(px_-x1))*s,d=((x0-x2)*(py-y2)-(y0-y2)*(px_-x2))*s;if(a>=0&&b>=0&&d>=0)px(x,y,c)}};

// ---------- khung dùng chung ----------
// tô nền ellipse chỉ trong vùng đã vẽ (dùng để đổ thức ăn lên bát/đĩa)
const bowl=(food,o={})=>{const cer=o.cer||'#f4efe2',band=o.band||'#d8402e';
 // thân bát (nửa elip phía dưới): hẹp dần xuống chân
 for(let y=9;y<=14;y++){const w=6.5*Math.sqrt(Math.max(0,1-Math.pow((y-9)/6.6,2)))+.4;for(let x=0;x<N;x++){const dx=(x+.5-8)/w;if(Math.abs(dx)<=1){px(x,y,dx>.55?sh(cer,-.24):dx>.12?sh(cer,-.09):dx<-.6?sh(cer,.12):cer)}}}
 for(let x=0;x<N;x++)if(g[11*N+x])px(x,11,band);
 for(let x=0;x<N;x++)if(g[12*N+x]&&x>7)px(x,12,sh(band,-.1));
 rect(5,14,6,1,sh(cer,-.38));rect(6,15,4,1,sh(cer,-.5));
 ell(8,9,6.6,2.9,sh(cer,-.05));ell(8,9.2,5.7,2.4,food);
 px(3,8,sh(cer,.45));px(4,7,sh(cer,.45))};
const plate=(food,o={})=>{const cer=o.cer||'#f4efe2';ell(8,10.4,7.6,4.4,sh(cer,-.2));ell(8,9.8,7.6,4.4,cer);ell(8,9.9,5.8,3.2,sh(cer,-.07));if(food)ell(8,9.8,o.fr||5,o.fy||2.7,food);rect(2,8,2,1,sh(cer,.4))};
const glass=(liq,o={})=>{const top=o.top||2,bot=14;
 for(let y=top;y<=bot;y++){const t=(y-top)/(bot-top),h=4.4-t*1.1;for(let x=0;x<N;x++){const dx=(x+.5-8)/h;if(Math.abs(dx)<=1)px(x,y,dx<-.7?'#ffffff':dx>.6?'#bfdfe8':'#e4f4f8')}}
 const ly=o.ly||5;for(let y=ly;y<=bot-1;y++){const t=(y-top)/(bot-top),h=3.5-t*1.1;for(let x=0;x<N;x++){const dx=(x+.5-8)/h;if(Math.abs(dx)<=1)px(x,y,dx<-.6?sh(liq,.2):dx>.5?sh(liq,-.18):liq)}}
 rect(5,ly,6,1,sh(liq,.35));rect(5,bot,6,1,'#9fc8d4')};
const ice=(x,y)=>{rect(x,y,3,3,'#d4f0fa');rect(x,y,3,1,'#ffffff');px(x+2,y+2,'#8ec4d8')};
const straw=(x0,y0,x1,y1,c)=>{line(x0,y0,x1,y1,c);line(x0+1,y0,x1+1,y1,sh(c,-.25));px(x0,y0+1,'#ffffff')};
const sack=(c,x=8,top=5)=>{ball(x,10,6.4,5.4,c);rect(x-3,top+1,6,2,sh(c,-.12));rect(x-3,top+2,6,1,sh(c,-.3));px(x-4,top,sh(c,-.1));px(x+3,top,sh(c,-.1));rect(x-2,top,4,1,sh(c,.1))};
const leafy=(x,y,r,c)=>ball(x,y,r,r*.85,c,0);
const sprig=(x0,y0,x1,y1,c)=>line(x0,y0,x1,y1,c);
const seedPacket=(col)=>{rect(3,3,10,12,'#f1e3c0');rect(3,3,1,12,'#fff5dc');rect(12,3,1,12,'#d8c496');rect(3,14,10,1,'#c8b27a');
 for(let i=0;i<5;i++){rect(3+i*2,2,1,1,'#d8c496');rect(4+i*2,3,1,1,'#c8b27a')}
 rect(3,4,10,2,sh(col,-.15));rect(3,4,10,1,col);
 rect(5,7,6,5,'#fffaf0');rect(5,7,6,1,'#fff');rect(5,11,6,1,'#e6d8b6');
 ball(8,9.5,2.2,2.1,col,0);px(7,8,sh(col,.45));line(8,11,8,12,'#3f8a3a');
 dots([[5,13],[8,13],[10,13]],sh(col,-.35))};

const PAINT={
 // ===== cây trồng =====
 ca_chua:()=>{ball(8,9.6,6.2,5.4,'#e2492f');rect(5,5,6,1,'#2f7a2a');rect(6,4,4,1,'#3f9a3a');px(7,3,'#2f7a2a');px(9,3,'#2f7a2a');px(8,3,'#3f9a3a');line(8,2,8,3,'#6a7a2a');px(4,6,'#3f9a3a');px(11,6,'#3f9a3a');px(7,6,'#3f9a3a');px(9,6,'#3f9a3a')},
 chanh:()=>{ball(8,9.4,6,5,'#b8d84a');px(14,9,'#9ab83a');px(1,9,'#a6c63e');rect(13,8,1,2,'#9ab83a');dots([[5,11],[8,12],[11,10],[10,7],[6,8]],'#8ab02e');strip(8,5,13,2,lf,'#4a9a3c');line(8,5,8,3,'#5a7a2a');px(7,3,'#4a9a3c')},
 ca_rot:()=>{strip(11,5,3,13.5,t=>2.7*(1-t*.88),'#ee8a2a');for(const[x,y]of[[9,6],[7,8],[5,10],[8,10],[6,7]])px(x,y,'#c8661c');strip(11,5,9.5,0.5,t=>1.3*lf(t),'#4aa84a');strip(11,5,12.5,0,t=>1.3*lf(t),'#5fb94f');strip(11,5,15,2.5,t=>1.2*lf(t),'#3f9a3a');rect(10,4,3,2,'#c8661c')},
 ot:()=>{strip(11,4.5,10,8,t=>2.1,'#d8301f');strip(10,8,6.5,11.8,t=>2.1-t*.4,'#d8301f');strip(6.5,11.8,2.5,13.5,t=>1.7*(1-t*.8),'#c0241a');px(10,6,'#ff7a5a');px(9,8,'#ff7a5a');px(10,5,'#ff9a7a');rect(10,2,3,2,'#3f9a3a');px(10,1,'#5a7a2a');px(11,1,'#5a7a2a');px(12,0,'#5a7a2a')},
 chuoi:()=>{const b=(dx,dy,c)=>{strip(3+dx,4+dy,4.6+dx,9.4+dy,t=>.9+t*1.3,c);strip(4.6+dx,9.4+dy,9.6+dx,12.6+dy,t=>2.3,c);strip(9.6+dx,12.6+dy,14+dx,8.6+dy,t=>2.3-t*1.3,c)};b(1,-2,'#e8c63a');b(0,0,'#f6dc5a');dots([[5,8],[7,10],[10,11],[12,9]],'#fff3a0');dots([[14,8],[14,9]],'#6a4a1a');rect(2,3,2,2,'#7a8a3a');px(2,2,'#5a6a2a');line(5,8,6,9,'#c8a82a');line(9,12,11,12,'#c8a82a')},
 dau_phong:()=>{ball(6,6.6,3.8,3.4,'#d8ac6c');ball(10,9.8,3.9,3.5,'#d2a464');ball(8,8.2,2.6,2.4,'#d2a464',0);dots([[4,6],[6,5],[5,8],[7,8],[10,9],[11,11],[9,11],[12,9],[8,7]],'#a8803e');dots([[5,5],[10,8]],'#f0d49c');line(12,12,13,13,'#a8803e')},
 rau_muong:()=>{for(const[x1,y1,c]of[[3,3,'#3f8a3a'],[8,1.5,'#4a9a44'],[13,3,'#3f8a3a']]){line(8,15,x1+1,y1+3,'#a8d48a');strip(x1+1,y1+3,x1,y1,t=>2*lf(t)+.3,c)}line(7,15,7,11,'#d4eab8');line(9,15,9,11,'#8ac06a');rect(6,13,4,1,'#e04a3a');px(5,14,'#d8d8c0');px(10,14,'#d8d8c0')},
 rau_thom:()=>{line(8,15,8,9,'#6aa84a');line(8,11,5,8,'#6aa84a');line(8,11,11,8,'#6aa84a');line(5,8,3,10,'#6aa84a');line(11,8,13,10,'#6aa84a');[[8,4],[4.5,6],[11.5,6],[3,11],[13,11]].forEach(([x,y])=>{ball(x-1.5,y+1,1.7,1.5,'#4fa044',0);ball(x+1.5,y+1,1.7,1.5,'#4fa044',0);ball(x,y-1,1.8,1.6,'#68bd56',0);px(x,y,'#2f7a2a');px(x,y-2,'#a6e08a')})},
 hanh:()=>{strip(8,11,4,1,t=>1.1*(1-t*.5),'#3f9a4a');strip(8,11,8,0.5,t=>1.2*(1-t*.4),'#4aa84a');strip(8,11,12,1,t=>1.1*(1-t*.5),'#3f9a4a');strip(8,15,8,9.5,t=>1.9*(1-t*.2),'#f4f0e0');ball(8,13,2.3,2.4,'#f4f0e0',0);line(7,15,6,16,'#d8c8a0');line(9,15,10,16,'#d8c8a0');rect(7,10,3,1,'#bfe0a0');rect(7,15,3,1,'#c8bc98')},
 nep:()=>{line(3,15,3,10,'#7aa83a');const A=[[3,9],[3.6,7],[5,5.2],[7,4],[9.4,3.6],[11.6,4.6],[13,6.6],[13.4,9]];A.forEach(([x,y],i)=>{line(x,y,...(A[i+1]||[x,y]),'#8ab044')});A.forEach(([x,y],i)=>{if(i<1)return;[[-1,0],[1,1]].forEach(([ox,oy])=>{const gx=Math.floor(x+ox),gy=Math.floor(y+oy);rect(gx,gy,2,2,'#e8cf6a');px(gx,gy,'#fff0a8');px(gx+1,gy+1,'#c8a83a')})})},
 gao:()=>{sack('#d8c690');ball(8,5,4.6,2.2,'#fffaf0');dots([[6,4],[8,3],[10,4],[7,5],[9,5],[11,5],[5,5]],'#e6dcc0');dots([[7,3],[10,5]],'#ffffff');rect(7,8,3,3,'#c8462e');px(8,9,'#f2d04a')},
 dau_xanh:()=>{strip(2.5,12.5,13.5,3.5,t=>2.9*lf(t)+.5,'#5f9e44');strip(3.5,11.5,12.5,4.5,t=>1.7*lf(t)+.2,'#9ad870',1);[[5,10],[7.6,7.9],[10.2,5.9]].forEach(([x,y])=>ball(x,y,1.6,1.6,'#6fbe4a'));ball(4,14,1.5,1.4,'#6fbe4a');ball(8,14.3,1.5,1.4,'#7fce56');ball(12,13.6,1.5,1.4,'#6fbe4a')},
 dua:()=>{ball(8,9.6,6.4,5.8,'#8a5a2b');for(let i=0;i<14;i++){const x=2+(i*7)%12,y=7+(i*5)%8;px(x,y,i%2?'#5a3a1a':'#a87a44')}ell(8,5.6,4.6,2.1,'#fffaf0');ell(8,5.9,3.4,1.4,'#d4eef6');px(6,5,'#ffffff');px(7,5,'#ffffff');rect(4,6,8,1,'#e6dcc0');px(3,6,'#5a3a1a');px(12,6,'#5a3a1a')},
 // ===== hạt giống (túi giấy, nhãn theo màu cây) =====
 seed:()=>{ell(8,13,6,2.2,'#6b4a2a');ell(8,12.4,6,2,'#8a6238');line(8,12,8,8,'#6aa84a');strip(8,9,4,6,t=>1.6*lf(t),'#5fb04a');strip(8,8.5,12,5,t=>1.7*lf(t),'#7fc45a');dots([[5,13],[9,14],[11,12]],'#5a3a1a')}
};
Object.keys({nep:1,dau_xanh:1,hanh:1,dua:1,gao:1,ca_chua:1,rau_muong:1,ot:1,ca_rot:1,rau_thom:1,chuoi:1,dau_phong:1,chanh:1}).forEach(k=>{PAINT['hat_'+k]=()=>seedPacket(G.CROPS[k]?G.CROPS[k].color:'#c8a040')});

// ===== sản phẩm vật nuôi + hàng ở chợ =====
Object.assign(PAINT,{
 trung:()=>{ball(6,10,4.1,5,'#fff3d6');ball(11,9.2,3.8,4.6,'#e2b988');dots([[10,7],[12,8],[11,11],[13,10]],'#c8946a');dots([[5,8]],'#ffffff');rect(4,14,10,1,'#c8b890')},
 sua:()=>{for(let y=6;y<=14;y++){rect(4,y,8,1,'#f6f2e6');px(4,y,'#ffffff');px(11,y,'#d0cabc')}rect(5,5,6,1,'#f6f2e6');rect(6,2,4,3,'#f6f2e6');px(6,2,'#ffffff');rect(5,1,6,2,'#4a8ad8');px(5,1,'#8ab8f0');rect(4,9,8,4,'#4a8ad8');px(4,9,'#8ab8f0');ball(7,11,1.6,1.1,'#fffaf0',0);px(9,10,'#fffaf0');px(9,12,'#fffaf0');px(10,11,'#fffaf0')},
 thit_heo:()=>{ball(8,9.6,7.2,5,'#ee8a86');line(3,8,12,7,'#fde4dc');line(2,10,13,9,'#fde4dc');line(3,12,12,12,'#fde4dc');line(3,6,6,5,'#fff6ee');line(7,5,11,5,'#fff6ee');dots([[5,9],[9,11],[11,8]],'#d86a68');px(3,6,'#ffffff')},
 thit_vit:()=>{ball(6.6,6.6,4.8,4.4,'#d89a50');strip(9,9,13,13,t=>1.4,'#fffaf0');ball(13.6,13.6,1.7,1.7,'#fffaf0');ball(14,12,1.2,1.2,'#e8e0d0',0);dots([[4,5],[6,4],[8,6],[5,8]],'#f0c27a');dots([[8,8],[9,7],[3,7]],'#a8682a')},
 ca:()=>{ell(7,8,5.8,3.8,'#7aa8cc');ball(7,7.4,5.6,3.4,'#8ab8d8');ell(7,10.4,4.4,1.3,'#d8ecf6');tri(11,8,15.5,3.5,15.5,12.5,'#6a9cc0');tri(6,4.6,10,4.6,8.4,7,'#6a9cc0');px(3,7,'#ffffff');px(3,8,'#2a1a10');line(5,6,5,10,'#5e8cb0');dots([[7,7],[9,8],[8,9],[10,6],[6,8]],'#b4d4e8')},
 duong:()=>{const cube=(x,y,s)=>{rect(x,y,s,s,'#fffaf0');rect(x,y,s,1,'#ffffff');rect(x,y,1,s,'#ffffff');rect(x+s-1,y,1,s,'#c8d4e0');rect(x,y+s-1,s,1,'#c8d4e0');px(x+2,y+2,'#e8f0f8')};cube(1,8,6);cube(8,9,6);cube(4,3,6);dots([[13,5],[2,5],[12,13]],'#ffffff');px(14,4,'#bfe0f4')},
 muoi:()=>{for(let y=6;y<=14;y++){rect(4,y,8,1,'#f4f4f0');px(4,y,'#ffffff');px(11,y,'#c4c8c4')}rect(5,14,6,1,'#c4c8c4');rect(5,2,6,4,'#b8c0c8');rect(5,2,6,1,'#e8eef2');rect(5,5,6,1,'#8a929a');dots([[7,3],[9,3],[8,4]],'#4a525a');rect(4,9,8,3,'#4a7ac8');px(4,9,'#8ab0f0');dots([[6,10],[8,11],[9,10]],'#ffffff')},
 nuoc_mam:()=>{rect(5,6,6,9,'#a8501e');rect(5,6,1,9,'#d8802e');rect(10,6,1,9,'#7a3410');rect(6,5,4,1,'#a8501e');rect(7,2,2,3,'#8a4018');rect(6,1,4,2,'#c8302a');px(6,1,'#f06a5a');rect(5,9,6,4,'#f4e4b8');rect(5,10,6,1,'#d8402e');px(7,12,'#a8501e');px(8,12,'#a8501e');rect(5,14,6,1,'#5a2a0e')},
 dau_an:()=>{rect(4,5,8,10,'#f0c830');rect(4,5,2,10,'#fff0a0');rect(11,5,1,10,'#c89a10');rect(5,4,6,1,'#f0c830');rect(6,2,4,2,'#e0b020');rect(5,1,6,2,'#d8402e');px(5,1,'#f08070');rect(4,9,8,4,'#fff6d0');ball(8,11,1.5,1.5,'#f0b820',0);px(8,9,'#f0b820');rect(4,14,8,1,'#a87a0a')},
 bun:()=>{[[4.5,-.4],[7,.3],[9.6,.3],[12,-.4]].forEach(([x,o],i)=>{strip(x+o,2,x-o,14,t=>1.35,i%2?'#fbf4e2':'#f2e8d0')});rect(3,7,10,2,'#d8402e');rect(3,7,10,1,'#f06a5a');line(4,13,4,15,'#f2e8d0');line(7,14,7,15,'#f2e8d0');line(10,14,10,15,'#f2e8d0');line(12,13,12,15,'#f2e8d0');line(4,2,3,1,'#f2e8d0');line(11,2,12,1,'#f2e8d0')},
 banh_pho:()=>{const sheet=(y,c)=>{rect(2,y,12,3,c);rect(2,y,12,1,sh(c,.4));rect(2,y+2,12,1,sh(c,-.18));px(1,y+1,c);px(14,y+1,c)};sheet(10,'#f4ead4');sheet(7,'#fff6e4');sheet(4,'#fbf0dc');line(5,5,5,6,'#e0d4b8');line(9,8,9,9,'#e0d4b8');line(11,11,11,12,'#e0d4b8');line(4,12,4,12,'#e0d4b8')},
 mi:()=>{ball(8,9,6.6,5,'#e8c460');for(let i=0;i<4;i++){const y=5+i*2.2;for(let x=2;x<14;x++)px(x,y+Math.sin((x+i)*1.1)*.9,i%2?'#c89a30':'#f6dc88')}dots([[3,10],[12,12],[8,13]],'#c89a30')},
 bot_mi:()=>{rect(3,3,10,12,'#f6f0e0');rect(3,3,2,12,'#ffffff');rect(12,3,1,12,'#cfc7b0');rect(3,14,10,1,'#cfc7b0');rect(3,3,10,2,'#d8d0b8');for(let i=0;i<5;i++)px(3+i*2,2,'#d8d0b8');line(8,13,8,7,'#c8962a');[[7,8],[9,8],[7,10],[9,10],[7,12],[9,12]].forEach(([x,y])=>px(x,y,'#e8b840'));px(8,6,'#e8b840');rect(3,6,10,1,'#d89a3a')},
 banh_trang:()=>{ell(8,11.4,7,3.2,'#d8ccae');ell(8,10.4,7,3.2,'#f2e8cc');ell(8,9,7,3.2,'#fff6e0');for(let x=2;x<14;x+=2)for(let y=7;y<11;y+=2)if(g[y*N+x]&&g[y*N+x]==='#fff6e0')px(x,y,'#e6d8b8');rect(3,8,2,1,'#ffffff')},
 cam:()=>{sack('#a87a44');ball(8,5.6,4.4,2,'#8a5a2a');dots([[6,5],[8,4],[10,5],[7,6],[9,6]],'#c89a5a');dots([[7,5],[10,6]],'#5a3a18');rect(7,9,3,3,'#f2d04a');px(8,10,'#a87a44');dots([[2,14],[14,14],[13,13]],'#8a5a2a')},
 tom:()=>{[[11.5,11],[12.4,8],[10.8,5.2],[8,3.8],[5.4,5],[4,8]].forEach(([x,y],i)=>ball(x,y,2.5-i*.04,2.3,i%2?'#f2905a':'#f08850'));ball(3.8,9.4,2.7,2.6,'#e8703a');tri(11,12,14,15,9.5,15,'#d8602a');tri(12,12,15,12,14,15,'#f08850');px(2,9,'#2a1a10');px(2,8,'#ffffff');line(1,10,0,13,'#d8602a');line(2,11,2,14,'#d8602a');dots([[12,7],[10,4],[7,3],[5,4]],'#d8602a')},
 thit_bo:()=>{ball(8,9.4,7.2,5.2,'#c8403c');line(2,6,7,4,'#fff0e0');line(7,4,13,6,'#fff0e0');dots([[5,8],[6,9],[9,8],[10,10],[7,12],[11,12]],'#f4b8b0');line(4,10,6,11,'#f4b8b0');line(9,7,11,8,'#f4b8b0');dots([[11,9],[4,12]],'#9a2a28')},
 da:()=>{const cube=(x,y,w,h)=>{rect(x,y,w,h,'#bfe8f8');rect(x,y,w,1,'#e8f8ff');rect(x,y,1,h,'#e8f8ff');rect(x+w-1,y+1,1,h-1,'#88c0d8');rect(x+1,y+h-1,w-1,1,'#88c0d8');px(x+2,y+2,'#ffffff');px(x+3,y+2,'#ffffff')};cube(2,7,7,7);cube(8,4,6,6);cube(9,10,5,5)},
 tra:()=>{rect(4,4,8,10,'#2f6a3a');rect(4,4,2,10,'#4a9a58');rect(11,4,1,10,'#1f4a28');ell(8,4,4.2,1.5,'#c8c8c0');ell(8,3.6,3.2,1,'#e8e8e0');rect(4,13,8,1,'#1f4a28');strip(6,12,10,6,t=>1.7*lf(t),'#bfe8a0');line(8,10,8,8,'#4a9a58');rect(4,8,8,1,'#d8b84a')},
 ca_phe:()=>{[[4.4,4.6],[11.2,4.4],[7.8,8.6],[4.2,12],[11.8,12]].forEach(([x,y])=>{ball(x,y,2.5,2,'#6a3a1e');line(x-1,y+.5,x+1,y-.5,'#2a1208');px(x-1,y-1,'#a8683a')})},
 sua_dac:()=>{rect(4,3,8,12,'#f4ecd8');rect(4,3,2,12,'#ffffff');rect(11,3,1,12,'#bfb598');ell(8,3.4,4.1,1.3,'#d0d0c8');ell(8,3.1,3,.8,'#ecece4');rect(4,6,8,6,'#3a78c8');rect(4,6,2,6,'#6aa0e8');rect(11,6,1,6,'#2a58a0');rect(4,6,8,1,'#f2d04a');rect(4,11,8,1,'#f2d04a');ball(8,9,1.8,1.5,'#fffaf0',0);px(8,7,'#fffaf0');rect(4,14,8,1,'#bfb598')}
});

// ===== món ăn (góc nhìn 3/4: bát, đĩa, ly) =====
Object.assign(PAINT,{
 xoi_dau:()=>{bowl('#f4f0d8',{band:'#4a9a58'});ball(8,7.4,5.2,3.2,'#f2eecf');ball(8,5.6,3.4,1.9,'#f2d04a');dots([[7,5],[9,5],[8,6],[10,6]],'#e8b820');dots([[6,7],[10,8],[8,8],[12,7]],'#a8682a');px(8,4,'#5fb04a');px(9,4,'#5fb04a')},
 xoi_man:()=>{bowl('#fffaf0',{band:'#4a8ad8'});ball(8,7.4,5.2,3.2,'#fffaf0');ball(6,5.8,2.8,1.7,'#d89a4a');dots([[5,5],[7,6],[6,6]],'#f0c27a');ball(10.6,6.2,1.5,1.2,'#a8382e');ball(12.2,7.6,1.3,1.1,'#a8382e');dots([[10,6],[12,7]],'#e07060');dots([[8,8],[4,8],[9,4]],'#a8682a');dots([[7,4],[11,8]],'#5fb04a')},
 xoi_dua:()=>{bowl('#fffaf0',{band:'#5fb04a'});ball(8,7.2,5.3,3.3,'#fffaf0');dots([[5,5],[7,4],[9,5],[11,6],[6,7],[10,8],[8,6],[4,7],[12,8],[7,8]],'#ffffff');dots([[6,5],[9,4],[8,7],[11,7],[5,8]],'#efe2b8');dots([[7,5],[10,6],[6,8]],'#8a6a3a');px(8,3,'#fff6dc')},
 xoi_lac:()=>{bowl('#f4e8c8',{band:'#c8860a'});ball(8,7.4,5.2,3.2,'#f4e8c8');[[5,6],[7,5],[9,5.4],[11,6.6],[6.4,8],[9.6,8.2],[8,7]].forEach(([x,y])=>ball(x,y,1.2,1.1,'#d8a860',0));dots([[5,6],[9,5]],'#f0d49c');dots([[8,4],[4,7],[12,8],[7,9]],'#3a2a1a')},
 com_chien:()=>{bowl('#f0d890',{band:'#d8402e'});ball(8,7.4,5.3,3.3,'#f0d890');dots([[5,6],[8,5],[11,7],[7,8],[10,5]],'#5fb04a');dots([[6,5],[9,7],[11,5],[5,8]],'#ee8a2a');dots([[7,6],[9,4],[4,7],[12,8]],'#f6e060');dots([[6,7],[10,8]],'#fffaf0');px(8,3,'#fff0b0')},
 com_kho:()=>{bowl('#7a4a22',{band:'#8a4a22'});ball(5.4,7.6,3.8,2.7,'#fffaf0');dots([[4,6],[6,6],[5,8]],'#ffffff');ball(10.4,7.2,1.7,1.4,'#8a4a22');ball(12.2,8.4,1.4,1.2,'#8a4a22');px(10,6,'#c8803a');px(12,8,'#c8803a');ell(9,9.4,1.8,1.1,'#fffaf0');px(9,9,'#f2b62a')},
 chao_vit:()=>{bowl('#f4ecd0',{band:'#d8a060'});ball(8,8.4,5.2,2.3,'#f8f2dc');ball(6,7.6,2.2,1.3,'#c8803a');ball(10,7.8,2,1.2,'#c8803a');px(5,7,'#a85a1e');px(9,7,'#a85a1e');px(7,8,'#f0c27a');dots([[8,6],[11,6],[5,9],[10,9]],'#5fb04a');dots([[8,9],[12,8]],'#a8682a')},
 pho_bo:()=>{bowl('#d9a066',{band:'#4a8ad8'});ball(8,7.6,5.2,2.9,'#f6f0e0');for(const y of[5,6,7,8])line(4,y,12,y+(y%2?-.6:.6),'#e0d6bc');ball(6,6.6,2.2,1.2,'#c8403c');ball(10,6.8,2.2,1.2,'#b8302c');px(5,6,'#e87870');px(9,6,'#e87870');dots([[8,5],[11,5],[4,8],[12,8],[7,9]],'#5fb04a');dots([[9,9],[5,9]],'#2f7a2a');px(13,5,'#b8d84a')},
 bun_cha:()=>{bowl('#d8883a',{band:'#c8603a'});ball(5,7.2,3.4,2.2,'#fbf4e2');for(const y of[6,7,8])line(3,y,7,y,'#e6dcc0');[[9,7.4],[11.6,8],[10.4,9.4]].forEach(([x,y])=>{ball(x,y,1.9,1.4,'#8a4a22');px(x-1,y-1,'#c8803a')});dots([[8,5],[11,5],[12,6],[7,9]],'#5fb04a');dots([[10,6],[6,9]],'#2f7a2a')},
 mi_xao:()=>{plate('#e8c460',{fr:5.4,fy:2.9});for(const y of[7,8,9,10,11])line(3,y,12,y+(y%2?-.5:.5),y%2?'#c89a30':'#f6dc88');ball(5.6,8,2.1,1.2,'#c8403c');ball(10.4,10,2.1,1.2,'#b8302c');dots([[7,9],[8,7],[9,11]],'#ee8a2a');dots([[10,7],[5,11],[7,10]],'#5fb04a');px(5,7,'#e87870')},
 rau_muong_xao:()=>{plate('#2f7a2a',{fr:5.2,fy:2.8});for(const[x0,y0,x1,y1]of[[3,9,12,8],[4,11,13,10],[4,8,10,11],[5,10,12,8]])line(x0,y0,x1,y1,'#6fbe4a');for(const[x,y]of[[5,8],[8,9],[11,9],[7,11],[10,8]])px(x,y,'#4aa83a');dots([[6,10],[9,10],[12,10]],'#d8301f');dots([[4,9],[8,8],[10,11]],'#d8301f');dots([[7,9],[11,10],[5,11]],'#f6f0c0')},
 goi_cuon:()=>{const roll=(x0,y0,x1,y1)=>{strip(x0,y0,x1,y1,t=>2.2,'#f6eed8');ball(x0,y0,1.2,2.2,'#e8dcc0',0);ball(x1,y1,1.1,2.1,'#fbf4e2',0);const dx=x1-x0,dy=y1-y0;for(let k=1;k<5;k++){const t=k/5,x=x0+dx*t,y=y0+dy*t;px(x,y-.4,k%2?'#f08850':'#7fc45a');px(x+1,y+.6,k%2?'#7fc45a':'#f08850')}px(x0+dx*.5,y0+dy*.5-1.6,'#fffaf0')};roll(2.5,4.5,12.5,3.2);roll(2.5,9.5,12.5,8.2);ell(12,13.4,3.4,1.7,'#f4efe2');ell(12,13.5,2.6,1.1,'#8a3a1e');px(11,13,'#c8602a')},
 banh_mi:()=>{strip(1.5,12.5,14.5,5.5,t=>3.1*lf(t)+.6,'#e8b060');strip(2.5,10,13,4.8,t=>1.9*lf(t)+.2,'#fffaf0',1);strip(3,10.3,12.5,5.6,t=>1.1*lf(t)+.1,'#5fb04a',1);dots([[5,9],[8,7],[11,6]],'#e89a90');dots([[6,8],[9,7],[10,6],[4,10]],'#ee8a2a');dots([[7,9],[12,5]],'#c8403c');dots([[4,13],[7,12],[10,10],[12,8]],'#c8883a');dots([[4,11],[7,10],[10,8],[13,6]],'#f6d088')},
 banh_xeo:()=>{ball(8,9.6,7.2,5.2,'#f2c84a');ell(8,7,6,2.5,'#fff2c0');ell(8,7.2,5.2,1.8,'#fffaf0');ball(5.4,6.4,1.4,1.1,'#f08a80');ball(8.4,7.2,1.4,1.1,'#f08a80');ball(11,6.4,1.3,1,'#f08a80');dots([[6,8],[7,6],[10,8],[9,6],[4,7]],'#ffffff');dots([[5,5],[10,5],[12,7],[8,5]],'#5fb04a');dots([[2,10],[5,13],[10,13],[13,11],[14,9]],'#c8902a');dots([[4,11],[8,12],[12,12]],'#e0aa30')},
 canh_chua:()=>{bowl('#e8883a',{band:'#5fb04a'});ell(8,9.1,5.6,2.1,'#f0a050');ball(6,8.4,2.3,1.3,'#fff6ec');px(5,8,'#e8d8c0');ball(10,8.2,1.9,1.2,'#e2492f');px(9,8,'#ff8a70');ball(12,9.4,1,.8,'#f2d04a');ball(4.2,9.8,1,.8,'#f2d04a');dots([[8,7],[11,7],[7,10],[9,10]],'#5fb04a');dots([[3,8],[12,8]],'#2f7a2a')},
 tra_chanh:()=>{glass('#d9a52e',{ly:5});ice(6,7);ice(9,9);px(6,6,'#f0c85a');line(10,0,8,9,'#e2492f');line(11,0,9,9,'#c0301f');px(10,0,'#ff8a70');ball(12,4,2.4,2.4,'#b8d84a');ball(12,4,1.5,1.5,'#f0f8c0',0);line(12,3,12,5,'#b8d84a');line(11,4,13,4,'#b8d84a')},
 ca_phe_sua:()=>{glass('#f4e6c4',{ly:9});rect(5,5,6,4,'#4a2c1a');rect(5,5,6,1,'#6e4428');rect(5,8,6,1,'#8a5a34');ice(6,6);ice(9,7);line(10,0,8,10,'#3a2a20');line(11,0,9,10,'#1a1210');px(10,0,'#8a7a70')},
 flan:()=>{ell(8,12.4,7.4,2.8,'#d8d0c0');ell(8,11.8,7.4,2.8,'#f4efe2');ball(8,8.2,5.6,4.2,'#f2c24a');ell(8,5.2,4,1.5,'#a85a1a');ell(8,5,3,1,'#c8742a');line(4,6,4,9,'#a85a1a');line(12,6,12,10,'#a85a1a');line(6,6,6,8,'#a85a1a');line(10,6,10,9,'#a85a1a');px(5,8,'#fff0a8');px(6,9,'#fff0a8')},
 che_chuoi:()=>{bowl('#fff3d4',{band:'#e8a030'});ell(8,9.1,5.6,2.1,'#fff9e8');[[5.4,8.4],[8,9.4],[10.6,8.2],[7,7.6]].forEach(([x,y])=>{ell(x,y,1.5,1,'#f6dc5a');px(x,y-.4,'#fff3a0')});dots([[4,9],[11,10],[9,7],[6,10]],'#d8a860');dots([[7,9],[10,7],[5,7]],'#3a2a1a')},
 sinh_to:()=>{glass('#f2e6b0',{ly:4});rect(5,4,6,1,'#fffaf0');rect(5,5,2,6,'#fff6d0');ball(12,3,2.5,2.5,'#f6dc5a');ball(12,3,1.4,1.4,'#fff3a0',0);line(10,0,8,9,'#4a9a58');line(11,0,9,9,'#2f7a3a');px(10,0,'#8ad88a')},
 // ===== vật nuôi =====
 ga:()=>{strip(1.5,5,3.5,10,t=>1.7,'#e8dfc8');ball(7,9.6,5,4.4,'#fffaf0');ell(6.4,10,2.6,1.8,'#e6dcc4');ball(11.4,5.6,2.9,2.7,'#fffaf0');rect(10,2,1,1,'#d8302a');rect(11,1,2,2,'#d8302a');px(13,2,'#d8302a');tri(13.6,5,15.9,6.1,13.6,7.2,'#f2a02a');px(12,5,'#2a1a10');px(13,8,'#d8302a');line(6,14,6,15,'#e8892a');line(9,14,9,15,'#e8892a');px(5,15,'#e8892a');px(10,15,'#e8892a')},
 bo:()=>{ball(2.4,5.2,2.2,1.5,'#d9a066');ball(13.6,5.2,2.2,1.5,'#d9a066');tri(3.5,4,5,1,6,4,'#fff6e4');tri(12.5,4,11,1,10,4,'#fff6e4');ball(8,9,5.8,5.2,'#fffaf0');ball(5.2,6.4,2.6,1.9,'#8a5a2b',0);ball(8,12.2,3.7,2.5,'#f1a8b8');px(7,12,'#c8707e');px(9,12,'#c8707e');px(5,8,'#2a1a10');px(11,8,'#2a1a10')},
 heo:()=>{tri(1.5,2.5,6.4,3.8,2.6,7.4,'#e48aa0');tri(14.5,2.5,9.6,3.8,13.4,7.4,'#e48aa0');ball(8,9,6.2,5.3,'#f5a8b8');ball(8,10.6,3.4,2.4,'#e48aa0');px(7,10,'#a8506a');px(9,10,'#a8506a');px(4,7,'#2a1a10');px(11,7,'#2a1a10');px(4,6,'#ffffff')},
 vit:()=>{tri(0.5,7,3,8.6,2.6,11,'#e8d890');ball(7.2,10,5.8,4,'#fff4c0');ell(6.4,10.4,3,2,'#e8d890');ball(11,5.4,3,2.9,'#f2d04a');ell(14,6.6,1.9,1,'#e8892a');px(11,4,'#2a1a10');px(10,4,'#ffffff');line(6,14,6,15,'#e8892a');line(9,14,9,15,'#e8892a')},
 caao:()=>{ell(8,11,7.6,4,'#3a80b8');ell(8,10.4,7.6,4,'#4a98d0');ell(8,10.4,5.4,2.6,'#5aaae0');line(2,9,5,8,'#8ac8e8');line(10,12,13,11,'#8ac8e8');ball(6.6,9.6,2.8,1.6,'#f08850');tri(8.6,9.6,11.2,7.8,11.2,11.4,'#e8703a');px(5,9,'#2a1a10');ell(12.2,8.4,1.8,1,'#4a9a3c');px(12,7,'#f6b0c0');px(13,7,'#f6b0c0')},
 coin:()=>{ell(8,8,6.6,6.6,'#c8860a');ell(8,7.7,6.4,6.3,'#f2c42a');ell(8,8,5,5,'#d8a014');ell(8,8,4.4,4.4,'#f8d84a');rect(7,5,2,6,'#d8a014');rect(6,6,4,1,'#d8a014');rect(6,9,4,1,'#d8a014');px(4,4,'#fff6b0');px(5,3,'#fff6b0');px(3,5,'#fff6b0')}
});


// ---------- xuất ảnh ----------
// build(w,h,fn): chạy fn vẽ lên lưới w×h rồi thêm viền đậm 1px → {w,h,o} (o = mảng màu (w+2)×(h+2)); xong trả lưới về 16×16
const build=(w,h,fn)=>{const oN=N,oM=M;N=w;M=h;g=Array(N*M).fill(null);fn();
 const W=N+2,H=M+2,o=Array(W*H).fill(null),at=(x,y)=>x>=0&&y>=0&&x<N&&y<M?g[y*N+x]:null;
 for(let y=-1;y<=M;y++)for(let x=-1;x<=N;x++){const v=at(x,y);o[(y+1)*W+x+1]=v||(at(x+1,y)||at(x-1,y)||at(x,y+1)||at(x,y-1)?OL:null)}
 N=oN;M=oM;return{w:W,h:H,o}};
const toCanvas=b=>{const c=document.createElement('canvas');c.width=b.w;c.height=b.h;const x=c.getContext('2d');
 b.o.forEach((v,i)=>{if(v){x.fillStyle=v;x.fillRect(i%b.w,(i/b.w)|0,1,1)}});return c};
const cacheP={},cacheU={};
G.iconPixels=id=>{if(!PAINT[id])return null;return cacheP[id]||(cacheP[id]=build(16,16,PAINT[id]).o)};
const _iu=G.iconUrl;
G.iconUrl=id=>{if(!PAINT[id])return _iu(id);return cacheU[id]||(cacheU[id]=toCanvas({w:N+2,h:M+2,o:G.iconPixels(id)}).toDataURL())};
G.iconIds=()=>Object.keys(PAINT);
// bộ công cụ vẽ cho file khác (plants.js vẽ sprite cây lớn hơn icon)
G.paint={px,rect,line,ell,ball,strip,tri,dots,sh,lf,tp,bar,build,toCanvas};
})();
