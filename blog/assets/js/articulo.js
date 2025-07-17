document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if(!id) return location.href='index.html';
  fetch('data/articulos.json')
    .then(r=>r.json())
    .then(arr=>{
      const art = arr.find(a=>a.id===id);
      if(!art) return location.href='index.html';
      renderizar(art);
    });
});

function renderizar(a){
  document.title = a.titulo + ' | Blog Demo';
  document.getElementById('titulo-articulo').textContent = a.titulo;
  const cont = document.getElementById('contenido-articulo');
  cont.innerHTML = `
    <img src="../${a.imagen}" alt="" style="max-width:100%;height:auto">
    <p><small>${a.fecha} · ${a.autor}</small></p>
    ${a.contenido}
    <p><strong>Categoría:</strong> ${a.categoria}</p>
    <p><strong>Etiquetas:</strong> ${a.etiquetas.map(t=>'<a href=\'index.html?tag='+encodeURIComponent(t)+'\'>'+t+'</a>').join(', ')}</p>
    <h3>Fuentes</h3>
    <ul>${a.fuentes.map(f=>'<li><a href="'+f.url+'" target="_blank" rel="noopener">'+f.titulo+'</a></li>').join('')}</ul>
  `;

  const ld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": a.titulo,
    "datePublished": a.fecha,
    "author": {"@type":"Person","name": a.autor},
    "image": location.origin + '/' + a.imagen,
    "articleBody": a.contenido.replace(/<[^>]+>/g,''),
    "publisher": {"@type":"Organization","name":"Blog Demo"}
  };
  const script = document.createElement('script');
  script.type='application/ld+json';
  script.textContent = JSON.stringify(ld);
  document.head.appendChild(script);
}
