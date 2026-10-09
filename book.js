// book.js — SỔ SÁCH: sổ thu chi + sổ công thức. File này chỉ giữ dữ liệu; ui.js (modal 'book') dựng bảng.
(()=>{
// ===== Thu chi =====
// Mọi thay đổi tiền trong game đều đi qua G.earn / G.spend (cat = loại khoản, xem G.BOOK_CAT) để sổ ghi lại.
// S.book = {days:{[ngày game]:{inc:{loại:xu}, exp:{…}}}, tot:{inc:{…}, exp:{…}}}; theo ngày chỉ giữ 14 ngày gần nhất.
G.BOOK_CAT={
  inc:{stall:'Bán món ở xe đẩy',shop:'Bán món ở nhà hàng',crop:'Bán nông sản',animal:'Bán sản phẩm vật nuôi',ing:'Bán nguyên liệu',reward:'Thưởng nhiệm vụ'},
  exp:{seed:'Mua hạt giống',ing:'Mua nguyên liệu',plot:'Mở ô đất',animal:'Mua vật nuôi',kit:'Nâng cấp bếp',build:'Sửa xe đẩy'}};
const KEEP=14;
const state=()=>G.S.book||(G.S.book={days:{},tot:{inc:{},exp:{}}});
const note=(kind,cat,n)=>{const B=state(),d=B.days[G.S.day]||(B.days[G.S.day]={inc:{},exp:{}});
  d[kind][cat]=(d[kind][cat]||0)+n;B.tot[kind][cat]=(B.tot[kind][cat]||0)+n;
  Object.keys(B.days).forEach(k=>{if(G.S.day-k>=KEEP)delete B.days[k]})};
G.earn=(n,cat)=>{G.S.money+=n;note('inc',cat,n)};
G.spend=(n,cat)=>{G.S.money-=n;note('exp',cat,n)};
// Loại khoản khi bán một vật phẩm: nông sản / sản phẩm vật nuôi / nguyên liệu
G.sellCat=id=>G.CROPS[id]?'crop':Object.values(G.ANIMALS).some(a=>a.make===id)?'animal':'ing';
const sum=o=>Object.values(o).reduce((a,b)=>a+b,0);
G.bookMoney=()=>{const B=state(),day=G.S.day,t=B.days[day]||{inc:{},exp:{}},chart=[];
  for(let d=Math.max(1,day-6);d<=day;d++){const x=B.days[d]||{inc:{},exp:{}};chart.push({day:d,profit:sum(x.inc)-sum(x.exp)})}
  return{day,today:{inc:t.inc,exp:t.exp,incSum:sum(t.inc),expSum:sum(t.exp)},
    total:{inc:B.tot.inc,exp:B.tot.exp,incSum:sum(B.tot.inc),expSum:sum(B.tot.exp)},chart}};

// ===== Công thức =====
// Nguồn nguyên liệu: trồng ở ruộng / nuôi / mua ở chợ
const srcOf=id=>G.CROPS[id]?'trồng':Object.values(G.ANIMALS).some(a=>a.make===id)?'nuôi':G.ITEMS[id]&&G.ITEMS[id].buy!=null?'chợ':'';
// Vốn ước tính cho 1 đơn vị: đồ mua = giá chợ; cây trồng = giá hạt / 1,3 (mỗi cây thu trung bình 1,3); còn lại = giá bán
const costOf=id=>{const it=G.ITEMS[id]||{};return it.buy!=null?it.buy:G.CROPS[id]?G.CROPS[id].seed/1.3:(it.sell||0)};
G.bookRecipes=()=>{const S=G.S,menu=G.STALL_MENU||[];
  return Object.keys(G.RECIPES).map(k=>{const r=G.RECIPES[k],need=Object.entries(r.need),cost=Math.round(need.reduce((a,[id,n])=>a+costOf(id)*n,0));
    return{id:k,n:r.n,place:menu.includes(k)?'stall':'shop',unlocked:G.unlocked(k),unlock:r.unlock||0,served:S.served,price:r.price,cost,profit:r.price-cost,
      need:need.map(([id,n])=>({id,name:G.ITEMS[id]?G.ITEMS[id].n:id,n,have:S.inv[id]||0,src:srcOf(id)}))}})
    .sort((a,b)=>(a.place===b.place?0:a.place==='stall'?-1:1)||a.unlock-b.unlock)};

// Nút nhỏ mở sổ sách (góc trên bên phải, cạnh nút nhiệm vụ)
G.bookHTML=()=>`<button class="tbtn" data-modal="book" title="Sổ sách">${G.ic('book')}</button>`;
})();
