/* ============================================================
   VOGUE LANDING — main.js
   1. Countdown en tiempo real
   2. Carruseles (Actividades + Cronograma)
   3. Validación de formulario
   4. Scroll reveal
   5. Social links
   ============================================================ */


/* 1. COUNTDOWN */
function initCountdown() {
  const eventoFecha = new Date('2026-05-10T13:00:00-03:00');
  const elDias  = document.getElementById('cd-dias');
  const elHoras = document.getElementById('cd-horas');
  const elMin   = document.getElementById('cd-min');

  if (!elDias || !elHoras || !elMin) return;

  function actualizar() {
    const diff = eventoFecha - new Date();
    if (diff <= 0) {
      elDias.textContent = elHoras.textContent = elMin.textContent = '00';
      return;
    }
    elDias.textContent  = String(Math.floor(diff / 86400000)).padStart(2, '0');
    elHoras.textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
    elMin.textContent   = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
  }
  actualizar();
  setInterval(actualizar, 1000);
}


/* 2. CARRUSELES */
function crearCarrusel({ trackId, prevId, nextId, dotsId }) {
  const track    = document.getElementById(trackId);
  const btnPrev  = document.getElementById(prevId);
  const btnNext  = document.getElementById(nextId);
  const dotsWrap = dotsId ? document.getElementById(dotsId) : null;

  if (!track || !btnPrev || !btnNext) return;

  const items = Array.from(track.children);
  const dots  = dotsWrap ? Array.from(dotsWrap.querySelectorAll('.carrusel-dot')) : [];
  let idx = 0;

  function irA(i) {
    idx = Math.max(0, Math.min(i, items.length - 1));
    track.style.transform  = `translateX(${idx * -100}%)`;
    track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    btnPrev.style.opacity  = idx === 0 ? '0.3' : '1';
    btnNext.style.opacity  = idx === items.length - 1 ? '0.3' : '1';
    dots.forEach((d, j) => d.classList.toggle('activo', j === idx));
  }

  btnPrev.addEventListener('click', () => irA(idx - 1));
  btnNext.addEventListener('click', () => irA(idx + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => irA(i)));

  let touchX = 0;
  track.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? irA(idx + 1) : irA(idx - 1);
  }, { passive: true });

  irA(0);
}

function initCarruseles() {
  crearCarrusel({ trackId: 'carrusel-track', prevId: 'carrusel-prev', nextId: 'carrusel-next', dotsId: null });
  crearCarrusel({ trackId: 'cron-track',     prevId: 'cron-prev',     nextId: 'cron-next',     dotsId: 'cron-dots' });
}


/* 3. FORMULARIO */
function initFormulario() {
  const form        = document.getElementById('vogue-form');
  const campoNombre = document.getElementById('campo-nombre');
  const campoEmail  = document.getElementById('campo-email');
  const campoPortf  = document.getElementById('campo-portfolio');
  const campoMotivo = document.getElementById('campo-motivo');
  const msgExito    = document.getElementById('form-exito');

  if (!form) return;

  function mostrarError(campo, msg) {
    const prev = campo.parentElement.querySelector('.form-error');
    if (prev) prev.remove();
    campo.style.borderBottom = '2px solid #e53e3e';
    const el = document.createElement('span');
    el.className   = 'form-error';
    el.textContent = msg;
    el.style.cssText = 'color:#e53e3e;font-size:12px;font-family:var(--font-montserrat);margin-top:4px;display:block;';
    campo.parentElement.appendChild(el);
  }

  function limpiarError(campo) {
    const el = campo.parentElement.querySelector('.form-error');
    if (el) el.remove();
    campo.style.borderBottom = '';
  }

  [campoNombre, campoEmail, campoPortf, campoMotivo].forEach(c => {
    if (c) c.addEventListener('input', () => limpiarError(c));
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    let errores = false;

    if (campoNombre && campoNombre.value.trim().length < 2) {
      mostrarError(campoNombre, 'Ingresá tu nombre completo.'); errores = true;
    }
    if (campoEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campoEmail.value.trim())) {
      mostrarError(campoEmail, 'El correo no tiene un formato válido.'); errores = true;
    }
    if (campoMotivo && campoMotivo.value.trim().length < 20) {
      mostrarError(campoMotivo, 'Contanos un poco más (mínimo 20 caracteres).'); errores = true;
    }
    if (campoPortf && campoPortf.value.trim() && !campoPortf.value.trim().startsWith('http')) {
      mostrarError(campoPortf, 'El link debe empezar con http:// o https://'); errores = true;
    }

    if (!errores) {
      form.style.display = 'none';
      if (msgExito) {
        msgExito.style.display = 'flex';
        setTimeout(() => {
          msgExito.style.transition = 'all 0.5s ease';
          msgExito.style.opacity = '1';
          msgExito.style.transform = 'translateY(0)';
        }, 50);
      }
    } else {
      const primer = form.querySelector('.form-error');
      if (primer) primer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}


/* 4. SCROLL REVEAL */
function initScrollReveal() {
  const elementos = document.querySelectorAll('.reveal');
  if (!elementos.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elementos.forEach(el => observer.observe(el));
}


/* 5. SOCIAL LINKS */
function initSocialLinks() {
  const links = {
    facebook:  'https://www.facebook.com/VogueMexicoLatinoamerica/',
    instagram: 'https://www.instagram.com/voguelatam/?hl=es',
    twitter:   'https://x.com/voguelatam',
    youtube:   'https://www.youtube.com/channel/UCLBMjQDJ5r8kbTrN1kev4dw',
    pinterest: 'https://ar.pinterest.com/voguelatam/',
    tiktok:    'https://www.tiktok.com/@voguelatam'
  };

  Object.entries(links).forEach(([red, url]) => {
    const el = document.querySelector(`[data-social="${red}"]`);
    if (el) {
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => window.open(url, '_blank', 'noopener'));
    }
  });
}


/* INIT */
document.addEventListener('DOMContentLoaded', function () {
  initCountdown();
  initCarruseles();
  initFormulario();
  initScrollReveal();
  initSocialLinks();
});