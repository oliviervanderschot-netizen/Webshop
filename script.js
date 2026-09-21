// Simple cross-fade slideshow for the hero image zone
document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".hero-slideshow .slide");
  if (slides.length < 2) return;

  let current = 0;
  const interval = 4000;

  setInterval(() => {
    slides[current].classList.remove("active");
    current = (current + 1) % slides.length;
    slides[current].classList.add("active");
  }, interval);
});

// Menu button -> league dropdown
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("menuToggle");
  const menu = document.getElementById("leagueMenu");
  if (!toggle || !menu) return;

  const closeMenu = () => {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  };

  const openMenu = () => {
    menu.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
  };

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    menu.classList.contains("open") ? closeMenu() : openMenu();
  });

  document.addEventListener("click", (event) => {
    if (!menu.contains(event.target) && event.target !== toggle) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
});
