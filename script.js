const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Menu mobile ---------- */
const nav=$('#nav'),btn=$('.menu-btn');
const setMenu=o=>{nav.classList.toggle('open',o);btn.setAttribute('aria-expanded',o);btn.setAttribute('aria-label',o?'Fermer le menu':'Ouvrir le menu');document.body.classList.toggle('menu-open',o)};
btn.addEventListener('click',()=>setMenu(!nav.classList.contains('open')));
nav.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false)});
addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){setMenu(false);btn.focus()}});
addEventListener('resize',()=>{if(innerWidth>1020)setMenu(false)});
$('#y').textContent=new Date().getFullYear();

/* ---------- En-tête et retour en haut (sans écouteur de défilement) ---------- */
const hdr=$('.site-header'),toTop=$('.totop');
(function(){
  if(!('IntersectionObserver' in window))return;
  const mk=(top,cb)=>{const s=document.createElement('div');s.setAttribute('aria-hidden','true');s.style.cssText=`position:absolute;top:${top}px;left:0;width:1px;height:1px;pointer-events:none`;document.body.appendChild(s);new IntersectionObserver(e=>cb(!e[0].isIntersecting)).observe(s)};
  document.body.style.position=document.body.style.position||'relative';
  mk(30,v=>hdr.classList.toggle('scrolled',v));
  if(toTop)mk(700,v=>toTop.classList.toggle('show',v));
})();
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
    if(el.classList.contains('badge')){el.textContent=open?'Ouvert':'Fermé';el.classList.add(open?'open':'closed')}
    else if(el.classList.contains('status')){el.lastElementChild.innerHTML=`<b>${msg.split(' · ')[0]}</b> · ${msg.split(' · ')[1]}`;el.classList.toggle('open',open)}
    else el.innerHTML=`<b>${msg.split(' · ')[0]}</b> · ${msg.split(' · ')[1]}`});
  $$('[data-status-dot]').forEach(el=>el.classList.toggle('open',open));
  $$(`.hours tr[data-day="${d}"],.ft-hours tr[data-day="${d}"]`).forEach(r=>r.classList.add('today'));
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

/* ---------- Hero : diaporama piloté par la barre animée ---------- */
(function(){
  const slides=$$('.slide'),hero=$('.hero2');if(!slides.length)return;
  const segs=$$('.seg-b'),count=$('.hero-ctrl .count b');
  let i=0,hoverPause=false,userPause=false,vis=true;
  const paused=()=>hero.classList.toggle('is-paused',hoverPause||userPause||!vis||document.hidden);
  const go=n=>{
    i=(n+slides.length)%slides.length;
    slides.forEach((s,k)=>{s.classList.toggle('active',k===i);s.setAttribute('aria-hidden',k!==i)});
    $$('.hbp').forEach(im=>im.classList.toggle('on',+im.dataset.i===i));
    count.textContent=i+1;
    segs.forEach((sg,k)=>{sg.classList.remove('run','done');sg.removeAttribute('aria-current');if(k<i)sg.classList.add('done')});
    const cur=segs[i];cur.setAttribute('aria-current','true');
    void cur.offsetWidth;                       // relance l'animation depuis zéro
    if(!reduce)cur.classList.add('run');else cur.classList.add('done');
  };
  // fin de l'animation de la barre active : on passe à la suite
  $('.seg').addEventListener('animationend',e=>{if(e.target.closest('.seg-b')===segs[i])go(i+1)});
  segs.forEach((sg,k)=>sg.addEventListener('click',()=>go(k)));
  $('.hero-ctrl .next').addEventListener('click',()=>go(i+1));
  $('.hero-ctrl .prev').addEventListener('click',()=>go(i-1));
  document.addEventListener('visibilitychange',paused);
  if('IntersectionObserver' in window)new IntersectionObserver(e=>{vis=e[e.length-1].isIntersecting;paused()}).observe(hero);
  // pause au survol des commandes et du bouton principal seulement (la bannière fait tout l'écran)
  $$('.hero-ctrl,.slide .pill').forEach(el=>{
    el.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hoverPause=true;paused()}});
    el.addEventListener('pointerleave',()=>{hoverPause=false;paused()});
  });
  hero.addEventListener('focusin',()=>{hoverPause=true;paused()});
  hero.addEventListener('focusout',()=>{hoverPause=false;paused()});
  const pp=$('.pp');
  pp.addEventListener('click',()=>{
    userPause=!userPause;pp.classList.toggle('on',userPause);pp.setAttribute('aria-pressed',userPause);
    pp.setAttribute('aria-label',userPause?'Reprendre le diaporama':'Mettre le diaporama en pause');paused();
  });
  go(0);
})();

/* ---------- Bannière de cookies / contenus tiers ---------- */
(function(){
  const KEY='gao-consent',TTL=1000*60*60*24*182;
  const read=()=>{try{const v=JSON.parse(localStorage.getItem(KEY));return v&&Date.now()-v.t<TTL?v:null}catch(e){return null}};
  const write=m=>{try{localStorage.setItem(KEY,JSON.stringify({maps:m,t:Date.now()}))}catch(e){}};
  const loadMap=box=>{if(box.classList.contains('loaded'))return;const fr=document.createElement('iframe');fr.className='map-frame';fr.title="Plan d'accès Grand Angle Optique";fr.loading='lazy';fr.referrerPolicy='no-referrer-when-downgrade';fr.src=box.dataset.src;box.replaceChildren(fr);box.classList.add('loaded')};
  const apply=m=>{if(m)$$('.map-consent').forEach(loadMap)};
  const el=document.createElement('div');el.className='cc';el.setAttribute('role','dialog');el.setAttribute('aria-labelledby','cc-t');el.setAttribute('aria-describedby','cc-d');
  el.innerHTML=`<div class="cc-body"><div class="cc-head"><span class="cc-ico" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M21 12.5A9 9 0 1 1 11.5 3a4 4 0 0 0 4.5 4.5 3.5 3.5 0 0 0 5 5z"/><circle cx="8.5" cy="11" r=".8"/><circle cx="12" cy="15.5" r=".8"/><circle cx="15.5" cy="12" r=".8"/></svg></span><h2 id="cc-t">Votre vie privée compte</h2></div>
    <p id="cc-d">Ce site n’utilise aucun traceur publicitaire ni de mesure d’audience. Seul le plan d’accès <strong>Google Maps</strong> peut transmettre des données à Google, et uniquement si vous l’autorisez. <a href="politique-de-confidentialite.html">En savoir plus</a></p>
    <div class="cc-opts"><div class="cc-opt"><span><strong>Essentiel</strong><small>Mémorise votre choix (6 mois). Aucun suivi.</small></span><span class="sw"><input type="checkbox" checked disabled aria-label="Essentiel (toujours actif)"><i></i></span></div>
    <div class="cc-opt"><span><strong>Contenus tiers</strong><small>Affiche la carte Google Maps directement.</small></span><span class="sw"><input type="checkbox" id="cc-maps" aria-label="Autoriser Google Maps"><i></i></span></div></div></div>
    <div class="cc-actions"><button type="button" class="cc-btn line" data-a="refuse">Tout refuser</button><button type="button" class="cc-btn fill cc-all" data-a="accept">Tout accepter</button><button type="button" class="cc-btn fill cc-save" data-a="save">Enregistrer</button><button type="button" class="cc-btn text" data-a="custom">Personnaliser</button></div>`;
  document.body.appendChild(el);
  const maps=$('#cc-maps',el),hide=()=>{el.classList.remove('show');setTimeout(()=>{el.hidden=true},600)};
  const open=custom=>{el.hidden=false;const c=read();maps.checked=!!(c&&c.maps);el.classList.toggle('custom',!!custom);$('[data-a=custom]',el).textContent=custom?'Retour':'Personnaliser';requestAnimationFrame(()=>el.classList.add('show'))};
  el.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a;
    if(a==='custom'){const on=!el.classList.contains('custom');el.classList.toggle('custom',on);b.textContent=on?'Retour':'Personnaliser';return}
    const m=a==='accept'?true:a==='refuse'?false:maps.checked;write(m);apply(m);hide()});
  addEventListener('keydown',e=>{if(e.key==='Escape'&&el.classList.contains('show')&&read())hide()});
  $$('[data-cookie-open]').forEach(b=>b.addEventListener('click',()=>open(true)));
  const c=read();if(c)apply(c.maps);else{el.hidden=true;setTimeout(()=>open(false),900)}
})();

/* ---------- Barre de navigation plus transparente tant que la bannière est derrière ---------- */
(function(){
  const hero=$('.hero2'),h=$('.site-header');
  if(!hero||!h||!('IntersectionObserver' in window))return;
  new IntersectionObserver(e=>h.classList.toggle('over-hero',e[e.length-1].isIntersecting),{rootMargin:'-76px 0px 0px 0px'}).observe(hero);
})();
