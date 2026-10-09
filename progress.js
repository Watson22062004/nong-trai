// progress.js — TIẾN TRÌNH: cấp quán (G.S.tier) + chuỗi nhiệm vụ dẫn dắt người chơi.
// Cấp 0: chỉ làm nông, xe đẩy cũ của bà còn phủ bạt ở làng · Cấp 1: đã sửa xe đẩy (mở màn bán ở zones/stall.js).
// Cấp 2, 3 (quán bình dân, nhà hàng) sẽ nối tiếp ở đây + POI_TIER trong core.js.
G.PROG={
  // Xu cần để sửa xe đẩy. Cân theo mô phỏng nông trại (giá hạt, thời gian lớn, giá bán, 10 ô đầu game rồi mở thêm từng ô):
  // người chơi cẩn thận đủ 1000 xu sau khoảng 3 phút, người chơi chậm khoảng 4–5 phút (ước lượng, chưa chơi thử). Muốn pha làm nông dài/ngắn hơn thì chỉnh số này.
  stallCost:1000
};

// ===== Sửa xe đẩy + khoá cổng =====
G.buildStall=()=>{const S=G.S,c=G.PROG.stallCost;
  if(S.tier>0)return;
  if(S.money<c)return G.msg('Cần '+c+' xu để sửa xe — còn thiếu '+(c-S.money));
  G.spend(c,'build');S.tier=1;G.ui.modal=null;G.msg('Xe đẩy của bà đã sửa xong! Vào mở bán nhé');
  G.snd&&G.snd.unlockChime&&G.snd.unlockChime();G.save&&G.save();G.refreshUI&&G.refreshUI()};
// Chạm vào cổng một khu: xe đẩy chưa sửa thì hiện bảng sửa xe thay vì vào khu
G.enterZone=zone=>{
  if(zone==='stall'&&!(G.S.tier>0)){G.ui.modal='build';G.refreshUI&&G.refreshUI();return}
  G.goZone(zone)};

// ===== Nhiệm vụ: chính (hướng dẫn G.QUESTS + cốt truyện G.STORY) và hàng ngày =====
// Hướng dẫn: p(S) → [đã có, cần]. d: mô tả (chuỗi hoặc hàm). r: thưởng {money, inv:{id:n}}. note: lời thoại ngắn khi nhận thưởng.
const harvested=S=>Object.values(S.stat.h).reduce((a,b)=>a+b,0);
G.QUESTS=[
  {t:'Gieo hạt đầu tiên',d:'Ruộng nhà bỏ hoang lâu rồi. Chạm vào ô đất để gieo hạt.',p:S=>[S.stat.plant,1],r:{money:10}},
  {t:'Thu hoạch 10 cây',d:'Đợi cây chín rồi bấm "Thu hoạch hết".',p:S=>[harvested(S),10],r:{money:30}},
  {t:'Trồng chanh',d:'Chanh là nguyên liệu của ly trà đầu tiên, chỉ trồng được chứ không mua. Thu hoạch 3 quả.',p:S=>[S.stat.h.chanh||0,3],r:{inv:{hat_rau_thom:3,hat_ca_rot:3}},note:'Tặng ít hạt rau thơm, cà rốt'},
  {t:'Dành dụm sửa xe của bà',d:()=>'Bán nông sản ở Chợ đầu mối. Cần '+G.PROG.stallCost+' xu để sửa chiếc xe đẩy cũ ở '+G.VILLAGE+'.',
    p:S=>S.tier>0?[1,1]:[Math.min(S.money,G.PROG.stallCost),G.PROG.stallCost],r:{}},
  {t:'Sửa xe đẩy',d:()=>'Ra '+G.VILLAGE+', chạm vào chiếc xe phủ bạt rồi bấm Sửa xe.',p:S=>[S.tier>0?1:0,1],r:{inv:{tra:3,duong:3,da:3}},note:'Bà để lại ít trà, đường và đá!'},
  {t:'Bán 5 khách đầu tiên',d:'Bấm bảng ĐÓNG CỬA để mở bán, ghép đúng món theo phiếu. Nhớ mang chanh!',p:S=>[S.served,5],r:{money:60}},
  {t:'Phục vụ 12 khách',d:'Đủ 12 khách sẽ mở khoá gỏi cuốn.',p:S=>[S.served,12],r:{money:120}}
];
// Cốt truyện: chuỗi chương nối tiếp, cùng cơ chế với hướng dẫn. Nội dung điền vào G.STORY, mỗi chương:
// {t:'Chương 1: …', txt:'lời kể hiện trong bảng nhiệm vụ', p:S=>[đã có, cần], r:{…}, note:'…'}
G.STORY=[];
// Đẩy một chuỗi nhiệm vụ tuần tự: bước list[S[key]] đạt thì phát thưởng rồi sang bước kế.
// silent=true: chỉ bỏ qua các bước đã đạt (dùng khi tải save), không phát thưởng
const stepQuests=(list,key,silent)=>{const S=G.S;let q;
  while((q=list[S[key]])){const[a,b]=q.p(S);if(a<b)break;
    if(!silent){const r=q.r||{};if(r.money)G.earn(r.money,'reward');if(r.inv)for(const k in r.inv)G.add(k,r.inv[k]);
      G.msg('Xong: '+q.t+(r.money?' · +'+r.money+' xu':'')+(q.note?' · '+q.note:''));G.snd&&G.snd.unlockChime&&G.snd.unlockChime()}
    S[key]++}};
G.checkQuest=silent=>{stepQuests(G.QUESTS,'quest',silent);stepQuests(G.STORY,'story',silent)};
G.updateProgress=(()=>{let acc=0;return dt=>{acc+=dt;if(acc<.5)return;acc=0;G.checkQuest()}})(); // kiểm tra nhiệm vụ 2 lần/giây

// Nhiệm vụ hàng ngày: 3 việc mỗi ngày thật (đổi lúc 0h), tiến độ = số hiện tại − mốc đầu ngày, bấm Nhận để lấy thưởng
const DAILY_POOL=[
  {id:'plant',t:'Gieo 10 hạt giống',n:10,v:S=>S.stat.plant,r:{money:25}},
  {id:'harvest',t:'Thu hoạch 12 nông sản',n:12,v:harvested,r:{money:35}},
  {id:'chanh',t:'Thu hoạch 5 quả chanh',n:5,v:S=>S.stat.h.chanh||0,r:{money:30}},
  {id:'rau_thom',t:'Thu hoạch 5 rau thơm',n:5,v:S=>S.stat.h.rau_thom||0,r:{money:30}},
  {id:'serve',t:'Phục vụ 6 khách ở xe đẩy',n:6,v:S=>S.served,r:{money:60},tier:1}
];
G.today=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
G.msToNextDay=()=>{const d=new Date();return new Date(d.getFullYear(),d.getMonth(),d.getDate()+1)-d};
// Danh sách của hôm nay: chưa có thì tạo (chọn 3 việc cố định theo ngày, lưu mốc đầu ngày) rồi lưu vào save
const todayDaily=()=>{const S=G.S,key=G.today();
  if(S.daily&&S.daily.date===key)return S.daily;
  const pool=DAILY_POOL.filter(x=>(x.tier||0)<=S.tier),pick=[],base={};let h=0;
  for(const ch of key)h=(h*31+ch.charCodeAt(0))>>>0;
  while(pick.length<3&&pool.length){h=(h*1103515245+12345)>>>0;pick.push(pool.splice((h>>>8)%pool.length,1)[0].id)}
  DAILY_POOL.forEach(x=>base[x.id]=x.v(S));
  return S.daily={date:key,pick,base,claimed:{}}};
G.dailyList=()=>{const S=G.S,D=todayDaily();
  return D.pick.map(id=>{const x=DAILY_POOL.find(y=>y.id===id),a=Math.min(x.n,Math.max(0,x.v(S)-D.base[id])),done=!!D.claimed[id];
    return{id,t:x.t,a,b:x.n,r:x.r,claimed:done,can:a>=x.n&&!done}})};
G.claimDaily=id=>{const it=G.dailyList().find(x=>x.id===id);if(!it||!it.can)return;
  todayDaily().claimed[id]=true;G.earn(it.r.money,'reward');
  G.msg('Nhận thưởng: '+it.t+' · +'+it.r.money+' xu');G.snd&&G.snd.unlockChime&&G.snd.unlockChime()};

// Dữ liệu cho bảng nhiệm vụ (ui.js dựng HTML) + nút nhỏ ở góc màn hình
G.rewardText=r=>[r.money?r.money+' xu':'',...Object.entries(r.inv||{}).map(([k,n])=>n+' '+(G.ITEMS[k]?G.ITEMS[k].n:k))].filter(Boolean).join(', ');
const questList=(list,idx,S)=>list.map((q,i)=>{const cur=i===idx,[a,b]=i<idx?[1,1]:cur?q.p(S):[0,1];
  return{t:q.t,d:typeof q.d==='function'?q.d():q.d,txt:q.txt,state:i<idx?'done':cur?'cur':'lock',a:Math.min(a,b),b,r:G.rewardText(q.r||{})}});
G.questView=()=>({story:questList(G.STORY,G.S.story,G.S),guide:questList(G.QUESTS,G.S.quest,G.S),daily:G.dailyList(),left:G.msToNextDay()});
G.questHTML=()=>{const n=G.dailyList().filter(x=>x.can).length;
  return `<button class="tbtn" data-modal="quest" title="Nhiệm vụ">${G.ic('quest')}${n?`<span class="qdot">${n}</span>`:''}</button>`};
G.checkQuest(true);
