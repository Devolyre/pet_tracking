'use strict';
(()=>{
 const dialog=document.getElementById('spawn-dialog'),svg=document.getElementById('spawn-svg');
 let route=null,selected=0,view=[0,0,1024,1024],drag=null;
 const active=()=>route.pets[selected],map=()=>SPAWN_MAPS[active().spawn.map];
 const entries=()=>map().points[active().spawn.mob].coords;
 function renderMarkers(){
  view=boundMapView(view);
  const r=view[2]/145;
  const circle=(p,on)=>`<circle cx="${p[0]}" cy="${p[1]}" r="${on?r:r*.65}" fill="${on?'#ffe192':'#c3b3e5'}" stroke="${on?'#37230d':'#281f3e'}" stroke-width="${r*.27}" opacity="${on?1:.4}"><title>${esc(on?gn(map().points[active().spawn.mob].name):tx('Другой моб маршрута'))}${p[2]?(lang==='ru'?' · ур. ':' · Lv ')+p[2]:''}</title></circle>`;
  const other=new Map();route.pets.forEach(p=>{if(p.spawn&&p.spawn.map===active().spawn.map&&p.spawn.mob!==active().spawn.mob){const item=map().points[p.spawn.mob];if(item)other.set(p.spawn.mob,item.coords);}});
  document.getElementById('spawn-other').innerHTML=[...other.values()].flat().map(p=>circle(p,false)).join('');
  document.getElementById('spawn-selected').innerHTML=entries().map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="${r*1.9}" fill="#ffc954" opacity=".18"/>`+circle(p,true)).join('');
  svg.setAttribute('viewBox',view.join(' '));
 }
 function fit(){const coords=entries(),xs=coords.map(p=>p[0]),ys=coords.map(p=>p[1]);const left=Math.min(...xs),right=Math.max(...xs),top=Math.min(...ys),bottom=Math.max(...ys);const size=Math.min(1024,Math.max(65,(right-left)*1.4,(bottom-top)*1.4));view=[(left+right-size)/2,(top+bottom-size)/2,size,size];renderMarkers();}
 function select(i){selected=i;const p=active(),m=map();document.getElementById('spawn-title').innerHTML=petImage(p)+'<span>'+esc(gn(p.name,'pet'))+'</span>';document.getElementById('spawn-subtitle').textContent=tx(m.title)+' · '+gn(m.points[p.spawn.mob].name);document.getElementById('spawn-count').textContent=entries().length+(lang==='ru'?' точек появления':' spawn points');svg.setAttribute('aria-label',tx('Спавны')+' '+gn(p.name,'pet')+' — '+tx(m.title));
  document.getElementById('spawn-list').innerHTML=route.pets.map((item,j)=>`<button data-spawn-select="${j}" ${!item.spawn?'disabled':''} class="${j===selected?'selected':''}" aria-pressed="${j===selected}">${petImage(item)}<span>${esc(gn(item.name))}<small>${tx(item.spawn?'⌖ Показать спавны':'Нет подтверждённых координат')}</small></span></button>`).join('');
  let tiles='';for(let x=0;x<4;x++)for(let y=0;y<4;y++)tiles+=`<image href="spawns/${p.spawn.map}/${x}_${y}.webp" x="${x*256}" y="${y*256}" width="256" height="256"/>`;
  document.getElementById('spawn-tiles').innerHTML=tiles;document.getElementById('spawn-source').href='https://aion2tierlist.com/map'+(p.spawn.map==='verteron'?'':'/'+p.spawn.map);fit();
 }
 document.addEventListener('languagechange',()=>{if(route&&dialog.open)select(selected);});
 document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.spawnRoute){const found=ROUTES.find(r=>r.id===b.dataset.spawnRoute),i=Number(b.dataset.spawnIndex);if(!found?.pets[i]?.spawn)return;route=found;select(i);dialog.showModal();}else if(b.hasAttribute('data-spawn-select')){const i=Number(b.dataset.spawnSelect);if(route?.pets[i]?.spawn)select(i);}});
 document.getElementById('close-spawns').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
 document.getElementById('spawn-fit').onclick=fit;document.getElementById('spawn-world').onclick=()=>{view=[0,0,1024,1024];renderMarkers();};
 function zoom(f,center){const size=Math.max(20,Math.min(1024,view[2]*f)),c=center||[view[0]+view[2]/2,view[1]+view[3]/2],q=size/view[2];view=[c[0]-(c[0]-view[0])*q,c[1]-(c[1]-view[1])*q,size,size];renderMarkers();}
 document.getElementById('spawn-plus').onclick=()=>zoom(.7);document.getElementById('spawn-minus').onclick=()=>zoom(1/.7);
 function point(e){const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;const out=p.matrixTransform(svg.getScreenCTM().inverse());return [out.x,out.y];}
 svg.addEventListener('wheel',e=>{e.preventDefault();zoom(e.deltaY>0?1.18:1/1.18,point(e));},{passive:false});
 svg.addEventListener('pointerdown',e=>{if(e.button!==0&&e.pointerType==='mouse')return;svg.setPointerCapture(e.pointerId);drag={id:e.pointerId,point:point(e)};svg.classList.add('dragging');});
 svg.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const p=point(e);view[0]+=drag.point[0]-p[0];view[1]+=drag.point[1]-p[1];view=boundMapView(view);svg.setAttribute('viewBox',view.join(' '));drag.point=point(e);});
 function stop(){drag=null;svg.classList.remove('dragging');}svg.addEventListener('pointerup',stop);svg.addEventListener('pointercancel',stop);dialog.addEventListener('close',stop);
})();
