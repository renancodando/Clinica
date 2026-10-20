const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
const state={interest:'Pele / cuidados faciais',days:[],time:'pela manhã',note:''};
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

function splitText(){
  $$('.split').forEach(el=>{
    if(el.dataset.split)return;
    el.dataset.split='1';
    const nodes=[...el.childNodes],frag=document.createDocumentFragment();
    nodes.forEach(node=>{
      if(node.nodeType===3){
        node.textContent.split(/(\s+)/).forEach(part=>{
          if(/^\s+$/.test(part)){frag.append(document.createTextNode(part));return}
          if(!part)return;
          const word=document.createElement('span'),inner=document.createElement('span');
          word.className='word';inner.textContent=part;word.append(inner);frag.append(word);
        });
      }else frag.append(node.cloneNode(true));
    });
    el.replaceChildren(frag);
  });
}

function reveals(){
  const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('visible');io.unobserve(entry.target)}
  }),{threshold:.12});
  $$('.reveal,.split').forEach((el,i)=>{el.style.setProperty('--delay',`${Math.min((i%4)*55,165)}ms`);io.observe(el)});
}

function cursor(){
  if(matchMedia('(pointer:coarse)').matches)return;
  const c=$('.cursor'),glow=$('.pointer-glow');let x=innerWidth/2,y=innerHeight/2,cx=x,cy=y;
  addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY;glow.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%)`});
  const loop=()=>{cx+=(x-cx)*.18;cy+=(y-cy)*.18;c.style.transform=`translate(${cx}px,${cy}px) translate(-50%,-50%)`;requestAnimationFrame(loop)};loop();
  $$('a,button,textarea').forEach(el=>{el.addEventListener('mouseenter',()=>c.classList.add('hover'));el.addEventListener('mouseleave',()=>c.classList.remove('hover'))});
}

function magnetic(){
  if(matchMedia('(pointer:coarse)').matches)return;
  $$('.magnetic').forEach(el=>{
    el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2;el.style.transform=`translate(${dx*.08}px,${dy*.08}px)`});
    el.addEventListener('pointerleave',()=>el.style.transform='');
  });
}

function heroParallax(){
  const scene=$('#heroScene');if(!scene||matchMedia('(pointer:coarse)').matches||reduce)return;
  addEventListener('pointermove',e=>{const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;scene.style.transform=`perspective(1000px) rotateX(${-y*4}deg) rotateY(${x*6}deg) translate3d(${x*8}px,${y*8}px,0)`});
}

function scrollUI(){
  const bar=$('.scroll-progress span'),header=$('.header');
  const update=()=>{const h=document.documentElement.scrollHeight-innerHeight;bar.style.transform=`scaleX(${h?scrollY/h:0})`;header.classList.toggle('scrolled',scrollY>40)};
  addEventListener('scroll',update,{passive:true});update();
}

function manifestoFlow(){
  const cards=$$('.flow-card');if(!cards.length)return;
  const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){cards.forEach(c=>c.classList.remove('active'));entry.target.classList.add('active')}}),{threshold:.58});
  cards.forEach(c=>io.observe(c));cards[0].classList.add('active');
}

function care(){
  const stage=$('#careStage'),title=$('.stage-copy h3',stage),copy=$('.stage-copy p',stage),num=$('.stage-number',stage),art=$('.stage-art',stage);
  const interests={pele:'Pele / cuidados faciais',corpo:'Cuidados corporais','bem-estar':'Bem-estar / autocuidado',orientacao:'Ainda não sei e gostaria de orientação'};
  const colors={pele:['#b8c5b5','#7f9b85'],corpo:['#d9c4a2','#c98c70'],'bem-estar':['#d9c4a2','#b8c5b5'],orientacao:['#b8c5b5','#a8b0aa']};
  $$('.care-tab').forEach(btn=>btn.addEventListener('click',()=>{
    $$('.care-tab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
    [title,copy,num].forEach(el=>el.animate([{opacity:.2,transform:'translateY(12px)'},{opacity:1,transform:'none'}],{duration:480,easing:'cubic-bezier(.22,1,.36,1)'}));
    title.textContent=btn.dataset.title;copy.textContent=btn.dataset.copy;num.textContent=btn.dataset.index;
    const [a,b]=colors[btn.dataset.care]||colors.pele;
    art.animate([{filter:'saturate(.8)',transform:'scale(.96)'},{filter:'saturate(1)',transform:'scale(1)'}],{duration:520,easing:'cubic-bezier(.22,1,.36,1)'});
    art.querySelector('span').style.background=`radial-gradient(circle at 34% 30%,rgba(255,255,255,.92),${a}88 48%,${b}26 70%,transparent 72%)`;
    state.interest=interests[btn.dataset.care];
    const matching=$$('#interestChips .chip').find(c=>c.dataset.value===state.interest);
    if(matching){$$('#interestChips .chip').forEach(c=>c.classList.remove('selected'));matching.classList.add('selected')}
    updateMessage();
  }));
}

function single(container,key){
  $$('.chip',container).forEach(ch=>ch.addEventListener('click',()=>{$$('.chip',container).forEach(c=>c.classList.remove('selected'));ch.classList.add('selected');state[key]=ch.dataset.value;updateMessage()}));
}
function multi(container){
  $$('.chip',container).forEach(ch=>ch.addEventListener('click',()=>{ch.classList.toggle('selected');state.days=$$('.chip.selected',container).map(c=>c.dataset.value);updateMessage()}));
}
function updateMessage(){
  const days=state.days.length?state.days.join(', '):'a combinar';
  const extra=state.note.trim()?`\nTambém queria comentar: ${state.note.trim()}`:'';
  const msg=`Olá! Vi o site da Lípea e gostaria de conversar sobre um atendimento.\n\nMeu interesse hoje é: ${state.interest}.\nOs dias que costumam funcionar para mim: ${days}.\nQuanto ao horário, prefiro ${state.time}.${extra}\n\nVocês conseguem me orientar sobre o melhor caminho para começar?`;
  $('#messagePreview').textContent=msg;$('#whatsappBtn').href=`https://wa.me/5547999753853?text=${encodeURIComponent(msg)}`;
}
function builder(){
  single($('#interestChips'),'interest');single($('#timeChips'),'time');multi($('#dayChips'));
  const note=$('#note');note.addEventListener('input',()=>{state.note=note.value;$('#noteCount').textContent=note.value.length;updateMessage()});updateMessage();
}

function status(){
  const out=$('#heroStatus');
  const fmt=new Intl.DateTimeFormat('en-US',{timeZone:'America/Sao_Paulo',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false});
  const parts=Object.fromEntries(fmt.formatToParts(new Date()).map(x=>[x.type,x.value]));
  const h=Number(parts.hour)+Number(parts.minute)/60;
  const open=(['Mon','Tue','Wed','Thu','Fri'].includes(parts.weekday)&&h>=8&&h<20)||(parts.weekday==='Sat'&&h>=8&&h<11);
  out.textContent=open?'aberto agora':'atendimento em Gaspar';
}

function canvas(){
  const c=$('#ambient'),ctx=c.getContext('2d');let w,h,t=0,dpr=Math.min(devicePixelRatio,2);
  const blobs=[{x:.13,y:.13,r:.25,c:'127,155,133',a:.12,s:.75},{x:.84,y:.24,r:.21,c:'201,140,112',a:.075,s:.95},{x:.66,y:.79,r:.3,c:'217,196,162',a:.11,s:.55},{x:.25,y:.72,r:.18,c:'184,197,181',a:.08,s:.7}];
  const resize=()=>{w=innerWidth;h=innerHeight;c.width=w*dpr;c.height=h*dpr;c.style.width=w+'px';c.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0)};resize();addEventListener('resize',resize);
  const draw=()=>{t+=.0025;ctx.clearRect(0,0,w,h);blobs.forEach((b,i)=>{const x=(b.x+Math.sin(t*b.s+i)*.045)*w,y=(b.y+Math.cos(t*b.s*.8+i)*.04)*h,r=b.r*Math.min(w,h)*1.9,g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${b.c},${b.a})`);g.addColorStop(1,`rgba(${b.c},0)`);ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2)});requestAnimationFrame(draw)};
  if(!reduce)draw();
}

splitText();reveals();cursor();magnetic();heroParallax();scrollUI();manifestoFlow();care();builder();status();canvas();