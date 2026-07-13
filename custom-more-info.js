/* Mejoras de la vista “Más info”: tortas de servicios y administración con porcentajes. */
renderMainMoreInfo=function(){
 const isMore=view==='more',panel=$('#moreInfoView');
 panel.hidden=!isMore;
 const dashboardSections=['#kpis','.charts','.connectivity','.school-size','.records'];
 dashboardSections.forEach(selector=>{const el=$(selector);if(el)el.hidden=isMore});
 if(!isMore)return false;

 const rs=filtered();
 const total=rs.length;
 const pct=n=>total?((n/total)*100).toFixed(1).replace('.',',')+'%':'0%';
 const uniqueOrgs=new Set(rs.map(d=>(d.org+'|'+clean(d.institution)).toLowerCase())).size;
 const multi=rs.filter(d=>Number(d.services)>1).length;
 const principals=rs.filter(d=>d.type==='Principal').length;
 const sites=rs.filter(d=>d.type==='Sede').length;
 const extra=rs.reduce((sum,d)=>sum+Math.max(0,(Number(d.services)||0)-1),0);
 const people=rs.reduce((sum,d)=>sum+(Number(d.people)||0),0);
 const cities=new Set(rs.map(d=>d.city).filter(Boolean)).size;
 const group=(key)=>Object.entries(rs.reduce((acc,d)=>{const value=clean(d[key])||'Sin información';acc[value]=(acc[value]||0)+1;return acc},{})).sort((a,b)=>b[1]-a[1]);

 const palette=['#00ef9b','#ffd84d','#58a6ff','#c084fc','#ff8a65','#5eead4','#f472b6'];
 const donut=(items,centerLabel)=>{
   let cursor=0;
   const stops=items.map(([,count],i)=>{const start=cursor;cursor+=total?count/total*100:0;return palette[i%palette.length]+' '+start+'% '+cursor+'%'}).join(', ');
   const background=total?'conic-gradient('+stops+')':'#13231d';
   const legend=items.map(([label,count],i)=>'<p><i style="background:'+palette[i%palette.length]+'"></i><span>'+esc(label)+'</span><strong>'+fmt(count)+' <small>('+pct(count)+')</small></strong></p>').join('');
   return '<div class="more-pie-layout"><div class="more-pie" style="background:'+background+'"><div><strong>'+fmt(total)+'</strong><span>'+centerLabel+'</span></div></div><div class="more-pie-legend">'+legend+'</div></div>';
 };

 const services=group('services').map(([label,count])=>[(label==='Sin información'?label:label+' servicio'+(label==='1'?'':'s')),count]);
 const administrations=group('administration');

 $('#moreInfoContent').innerHTML=
 '<div class="more-hero-kpis">'+
   '<article class="featured"><span>Ubicaciones conectadas</span><strong>'+fmt(total)+'</strong><small>'+fmt(uniqueOrgs)+' organizaciones beneficiadas</small></article>'+
   '<article><span>Alumnos y beneficiarios</span><strong>'+fmt(people)+'</strong><small>Impacto social acumulado</small></article>'+
   '<article><span>Ciudades con presencia</span><strong>'+fmt(cities)+'</strong><small>Cobertura territorial</small></article>'+
 '</div>'+
 '<div class="more-kpis">'+
   '<article><span>Sedes con más de un servicio</span><strong>'+fmt(multi)+'</strong><small>'+pct(multi)+' de las ubicaciones</small></article>'+
   '<article><span>Servicios adicionales</span><strong>'+fmt(extra)+'</strong><small>Por encima del primer servicio</small></article>'+
   '<article><span>Principales instaladas</span><strong>'+fmt(principals)+'</strong><small>'+pct(principals)+' del total</small></article>'+
   '<article><span>Sedes instaladas</span><strong>'+fmt(sites)+'</strong><small>'+pct(sites)+' del total</small></article>'+
 '</div>'+
 '<div class="more-grids wide">'+
   '<section><span class="eyebrow">SERVICIOS INSTALADOS</span><h3>Distribución por cantidad</h3>'+donut(services,'Total')+'</section>'+
   '<section><span class="eyebrow">TIPO DE ADMINISTRACIÓN</span><h3>Distribución de organizaciones</h3>'+donut(administrations,'Total')+'</section>'+
 '</div>';
 return true;
};

render();
