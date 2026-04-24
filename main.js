document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.querySelector(".close");
  let lockedScrollY = 0;

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
    "main > .gallery-2 img",
    "main > .title-img",
    "main > .duo-gallery",
    "main > .vertical-gallery",
    "main > .square-grid",
    "main > .triple-gallery",
    "main > .gallery-container",
    "main > .title-cards-section",
    "main > .tony-black-section",
    "main > .visualizers-section"
  ];

  const getImageSource = (img) => {
    if (!img) return "";

    const picture = img.closest("picture");
    const source = picture ? picture.querySelector("source") : null;

    return (
      img.getAttribute("data-full") ||
      img.getAttribute("data-src") ||
      img.currentSrc ||
      img.src ||
      img.getAttribute("src") ||
      (source ? source.getAttribute("srcset") : "") ||
      ""
    ).split(",")[0].trim().split(" ")[0];
  };

  const openLightbox = (clickedImg) => {
    if (!lightbox || !lightboxImg) return;

    const previewSrc = getImageSource(clickedImg);
    if (!previewSrc) return;

    lockedScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.setProperty("--scroll-lock-top", `-${lockedScrollY}px`);

    lightboxImg.removeAttribute("srcset");
    lightboxImg.removeAttribute("sizes");
    lightboxImg.style.opacity = "0";

    const tempImg = new Image();

    tempImg.onload = () => {
      lightboxImg.src = previewSrc;
      lightboxImg.alt = clickedImg.alt || "preview";
      lightboxImg.style.opacity = "1";
    };

    tempImg.onerror = () => {
      lightboxImg.src = clickedImg.src || previewSrc;
      lightboxImg.alt = clickedImg.alt || "preview";
      lightboxImg.style.opacity = "1";
    };

    tempImg.src = previewSrc;

    document.body.classList.add("lightbox-open");
    lightbox.classList.add("active");
  };

  const closeLightbox = () => {
    if (!lightbox || !lightboxImg || !lightbox.classList.contains("active")) return;

    const restoreScrollY = lockedScrollY;

    lightbox.classList.remove("active");
    lightboxImg.src = "";
    lightboxImg.style.opacity = "1";

    document.body.classList.remove("lightbox-open");
    document.body.style.removeProperty("--scroll-lock-top");

    requestAnimationFrame(() => {
      window.scrollTo(0, restoreScrollY);
    });
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

      e.preventDefault();
      openLightbox(clickedImg);
    });

    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      closeLightbox();
    });

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
