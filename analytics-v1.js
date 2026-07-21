(()=>{
"use strict";
const send=(name,params={})=>{
  if(typeof window.gtag!=="function") return;
  window.gtag("event",name,{dashboard:"impacto_social",...params});
};
const textOf=el=>(el?.textContent||"").replace(/\s+/g," ").trim().slice(0,80);
const debounce=(fn,ms=700)=>{let timer;return(...args)=>{clearTimeout(timer);timer=setTimeout(()=>fn(...args),ms)}};
const sanitizeSearch=value=>{
  let term=String(value||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  term=term.replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi," ")
    .replace(/https?:\/\/\S+/gi," ")
    .replace(/\b\d[\d\s()+.-]{3,}\b/g," ")
    .replace(/\d+/g," ")
    .replace(/[^a-zñ\s-]/gi," ")
    .replace(/\s+/g," ").trim();
  return term.length>=3?term.slice(0,50):"";
};
const filterNames={
  cityFilter:"ciudad",zoneFilter:"zona_fibrazo",siteFilter:"tipo_sede",
  statusFilter:"estado",sizeFilter:"tamano",internetFilter:"internet_previo",
  servicesFilter:"servicios_instalados"
};
document.addEventListener("change",event=>{
  const el=event.target;
  if(filterNames[el.id]){
    send("filtro_usado",{filtro:filterNames[el.id],opcion:String(el.value||"sin_valor").slice(0,50)});
    const active=Object.keys(filterNames).filter(id=>{const x=document.getElementById(id);return x&&x.value&&x.value!=="all"}).length;
    send("combinacion_filtros",{cantidad_filtros:active});
  }
  if(el.matches("#columnsMenu [data-column]")) send("columna_modificada",{columna:el.dataset.column||"sin_nombre",visible:el.checked?"si":"no"});
});
document.addEventListener("click",event=>{
  const target=event.target.closest("button,a");
  if(!target) return;
  if(target.id==="clearFilters") send("limpiar_filtros");
  else if(target.id==="refreshDashboard") send("actualizar_datos");
  else if(target.id==="showMoreRows") send(target.getAttribute("aria-expanded")==="true"?"ver_menos":"ver_mas");
  else if(target.id==="columnsButton") send("selector_columnas");
  else if(target.matches(".view-switch button")) send("seccion_consultada",{seccion:target.dataset.view||textOf(target)});
  else if(target.matches(".detail-tabs button")) send("pestana_detalle",{pestana:target.dataset.detail||textOf(target)});
  else if(target.matches(".metric-switch button")) send("grafico_modificado",{control:"metrica",opcion:target.dataset.metric||textOf(target)});
  else if(target.matches(".period-switch button")) send("grafico_modificado",{control:"periodo",opcion:target.dataset.period||textOf(target)});
  else if(target.matches(".chart-switch button")) send("grafico_modificado",{control:"tipo",opcion:target.dataset.chart||textOf(target)});
  else if(target.matches(".client-link")) send("abrir_sysbrazo");
  else if(target.matches(".source-link")) send("abrir_sheet");
  else if(target.closest("#locationsMapPanel")&&target.tagName==="A") send("abrir_mapa");
  else if(target.tagName==="A"){
    let host="externo";
    try{host=new URL(target.href,location.href).hostname.replace(/^www\./,"").slice(0,60)}catch(_){}
    send("enlace_externo",{destino:host});
  }
});
const reportSearch=debounce(()=>{
  const input=document.getElementById("searchInput");
  if(!input||!input.value.trim()) return;
  const term=sanitizeSearch(input.value);
  const countText=document.getElementById("recordCount")?.textContent||"";
  const results=Number((countText.match(/[\d.]+/)||["0"])[0].replace(/\./g,""))||0;
  const params={resultados:results};
  if(term) params.termino_sanitizado=term;
  send(results?"busqueda_realizada":"busqueda_sin_resultados",params);
},900);
document.getElementById("searchInput")?.addEventListener("input",reportSearch);
const sections=[
  ["filtros",".filters"],["indicadores","#kpis"],["graficos",".charts"],
  ["conectividad",".connectivity"],["tamano_escuelas",".school-size"],["base_detallada",".records"]
];
const seen=new Set();
if("IntersectionObserver" in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting&&entry.intersectionRatio>=.35){
      const name=entry.target.dataset.analyticsSection;
      if(name&&!seen.has(name)){seen.add(name);send("seccion_vista",{seccion:name})}
    }
  }),{threshold:[.35]});
  sections.forEach(([name,selector])=>{const el=document.querySelector(selector);if(el){el.dataset.analyticsSection=name;observer.observe(el)}});
}
const milestones=new Set();
let maxDepth=0;
const reportDepth=()=>{
  const doc=Math.max(document.documentElement.scrollHeight-window.innerHeight,1);
  maxDepth=Math.max(maxDepth,Math.round((window.scrollY/doc)*100));
  [25,50,75,90].forEach(level=>{if(maxDepth>=level&&!milestones.has(level)){milestones.add(level);send("profundidad_navegacion",{porcentaje:level})}});
};
window.addEventListener("scroll",debounce(reportDepth,250),{passive:true});
let activeStarted=Date.now(),activeMs=0;
const pause=()=>{if(activeStarted){activeMs+=Date.now()-activeStarted;activeStarted=0}};
const resume=()=>{if(!activeStarted)activeStarted=Date.now()};
document.addEventListener("visibilitychange",()=>document.hidden?pause():resume());
window.addEventListener("pagehide",()=>{
  pause();
  send("tiempo_uso",{segundos:Math.round(activeMs/1000),profundidad_maxima:maxDepth});
});
send("dashboard_iniciado");
})();