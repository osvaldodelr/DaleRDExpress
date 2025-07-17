const ITEMS_POR_PAGINA = 10;
let datos = [];
let datosFiltrados = [];
let paginaActual = 1;

document.addEventListener('DOMContentLoaded', () => {
  fetch('data/articulos.json')
    .then(resp => resp.json())
    .then(json => {
      datos = json;
      initFiltros();
      aplicarFiltros();
      const params = new URLSearchParams(location.search);
      const pg = parseInt(params.get('page'));
      if(pg) mostrarPagina(pg);
    });

  document.getElementById('busqueda').addEventListener('input', aplicarFiltros);
  document.getElementById('f-dia').addEventListener('change', aplicarFiltros);
  document.getElementById('f-mes').addEventListener('change', aplicarFiltros);
  document.getElementById('f-anio').addEventListener('change', aplicarFiltros);
  document.getElementById('f-cat').addEventListener('change', aplicarFiltros);
});

function initFiltros(){
  const selAnio = document.getElementById('f-anio');
  const selCat = document.getElementById('f-cat');
  const años = [...new Set(datos.map(d=>d.fecha.slice(0,4)))].sort().reverse();
  años.forEach(a=>{const opt=document.createElement('option');opt.value=a;opt.textContent=a;selAnio.appendChild(opt);});
  const cats = [...new Set(datos.map(d=>d.categoria))];
  cats.forEach(c=>{const opt=document.createElement('option');opt.value=c;opt.textContent=c;selCat.appendChild(opt);});

  const tags = [...new Set(datos.flatMap(d=>d.etiquetas))];
  const cont = document.getElementById('f-etiquetas');
  tags.forEach(t=>{
    const btn = document.createElement('button');
    btn.textContent = t;
    btn.addEventListener('click', ()=>{btn.classList.toggle('activo'); aplicarFiltros();});
    cont.appendChild(btn);
  });
}

function aplicarFiltros(){
  const texto = document.getElementById('busqueda').value.toLowerCase();
  const dia = document.getElementById('f-dia').value;
  const mes = document.getElementById('f-mes').value;
  const anio = document.getElementById('f-anio').value;
  const cat = document.getElementById('f-cat').value;
  const etiquetasActivas = [...document.querySelectorAll('#f-etiquetas button.activo')].map(b=>b.textContent);

  datosFiltrados = datos.filter(d=>{
    if(texto && !d.titulo.toLowerCase().includes(texto) && !d.resumen.toLowerCase().includes(texto)) return false;
    if(dia && d.fecha !== dia) return false;
    if(mes && d.fecha.slice(0,7) !== mes) return false;
    if(anio && d.fecha.slice(0,4) !== anio) return false;
    if(cat && d.categoria !== cat) return false;
    if(etiquetasActivas.length && !etiquetasActivas.every(t=>d.etiquetas.includes(t))) return false;
    return true;
  });
  mostrarPagina(1);
}

function mostrarPagina(n){
  paginaActual = n;
  const ini = (n-1)*ITEMS_POR_PAGINA;
  const fin = ini + ITEMS_POR_PAGINA;
  renderizarLista(datosFiltrados.slice(ini, fin));
  renderizarPaginacion(datosFiltrados.length, n);
  history.replaceState(null,'',`?page=${n}`);
}

function renderizarLista(arr){
  const cont = document.getElementById('lista-articulos');
  cont.innerHTML = '';
  arr.forEach(a=>{
    const card=document.createElement('article');
    card.className='card';
    card.innerHTML=`
      <img src="../${a.imagen}" alt="">
      <h2><a href="articulo.html?id=${encodeURIComponent(a.id)}">${a.titulo}</a></h2>
      <p>${a.resumen}</p>
      <small>${a.fecha} · ${a.autor}</small>`;
    cont.appendChild(card);
  });
}

function renderizarPaginacion(total, actual){
  const cont = document.getElementById('paginacion');
  cont.innerHTML='';
  const totalPag = Math.ceil(total/ITEMS_POR_PAGINA);
  const crearBtn = (txt, n, disabled=false)=>{
    const b=document.createElement('button');
    b.textContent=txt;
    if(disabled){b.disabled=true;}
    else{b.addEventListener('click',()=>mostrarPagina(n));}
    if(n===actual) b.classList.add('activo');
    cont.appendChild(b);
  };
  crearBtn('Anterior', actual-1, actual===1);
  for(let i=1;i<=totalPag;i++) crearBtn(i,i);
  crearBtn('Siguiente', actual+1, actual===totalPag);
}
