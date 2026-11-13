const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const nav=$('#nav'),btn=$('.menu-btn');
btn.addEventListener('click',()=>{const o=nav.classList.toggle('open');btn.setAttribute('aria-expanded',o)});
nav.addEventListener('click',()=>{nav.classList.remove('open');btn.setAttribute('aria-expanded',false)});
$('#y').textContent=new Date().getFullYear();
// progress bar + sticky header
const bar=document.createElement('div');bar.className='progress';document.body.prepend(bar);
const hdr=$('.site-header');
const onScroll=()=>{const h=document.documentElement,m=h.scrollHeight-h.clientHeight;bar.style.transform=`scaleX(${m>0?h.scrollTop/m:0})`;hdr.classList.toggle('scrolled',h.scrollTop>30)};
addEventListener('scroll',onScroll,{passive:true});onScroll();
// reveal on scroll
const targets=$$('.section h1,.section h2,.section>p,.cards article,.kf,.stat,.person,.steps li,.contact>*,.map,.hero-art');
targets.forEach((el,i)=>{el.classList.add('reveal');
  if(el.classList.contains('kf'))el.classList.add(el.classList.contains('rev')?'right':'left');
  el.style.setProperty('--d',(el.matches('.cards article,.stat,.steps li')?(i%5)*.08:0)+'s')});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);if(e.target.matches('.stat'))count($('b',e.target))}}),{threshold:.15});
targets.forEach(t=>io.observe(t));
if(reduce)targets.forEach(t=>t.classList.add('in'));
// counters
function count(b){const to=+b.dataset.count,pre=b.dataset.prefix||'',suf=b.dataset.suffix||'';
  const txt=v=>pre+v+suf;if(reduce||to===0){b.innerHTML=txt(to);return}
  const t0=performance.now(),d=1400;(function f(t){const p=Math.min((t-t0)/d,1),e=1-Math.pow(1-p,3);b.innerHTML=txt(Math.round(to*e));if(p<1)requestAnimationFrame(f)})(t0)}
$$('.stat').forEach(s=>{if(reduce)count($('b',s))});
// eye follows cursor + blinks
const iris=$('#iris'),blink=$('#blink');
if(iris&&!reduce){
  const art=$('.hero-art');
  const look=(x,y)=>{const r=art.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=x-cx,dy=y-cy,d=Math.hypot(dx,dy)||1,k=Math.min(d/6,1);iris.style.transform=`translate(${dx/d*26*k}px,${dy/d*14*k}px)`};
  addEventListener('pointermove',e=>look(e.clientX,e.clientY));
  (function b(){setTimeout(()=>{blink.setAttribute('height',240);blink.style.transition='height .09s';setTimeout(()=>{blink.setAttribute('height',0)},130);b()},2500+Math.random()*3500)})();
}

// Google Maps : chargée uniquement après consentement (clic)
$$('.map-consent').forEach(box=>{const b=$('button',box);b.addEventListener('click',()=>{
  const f=document.createElement('iframe');f.className='map-frame';f.title="Plan d'accès Grand Angle Optique";f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';f.src=box.dataset.src;
  box.replaceChildren(f);box.classList.add('loaded')})});
