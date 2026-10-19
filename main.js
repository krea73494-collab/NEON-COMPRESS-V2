
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';
(()=>{'use strict';
const $=id=>document.getElementById(id);let file=null,url=null,progress=0,outputUrl=null,outputBlob=null,ffmpeg=null,busy=false,cancelRequested=false;const screens=['uploadScreen','processingScreen','completeScreen'];
// Lightweight CSS sparkles surrounding the processing percentage ring.
const ringSparks=$('ringSparks');
for(let i=0;i<26;i++){
 const dot=document.createElement('i');
 dot.style.setProperty('--angle',(i*360/26)+'deg');
 dot.style.setProperty('--radius',(-89-(i%4)*5)+'px');
 dot.style.setProperty('--sz',(2+i%4)+'px');
 dot.style.setProperty('--spark',i%3===0?'#ffffff':i%3===1?'#ffcf87':'#ff526b');
 dot.style.setProperty('--twinkle',(0.55+(i%6)*0.18)+'s');
 dot.style.setProperty('--delay',(-i*.12)+'s');
 ringSparks.appendChild(dot);
}

function page(n){screens.forEach((id,i)=>$(id).classList.toggle('hidden',i!==n));document.querySelectorAll('.step').forEach((el,i)=>el.classList.toggle('active',i<=n));window.scrollTo({top:0,behavior:'smooth'});}
 function setFile(f){if(!f)return;if(!/\.mp4$/i.test(f.name)){alert('MAX QUALITY requires an MP4 file.');return;}if(busy)return;if(url)URL.revokeObjectURL(url);if(outputUrl)URL.revokeObjectURL(outputUrl);outputUrl=null;outputBlob=null;file=f;url=URL.createObjectURL(f);$('fileName').textContent=f.name;$('fileSize').textContent=(f.size/1048576).toFixed(1)+' MB';$('uploadPreview').src=url;$('fileBox').style.display='block';$('start').disabled=false;}
 function setProgress(n){progress=Math.max(0,Math.min(100,Math.round(n)));$('percentage').textContent=progress+'%';$('ring').style.setProperty('--progress',progress+'%');}
 function reset(){if(busy)return;$('uploadPreview').pause();$('completePreview').pause();$('uploadPreview').removeAttribute('src');$('completePreview').removeAttribute('src');$('uploadPreview').load();$('completePreview').load();if(url)URL.revokeObjectURL(url);if(outputUrl)URL.revokeObjectURL(outputUrl);url=null;outputUrl=null;outputBlob=null;file=null;$('videoInput').value='';$('fileBox').style.display='none';$('start').disabled=true;setProgress(0);page(0);}
 $('continue').addEventListener('click',()=>{$('welcome').classList.add('hidden');sessionStorage.setItem('neon-welcomed','1');});if(sessionStorage.getItem('neon-welcomed')==='1')$('welcome').classList.add('hidden');
 $('videoInput').addEventListener('change',e=>setFile(e.target.files[0]));$('replace').addEventListener('click',()=>$('videoInput').click());
 const drop=$('drop');drop.addEventListener('dragover',e=>{e.preventDefault();drop.classList.add('drag');});drop.addEventListener('dragleave',()=>drop.classList.remove('drag'));drop.addEventListener('drop',e=>{e.preventDefault();drop.classList.remove('drag');setFile(e.dataTransfer.files[0]);});
 $('unlimited').addEventListener('click',()=>alert('Unlimited access is coming soon. Daily limit shown is illustrative.'));
 $('start').addEventListener('click',async()=>{
  if(!file||busy)return;busy=true;cancelRequested=false;setProgress(0);$('processingName').textContent=file.name;page(1);$('start').disabled=true;
  const inputName='neon-input-'+Date.now()+'.mp4',outputName='neon-output-'+Date.now()+'.mp4';
  let progressHandler=null;
  try{
   // Exact V1 MAX QUALITY engine: FFmpeg wrapper, core v0.12.10, and stream copy.
   if(!ffmpeg)ffmpeg=new FFmpeg();
   if(!ffmpeg.loaded){
     $('processingName').textContent='Loading V1 FFmpeg engine…';
     const baseUrl='https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm';
     await ffmpeg.load({
       coreURL:await toBlobURL(`${baseUrl}/ffmpeg-core.js`,'text/javascript'),
       wasmURL:await toBlobURL(`${baseUrl}/ffmpeg-core.wasm`,'application/wasm'),
     });
   }
   if(cancelRequested)throw new Error('Cancelled');
   progressHandler=({progress:p})=>{if(Number.isFinite(p))setProgress(Math.max(4,Math.min(96,p*92)));};ffmpeg.on('progress',progressHandler);
   $('processingName').textContent='Reading '+file.name;
   const bytes=new Uint8Array(await file.arrayBuffer());if(cancelRequested)throw new Error('Cancelled');
   await ffmpeg.writeFile(inputName,bytes);setProgress(4);
   $('processingName').textContent='Optimizing '+file.name;
   // Stream-copy MP4 remux (no re-encoding). This does not increase visual quality.
   const code=await ffmpeg.exec(['-i',inputName,'-map','0:v:0','-map','0:a?','-c','copy','-movflags','+faststart','-y',outputName]);
   if(cancelRequested)throw new Error('Cancelled');if(code!==0)throw new Error('FFmpeg exited with code '+code);
   const data=await ffmpeg.readFile(outputName);if(!(data instanceof Uint8Array)||!data.length)throw new Error('No output video was produced');
   outputBlob=new Blob([new Uint8Array(data)],{type:'video/mp4'});outputUrl=URL.createObjectURL(outputBlob);$('completePreview').src=outputUrl;setProgress(100);page(2);
  }catch(err){if(!cancelRequested)alert('Video processing failed: '+(err?.message||String(err))+'\nCheck your internet connection and browser memory.');page(0);}
  finally{if(ffmpeg&&progressHandler)ffmpeg.off('progress',progressHandler);if(ffmpeg){for(const name of [inputName,outputName]){try{await ffmpeg.deleteFile(name)}catch{}}}busy=false;$('start').disabled=!file;}
 });
 $('download').addEventListener('click',()=>{if(!outputBlob||!outputUrl)return;const a=document.createElement('a');a.href=outputUrl;a.download=(file?.name||'video.mp4').replace(/\.mp4$/i,'')+'-neon-max-quality.mp4';document.body.appendChild(a);a.click();a.remove();});
 $('cancel').addEventListener('click',async()=>{if(!busy){page(0);return;}cancelRequested=true;$('processingName').textContent='Cancelling…';try{if(ffmpeg)await ffmpeg.terminate()}catch{}ffmpeg=null;});
 $('again').addEventListener('click',reset);window.addEventListener('beforeunload',()=>{if(url)URL.revokeObjectURL(url);if(outputUrl)URL.revokeObjectURL(outputUrl);});
// Decorative sky lanterns: animation only, no effect on video or controls.
const lanternSky=$('lanternSky');
for(let i=0;i<13;i++){
  const el=document.createElement('span');el.className='sky-lantern';
  el.style.setProperty('--x',(3+(i*37)%94)+'%');
  el.style.setProperty('--size',(15+(i*7)%17)+'px');
  el.style.setProperty('--duration',(14+(i*3)%13)+'s');
  el.style.setProperty('--delay',(-i*2.1)+'s');
  lanternSky.appendChild(el);
}
const canvas=$('sky'),ctx=canvas.getContext('2d');if(!ctx)return;let particles=[],rockets=[],w=0,h=0,last=0;const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function resize(){w=canvas.width=innerWidth*devicePixelRatio;h=canvas.height=innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);w=innerWidth;h=innerHeight;}resize();addEventListener('resize',resize);
function burst(x,y,white=false){
  const amount=white?30:34;
  for(let i=0;i<amount;i++){
    const a=Math.random()*Math.PI*2,s=(white?1.2:1.6)+Math.random()*(white?3.5:2.9);
    particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,size:white?1.1+Math.random()*2.2:1+Math.random()*1.7,color:white?'255,255,255':Math.random()>.5?'255,64,89':'255,220,225'});
  }
  if(particles.length>360)particles.splice(0,particles.length-360);
}
function launchHeroFireworks(){
  const hero=document.querySelector('.hero');if(!hero)return;
  const r=hero.getBoundingClientRect();if(r.bottom<0||r.top>h)return;
  const x=r.left+r.width*([.08,.18,.32,.68,.82,.92][Math.floor(Math.random()*6)]);
  const targetY=Math.max(35,r.top+Math.random()*Math.min(110,r.height*.65));
  rockets.push({x,y:Math.min(h-10,r.bottom+65),targetY,speed:4.2+Math.random()*2,trail:[]});
}
function draw(t){
  ctx.clearRect(0,0,w,h);
  if(!reduced&&t-last>320){launchHeroFireworks();launchHeroFireworks();if(Math.random()>.45)launchHeroFireworks();last=t;}
  rockets=rockets.filter(r=>{
    r.trail.push({x:r.x,y:r.y});if(r.trail.length>12)r.trail.shift();
    r.y-=r.speed;
    r.trail.forEach((p,i)=>{ctx.beginPath();ctx.fillStyle=`rgba(255,${i%2?255:75},${i%2?255:100},${(i+1)/r.trail.length*.75})`;ctx.arc(p.x,p.y,1.5,0,Math.PI*2);ctx.fill();});
    if(r.y<=r.targetY){burst(r.x,r.y);return false;}return true;
  });
  particles=particles.filter(p=>p.life>0);
  for(const p of particles){p.x+=p.vx;p.y+=p.vy;p.vy+=.025;p.life-=.018;ctx.beginPath();ctx.fillStyle=`rgba(${p.color},${Math.max(0,p.life)})`;ctx.shadowBlur=12;ctx.shadowColor=`rgba(${p.color},.85)`;ctx.arc(p.x,p.y,Math.max(.2,p.size*p.life),0,Math.PI*2);ctx.fill();}
  ctx.shadowBlur=0;requestAnimationFrame(draw);
}
if(!reduced){
  requestAnimationFrame(draw);
  document.addEventListener('pointerdown',e=>{burst(e.clientX,e.clientY,true);burst(e.clientX,e.clientY,true);},{passive:true,capture:true});
}

})();
