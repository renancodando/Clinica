const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
const state={interest:'Pele / cuidados faciais',days:[],time:'pela manhã',note:''};

function reveals(){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.1});$$('.reveal').forEach(el=>{el.style.setProperty('--delay',`${el.dataset.delay||0}ms`);io.observe(el)})}

function progress(){const bar=$('.scroll-progress span');const update=()=>{const max=document.documentElement.scrollHeight-innerHeight;bar.style.transform=`scaleX(${max?scrollY/max:0})`};addEventListener('scroll',update,{passive:true});update()}

function magnetic(){if(matchMedia('(pointer:coarse)').matches)return;$$('.magnetic').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=e.clientX-(r.left+r.width/2),y=e.clientY-(r.top+r.height/2);el.style.transform=`translate(${x*.07}px,${y*.07}px)`});el.addEventListener('pointerleave',()=>el.style.transform='')})}

function heroParallax(){const win=$('#skinWindow');if(!win||matchMedia('(pointer:coarse)').matches)return;win.addEventListener('pointermove',e=>{const r=win.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;$('.face-line',win).style.transform=`translate(${x*8}px,${y*8}px)`;$$('.scan',win).forEach((el,i)=>el.style.transform=`translateX(${x*(i+1)*6}px)`)});win.addEventListener('pointerleave',()=>{$('.face-line',win).style.transform='';$$('.scan',win).forEach(el=>el.style.transform='')})}

const carePaths={
  skin:'M14 191C86 183 92 95 163 106c72 11 73 104 150 89 70-14 83-117 166-101 51 10 71 53 108 69',
  body:'M13 128c78-48 136-55 194-11 61 46 104 53 164 14 55-36 110-31 216 34',
  wellness:'M8 158c97-9 134-86 213-82 91 5 93 103 186 93 75-8 107-71 183-68',
  guide:'M12 180c55-76 130-86 196-32 62 51 132 58 186 0 48-51 112-59 192-15'
};

function careSelector(){const detail=$('#careDetail'),title=$('#careTitle'),text=$('#careText'),index=$('#careIndex'),path=$('#carePath');$$('.care-item').forEach(btn=>btn.addEventListener('click',()=>{$$('.care-item').forEach(b=>b.classList.remove('active'));btn.classList.add('active');detail.dataset.mode=btn.dataset.mode;index.textContent=btn.dataset.index;title.textContent=btn.dataset.title;text.textContent=btn.dataset.copy;state.interest=btn.dataset.message;path.setAttribute('d',carePaths[btn.dataset.mode]);path.animate([{strokeDashoffset:600,opacity:.2},{strokeDashoffset:0,opacity:1}],{duration:650,easing:'cubic-bezier(.22,1,.36,1)'});[title,text].forEach(el=>el.animate([{opacity:.2,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:380,easing:'cubic-bezier(.22,1,.36,1)'}));syncInterestChip(btn.dataset.message);updateMessage()}))}

function syncInterestChip(value){const wrap=$('#interestOptions');if(!wrap)return;$$('.chip',wrap).forEach(c=>c.classList.toggle('selected',c.dataset.value===value))}

function singleSelect(container,key){$$('.chip',container).forEach(chip=>chip.addEventListener('click',()=>{$$('.chip',container).forEach(c=>c.classList.remove('selected'));chip.classList.add('selected');state[key]=chip.dataset.value;updateMessage()}))}
function multiSelect(container){$$('.chip',container).forEach(chip=>chip.addEventListener('click',()=>{chip.classList.toggle('selected');state.days=$$('.chip.selected',container).map(c=>c.dataset.value);updateMessage()}))}

function updateMessage(){const days=state.days.length?state.days.join(', '):'a combinar';const note=state.note.trim()?`\nTambém queria comentar: ${state.note.trim()}`:'';const msg=`Olá! Vi o site da Lípea e gostaria de conversar sobre um atendimento.\n\nMeu interesse hoje é: ${state.interest}.\nOs dias que costumam funcionar para mim: ${days}.\nQuanto ao horário, prefiro ${state.time}.${note}\n\nVocês conseguem me orientar sobre o melhor caminho para começar?`;$('#messagePreview').textContent=msg;$('#whatsappBtn').href=`https://wa.me/5547999753853?text=${encodeURIComponent(msg)}`}

function builder(){singleSelect($('#interestOptions'),'interest');singleSelect($('#timeOptions'),'time');multiSelect($('#dayOptions'));const note=$('#note');note.addEventListener('input',()=>{state.note=note.value;$('#noteCount').textContent=note.value.length;updateMessage()});updateMessage()}

function status(){const el=$('#statusText');const fmt=new Intl.DateTimeFormat('en-US',{timeZone:'America/Sao_Paulo',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false});const p=Object.fromEntries(fmt.formatToParts(new Date()).map(v=>[v.type,v.value]));const h=Number(p.hour)+Number(p.minute)/60;const open=(['Mon','Tue','Wed','Thu','Fri'].includes(p.weekday)&&h>=8&&h<20)||(p.weekday==='Sat'&&h>=8&&h<11);el.textContent=open?'Aberto agora em Gaspar':'Atendimento em Gaspar'}

function activeNav(){const links=$$('.header nav a');const sections=links.map(a=>$(a.getAttribute('href'))).filter(Boolean);const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${e.target.id}`))}}),{rootMargin:'-30% 0px -55%'});sections.forEach(s=>io.observe(s))}

reveals();progress();magnetic();heroParallax();careSelector();builder();status();activeNav();
