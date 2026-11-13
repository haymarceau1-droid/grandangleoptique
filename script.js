const nav=document.getElementById('nav'),btn=document.querySelector('.menu-btn');
btn.addEventListener('click',()=>{const o=nav.classList.toggle('open');btn.setAttribute('aria-expanded',o)});
nav.addEventListener('click',()=>{nav.classList.remove('open');btn.setAttribute('aria-expanded',false)});
document.getElementById('y').textContent=new Date().getFullYear();
