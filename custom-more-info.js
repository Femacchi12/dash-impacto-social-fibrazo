/* Mejoras visuales: porcentajes y organización de la vista “Más info”. */

/* Porcentajes en los gráficos horizontales, conservando cada gráfico en su pestaña actual. */
renderCities=function(){
 const rs=filtered(),map=new Map();
 rs.forEach(d=>{if(!map.has(d.city))map.set(d.city,[]);map.get(d.city).push(d)});
 const arr=[...map].map(([city,list])=>[city,metric(list)]).sort((a,b)=>b[1]-a[1]);
 const max=Math.max(1,...arr.map(x=>x[1]));
 const total=Math.max(1,metric(rs));
 const percentage=value=>((value/total)*100).toFixed(1).replace('.',',')+'%';
 $('#cityChart').innerHTML=arr.length?arr.map(x=>'<div class="bar-row"><span>'+esc(x[0])+'</span><div class="track"><i style="width:'+x[1]/max*100+'%"></i></div><b>'+fmt(x[1])+' <small>('+percentage(x[1])+')</small></b></div>').join(''):'<p class="empty">Sin resultados.</p>';
};

renderConnectivity=function(){
 const rs=filtered(),total=Math.max(1,rs.length);
 const yes=rs.filter(d=>d.internet==='SI'||d.internet==='Sí').length,no=rs.length-yes;
 const yesPct=yes/total*100,noPct=no/total*100;
 const percentage=value=>((value/total)*100).toFixed(1).replace('.',',')+'%';
 $('#internetSummary').innerHTML='<div class="donut" style="background:conic-gradient(var(--green) 0 '+yesPct+'%,var(--yellow) '+yesPct+'% 100%)"></div><div class="donut-labels"><div><i class="dot" style="background:var(--green)"></i>Tenían internet · '+yes+' ('+percentage(yes)+')</div><div><i class="dot" style="background:var(--yellow)"></i>No tenían · '+no+' ('+percentage(no)+')</div></div>';
 const providers=group(rs,'provider').slice(0,7),pm=Math.max(1,...providers.map(x=>x[1]));
 $('#providerChart').innerHTML=providers.map(x=>'<div class="provider-item"><span>'+esc(x[0])+'</span><div class="track"><i style="width:'+x[1]/pm*100+'%"></i></div><b>'+x[1]+' <small>('+percentage(x[1])+')</small></b></div>').join('')||'<p class="empty">Sin datos.</p>';
 $('#qualityChart').innerHTML=group(rs,'quality').map(x=>'<div class="quality"><b>'+x[1]+'</b><small>'+esc(x[0])+'</small></div>').join('')||'<p class="empty">Sin datos.</p>';
};

renderSizes=function(){
 const panel=$('.school-size');
 if(currentOrg()==='foundation'){panel.style.display='none';return}
 panel.style.display='block';
 const rs=filtered(),order=['0–200','201–500','501–1.000','1.001–1.500','1.501–2.000','Más de 2.000'],counts=Object.fromEntries(order.map(x=>[x,0]));
 rs.forEach(d=>counts[sizeBucket(d)]++);
 const max=Math.max(1,...Object.values(counts)),total=Math.max(1,rs.length);
 const percentage=value=>((value/total)*100).toFixed(1).replace('.',',')+'%';
 $('#sizeChart').innerHTML=order.map(k=>'<div class="size-row"><span>'+k+'</span><div class="track"><i style="width:'+counts[k]/max*100+'%"></i></div><b>'+counts[k]+' <small>('+percentage(counts[k])+')</small></b></div>').join('');
 const avg=rs.length?Math.round(rs.reduce((a,d)=>a+d.people,0)/rs.length):0,largest=rs.slice().sort((a,b)=>b.people-a.people)[0];
 $('#sizeSummary').innerHTML='<article><span>Promedio por sede</span><b>'+fmt(avg)+'</b></article><article><span>Sedes analizadas</span><b>'+fmt(rs.length)+'</b></article><article><span>Mayor institución</span><b>'+(largest?fmt(largest.people):'0')+'</b><small>'+(largest?esc(largest.institution):'Sin resultados')+'</small></article>';
};

renderMainMoreInfo=function(){
 const isMore=view==='more',panel=$('#moreInfoView');
 panel.hidden=!isMore;
 const dashboardSections=['#kpis','.charts','.connectivity','.school-size','.records'];
 dashboardSections.forEach(selector=>{const el=$(selector);if(el)el.hidden=isMore});
 if(!isMore)return false;

 /* “Más info” usa exclusivamente instituciones educativas; excluye fundaciones. */
 const rs=filtered().filter(d=>d.org==='education');
 const total=rs.length;
 const pct=n=>total?((n/total)*100).toFixed(1).replace('.',',')+'%':'0%';
 const uniqueOrgs=new Set(rs.map(d=>clean(d.institution).toLowerCase())).size;
 const multi=rs.filter(d=>Number(d.services)>1).length;
 const principals=rs.filter(d=>d.type==='Principal').length;
 const sites=rs.filter(d=>d.type==='Sede').length;
 const extra=rs.reduce((sum,d)=>sum+Math.max(0,(Number(d.services)||0)-1),0);
 const totalServices=total+extra;
 const people=rs.reduce((sum,d)=>sum+(Number(d.people)||0),0);
 const cities=new Set(rs.map(d=>d.city).filter(Boolean)).size;
 const groupItems=(key)=>Object.entries(rs.reduce((acc,d)=>{const value=clean(d[key])||'Sin información';acc[value]=(acc[value]||0)+1;return acc},{})).sort((a,b)=>b[1]-a[1]);

 const palette=['#00ef9b','#ffd84d','#58a6ff','#c084fc','#ff8a65','#5eead4','#f472b6'];
 const donut=(items,centerLabel)=>{
   let cursor=0;
   const stops=items.map(([,count],i)=>{const start=cursor;cursor+=total?count/total*100:0;return palette[i%palette.length]+' '+start+'% '+cursor+'%'}).join(', ');
   const background=total?'conic-gradient('+stops+')':'#13231d';
   const legend=items.map(([label,count],i)=>'<p><i style="background:'+palette[i%palette.length]+'"></i><span>'+esc(label)+'</span><strong>'+fmt(count)+' <small>('+pct(count)+')</small></strong></p>').join('');
   return '<div class="more-pie-layout"><div class="more-pie" style="background:'+background+'"><div><strong>'+fmt(total)+'</strong><span>'+centerLabel+'</span></div></div><div class="more-pie-legend">'+legend+'</div></div>';
 };

 const services=groupItems('services').map(([label,count])=>[(label==='Sin información'?label:label+' servicio'+(label==='1'?'':'s')),count]);
 const administrations=groupItems('administration');

 $('#moreInfoContent').innerHTML=
 '<div class="more-hero-kpis">'+
   '<article class="featured"><span>Escuelas conectadas</span><strong>'+fmt(total)+'</strong><small>'+fmt(uniqueOrgs)+' instituciones educativas beneficiadas</small></article>'+
   '<article><span>Alumnos</span><strong>'+fmt(people)+'</strong><small>Impacto educativo acumulado</small></article>'+
   '<article><span>Ciudades con presencia</span><strong>'+fmt(cities)+'</strong><small>Cobertura territorial</small></article>'+
 '</div>'+
 '<div class="more-kpis">'+
   '<article><span>Total de servicios instalados</span><strong>'+fmt(totalServices)+'</strong><small>'+fmt(total)+' servicios base + '+fmt(extra)+' adicionales</small></article>'+
   '<article><span>Sedes con más de un servicio</span><strong>'+fmt(multi)+'</strong><small>'+pct(multi)+' de las escuelas</small></article>'+
   '<article><span>Servicios adicionales</span><strong>'+fmt(extra)+'</strong><small>Por encima del primer servicio</small></article>'+
   '<article><span>Principales instaladas</span><strong>'+fmt(principals)+'</strong><small>'+pct(principals)+' del total</small></article>'+
   '<article><span>Sedes instaladas</span><strong>'+fmt(sites)+'</strong><small>'+pct(sites)+' del total</small></article>'+
 '</div>'+
 '<div class="more-grids wide" style="grid-template-columns:1fr">'+
   '<section><span class="eyebrow">SERVICIOS INSTALADOS</span><h3>Distribución por cantidad</h3>'+donut(services,'Total')+'</section>'+
   '<section><span class="eyebrow">TIPO DE ADMINISTRACIÓN</span><h3>Distribución de escuelas</h3>'+donut(administrations,'Total')+'</section>'+
 '</div>';
 return true;
};

render();
