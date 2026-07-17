/* Mejoras visuales: porcentajes y organización de la vista “Más info”. */

/* Porcentajes en los gráficos horizontales, conservando cada gráfico en su pestaña actual. */
renderCities=function(){
 const rs=filtered(),map=new Map();rs.forEach(d=>{if(!map.has(d.city))map.set(d.city,[]);map.get(d.city).push(d)});
 const items=[...map].map(([city,list])=>({city,schools:list.length,people:list.reduce((sum,d)=>sum+(Number(d.people)||0),0)}));
 const totalSchools=Math.max(1,rs.length),totalPeople=Math.max(1,rs.reduce((sum,d)=>sum+(Number(d.people)||0),0)),mode=view==='foundations'?'schools':metricMode;
 const pct=(value,total)=>((value/total)*100).toFixed(1).replace('.',',')+'%';
 if(mode==='both'){
  items.sort((a,b)=>b.schools-a.schools);const ms=Math.max(1,...items.map(x=>x.schools)),mp=Math.max(1,...items.map(x=>x.people));
  $('#cityChart').innerHTML=items.length?'<p class="scope-note">Base: '+fmt(rs.length)+' escuelas analizadas · '+fmt(totalPeople)+' alumnos conectados</p><div class="city-dual-legend"><span><i></i>Escuelas</span><span><i></i>Alumnos</span></div>'+items.map(x=>'<div class="city-dual-row"><strong>'+esc(x.city)+'</strong><div class="city-dual-series"><div><small>Escuelas</small><div class="track"><i style="width:'+x.schools/ms*100+'%"></i></div><b><span>'+fmt(x.schools)+'</span><em>'+pct(x.schools,totalSchools)+'</em></b></div><div><small>Alumnos</small><div class="track people"><i style="width:'+x.people/mp*100+'%"></i></div><b><span>'+fmt(x.people)+'</span><em>'+pct(x.people,totalPeople)+'</em></b></div></div></div>').join(''):'<p class="empty">Sin resultados.</p>';return
 }
 const key=mode==='people'?'people':'schools',total=mode==='people'?totalPeople:totalSchools,arr=items.sort((a,b)=>b[key]-a[key]),max=Math.max(1,...arr.map(x=>x[key]));
 const baseLabel=mode==='people'?'Base: '+fmt(totalPeople)+' alumnos conectados':view==='foundations'?'Base: '+fmt(rs.length)+' fundaciones registradas':'Base: '+fmt(rs.length)+' escuelas analizadas';
 $('#cityChart').innerHTML=arr.length?'<p class="scope-note">'+baseLabel+'</p>'+arr.map(x=>'<div class="bar-row"><span>'+esc(x.city)+'</span><div class="track"><i style="width:'+x[key]/max*100+'%"></i></div><b><span>'+fmt(x[key])+'</span><em>'+pct(x[key],total)+'</em></b></div>').join(''):'<p class="empty">Sin resultados.</p>';
};

renderSizes=function(){
 const panel=$('.school-size');
 if(currentOrg()==='foundation'){panel.style.display='none';return}
 panel.style.display='block';
 const rs=filtered().filter(d=>d.org==='education'&&Number(d.people)>0);
 const order=['0–200','201–500','501–1.000','1.001–1.500','1.501–2.000','Más de 2.000'],counts=Object.fromEntries(order.map(x=>[x,0]));
 rs.forEach(d=>counts[sizeBucket(d)]++);
 const max=Math.max(1,...Object.values(counts)),total=Math.max(1,rs.length);
 const percentage=value=>((value/total)*100).toFixed(1).replace('.',',')+'%';
 $('#sizeChart').innerHTML='<p class="scope-note">Base: '+fmt(rs.length)+' escuelas analizadas</p>'+order.map(k=>'<div class="size-row"><span>'+k+'</span><div class="track"><i style="width:'+counts[k]/max*100+'%"></i></div><b><span>'+counts[k]+'</span><em>'+percentage(counts[k])+'</em></b></div>').join('');
 const avg=rs.length?Math.round(rs.reduce((a,d)=>a+d.people,0)/rs.length):0,ordered=rs.slice().sort((a,b)=>a.people-b.people),smallest=ordered[0],largest=ordered[ordered.length-1];
 $('#sizeSummary').innerHTML='<article><span>Promedio por escuela</span><b>'+fmt(avg)+'</b></article><article><span>Escuelas analizadas</span><b>'+fmt(rs.length)+'</b></article><article><span>Escuela con menos alumnos</span><b>'+(smallest?fmt(smallest.people)+' alumnos':'0 alumnos')+'</b><small>'+(smallest?esc(smallest.institution)+(clean(smallest.site)?' · '+esc(smallest.site):''):'Sin resultados')+'</small></article><article><span>Escuela con más alumnos</span><b>'+(largest?fmt(largest.people)+' alumnos':'0 alumnos')+'</b><small>'+(largest?esc(largest.institution)+(clean(largest.site)?' · '+esc(largest.site):''):'Sin resultados')+'</small></article>';
};

renderMainMoreInfo=function(){
 const isMore=view==='more',panel=$('#moreInfoView');
 panel.hidden=!isMore;
 const dashboardSections=['#kpis','.charts','.connectivity','.school-size','.records'];
 dashboardSections.forEach(selector=>{const el=$(selector);if(el)el.hidden=isMore});
 if(!isMore)return false;

 /* “Más info” consolida escuelas y fundaciones respetando los filtros activos. */
 const allRs=filtered();
 const rs=allRs.filter(d=>d.org==='education');
 const foundationRs=allRs.filter(d=>d.org==='foundation');
 const total=rs.length;
 const pct=n=>total?((n/total)*100).toFixed(1).replace('.',',')+'%':'0%';
 const uniqueOrgs=new Set(rs.map(d=>clean(d.institution).toLowerCase())).size;
 const multi=rs.filter(d=>Number(d.services)>1).length;
 const principals=rs.filter(d=>d.type==='Principal').length;
 const sites=rs.filter(d=>d.type==='Sede').length;
 const extra=rs.reduce((sum,d)=>sum+Math.max(0,(Number(d.services)||0)-1),0);
 const totalServices=total+extra;
 const foundationBase=foundationRs.length;
 const foundationExtra=foundationRs.reduce((sum,d)=>sum+Math.max(0,(Number(d.services)||0)-1),0);
 const foundationServices=foundationBase+foundationExtra;
 const overallServices=totalServices+foundationServices;
 const people=rs.reduce((sum,d)=>sum+(Number(d.people)||0),0);
 const cities=new Set(rs.map(d=>d.city).filter(Boolean)).size;
 const groupItems=(key)=>Object.entries(rs.reduce((acc,d)=>{const value=clean(d[key])||'Sin información';acc[value]=(acc[value]||0)+1;return acc},{})).sort((a,b)=>b[1]-a[1]);

 const palette=['#00ef9b','#ffd84d','#58a6ff','#c084fc','#ff8a65','#5eead4','#f472b6'];
 const donut=(items,centerLabel)=>{
   let cursor=0;
   const stops=items.map(([,count],i)=>{const start=cursor;cursor+=total?count/total*100:0;return palette[i%palette.length]+' '+start+'% '+cursor+'%'}).join(', ');
   const background=total?'conic-gradient('+stops+')':'#13231d';
   const legend=items.map(([label,count],i)=>'<p><i style="background:'+palette[i%palette.length]+'"></i><span>'+esc(label)+'</span><strong><span>'+fmt(count)+'</span><small>('+pct(count)+')</small></strong></p>').join('');
   return '<div class="more-pie-layout"><div class="more-pie" style="background:'+background+'"><div><strong>'+fmt(total)+'</strong><span>'+centerLabel+'</span></div></div><div class="more-pie-legend">'+legend+'</div></div>';
 };

 const services=groupItems('services').map(([label,count])=>[(label==='Sin información'?label:label+' servicio'+(label==='1'?'':'s')),count]);
 const administrations=groupItems('administration');

 $('#moreInfoContent').innerHTML=
 '<div class="more-hero-kpis">'+
   '<article><span>Escuelas conectadas</span><strong>'+fmt(total)+'</strong><small>'+fmt(uniqueOrgs)+' instituciones educativas beneficiadas</small></article>'+
   '<article><span>Alumnos conectados</span><strong>'+fmt(people)+'</strong></article>'+
   '<article><span>Ciudades con presencia</span><strong>'+fmt(cities)+'</strong></article>'+
 '</div>'+
 '<div class="more-kpis services-summary-grid">'+
   '<article><span>Total de servicios instalados en fundaciones</span><strong>'+fmt(foundationServices)+'</strong><small>'+fmt(foundationBase)+' fundaciones'+(foundationExtra?' + '+fmt(foundationExtra)+' adicionales':'')+'</small></article>'+
   '<article><span>Total de servicios instalados en escuelas</span><strong>'+fmt(totalServices)+'</strong><small>'+fmt(total)+' servicios base + '+fmt(extra)+' adicionales</small></article>'+
   '<article><span>Total de servicios instalados</span><strong>'+fmt(overallServices)+'</strong><small>'+fmt(total)+' servicios base + '+fmt(extra)+' adicionales + '+fmt(foundationServices)+' fundaciones</small></article>'+
   '<article><span>Servicios adicionales en escuelas</span><strong>'+fmt(extra)+'</strong><small>Por encima del primer servicio</small></article>'+
   '<article><span>Escuelas con más de un servicio</span><strong>'+fmt(multi)+'</strong><small>'+pct(multi)+' de las escuelas</small></article>'+
   '<article><span>Escuelas “principales” instaladas</span><strong>'+fmt(principals)+'</strong><small>'+pct(principals)+' del total</small></article>'+
   '<article><span>Escuelas “sedes” instaladas</span><strong>'+fmt(sites)+'</strong><small>'+pct(sites)+' del total</small></article>'+
 '</div>'+
 '<div class="more-grids wide" style="grid-template-columns:1fr">'+
   '<section><span class="eyebrow">SERVICIOS INSTALADOS</span><h3>Distribución por cantidad</h3>'+donut(services,'Total')+'</section>'+
   '<section><span class="eyebrow">TIPO DE ADMINISTRACIÓN</span><h3>Distribución de escuelas</h3>'+donut(administrations,'Total')+'</section>'+
 '</div>';
 return true;
};

render();
