const $=(selector,context=document)=>context.querySelector(selector);
const $$=(selector,context=document)=>[...context.querySelectorAll(selector)];

const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarsePointer=matchMedia('(pointer: coarse)').matches;
const phone='5547999753853';
let selectedCare='Cuidados faciais';

function whatsappLink(care=selectedCare){
  const message=`Olá! Conheci a Lípea pelo site e gostaria de conversar sobre ${care.toLowerCase()}. Podem me orientar sobre o melhor caminho para começar?`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function revealOnScroll(){
  if(reduceMotion){$$('.reveal').forEach(el=>el.classList.add('visible'));return}
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  },{threshold:.12,rootMargin:'0px 0px -5%'});

  $$('.reveal').forEach(el=>{
    el.style.setProperty('--delay',`${el.dataset.delay||0}ms`);
    observer.observe(el);
  });
}

function headerState(){
  const header=$('.site-header');
  const progress=$('.scroll-line span');
  const links=$$('.desktop-nav a');
  const sections=links.map(link=>$(link.getAttribute('href'))).filter(Boolean);

  const update=()=>{
    header.classList.toggle('scrolled',scrollY>28);
    const max=document.documentElement.scrollHeight-innerHeight;
    progress.style.transform=`scaleX(${max?scrollY/max:0})`;
  };

  addEventListener('scroll',update,{passive:true});
  update();

  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      links.forEach(link=>link.classList.toggle('active',link.getAttribute('href')===`#${entry.target.id}`));
    });
  },{rootMargin:'-35% 0px -55%'});

  sections.forEach(section=>observer.observe(section));
}

function mobileMenu(){
  const toggle=$('.menu-toggle');
  const menu=$('.mobile-menu');
  if(!toggle||!menu)return;

  const setOpen=open=>{
    toggle.classList.toggle('active',open);
    toggle.setAttribute('aria-expanded',String(open));
    toggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');
    menu.classList.toggle('open',open);
    menu.setAttribute('aria-hidden',String(!open));
    document.body.classList.toggle('menu-open',open);
  };

  toggle.addEventListener('click',()=>setOpen(!menu.classList.contains('open')));
  $$('a',menu).forEach(link=>link.addEventListener('click',()=>setOpen(false)));
  addEventListener('keydown',event=>{if(event.key==='Escape')setOpen(false)});
}

function careSelector(){
  const cards=$$('.care-card');
  const label=$('#careSelection');
  const button=$('#careWhatsapp');
  const mainButton=$('#mainWhatsapp');

  const select=card=>{
    cards.forEach(item=>{
      const active=item===card;
      item.classList.toggle('selected',active);
      item.setAttribute('aria-pressed',String(active));
    });
    selectedCare=card.dataset.care;
    label.textContent=selectedCare;
    button.href=whatsappLink();
    mainButton.href=whatsappLink();
    if(!reduceMotion){
      label.animate([{opacity:.15,transform:'translateY(5px)'},{opacity:1,transform:'none'}],{duration:360,easing:'cubic-bezier(.22,1,.36,1)'});
    }
  };

  cards.forEach(card=>{
    card.addEventListener('click',()=>select(card));
    card.addEventListener('keydown',event=>{
      if(event.key==='Enter'||event.key===' '){event.preventDefault();select(card)}
    });
  });

  button.href=whatsappLink();
  mainButton.href=whatsappLink();
}

function parallax(){
  if(reduceMotion||coarsePointer)return;
  const items=$$('.parallax-media');

  const update=()=>{
    const viewport=innerHeight;
    items.forEach(item=>{
      const image=$('img',item);
      if(!image)return;
      const rect=item.getBoundingClientRect();
      if(rect.bottom<0||rect.top>viewport)return;
      const center=rect.top+rect.height/2;
      const offset=(center-viewport/2)/viewport;
      image.style.transform=`translate3d(0,${offset*-26}px,0) scale(1.02)`;
    });
  };

  addEventListener('scroll',update,{passive:true});
  update();
}

function magnetic(){
  if(coarsePointer||reduceMotion)return;
  $$('.magnetic').forEach(element=>{
    element.addEventListener('pointermove',event=>{
      const rect=element.getBoundingClientRect();
      const x=event.clientX-(rect.left+rect.width/2);
      const y=event.clientY-(rect.top+rect.height/2);
      element.style.transform=`translate(${x*.07}px,${y*.07}px)`;
    });
    element.addEventListener('pointerleave',()=>{element.style.transform=''});
  });
}

function cursor(){
  if(coarsePointer||reduceMotion)return;
  const dot=$('.cursor');
  if(!dot)return;

  let x=-40,y=-40,targetX=-40,targetY=-40;
  const render=()=>{
    x+=(targetX-x)*.18;
    y+=(targetY-y)*.18;
    dot.style.left=`${x}px`;
    dot.style.top=`${y}px`;
    requestAnimationFrame(render);
  };

  addEventListener('pointermove',event=>{targetX=event.clientX;targetY=event.clientY});
  $$('a,button,.care-card').forEach(element=>{
    element.addEventListener('pointerenter',()=>dot.classList.add('big'));
    element.addEventListener('pointerleave',()=>dot.classList.remove('big'));
  });
  render();
}

function smoothAnchors(){
  $$('a[href^="#"]').forEach(link=>{
    link.addEventListener('click',event=>{
      const target=$(link.getAttribute('href'));
      if(!target)return;
      event.preventDefault();
      target.scrollIntoView({behavior:reduceMotion?'auto':'smooth',block:'start'});
    });
  });
}

revealOnScroll();
headerState();
mobileMenu();
careSelector();
parallax();
magnetic();
cursor();
smoothAnchors();
