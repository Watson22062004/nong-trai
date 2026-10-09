// music.js — NHẠC NỀN lofi chill, tạo trực tiếp bằng Web Audio (không cần file mp3, không tải mạng).
// Tiết tấu 72 BPM có swing; hợp âm 7/9 chơi bằng "đàn Rhodes" (tremolo + lọc mềm), bass trầm, vài nốt chuông thưa có vang,
// trống nhẹ (kick, snare, hi-hat), tiếng xào xạc băng đĩa than. Chuỗi hợp âm đổi ngẫu nhiên mỗi 4 ô nhịp nên không lặp nhàm.
// Âm lượng / bật tắt nhạc nằm ở G.audio.cfg (bảng Cài đặt). Muốn đổi không khí: sửa BPM, PROG (chuỗi hợp âm), CH (giọng hợp âm).
(()=>{
const BPM=72,SPB=60/BPM,S16=SPB/4,SWING=.3*S16;
const mtof=m=>440*Math.pow(2,(m-69)/12);
const rnd=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.random()*a.length|0];
// b = nốt bass, v = thế bấm hợp âm (không có nốt gốc, kiểu jazz), m = các nốt giai điệu hợp với hợp âm
const CH={
 Cmaj7:{b:36,v:[52,55,59,62],m:[72,74,76,79,83]},
 Am7:{b:33,v:[60,64,67,71],m:[72,76,79,81,84]},
 Dm7:{b:38,v:[53,57,60,64],m:[72,74,77,81,79]},
 G7:{b:31,v:[59,62,65,69],m:[71,74,77,79,81]},
 Em7:{b:40,v:[55,59,62,66],m:[71,74,76,79,83]},
 Fmaj7:{b:41,v:[57,60,64,67],m:[72,76,77,81,79]}};
const PROG=[['Fmaj7','Em7','Dm7','Cmaj7'],['Cmaj7','Am7','Dm7','G7'],['Am7','Dm7','G7','Cmaj7'],['Dm7','G7','Cmaj7','Am7'],['Cmaj7','Em7','Fmaj7','G7']];

// dựng toàn bộ mạng âm thanh trên ngữ cảnh C, đầu ra nối vào out; trả về bộ phát lịch nốt
const make=(C,out)=>{
 const mix=C.createGain(),sat=C.createWaveShaper(),mlp=C.createBiquadFilter();
 const cv=new Float32Array(257);for(let i=0;i<257;i++){const x=i/128-1;cv[i]=Math.tanh(x*1.6)/Math.tanh(1.6)}sat.curve=cv; // bão hoà nhẹ kiểu băng từ
 mlp.type='lowpass';mlp.frequency.value=4800;mlp.Q.value=.4;mix.connect(sat);sat.connect(mlp);mlp.connect(out);
 // vang (reverb) từ nhiễu tắt dần
 const rvb=C.createConvolver(),len=Math.floor(C.sampleRate*2.4),ib=C.createBuffer(2,len,C.sampleRate);
 for(let ch=0;ch<2;ch++){const d=ib.getChannelData(ch);let l=0;for(let i=0;i<len;i++){l+=((Math.random()*2-1)-l)*.35;d[i]=l*Math.pow(1-i/len,2.8)}}
 rvb.buffer=ib;const rg=C.createGain();rg.gain.value=.9;rvb.connect(rg);rg.connect(mix);
 const send=C.createGain();send.gain.value=.3;send.connect(rvb);
 // đàn: tremolo chậm + lọc mềm
 const pb=C.createGain(),lfo=C.createOscillator(),lg=C.createGain(),pt=C.createBiquadFilter();
 pb.gain.value=.85;lfo.frequency.value=4.6;lg.gain.value=.1;lfo.connect(lg);lg.connect(pb.gain);lfo.start();
 pt.type='lowpass';pt.frequency.value=2600;pb.connect(pt);pt.connect(mix);pt.connect(send);
 // giai điệu: vọng lại theo nốt chấm dôi
 const mb=C.createGain(),dl=C.createDelay(2),fb=C.createGain(),dp=C.createBiquadFilter();
 mb.gain.value=.8;dl.delayTime.value=SPB*.75;fb.gain.value=.38;dp.type='lowpass';dp.frequency.value=1800;
 mb.connect(mix);mb.connect(dl);dl.connect(dp);dp.connect(fb);fb.connect(dl);dp.connect(mix);dp.connect(send);
 // bass
 const bb=C.createGain(),bl=C.createBiquadFilter();bb.gain.value=.6;bl.type='lowpass';bl.frequency.value=380;bb.connect(bl);bl.connect(mix);
 // trống
 const db=C.createGain(),dlp=C.createBiquadFilter(),ds=C.createGain();db.gain.value=.5;dlp.type='lowpass';dlp.frequency.value=5200;db.connect(dlp);dlp.connect(mix);
 ds.gain.value=.35;dlp.connect(ds);ds.connect(send);
 // nhiễu dùng chung + tiếng xào xạc đĩa than
 const nb=C.createBuffer(1,C.sampleRate,C.sampleRate);{const d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
 const cb=C.createBuffer(1,C.sampleRate*4,C.sampleRate);{const d=cb.getChannelData(0);let k=-99,a=0;
  for(let i=0;i<d.length;i++){d[i]=(Math.random()*2-1)*.03;if(Math.random()<.0004){k=i;a=rnd(.4,1)}const j=i-k;if(j>=0&&j<30)d[i]+=(Math.random()*2-1)*a*(1-j/30)}}
 const cs=C.createBufferSource(),ch_=C.createBiquadFilter(),cg=C.createGain();cs.buffer=cb;cs.loop=true;ch_.type='highpass';ch_.frequency.value=1500;cg.gain.value=.05;
 cs.connect(ch_);ch_.connect(cg);cg.connect(mix);cs.start();

 // ---- giọng ----
 const piano=(t,m,vel,dur)=>{const f=mtof(m)*(1+rnd(-.0015,.0015)),o=C.createOscillator(),o2=C.createOscillator(),g=C.createGain(),g2=C.createGain(),lp=C.createBiquadFilter();
  o.type='triangle';o2.type='sine';o.frequency.value=f;o2.frequency.value=f*2.003;g2.gain.value=.22;lp.type='lowpass';lp.frequency.value=1300+vel*1500;lp.Q.value=.5;
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(vel*.3,t+.012);g.gain.exponentialRampToValueAtTime(vel*.12,t+.4);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.connect(g);o2.connect(g2);g2.connect(g);g.connect(lp);lp.connect(pb);o.start(t);o2.start(t);o.stop(t+dur+.05);o2.stop(t+dur+.05)};
 const bass=(t,m,dur,vel)=>{const f=mtof(m),o=C.createOscillator(),o2=C.createOscillator(),g=C.createGain(),g2=C.createGain();
  o.type='sine';o2.type='triangle';o.frequency.value=f;o2.frequency.value=f;g2.gain.value=.3;
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(vel*.32,t+.02);g.gain.exponentialRampToValueAtTime(vel*.2,t+.25);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.connect(g);o2.connect(g2);g2.connect(g);g.connect(bb);o.start(t);o2.start(t);o.stop(t+dur+.05);o2.stop(t+dur+.05)};
 const bell=(t,m,vel)=>{const f=mtof(m),o=C.createOscillator(),o2=C.createOscillator(),g=C.createGain(),g2=C.createGain();
  o.type='sine';o2.type='triangle';o.frequency.value=f;o2.frequency.value=f*3.01;g2.gain.value=.12;
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(vel*.24,t+.006);g.gain.exponentialRampToValueAtTime(.0001,t+1.1);
  o.connect(g);o2.connect(g2);g2.connect(g);g.connect(mb);o.start(t);o2.start(t);o.stop(t+1.2);o2.stop(t+1.2)};
 const kick=(t,v)=>{const o=C.createOscillator(),g=C.createGain();o.frequency.setValueAtTime(140,t);o.frequency.exponentialRampToValueAtTime(42,t+.14);
  g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+.32);o.connect(g);g.connect(db);o.start(t);o.stop(t+.35)};
 const noise=(t,dur,type,freq,q,v,dest)=>{const s=C.createBufferSource(),f=C.createBiquadFilter(),g=C.createGain();s.buffer=nb;f.type=type;f.frequency.value=freq;f.Q.value=q;
  g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);s.connect(f);f.connect(g);g.connect(dest);s.start(t,Math.random()*.6);s.stop(t+dur+.02)};
 const snare=(t,v)=>{noise(t,.2,'bandpass',1900,.8,v,db);const o=C.createOscillator(),g=C.createGain();o.frequency.setValueAtTime(190,t);o.frequency.exponentialRampToValueAtTime(130,t+.08);
  g.gain.setValueAtTime(v*.5,t);g.gain.exponentialRampToValueAtTime(.001,t+.1);o.connect(g);g.connect(db);o.start(t);o.stop(t+.12)};
 const hat=(t,v,open)=>noise(t,open?.22:.045,'highpass',7000,.7,v,db);

 // ---- bộ phát lịch ----
 let step=0,bar=-1,pi=-1,prog=null,chord=CH.Cmaj7,pat=[0,10],drumOff=true,melo={},lastM=2,nextT=C.currentTime+.2;
 const newBar=()=>{bar++;
  if(bar%4===0){let n;do{n=Math.random()*PROG.length|0}while(n===pi);pi=n;prog=PROG[n]}
  chord=CH[prog[bar%4]];pat=pick([[0,7,10],[0,6,11],[0,10],[0,4,10,14],[0,8,11]]);
  drumOff=bar<2||(bar%8===7&&Math.random()<.5);
  melo={};if(bar>=1&&Math.random()<.65){const k=1+(Math.random()*3|0),slots=[2,6,8,10,12,14].sort(()=>Math.random()-.5).slice(0,k);
   slots.forEach(s=>{lastM=Math.max(0,Math.min(4,lastM+pick([-2,-1,-1,0,1,1,2])));melo[s]=chord.m[lastM]})}};
 const play=(s,t)=>{
  if(s===0){chord.v.forEach((m,i)=>piano(t+i*.014+rnd(0,.01),m,rnd(.75,.95),SPB*3.2));bass(t,chord.b,SPB*2.6,1)}
  else if(pat.includes(s))chord.v.slice(1).forEach((m,i)=>piano(t+i*.012,m,rnd(.35,.55),SPB*.7));
  if(s===10&&Math.random()<.7)bass(t,chord.b+(Math.random()<.5?7:12),SPB*.9,.7);
  if(s===14&&Math.random()<.3)bass(t,chord.b+7,SPB*.5,.5);
  if(melo[s])bell(t,melo[s],rnd(.5,.75));
  if(drumOff)return;
  if(s===0)kick(t,.7);else if(s===10)kick(t,.55);else if(s===7&&Math.random()<.4)kick(t,.4);
  if(s===4||s===12)snare(t,.5);else if(s===15&&Math.random()<.2)snare(t,.15);
  if(s%2===0)hat(t,[.5,.28,.4,.28][(s/2)%4]*.7,false);else if(Math.random()<.18)hat(t,.07,false);
  if(s===14&&Math.random()<.3)hat(t,.2,true)};
 return{mix,
  sync:now=>{if(nextT<now)nextT=now+.05},
  pump:limit=>{while(nextT<limit){const s=step;if(s===0)newBar();play(s,nextT+((s&3)>=2?SWING:0));step=(step+1)&15;nextT+=S16}}};
};

// ---- điều khiển phát thật (chạy sau cử chỉ đầu tiên của người chơi) ----
let eng=null;
const start=()=>{const ac=G.audio.ctx();if(!ac||eng)return;eng=make(ac,G.audio.out());
 eng.mix.gain.setValueAtTime(0,ac.currentTime);eng.mix.gain.linearRampToValueAtTime(1,ac.currentTime+3.5); // nhạc nhỏ dần vào
 setInterval(()=>{if(!G.audio.cfg.mOn||ac.state!=='running'){eng.sync(ac.currentTime);return}eng.sync(ac.currentTime);eng.pump(ac.currentTime+.4)},60)};
G.music={start,make};
G.audio.ready.push(start);if(G.audio.ctx())start();
})();
