const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Menu mobile ---------- */
const nav=$('#nav'),btn=$('.menu-btn');
const setMenu=o=>{nav.classList.toggle('open',o);btn.setAttribute('aria-expanded',o);btn.setAttribute('aria-label',o?'Fermer le menu':'Ouvrir le menu');document.body.classList.toggle('menu-open',o)};
btn.addEventListener('click',()=>setMenu(!nav.classList.contains('open')));
nav.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false)});
addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){setMenu(false);btn.focus()}});
addEventListener('resize',()=>{if(innerWidth>900)setMenu(false)});
$('#y').textContent=new Date().getFullYear();

/* ---------- Scroll : progression, en-tête, retour en haut ---------- */
const bar=document.createElement('div');bar.className='progress';document.body.prepend(bar);
const hdr=$('.site-header'),toTop=$('.totop');
const onScroll=()=>{const h=document.documentElement,y=h.scrollTop,m=h.scrollHeight-h.clientHeight;
  bar.style.transform=`scaleX(${m>0?y/m:0})`;hdr.classList.toggle('scrolled',y>30);toTop&&toTop.classList.toggle('show',y>700)};
addEventListener('scroll',onScroll,{passive:true});onScroll();
toTop&&toTop.addEventListener('click',()=>scrollTo({top:0,behavior:reduce?'auto':'smooth'}));

/* ---------- Ouvert / fermé (heure de Paris) ---------- */
(function(){
  const p=Object.fromEntries(new Intl.DateTimeFormat('fr-FR',{timeZone:'Europe/Paris',weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date()).map(x=>[x.type,x.value]));
  const days={dim:0,lun:1,mar:2,mer:3,jeu:4,ven:5,sam:6},d=days[p.weekday.slice(0,3).toLowerCase()],t=+p.hour*60+ +p.minute;
  const slots=[[570,750],[810,1110]],openDay=d>=2&&d<=6;
  const fmt=m=>`${Math.floor(m/60)}h${String(m%60).padStart(2,'0')}`;
  let open=false,msg;
  if(openDay){const cur=slots.find(([a,b])=>t>=a&&t<b);
    if(cur){open=true;msg=`Ouvert · ferme à ${fmt(cur[1])}`}
    else{const nxt=slots.find(([a])=>t<a);msg=nxt?`Fermé · ouvre à ${fmt(nxt[0])}`:(d===6?'Fermé · ouvre mardi à 9h30':'Fermé · ouvre demain à 9h30')}}
  else msg='Fermé · ouvre mardi à 9h30';
  $$('[data-status]').forEach(el=>{
    if(el.classList.contains('pill')){el.textContent=open?'Ouvert':'Fermé';el.classList.add(open?'open':'closed')}
    else if(el.classList.contains('status')){el.lastElementChild.innerHTML=`<b>${msg.split(' · ')[0]}</b> · ${msg.split(' · ')[1]}`;el.classList.toggle('open',open)}
    else el.innerHTML=`<b>${msg.split(' · ')[0]}</b> · ${msg.split(' · ')[1]}`});
  $$('[data-status-dot]').forEach(el=>el.classList.toggle('open',open));
  $$(`.hours tr[data-day="${d}"]`).forEach(r=>r.classList.add('today'));
})();

/* ---------- Apparition au scroll + compteurs ---------- */
const targets=$$('.section h2,.sec-head,.section>p,.card,.kf,.stat,.person,.steps li,.info-card,.rdv-form,.map,.hero-art,.mini-steps li,.team-teaser>*,.empty');
targets.forEach(el=>{el.classList.add('reveal');
  if(el.classList.contains('kf'))el.classList.add(el.classList.contains('rev')?'right':'left');
  const sib=el.parentElement?[...el.parentElement.children].indexOf(el):0;
  if(el.matches('.card,.stat,.steps li,.info-card,.mini-steps li'))el.style.setProperty('--d',(sib%6)*.08+'s')});
function count(b){const to=+b.dataset.count,pre=b.dataset.prefix||'',suf=b.dataset.suffix||'',txt=v=>pre+v+suf;
  if(reduce||to===0){b.innerHTML=txt(to);return}
  const t0=performance.now(),dur=1400;(function f(t){const k=Math.min((t-t0)/dur,1);b.innerHTML=txt(Math.round(to*(1-Math.pow(1-k,3))));if(k<1)requestAnimationFrame(f)})(t0)}
if(reduce||!('IntersectionObserver' in window)){targets.forEach(t=>t.classList.add('in'));$$('.stat b').forEach(count)}
else{const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');io.unobserve(e.target);
    const b=e.target.matches('.stat')&&$('b',e.target);b&&count(b)}),{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  targets.forEach(t=>io.observe(t))}

/* ---------- Sous-navigation active (savoir-faire) ---------- */
const sub=$$('.subnav a');
if(sub.length&&'IntersectionObserver' in window){
  const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)sub.forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'});
  sub.forEach(a=>{const t=$(a.hash);t&&so.observe(t)})}

/* ---------- Œil qui suit le curseur ---------- */
const iris=$('#iris'),blink=$('#blink');
if(iris&&!reduce){const art=$('.hero-art');
  addEventListener('pointermove',e=>{const r=art.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),d=Math.hypot(dx,dy)||1,k=Math.min(d/6,1);
    iris.style.transform=`translate(${dx/d*26*k}px,${dy/d*14*k}px)`},{passive:true});
  (function b(){setTimeout(()=>{blink.style.transition='height .09s';blink.setAttribute('height',240);setTimeout(()=>blink.setAttribute('height',0),130);b()},2500+Math.random()*3500)})()}

/* ---------- Formulaire de rendez-vous ---------- */
$$('.rdv-form').forEach(f=>{
  const msg=$('.form-msg',f),date=$('input[type=date]',f);
  if(date)date.min=new Date().toISOString().slice(0,10);
  f.addEventListener('input',e=>e.target.classList.remove('invalid'));
  f.addEventListener('submit',e=>{e.preventDefault();
    const bad=[...f.querySelectorAll('[required]')].filter(i=>!i.checkValidity());
    bad.forEach(i=>i.classList.add('invalid'));
    if(bad.length){msg.className='form-msg err';msg.textContent='Merci de renseigner votre nom et une adresse e-mail valide.';bad[0].focus();return}
    const v=n=>(f.elements[n]&&f.elements[n].value||'').trim();
    let jour='';if(v('date')){const dt=new Date(v('date')+'T12:00');jour=dt.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'});
      if(dt.getDay()===0||dt.getDay()===1){msg.className='form-msg err';msg.textContent='La boutique est fermée le dimanche et le lundi : choisissez un jour du mardi au samedi.';date.classList.add('invalid');date.focus();return}}
    const body=[`Nom : ${v('nom')}`,`E-mail : ${v('email')}`,v('telephone')&&`Téléphone : ${v('telephone')}`,`Motif : ${v('motif')}`,jour&&`Date souhaitée : ${jour}`,`Moment : ${v('moment')}`,'',v('message')].filter(x=>x!==''&&x!==undefined&&x!==false).join('\n');
    location.href=`mailto:contact@grandangleoptique.fr?subject=${encodeURIComponent('Demande de rendez-vous – '+v('motif'))}&body=${encodeURIComponent(body)}`;
    msg.className='form-msg';msg.textContent='Votre messagerie s’ouvre avec la demande pré-remplie. Si rien ne se passe, appelez-nous au 02 41 68 11 45.'})});

/* ---------- Google Maps : chargée seulement après clic ---------- */
$$('.map-consent').forEach(box=>$('button',box).addEventListener('click',()=>{
  const fr=document.createElement('iframe');fr.className='map-frame';fr.title="Plan d'accès Grand Angle Optique";fr.loading='lazy';fr.referrerPolicy='no-referrer-when-downgrade';fr.src=box.dataset.src;
  box.replaceChildren(fr);box.classList.add('loaded')}));
