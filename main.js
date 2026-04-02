document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.querySelector(".close");

  const allowedSelectors = [
    ".gallery img",
    ".gallery-2 img",
    ".duo-gallery img",
    ".vertical-gallery img",
    ".square-grid img",
    ".triple-gallery img",
    ".grid-quad img",
    ".main-feature img",
    ".main-gallery img",
    ".cards-grid img",
    ".tony-black-card img"
  ];

  const revealSelectors = [
    "main > .hero",
    "main > .title-img",
    "main > .gallery",
    "main > .duo-gallery",
    "main > .vertical-gallery",
    "main > .square-grid",
    "main > .triple-gallery",
    "main > .gallery-container",
    "main > .title-cards-section",
    "main > .tony-black-section",
    "main > .visualizers-section"
  ];

  const closeLightbox = () => {
    if (!lightbox || !lightboxImg) return;

    lightbox.classList.remove("active");
    lightboxImg.src = "";
    document.body.classList.remove("lightbox-open");
  };

  const setupScrollReveal = () => {
    const revealTargets = [...document.querySelectorAll(revealSelectors.join(", "))];
    if (!revealTargets.length) return;

    revealTargets.forEach((element, index) => {
      element.classList.add("reveal-on-scroll");
      element.style.setProperty("--reveal-delay", `${(index % 3) * 70}ms`);
    });

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealTargets.forEach((element) => {
        element.classList.add("is-visible");
      });
      return;
    }

    document.body.classList.add("js-scroll-reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -10% 0px"
      }
    );

    const viewportLimit = window.innerHeight * 0.92;

    revealTargets.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const isInInitialViewport = rect.top <= viewportLimit && rect.bottom >= 0;

      if (isInInitialViewport) {
        element.classList.add("is-visible");
        return;
      }

      observer.observe(element);
    });
  };

  setupScrollReveal();

  if (lightbox && lightboxImg && closeBtn) {
    document.addEventListener("click", (e) => {
      const clickedImg = e.target.closest(allowedSelectors.join(", "));
      if (!clickedImg) return;

      lightbox.classList.add("active");
      lightboxImg.src = clickedImg.currentSrc || clickedImg.src;
      lightboxImg.alt = clickedImg.alt || "preview";
      document.body.classList.add("lightbox-open");
    });

    closeBtn.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeLightbox();
      }
    });
  }
});
