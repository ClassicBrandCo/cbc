async function loadFragment(id,path){
  try{
    const res=await fetch(path);
    if(!res.ok)throw new Error('Not found');
    document.getElementById(id).innerHTML=await res.text();
  }catch(e){console.warn('Could not load',path,e);}
}
loadFragment('site-header','/components/header.html');
loadFragment('site-footer','/components/footer.html');

window.addEventListener('click',e=>{
  if(e.target.closest('#mobile-menu-toggle')){
    const menu=document.getElementById('mobile-menu');
    if(menu)menu.classList.toggle('hidden');
  }
});

document.addEventListener('click',e=>{
  const a=e.target.closest('a[href^="#"]');
  if(a){
    e.preventDefault();
    const el=document.querySelector(a.getAttribute('href'));
    if(el)el.scrollIntoView({behavior:'smooth',block:'start'});
  }
});

window.addEventListener('load',()=>{
  const y=document.getElementById('year');
  if(y)y.textContent=new Date().getFullYear();
});