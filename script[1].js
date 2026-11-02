// "Base de datos" local: tablas guardadas en el navegador (localStorage)
const DB={
 get(t){try{return JSON.parse(localStorage.getItem(t))||null}catch(e){return null}},
 set(t,v){try{localStorage.setItem(t,JSON.stringify(v))}catch(e){}}
};
let mem={est:DB.get('estudiante'),ev:DB.get('evaluaciones')||[]};
const $=s=>document.querySelector(s);
function show(id){
 if(['datos','contenido','eval','res'].includes(id)&&!mem.est){id='registro'}
 document.querySelectorAll('main>section').forEach(s=>s.hidden=s.id!==id);$('#libro').hidden=(id==='inicio');document.body.classList.toggle('grid',id!=='inicio');scrollTo(0,0)
}
$('#fReg').onsubmit=e=>{e.preventDefault();
 mem.est={nombre:$('#nom').value.trim(),correo:$('#mail').value.trim(),edad:$('#edad').value,pais:$('#pais').value,curso:$('#curso').value,fecha:new Date().toLocaleString('es-GT')};
 DB.set('estudiante',mem.est);
 $('#dl').innerHTML=Object.entries({Nombre:mem.est.nombre,Correo:mem.est.correo,Edad:mem.est.edad,País:mem.est.pais,Curso:mem.est.curso,'Fecha de registro':mem.est.fecha}).map(([k,v])=>`<dt>${k}</dt><dd>${esc(v)}</dd>`).join('');
 show('datos')};
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}

const Q=[
 {t:'radio',q:'¿Qué significa HTML?',o:['Hyper Text Markup Language','High Tech Modern Language','Home Tool Markup Level'],a:'0'},
 {t:'check',q:'Selecciona TODOS los lenguajes del front-end web:',o:['HTML','CSS','JavaScript','SQL','Photoshop'],a:'0,1,2'},
 {t:'select',q:'¿Qué etiqueta crea un hipervínculo?',o:['&lt;img&gt;','&lt;a&gt;','&lt;p&gt;','&lt;h1&gt;'],a:'1'},
 {t:'list',q:'¿Qué propiedad CSS cambia el color del texto?',o:['background','font-size','color','margin'],a:'2'},
 {t:'text',q:'Escribe la instrucción de JavaScript que imprime un mensaje en la consola (sin paréntesis):',a:'console.log'},
 {t:'radio',q:'Java y JavaScript son el mismo lenguaje.',o:['Verdadero','Falso'],a:'1'}
];
const CORR=['Hyper Text Markup Language','HTML, CSS y JavaScript','&lt;a&gt;','color','console.log','Falso'];
function startQuiz(){
 $('#fQ').innerHTML=Q.map((x,i)=>{
  let h=`<div class="card"><b>${i+1}. ${x.q}</b>`;
  if(x.t==='radio')h+=x.o.map((o,j)=>`<label class="opt"><input type="radio" name="q${i}" value="${j}"> ${o}</label>`).join('');
  if(x.t==='check')h+=x.o.map((o,j)=>`<label class="opt"><input type="checkbox" name="q${i}" value="${j}"> ${o}</label>`).join('');
  if(x.t==='select')h+=`<select name="q${i}"><option value="">Elige…</option>${x.o.map((o,j)=>`<option value="${j}">${o}</option>`).join('')}</select>`;
  if(x.t==='list')h+=`<select name="q${i}" size="4">${x.o.map((o,j)=>`<option value="${j}">${o}</option>`).join('')}</select>`;
  if(x.t==='text')h+=`<input type="text" name="q${i}" autocomplete="off" placeholder="Tu respuesta">`;
  return h+'</div>'}).join('')+'<button type="submit">Enviar evaluación</button>';
 show('eval')}
$('#fQ').onsubmit=e=>{e.preventDefault();
 const f=e.target;let ok=0,det=[];
 Q.forEach((x,i)=>{
  let v;
  if(x.t==='radio'){const c=f.querySelector(`[name=q${i}]:checked`);v=c?c.value:''}
  else if(x.t==='check'){v=[...f.querySelectorAll(`[name=q${i}]:checked`)].map(c=>c.value).sort().join(',')}
  else if(x.t==='text'){v=f.querySelector(`[name=q${i}]`).value.trim().toLowerCase().replace(/\(.*$/,'')}
  else v=f.querySelector(`[name=q${i}]`).value;
  const good=v===x.a;if(good)ok++;
  det.push(`<p class="${good?'ok':'bad'}">${good?'✔':'✘'} Pregunta ${i+1}${good?'':' — Respuesta correcta: '+CORR[i]}</p>`)});
 const nota=Math.round(ok/Q.length*100)/10;const aprobo=nota>=7;
 mem.ev.push({correo:mem.est.correo,nombre:mem.est.nombre,aciertos:ok,calificacion:nota,aprobado:aprobo,fecha:new Date().toISOString()});
 DB.set('evaluaciones',mem.ev);
 $('#sc').textContent=nota.toFixed(1)+' / 10';
 $('#msg').textContent=aprobo?`¡Felicidades! Acertaste ${ok} de ${Q.length}.`:`Acertaste ${ok} de ${Q.length}. Necesitas 7.0 para aprobar: repasa el contenido e inténtalo de nuevo.`;
 $('#det').innerHTML=det.join('');
 $('#dip').innerHTML=aprobo?`<div class="diploma"><div>🎓 INSTITUTO HORIZONTE</div><h2>Diploma de Aprobación</h2><p>Se otorga a</p><div class="n">${esc(mem.est.nombre)}</div><p>por aprobar el curso<br><b>${esc(mem.est.curso)}</b><br>con una calificación de <b>${nota.toFixed(1)} / 10</b></p><p>${new Date().toLocaleDateString('es-GT',{day:'numeric',month:'long',year:'numeric'})}</p></div>`:'';
 $('#pr').hidden=!aprobo;$('#bd').hidden=true;show('res')};
function verBD(){const b=$('#bd');b.hidden=!b.hidden;b.textContent=JSON.stringify({estudiante:mem.est,evaluaciones:mem.ev},null,2)}

// Diseño de botones: agrega el ícono "sparkle" y la clase .text a cada botón
const SP='<svg class="sparkle" width="22" height="22" viewBox="0 0 24 24"><path d="M12 0c.8 6.2 5.8 11.2 12 12-6.2.8-11.2 5.8-12 12-.8-6.2-5.8-11.2-12-12C6.2 11.2 11.2 6.2 12 0z"/></svg>';
document.querySelectorAll('button:not(.flip-card__btn)').forEach(b=>{const t=b.textContent.trim();b.innerHTML=SP+'<span class="text">'+t+'</span>'});

// Ingreso de estudiantes ya registrados (cara trasera de la tarjeta)
$('#fLog').onsubmit=e=>{e.preventDefault();
 const s=DB.get('estudiante'),m=$('#mailLog').value.trim().toLowerCase();
 if(s&&s.correo.toLowerCase()===m){mem.est=s;
  $('#dl').innerHTML=Object.entries({Nombre:s.nombre,Correo:s.correo,Edad:s.edad,País:s.pais,Curso:s.curso,'Fecha de registro':s.fecha}).map(([k,v])=>`<dt>${k}</dt><dd>${esc(v)}</dd>`).join('');
  $('#logErr').textContent='';show('datos')}
 else $('#logErr').textContent='No encontramos ese correo. Usa la cara "Registro".'};

// Índice del curso: desplazamiento suave a cada tema
function irA(id){const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:'smooth',block:'start'})}
