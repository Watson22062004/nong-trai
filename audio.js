// audio.js — Âm thanh cho game, tổng hợp trực tiếp bằng Web Audio (không cần file mp3, không tải mạng).
// Nguyên tắc: chỉ QUAN SÁT trạng thái game (G.S, G.P, G.ui…) rồi phát tiếng tương ứng.
// Không bọc/sửa hàm nào của game → gameplay giữ nguyên. Muốn chỉnh tiếng nào → sửa trong SND bên dưới.
(()=>{
const KEY='xoiBenDua_snd';
let on=true;try{on=localStorage[KEY]!=='0'}catch(e){}
const VOL=1.8; // âm lượng tổng (trước là 0.8 → hơi nhỏ, nhất là trên điện thoại). Chỉnh số này để to/nhỏ.
let ac=null,sfx,ambBus,master,noise,crack,amb=null,busy=0;
const rnd=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.random()*a.length|0];
const live=()=>!!(ac&&on&&ac.state==='running'&&!document.hidden);
const gt={};const gate=(k,ms)=>{const n=performance.now();if(n-(gt[k]||0)<ms)return false;gt[k]=n;return true};

// ===== Khởi tạo (phải sau lần chạm đầu tiên của người chơi — quy định của trình duyệt) =====
function init(){
  if(ac)return;
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
  ac=new AC();
  const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=9000;
  const comp=ac.createDynamicsCompressor();comp.threshold.value=-20;comp.knee.value=18;comp.ratio.value=6;comp.attack.value=.004;comp.release.value=.2;
  master=ac.createGain();master.gain.value=on?VOL:0;
  sfx=ac.createGain();ambBus=ac.createGain();
  sfx.connect(lp);ambBus.connect(lp);lp.connect(comp);comp.connect(master);master.connect(ac.destination);
  const sr=ac.sampleRate;
  noise=ac.createBuffer(1,sr*2,sr);{const d=noise.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
  crack=ac.createBuffer(1,sr*3,sr);{const d=crack.getChannelData(0);let k=0,a=0;
    for(let i=0;i<d.length;i++){d[i]=(Math.random()*2-1)*.04;if(Math.random()<.00035){k=i;a=rnd(.5,1)}
      const j=i-k;if(j>=0&&j<28)d[i]+=(Math.random()*2-1)*a*(1-j/28)}}
  startAmbient();
}
// Trình duyệt chỉ mở khoá âm thanh khi có "cử chỉ" thật: trên cảm ứng đó là pointerup/touchend/click (KHÔNG phải pointerdown/touchstart),
// nên unlock() được gọi ở tất cả các sự kiện đó. iOS còn cần đặt audioSession='playback' để không bị công tắc im lặng chặn.
let kicked=false,tag=null;
const WAV='data:audio/wav;base64,'+'UklGRkQDAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YSADAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgA==';
function kick(){if(kicked||!ac||ac.state!=='running')return;kicked=true;
  try{const s=ac.createBufferSource();s.buffer=ac.createBuffer(1,1,22050);s.connect(ac.destination);s.start(0)}catch(e){}}
function unlock(){
  if(!on)return;
  try{if(navigator.audioSession)navigator.audioSession.type='playback';
    else if(!tag){tag=document.createElement('audio');tag.src=WAV;tag.loop=true;tag.setAttribute('playsinline','');tag.play().catch(()=>{})}}catch(e){}
  init();
  if(ac&&ac.state!=='running'){const r=ac.resume();if(r&&r.then)r.then(kick).catch(()=>{})}else kick()}

// ===== Bộ dựng âm =====
const env=(g,t,a,d,v)=>{g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(v,.0003),t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+d)};
const go=(n,t,len)=>{n.start(t);n.stop(t+len);busy++;n.onended=()=>busy--};
// Âm có cao độ. o: f2 (trượt tới), type, at (trễ giây), a/d (lên/tắt), v (to), lp (lọc mềm), vib [Hz,độ sâu]
function tone(f,o={}){
  if(!live()||busy>48)return;
  const t=ac.currentTime+(o.at||0)+.004,a=o.a??.004,d=o.d??.1,v=o.v??.05;
  const os=ac.createOscillator(),g=ac.createGain();
  os.type=o.type||'sine';os.frequency.setValueAtTime(f,t);
  if(o.f2)os.frequency.exponentialRampToValueAtTime(o.f2,t+a+d);
  if(o.vib){const l=ac.createOscillator(),lg=ac.createGain();l.frequency.value=o.vib[0];lg.gain.value=o.vib[1];l.connect(lg);lg.connect(os.frequency);go(l,t,a+d+.04)}
  env(g,t,a,d,v);
  let n=os;if(o.lp){const b=ac.createBiquadFilter();b.type='lowpass';b.frequency.value=o.lp;os.connect(b);n=b}
  n.connect(g);g.connect(o.dest||sfx);go(os,t,a+d+.04);
}
// Tiếng xì/sột soạt (nhiễu qua bộ lọc)
function hiss(type,f,o={}){
  if(!live()||busy>48)return;
  const t=ac.currentTime+(o.at||0)+.004,a=o.a??.003,d=o.d??.06,v=o.v??.05;
  const s=ac.createBufferSource();s.buffer=noise;s.loop=true;
  const b=ac.createBiquadFilter();b.type=type;b.frequency.setValueAtTime(f,t);b.Q.value=o.q??1;
  if(o.f2)b.frequency.exponentialRampToValueAtTime(o.f2,t+a+d);
  const g=ac.createGain();env(g,t,a,d,v);
  s.connect(b);b.connect(g);g.connect(sfx);s.start(t,Math.random()*1.5);s.stop(t+a+d+.04);busy++;s.onended=()=>busy--;
}
// Giọng nói "bập bẹ" (kiểu Animal Crossing): chuỗi nguyên âm [nguyên âm, hệ số cao độ, độ dài]
const VOW={a:[800,1300],o:[520,900],e:[470,2000],i:[320,2300],u:[340,950],ơ:[520,1250],ư:[360,1500]};
function say(base,seq,o={}){
  if(!live()||busy>44)return;
  const v=o.v??.16,dur=o.dur??.1,gap=o.gap??.03;let t=ac.currentTime+(o.at||0)+.01;
  seq.forEach(([vw,pm,len=1])=>{
    const f=base*pm,d=dur*len,fm=VOW[vw],os=ac.createOscillator(),g=ac.createGain();
    os.type='sawtooth';os.frequency.setValueAtTime(f*.96,t);os.frequency.linearRampToValueAtTime(f*(1+(o.lift||0)),t+d);
    env(g,t,.02,d,v);
    [[fm[0],1],[fm[1],.45]].forEach(([fc,k])=>{const b=ac.createBiquadFilter(),gg=ac.createGain();b.type='bandpass';b.frequency.value=fc;b.Q.value=5;gg.gain.value=k;os.connect(b);b.connect(gg);gg.connect(g)});
    g.connect(sfx);go(os,t,d+.07);t+=d*.8+gap;
  });
}

// ===== Danh sách âm thanh (volume đã chỉnh nhỏ, nền êm) =====
const SND={
  // — chạm / giao diện —
  tap(){tone(560,{f2:300,d:.05,v:.05})},
  tick(p=1){hiss('bandpass',1700*p,{q:2,d:.02,v:.05});tone(900*p,{type:'triangle',d:.025,v:.02})},
  open(){hiss('bandpass',900,{d:.07,v:.05});tone(330,{f2:430,d:.09,v:.04,type:'triangle'})},
  close(){tone(380,{f2:260,d:.08,v:.035,type:'triangle'});hiss('bandpass',700,{d:.05,v:.03})},
  nope(){tone(210,{f2:150,type:'triangle',d:.12,v:.055});tone(180,{f2:130,at:.12,d:.14,type:'triangle',v:.05})},
  // — bước chân theo mặt đất —
  step(s){const j=rnd(.85,1.15);
    if(s==='wood'){tone(rnd(110,150),{f2:70,d:.05,v:.05});hiss('bandpass',900*j,{q:1.2,d:.035,v:.03})}
    else if(s==='stone'){hiss('highpass',1800*j,{d:.025,v:.03});tone(260*j,{type:'triangle',d:.02,v:.012})}
    else if(s==='dirt')hiss('lowpass',1400*j,{d:.05,v:.04});
    else{hiss('bandpass',2200*j,{q:.7,d:.055,v:.03});hiss('lowpass',500,{d:.04,v:.025})}},
  // — trang trại —
  dig(){tone(130,{f2:55,d:.12,v:.08});hiss('lowpass',700,{d:.1,v:.06})},
  seed(){for(let i=0;i<3;i++)hiss('bandpass',3200+i*300,{q:3,at:i*.045,d:.03,v:.04})},
  harvest(){hiss('bandpass',2600,{q:.8,d:.14,v:.05});tone(520,{f2:900,d:.07,v:.05,at:.04})},
  sparkle(){tone(2637,{d:.18,v:.02});tone(3136,{at:.06,d:.2,v:.015})},
  pourGrain(){hiss('highpass',3000,{a:.03,d:.35,v:.035});for(let i=0;i<5;i++)hiss('bandpass',4200,{q:3,at:rnd(.02,.35),d:.02,v:.02})},
  collect(it){
    if(it==='trung'){hiss('bandpass',2500,{d:.02,v:.04});tone(700,{f2:500,d:.03,v:.03})}
    else if(it==='sua'||it==='ca'){tone(400,{f2:650,d:.08,v:.05});hiss('bandpass',1200,{at:.03,d:.1,v:.03})}
    else tone(620,{f2:980,d:.08,v:.06});
    tone(980,{f2:1300,at:.07,d:.08,v:.035})},
  // — tiền —
  coin(big,vol=1){[[1568,0],[2093,.07]].concat(big?[[2637,.14]]:[]).forEach(([f,at])=>{tone(f,{at,type:'triangle',a:.002,d:.28,v:.05*vol});tone(f*2.4,{at,d:.1,v:.012*vol})})},
  pay(){tone(1250,{f2:900,d:.07,type:'triangle',v:.04});hiss('highpass',4000,{d:.03,v:.02})},
  unlockChime(){[1047,1319,1568,2093].forEach((f,i)=>tone(f,{at:i*.09,type:'triangle',d:.35,v:.05}))},
  // — nấu ăn —
  ingredient(k){
    if(/^(nuoc_mam|dau_an|sua|sua_dac|tra|ca_phe)$/.test(k))for(let i=0;i<3;i++)tone(280+i*40,{f2:430+i*40,at:i*.07,d:.06,v:.045});
    else if(/^(nep|gao|bot_mi|duong|muoi|cam|dau_xanh|dau_phong)$/.test(k)){hiss('highpass',3200,{a:.01,d:.14,v:.035});tone(300,{f2:200,d:.05,v:.04})}
    else if(k==='trung'){hiss('bandpass',2500,{d:.02,v:.04});tone(700,{f2:480,d:.03,v:.035});tone(380,{f2:170,at:.05,d:.08,v:.05})}
    else if(/^(thit_|ca$|tom|mi$|bun|banh_)/.test(k)){tone(150,{f2:80,d:.08,v:.08});hiss('lowpass',500,{d:.05,v:.05})}
    else{tone(420,{f2:170,d:.09,v:.055});hiss('bandpass',1100,{d:.04,v:.03})}},
  pourAway(){hiss('bandpass',900,{f2:400,a:.03,d:.35,v:.04})},
  sizzle(){hiss('highpass',3500,{a:.05,d:1.2,v:.04});for(let i=0;i<10;i++)hiss('highpass',5000,{at:rnd(0,1.1),d:.012,v:.04})},
  clank(){tone(1100,{d:.09,v:.03,type:'triangle'});tone(1650,{at:.02,d:.07,v:.02,type:'triangle'});hiss('bandpass',2000,{d:.03,v:.03})},
  swish(){for(let i=0;i<3;i++)hiss('bandpass',700,{f2:1200,q:1.5,at:i*.2,a:.05,d:.12,v:.04})},
  ding(q=1){tone(1568,{d:.7,v:.06*q});tone(2349,{d:.5,v:.025*q});tone(1568,{at:.22,d:.7,v:.05*q});tone(2349,{at:.22,d:.5,v:.02*q})},
  // — nhà hàng —
  bell(){tone(1319,{d:.5,v:.045,a:.002});tone(2637,{d:.2,v:.015});tone(1047,{at:.16,d:.6,v:.04});tone(2093,{at:.16,d:.25,v:.013})},
  creak(){tone(150,{f2:200,type:'sawtooth',d:.35,v:.02,lp:600});hiss('bandpass',300,{d:.3,v:.015});tone(100,{f2:60,at:.38,d:.06,v:.05})},
  chair(){hiss('bandpass',500,{f2:260,q:2,d:.14,v:.045})},
  plate(){tone(3300,{d:.1,v:.03});tone(4300,{at:.015,d:.07,v:.02});tone(180,{f2:120,d:.05,v:.03})},
  // — tiếng động vật —
  chicken(v=1){for(let i=0;i<3;i++)tone(rnd(650,780),{type:'square',f2:rnd(480,560),at:i*.11,d:.07,v:.03*v,lp:2200})},
  rooster(v=1){tone(520,{type:'sawtooth',f2:940,a:.05,d:.2,v:.04*v,lp:2800});
    tone(900,{type:'sawtooth',f2:780,at:.26,a:.03,d:.3,v:.04*v,lp:2600,vib:[24,22]});
    tone(780,{type:'sawtooth',f2:420,at:.58,a:.03,d:.3,v:.035*v,lp:2400})},
  cow(v=1){tone(100,{type:'sawtooth',f2:140,a:.12,d:.4,v:.06*v,lp:900,vib:[5,5]});tone(140,{type:'sawtooth',f2:95,at:.35,a:.1,d:.55,v:.06*v,lp:850,vib:[5,5]})},
  pig(v=1){for(let i=0;i<2;i++){tone(190,{type:'sawtooth',f2:140,at:i*.18,a:.01,d:.11,v:.05*v,lp:800});hiss('bandpass',600,{at:i*.18,d:.1,v:.03*v})}},
  duck(v=1){for(let i=0;i<2;i++)tone(480,{type:'square',f2:360,at:i*.17,a:.01,d:.11,v:.03*v,lp:1500,vib:[40,30]})},
  fish(v=1){tone(500,{f2:200,d:.1,v:.06*v});hiss('bandpass',1200,{d:.12,v:.04*v});for(let i=0;i<3;i++)tone(rnd(500,800),{f2:rnd(900,1200),at:.12+i*.08,d:.05,v:.025*v})},
  dog(v=1){for(let i=0;i<2;i++)tone(330,{type:'sawtooth',f2:190,at:i*.24,a:.008,d:.14,v:.05*v,lp:1400})},
  cat(v=1){tone(620,{type:'triangle',f2:900,a:.12,d:.1,v:.04*v,lp:2400});tone(900,{type:'triangle',f2:520,at:.2,a:.03,d:.3,v:.04*v,lp:2200})},
  cry(t,v=1){({ga:SND.chicken,bo:SND.cow,heo:SND.pig,vit:SND.duck,caao:SND.fish}[t]||SND.chicken)(v)},
  // — chim / dế buổi tối (không khí) —
  bird(){const n=1+(Math.random()*3|0),f=rnd(2600,4200);for(let i=0;i<n;i++)tone(f*rnd(.9,1.1),{f2:f*rnd(1.1,1.4),at:i*.12,d:.07,v:.014})},
  cricket(){for(let i=0;i<5;i++)tone(4300,{at:i*.07,d:.04,v:.008})},
  // — giọng nói —
  vOrder(b){say(b,[['o',1],['i',1.1],['o',.95,1.3]],{lift:.08,at:.15})},      // "Cho mình một…"
  vYes(){say(215,[['a',1.25,.8],['a',1.05,.9]],{v:.17})},                     // "Dạ ạ!"
  vHappy(b){say(b,[['o',1],['u',1.15],['a',1.35,1.4]],{lift:.1,at:.45})},    // "Ngon quá!"
  vThanks(b){say(b,[['a',1.2],['ơ',.95,1.4]],{at:.2})},                      // "Cảm ơn!"
  vAngry(b){say(b*.8,[['ư',.75,1.8]],{lift:-.1,v:.15})}                      // "Hừ!"
};
Object.assign(SND,{say,ctx:()=>ac,live});
G.snd=SND;

// ===== Nền: suối nhẹ, lửa bếp (rất nhỏ; chim/dế/động vật thỉnh thoảng) =====
function startAmbient(){
  const mk=(buf,type,f,q)=>{const s=ac.createBufferSource();s.buffer=buf;s.loop=true;const b=ac.createBiquadFilter();b.type=type;b.frequency.value=f;b.Q.value=q||1;const g=ac.createGain();g.gain.value=0;s.connect(b);b.connect(g);g.connect(ambBus);s.start();return {g,b}};
  const stream=mk(noise,'bandpass',650,.6),stream2=ac.createBiquadFilter();stream2.type='lowpass';stream2.frequency.value=1500;
  stream.b.disconnect();stream.b.connect(stream2);stream2.connect(stream.g);
  const lfo=ac.createOscillator(),lg=ac.createGain();lfo.frequency.value=.15;lg.gain.value=.003;lfo.connect(lg);lg.connect(stream.g.gain);lfo.start();
  amb={stream:stream.g,fire:mk(crack,'highpass',1800).g,rumble:mk(noise,'lowpass',260).g,cur:{}};
}
function ambSet(k,v){if(!amb||amb.cur[k]===v)return;amb.cur[k]=v;amb[k].gain.setTargetAtTime(v,ac.currentTime,.6)}
function mix(){
  const z=G.ui.zone,cook=G.S.cooking.length>0;
  ambSet('stream',{farm:.018,hub:.016,market:.013,pets:.016}[z]||0);
  ambSet('fire',z==='kitchen'?(cook?.05:.014):z==='shop'?(cook?.03:0):0);
  ambSet('rumble',z==='kitchen'?(cook?.02:0):z==='shop'?(cook?.01:0):0);
}
let nBird=0,nCrit=0,nAni=0;
function ambient(){
  const t=performance.now(),z=G.ui.zone;if(z==='kitchen'||z==='shop')return;
  const night=G.S.clock/120>.7;
  if(!night&&t>nBird){SND.bird();nBird=t+rnd(5000,12000)}
  if(night&&t>nCrit){SND.cricket();nCrit=t+rnd(3500,8000)}
  if(t>nAni){nAni=t+rnd(14000,30000);
    if(z==='farm'){const a=G.S.animals;if(a.length)SND.cry(pick(a).type,.45)}
    else if(z==='pets')pick([()=>SND.chicken(.5),()=>SND.cow(.4),()=>SND.dog(.45),()=>SND.cat(.5)])();
    else if(z==='hub')pick([()=>SND.dog(.4),()=>SND.cat(.45),()=>SND.chicken(.4)])();
    else if(z==='market')SND.chicken(.35)}
}

// ===== Quan sát trạng thái game → phát âm =====
const STRIDE=34,NEG=/Không đủ|Hết |đầy|Thiếu|bận|Chưa |Chọn công thức|Phục vụ \d|không có trong|^Đủ /;
const SKIN_PITCH=[240,185,265,150],cst=new WeakMap();
let prev=null,acc=STRIDE*.5;
const snap=()=>{const S=G.S,U=G.ui,P=G.P;return{S,zone:U.zone,modal:U.modal,money:S.money,day:S.day,
  pl:S.plots.map(p=>!p?0:p.t>=G.CROPS[p.crop].time?2:1),
  an:S.animals.map(a=>({fed:a.fed,ready:a.ready})),
  cook:S.cooking.length,plots:S.plotsOpen,kit:S.kit,stars:G.stars(),done:G.potDone,pot:Object.assign({},U.pot),m:G._m,
  st:P.st,fxd:P.fxd||0,x:P.x,y:P.y}};
const sum=o=>Object.values(o).reduce((a,b)=>a+b,0);
const surface=()=>{const z=G.ui.zone,p=G.P;
  if(z==='kitchen'||z==='shop')return 'wood';
  if(z==='hub')return (p.y>=164&&p.y<=200)||(p.x>=290&&p.x<=322&&p.y>=58)||(p.x>=230&&p.x<=382&&p.y>=56&&p.y<=100)?'stone':'grass';
  if(z==='market')return p.y>=68&&p.y<=164?'stone':'grass';
  if(z==='farm')return p.y>=196&&p.y<=226?'dirt':'grass';
  return 'grass'};
const nearAnimal=()=>G.S.animals.findIndex((a,i)=>Math.hypot(G.P.x-(408+(i%2)*50+20),G.P.y-(40+Math.floor(i/2)*32+34))<8);
function rebase(){prev=snap();G.S.customers.forEach(c=>cst.set(c,{st:c.st}))}
function tick(){
  if(!G.S||!G.P||!G.ui)return;
  const S=G.S,U=G.ui,P=G.P;
  if(!prev||prev.S!==S){rebase();return}
  const q=prev,z=U.zone,shop=z==='shop';
  // đổi khu: cửa gỗ ở bếp / nhà hàng
  if(z!==q.zone){
    if(z==='shop'){SND.creak();SND.bell()}
    else if(z==='kitchen'||q.zone==='kitchen'||q.zone==='shop')SND.creak();
    acc=STRIDE*.5;
  }else if(P.st==='walk'){
    const d=Math.hypot(P.x-q.x,P.y-q.y);
    if(d<20){acc+=d;if(acc>=STRIDE){acc%=STRIDE;SND.step(surface())}}
  }else acc=STRIDE*.5;
  // mở/đóng bảng
  if(U.modal!==q.modal){if(!q.modal)SND.open();else if(!U.modal)SND.close();else SND.tick(1.2)}
  // nhân vật làm việc
  if(P.st==='work'&&q.st!=='work'){
    if(P.wa==='feed')SND.pourGrain();else if(P.wa==='stir')SND.swish();else if(P.wa==='serve')SND.tick(.9)}
  if(P.st==='work'&&P.wa==='dig'&&!q.fxd&&P.fxd&&!(z==='farm'&&nearAnimal()>=0))SND.dig();
  // cây trồng
  let nSeed=0,nHar=0,col=null; // gom lại: "thu hoạch hết" chỉ kêu một tiếng, không dồn dập
  S.plots.forEach((p,i)=>{const n=!p?0:p.t>=G.CROPS[p.crop].time?2:1,o=q.pl[i];
    if(o===0&&n>0)nSeed++;
    else if(o>0&&n===0)nHar++;
    else if(o===1&&n===2&&z==='farm'&&gate('rp',3500))SND.sparkle()});
  if(nSeed)SND.seed();if(nHar)SND.harvest();
  // vật nuôi
  if(S.animals.length>q.an.length){SND.ding(.6);SND.cry(S.animals[S.animals.length-1].type,.7)}
  S.animals.forEach((a,i)=>{const o=q.an[i];if(!o)return;
    if(a.fed&&!o.fed)SND.cry(a.type,.8);
    if(a.ready&&!o.ready&&z==='farm'&&gate('ar',2500))SND.cry(a.type,.4);
    if(!a.ready&&o.ready)col=G.ANIMALS[a.type].make});
  if(col)SND.collect(col);
  // nâng cấp / lên sao
  if(S.plotsOpen>q.plots)SND.dig();
  if(S.kit>q.kit){SND.clank();SND.ding(1)}
  if(G.stars()>q.stars)SND.unlockChime();
  // tiền
  const dm=S.money-q.money;
  if(dm>0&&gate('coin',70))SND.coin(dm>=60,z==='market'||shop?1:.45);
  else if(dm<0&&gate('pay',70))SND.pay();
  // thông báo của game
  if(G._m!==q.m){const m=G.msgText||'';
    if(/Mở khoá món mới/.test(m))SND.unlockChime();else if(NEG.test(m)&&gate('nope',300))SND.nope()}
  // nấu ăn
  const pot=U.pot||{};
  for(const k in pot)if((pot[k]||0)>(q.pot[k]||0))SND.ingredient(k);
  if(sum(pot)<sum(q.pot)&&S.cooking.length<=q.cook)SND.pourAway();
  if(S.cooking.length>q.cook){SND.sizzle();SND.clank()}
  if(G.potDone&&G.potDone!==q.done)SND.ding(z==='kitchen'||shop?1:.45);
  // ngày mới: gà gáy (ngoài trời)
  if(S.day>q.day&&z!=='kitchen'&&!shop&&gate('crow',5000))SND.rooster(.6);
  // khách hàng
  S.customers.forEach(c=>{const o=cst.get(c);
    if(!o){cst.set(c,{st:c.st});if(shop&&gate('bell',600))SND.bell();return}
    if(o.st===c.st)return;const a=o.st,b=c.st,bp=SKIN_PITCH[c.sk&3];o.st=b;if(!shop)return;
    const vg=()=>gate('voice',350); // tối đa 1 giọng khách mỗi 0,35s để không chồng tiếng
    if(b==='order'&&(a==='in'||a==='queue')){if(vg())SND.vOrder(bp)}
    else if(b==='toseat')SND.vYes();
    else if(b==='wait'&&a==='toseat')SND.chair();
    else if(b==='eat'){SND.plate();if(vg())SND.vHappy(bp)}
    else if(b==='leave'){if(c.mad){if(vg())SND.vAngry(bp)}else if(a==='eat'&&vg())SND.vThanks(bp)}});
  prev=snap();
}
setInterval(()=>{try{tick();if(live()){mix();ambient()}}catch(e){}},40);

// ===== Chạm / bấm nút =====
addEventListener('pointerdown',e=>{
  unlock();
  const t=e.target;if(!t||!t.closest)return;
  if(t.id==='cv'){if(!G.ui.modal&&G.P.st!=='work')SND.tap();return}
  const b=t.closest('button');if(!b||b.id==='sndbtn')return;
  const d=b.dataset;if(d.modal!==undefined||['buy','sell','sellall','animal','go','add','plot','kit','harvestall','again','shopopen','shopclose'].includes(d.act))return;
  SND.tick(d.act==='slot'?1.15:1)},true);
['pointerup','touchend','click','keydown'].forEach(ev=>addEventListener(ev,unlock,true));
document.addEventListener('visibilitychange',()=>{if(!ac)return;if(document.hidden)ac.suspend();else if(on)ac.resume()});

// ===== Nút bật/tắt âm thanh (nhỏ, dưới hàng nút nhiệm vụ/sổ sách ở góc phải) =====
const css=document.createElement('style');
css.textContent='#sndbtn{position:absolute;top:calc(var(--u)*6);right:calc(var(--u)*1.1);z-index:4;width:calc(var(--u)*3.8);height:calc(var(--u)*3.8);padding:0;border-radius:50%;border:2px solid var(--ink);background:linear-gradient(#fffaf2,#f4e4c4);box-shadow:0 2px 0 #1a100866;cursor:pointer;opacity:.88;display:flex;align-items:center;justify-content:center}#sndbtn svg{width:62%;height:62%;display:block}#sndbtn:active{transform:translateY(2px);box-shadow:none}';
document.head.appendChild(css);
const btn=document.createElement('button');btn.id='sndbtn';btn.type='button';
const icon=()=>{btn.title=on?'Tắt âm thanh':'Bật âm thanh';btn.setAttribute('aria-label',btn.title);
  btn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="#2a1a10" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z" fill="#2a1a10"/>'+(on?'<path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>':'<path d="M17 9l5 6M22 9l-5 6"/>')+'</svg>'};
icon();
btn.addEventListener('click',()=>{on=!on;try{localStorage[KEY]=on?'1':'0'}catch(e){}icon();
  if(on){unlock();if(master)master.gain.setTargetAtTime(VOL,ac.currentTime,.05);setTimeout(()=>SND.tick(1.1),80)}
  else if(master)master.gain.setTargetAtTime(0,ac.currentTime,.05)});
document.getElementById('game').appendChild(btn);
})();
