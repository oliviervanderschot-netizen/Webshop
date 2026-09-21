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
