// orders.js — BẢNG ĐƠN ĐẶT HÀNG: dân làng đặt món (nấu ở Bếp); giao đủ món (đúng sao) thì nhận tiền cao hơn bán lẻ, có khi kèm quà.
// Là chỗ dùng cho các món nhà hàng (xôi, cơm, phở…) mà xe đẩy không bán. Bảng mở sau khi thu hoạch những cây đầu tiên.
// State: S.orders = [{id, who, dish, qty, star, reward, bonus, t}] (t = giây còn lại) · S.ord = {next: giây tới đơn kế, seq: mã đơn, done: số đơn đã giao}
// Chỉnh độ khó / nhịp đơn: G.ORD (tối đa mấy đơn cùng lúc, thời hạn, nhịp ra đơn) và hàm make() bên dưới.
(()=>{
const WHO=['Bà Tư','Cô Lan','Chú Sáu','Anh Hai','Cô giáo Mai','Bác Ba','Chị Hạnh','Ông Năm','Bé Na','Dì Bảy'];
G.ORD={max:3,perDay:3,life:900,first:60,gap:[120,200],mult:1.6,starMult:.3}; // perDay = số đơn tối đa được ĐẶT và được GIAO trong 1 ngày game (1 ngày = 120 giây chơi) · thưởng = giá món × số lượng × (mult + starMult × (sao yêu cầu − 1))
const rnd=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.random()*a.length|0];
const ensure=()=>{const S=G.S;if(!Array.isArray(S.orders))S.orders=[];if(!S.ord)S.ord={next:G.ORD.first,seq:0,done:0}};
ensure();
// Bộ đếm theo ngày game: n = đã giao hôm nay, sp = đã đặt hôm nay; sang ngày mới thì về 0
const today=()=>{ensure();const o=G.S.ord;if(!o.dd||o.dd.day!==G.S.day)o.dd={day:G.S.day,n:0,sp:0};return o.dd};
G.ordToday=()=>today();
G.ordFull=()=>today().n>=G.ORD.perDay;
G.ordOpen=()=>G.S.quest>=2;
// Sinh một đơn: món đã mở khoá và chưa có đơn; số lượng và yêu cầu sao tăng dần theo số khách đã phục vụ / số đơn đã giao
const make=()=>{const S=G.S,ids=Object.keys(G.RECIPES).filter(k=>G.unlocked(k)&&!S.orders.some(o=>o.dish===k));if(!ids.length)return null;
 const dish=pick(ids),r=G.RECIPES[dish],sv=S.served,done=S.ord.done;
 const qty=sv<10?1:sv<40?1+(Math.random()<.5?1:0):sv<120?2+(Math.random()<.5?1:0):2+(Math.random()*3|0);
 const w3=Math.min(.25,.02*done),w2=Math.min(.4,.12+.015*done),x=Math.random(),star=x<w3?3:x<w3+w2?2:1;
 const reward=Math.round(r.price*qty*(G.ORD.mult+G.ORD.starMult*(star-1)));
 const b=Math.random(),bonus=b<.4?{rep:2}:b<.8?{seed:pick(Object.keys(G.CROPS)),n:3}:null;
 return{id:++S.ord.seq,who:pick(WHO),dish,qty,star,reward,bonus,t:G.ORD.life}};
G.updateOrders=dt=>{ensure();const S=G.S;if(!G.ordOpen())return;
 S.orders.forEach(o=>o.t-=dt);
 const gone=S.orders.filter(o=>o.t<=0);if(gone.length){S.orders=S.orders.filter(o=>o.t>0);G.msg('Đơn của '+gone[0].who+' đã hết hạn')}
 S.ord.next-=dt;
 if(S.ord.next<=0){const d=today();if(S.orders.length<G.ORD.max&&d.sp<G.ORD.perDay){const o=make();if(o){S.orders.push(o);d.sp++;G.msg(o.who+' đặt '+o.qty+' '+G.RECIPES[o.dish].n+' — xem Bảng đơn ở Bếp')}S.ord.next=rnd(G.ORD.gap[0],G.ORD.gap[1])}else S.ord.next=20}};
G.orderBonusText=o=>o.bonus?(o.bonus.rep?'+'+o.bonus.rep+' uy tín':'+'+o.bonus.n+' hạt '+G.CROPS[o.bonus.seed].n):'';
// Giao đơn: lấy món sao thấp nhất đủ yêu cầu trước (giữ món sao cao để bán hoặc cho đơn khó)
G.orderGive=id=>{ensure();const S=G.S,i=S.orders.findIndex(o=>o.id==id),o=S.orders[i];if(!o)return;
 if(G.ordFull())return G.msg('Hôm nay đã giao đủ '+G.ORD.perDay+' đơn — sang ngày mai nhé');
 if(G.dishStock(o.dish,o.star)<o.qty)return G.msg('Chưa đủ món cho đơn này');
 let need=o.qty;for(let s=o.star;s<=3&&need>0;s++){const k=G.dishId(o.dish,s),n=Math.min(need,S.inv[k]||0);if(n){G.add(k,-n);need-=n}}
 G.earn(o.reward,'order');
 let extra='';if(o.bonus){if(o.bonus.rep){G.addRep(o.bonus.rep);extra=' · +'+o.bonus.rep+' uy tín'}else{G.add('hat_'+o.bonus.seed,o.bonus.n);extra=' · +'+o.bonus.n+' hạt '+G.CROPS[o.bonus.seed].n}}
 S.orders.splice(i,1);S.ord.done++;today().n++; // không còn đơn mới đến sớm sau khi giao: tránh dồn đơn / spam tiền
 G.msg(o.who+' cảm ơn! +'+o.reward+' xu'+extra)};
G.orderSkip=id=>{ensure();const S=G.S,i=S.orders.findIndex(o=>o.id==id);if(i<0)return;S.orders.splice(i,1);S.ord.next=Math.max(S.ord.next,40)};
G.ordReady=()=>G.ordFull()?0:G.S.orders.filter(o=>G.dishStock(o.dish,o.star)>=o.qty).length;
})();
