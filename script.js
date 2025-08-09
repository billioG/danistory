document.addEventListener('DOMContentLoaded', () => {
  const cover = document.querySelector('.book-cover-front');
  const startBtn = document.querySelector('.start-reading');
  const pagesWrap = document.querySelector('.book-pages');
  const spreads = document.querySelectorAll('.book-spread');
  const controls = document.querySelector('.book-controls');
  const prevBtn = document.querySelector('.prev-page');
  const nextBtn = document.querySelector('.next-page');
  const progressFill = document.querySelector('.progress-fill');
  const currentEl = document.getElementById('current');
  const totalEl = document.getElementById('total');

  // Final interactivo
  const finalChoice = document.querySelector('.final-choice') || document.querySelector('.choice-buttons');
  const playerWrap = document.getElementById('video-wrap');
  const player = document.getElementById('final-player');
  const btnYes = document.getElementById('btn-yes');
  const btnNo  = document.getElementById('btn-no');

  let index = 0;
  const total = spreads.length;
  totalEl.textContent = total;

  // Índice de la página "continuará"
  let finalIndex = -1;
  spreads.forEach((sp, i) => { if (sp.id === 'continuara-spread') finalIndex = i; });

  function showSpread(i){
    // Si salimos del final, detener video
    if (finalIndex !== -1 && index === finalIndex && i !== finalIndex) stopFinalVideo();

    index = i;
    spreads.forEach((sp,idx)=> sp.style.display = (idx===index ? 'block' : 'none'));
    currentEl.textContent = index+1;
    progressFill.style.width = ((index+1)/total)*100 + '%';
  }

  function stopFinalVideo(){
    if (player) {
      player.src = '';
      if (playerWrap) playerWrap.hidden = true;
    }
  }

  // Iniciar lectura
  startBtn.addEventListener('click', () => {
    cover.style.display = 'none';
    pagesWrap.style.display = 'block';
    controls.style.display = 'flex';
    showSpread(0);
  });

  // Botones
  nextBtn.addEventListener('click', () => { if(index < total-1){ showSpread(index+1); } });
  prevBtn.addEventListener('click', () => { if(index > 0){ showSpread(index-1); } });

  // Teclado
  document.addEventListener('keydown', (e)=>{
    if(pagesWrap.style.display === 'block'){
      if(e.key === 'ArrowRight') nextBtn.click();
      if(e.key === 'ArrowLeft')  prevBtn.click();
    }
  });

  // Gestos táctiles
  let startX = 0;
  pagesWrap.addEventListener('touchstart', (e)=>{ startX = e.touches[0].clientX; }, {passive:true});
  pagesWrap.addEventListener('touchend', (e)=>{
    const dx = e.changedTouches[0].clientX - startX;
    if(dx < -50) nextBtn.click();
    if(dx >  50) prevBtn.click();
  }, {passive:true});

  // Reproductor final (Drive)
  if (finalChoice && player && playerWrap) {
    const yesId = finalChoice.dataset.yesId || 'YOUR_DRIVE_ID_SI';
    const noId  = finalChoice.dataset.noId  || 'YOUR_DRIVE_ID_NO';
    const yesURL = `https://drive.google.com/file/d/${yesId}/preview`;
    const noURL  = `https://drive.google.com/file/d/${noId}/preview`;

    btnYes?.addEventListener('click', () => {
      player.src = yesURL;
      playerWrap.hidden = false;
      playerWrap.scrollIntoView({behavior:'smooth', block:'center'});
    });

    btnNo?.addEventListener('click', () => {
      player.src = noURL;
      playerWrap.hidden = false;
      playerWrap.scrollIntoView({behavior:'smooth', block:'center'});
    });
  }

  // ===== MANEJO ROBUSTO DE IMÁGENES (evita 404 visibles) =====
  const placeholderSVG = encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
      <rect width='100%' height='100%' fill='#FFF3C2'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
            fill='#7a6444' font-family='Alegreya, serif' font-size='40'>
        Imagen no encontrada
      </text>
    </svg>
  `);
  const placeholderDataURL = `data:image/svg+xml;charset=utf-8,${placeholderSVG}`;

  document.querySelectorAll('.page-illustration img').forEach(img => {
    img.addEventListener('error', () => {
      img.src = placeholderDataURL;       // evita el 404 por cap-10.png u otros
      img.alt = 'Imagen no encontrada';
    }, { once: true });
  });
});
