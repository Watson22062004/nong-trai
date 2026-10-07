// progress.js — TIẾN TRÌNH: cấp quán (G.S.tier) + chuỗi nhiệm vụ dẫn dắt người chơi.
// Cấp 0: chỉ làm nông, xe đẩy cũ của bà còn phủ bạt ở Bến Dừa · Cấp 1: đã sửa xe đẩy (mở màn bán ở zones/stall.js).
// Cấp 2, 3 (quán bình dân, nhà hàng) sẽ nối tiếp ở đây + POI_TIER trong core.js.
G.PROG={
  // Xu cần để sửa xe đẩy. Cân theo mô phỏng nông trại (giá hạt, thời gian lớn, giá bán, 20 ô đất đầu game):
  // người chơi cẩn thận đủ 1000 xu sau khoảng 2,5–4 phút, người chơi chậm khoảng 4–6 phút. Muốn pha làm nông dài/ngắn hơn thì chỉnh số này.
  stallCost:1000
};

// ===== Sửa xe đẩy + khoá cổng =====
G.buildStall=()=>{const S=G.S,c=G.PROG.stallCost;
  if(S.tier>0)return;
  if(S.money<c)return G.msg('Cần '+c+' xu để sửa xe — còn thiếu '+(c-S.money));
  S.money-=c;S.tier=1;G.ui.modal=null;G.msg('Xe đẩy của bà đã sửa xong! Vào mở bán nhé');
  G.snd&&G.snd.unlockChime&&G.snd.unlockChime();G.save&&G.save();G.refreshUI&&G.refreshUI()};
// Chạm vào cổng một khu: xe đẩy chưa sửa thì hiện bảng sửa xe thay vì vào khu
G.enterZone=zone=>{
  if(zone==='stall'&&!(G.S.tier>0)){G.ui.modal='build';G.refreshUI&&G.refreshUI();return}
  G.goZone(zone)};

// ===== Nhiệm vụ =====
// p(S) → [đã có, cần]. d: mô tả (chuỗi hoặc hàm). r: thưởng {money, inv:{id:n}}. note: lời thoại ngắn khi nhận thưởng.
const harvested=S=>Object.values(S.stat.h).reduce((a,b)=>a+b,0);
G.QUESTS=[
  {t:'Gieo hạt đầu tiên',d:'Ruộng nhà bỏ hoang lâu rồi. Chạm vào ô đất để gieo hạt.',p:S=>[S.stat.plant,1],r:{money:10}},
  {t:'Thu hoạch 10 cây',d:'Đợi cây chín rồi bấm "Thu hoạch hết".',p:S=>[harvested(S),10],r:{money:30}},
  {t:'Trồng chanh',d:'Chanh là nguyên liệu của ly trà đầu tiên, chỉ trồng được chứ không mua. Thu hoạch 3 quả.',p:S=>[S.stat.h.chanh||0,3],r:{inv:{hat_rau_thom:3,hat_ca_rot:3}},note:'Tặng ít hạt rau thơm, cà rốt'},
  {t:'Dành dụm sửa xe của bà',d:()=>'Bán nông sản ở Chợ đầu mối. Cần '+G.PROG.stallCost+' xu để sửa chiếc xe đẩy cũ ở Bến Dừa.',
    p:S=>S.tier>0?[1,1]:[Math.min(S.money,G.PROG.stallCost),G.PROG.stallCost],r:{}},
  {t:'Sửa xe đẩy',d:'Ra Bến Dừa, chạm vào chiếc xe phủ bạt rồi bấm Sửa xe.',p:S=>[S.tier>0?1:0,1],r:{inv:{tra:3,duong:3,da:3}},note:'Bà để lại ít trà, đường và đá!'},
  {t:'Bán 5 khách đầu tiên',d:'Bấm bảng ĐÓNG CỬA để mở bán, ghép đúng món theo phiếu. Nhớ mang chanh!',p:S=>[S.served,5],r:{money:60}},
  {t:'Phục vụ 12 khách',d:'Đủ 12 khách sẽ mở khoá gỏi cuốn.',p:S=>[S.served,12],r:{money:120}}
];
// silent=true: chỉ bỏ qua các nhiệm vụ đã đạt (dùng khi tải save), không phát thưởng
G.checkQuest=silent=>{const S=G.S;let q;
  while((q=G.QUESTS[S.quest])){const[a,b]=q.p(S);if(a<b)break;
    if(!silent){const r=q.r||{};if(r.money)S.money+=r.money;if(r.inv)for(const k in r.inv)G.add(k,r.inv[k]);
      G.msg('Xong: '+q.t+(r.money?' · +'+r.money+' xu':'')+(q.note?' · '+q.note:''));G.snd&&G.snd.unlockChime&&G.snd.unlockChime()}
    S.quest++}};
G.updateProgress=(()=>{let acc=0;return dt=>{acc+=dt;if(acc<.5)return;acc=0;G.checkQuest()}})(); // kiểm tra nhiệm vụ 2 lần/giây
G.questHTML=()=>{const S=G.S,q=G.QUESTS[S.quest];if(!q)return'';
  const[a,b]=q.p(S),pc=Math.max(0,Math.min(100,Math.round(a/b*100))),d=typeof q.d==='function'?q.d():q.d;
  return `<div class="qcard"><small>Nhiệm vụ ${S.quest+1}/${G.QUESTS.length}</small><b>${q.t}</b><span>${d}</span><div class="qbar"><i style="width:${pc}%"></i></div><em>${Math.min(a,b)}/${b}</em></div>`};
G.checkQuest(true);
