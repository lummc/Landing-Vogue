/* ============================================================
   main.js — Vogue Lanzamiento
   Clean, modern JS. No legacy act1/act2/act3 references.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* ----------------------------------------------------------
     1. COUNTDOWN TIMER
     Target: 10 May 2026 00:00:00
  ---------------------------------------------------------- */
  const TARGET_DATE = new Date("2026-05-10T00:00:00");

  const cdDias    = document.getElementById("cd-dias");
  const cdHoras   = document.getElementById("cd-horas");
  const cdMinutos = document.getElementById("cd-minutos");

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function updateCountdown() {
    const now  = new Date();
    const diff = TARGET_DATE - now;

    if (diff <= 0) {
      if (cdDias)    cdDias.textContent    = "00";
      if (cdHoras)   cdHoras.textContent   = "00";
      if (cdMinutos) cdMinutos.textContent = "00";
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    if (cdDias)    cdDias.textContent    = pad(days);
    if (cdHoras)   cdHoras.textContent   = pad(hours);
    if (cdMinutos) cdMinutos.textContent = pad(minutes);
  }

  updateCountdown();
  setInterval(updateCountdown, 60000); // update every minute


  /* ----------------------------------------------------------
     2. CAROUSEL — Actividades
     Reads: #carrusel-track, #carrusel-prev, #carrusel-next
     Dots: .carrusel-dots > .carrusel-dot
  ---------------------------------------------------------- */
  function buildCarousel(trackId, prevId, nextId, dotsContainerId) {
    const track = document.getElementById(trackId);
    const prev  = document.getElementById(prevId);
    const next  = document.getElementById(nextId);
    const dotsContainer = dotsContainerId
      ? document.getElementById(dotsContainerId)
      : track?.closest(".carrusel-contenedor")?.querySelector(".carrusel-dots");

    if (!track) return;

    const items     = track.querySelectorAll(".carrusel-item, .cron-item");
    const totalItems = items.length;
    let current     = 0;

    const dots = dotsContainer ? dotsContainer.querySelectorAll(".carrusel-dot") : [];

    function goTo(index) {
      current = (index + totalItems) % totalItems;
      track.style.transform = `translateX(-${current * 100}%)`;

      dots.forEach((dot, i) => {
        dot.classList.toggle("activo", i === current);
      });
    }

    if (prev) prev.addEventListener("click", () => goTo(current - 1));
    if (next) next.addEventListener("click", () => goTo(current + 1));

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => goTo(i));
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX   = 0;

    track.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const delta = touchStartX - touchEndX;
      if (Math.abs(delta) > 50) {
        goTo(delta > 0 ? current + 1 : current - 1);
      }
    }, { passive: true });

    // Initialize
    goTo(0);
  }

  // Actividades carousel — uses class-based dots (no separate dots container id needed)
  buildCarousel("carrusel-track", "carrusel-prev", "carrusel-next", null);

  // Cronograma carousel
  buildCarousel("cron-track", "cron-prev", "cron-next", "cron-dots");


  /* ----------------------------------------------------------
     3. SCROLL REVEAL
     Adds .visible to elements with .reveal when they enter viewport
  ---------------------------------------------------------- */
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); // fire once
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    // Fallback for old browsers: show everything immediately
    revealElements.forEach((el) => el.classList.add("visible"));
  }


  /* ----------------------------------------------------------
     4. FORM SUBMISSION
     #vogue-form → shows #form-exito on success
     (wire up to a real backend / formspree / etc. as needed)
  ---------------------------------------------------------- */
  const form      = document.getElementById("vogue-form");
  const formExito = document.getElementById("form-exito");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const nombre    = form.querySelector("#campo-nombre, .nombre-completo")?.value?.trim();
      const email     = form.querySelector("#campo-email, .entry-email")?.value?.trim();
      const portfolio = form.querySelector("#campo-portfolio, .link-a-tu")?.value?.trim();

      // Basic validation
      if (!nombre || !email) {
        alert("Por favor completá al menos tu nombre y email.");
        return;
      }

      // TODO: replace this block with a real fetch() to your backend / formspree
      console.log("Form submitted:", { nombre, email, portfolio });

      // Show success state
      form.style.display = "none";
      if (formExito) {
        formExito.style.display = "flex";
      }
    });
  }

  // Also handle the groupButton (Locofy version)
  const groupButton = document.getElementById("groupButton");
  if (groupButton) {
    groupButton.addEventListener("click", (e) => {
      // Handled by the form submit above — no extra action needed
    });
  }


  /* ----------------------------------------------------------
     5. SOCIAL LINKS
     Uses data-social attribute on social icon images/wrappers
  ---------------------------------------------------------- */
  const SOCIAL_URLS = {
    facebook:  "https://www.facebook.com/VogueMexicoLatinoamerica/",
    instagram: "https://www.instagram.com/voguelatam/?hl=es",
    twitter:   "https://x.com/voguelatam",
    youtube:   "https://www.youtube.com/channel/UCLBMjQDJ5r8kbTrN1kev4dw",
    pinterest: "https://ar.pinterest.com/voguelatam/",
    tiktok:    "https://www.tiktok.com/@voguelatam",
  };

  // New Locofy version: .group-icon and .frame-child7 (twitter is index 2)
  const groupIcons = document.querySelectorAll(".group-icon");
  const socialKeys = ["facebook", "instagram", "youtube", "pinterest", "tiktok"];

  groupIcons.forEach((icon, i) => {
    const key = socialKeys[i];
    if (key && SOCIAL_URLS[key]) {
      icon.style.cursor = "pointer";
      icon.addEventListener("click", () => {
        window.open(SOCIAL_URLS[key], "_blank", "noopener,noreferrer");
      });
    }
  });

  // Twitter icon (frame-child7 / Group-41)
  const twitterIcon = document.querySelector(".frame-child7");
  if (twitterIcon) {
    twitterIcon.style.cursor = "pointer";
    twitterIcon.addEventListener("click", () => {
      window.open(SOCIAL_URLS.twitter, "_blank", "noopener,noreferrer");
    });
  }

  // Legacy support: data-social attribute (old HTML)
  document.querySelectorAll("[data-social]").forEach((el) => {
    const key = el.dataset.social;
    if (SOCIAL_URLS[key]) {
      el.style.cursor = "pointer";
      el.addEventListener("click", () => {
        window.open(SOCIAL_URLS[key], "_blank", "noopener,noreferrer");
      });
    }
  });


  /* ----------------------------------------------------------
     6. CTA BUTTON — scroll to form
  ---------------------------------------------------------- */
  const ctaBtn = document.querySelector(".cta-desktop");
  if (ctaBtn) {
    ctaBtn.addEventListener("click", () => {
      const formSection = document.querySelector(".register, #vogue-form, .entry-input");
      if (formSection) {
        formSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

});