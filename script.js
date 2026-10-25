// ==========================================================================
// ARTWORKS CONFIGURATION
// Clean, single-image portfolio items with muted per-artwork ambient tints.
// ==========================================================================
const artworks = [
  {
    id: "artwork-1",
    alt: "Surreal figure drawing in warm earthy tones",
    width: 1600,
    height: 1600,
    bgLight: "#ede4de",
    bgDark: "#2a2325",
    src: "images/artwork-1.webp"
  },
  {
    id: "artwork-2",
    alt: "Surreal plant composition with vibrant organic lines",
    width: 1600,
    height: 1600,
    bgLight: "#dae3d4",
    bgDark: "#17221c",
    src: "images/artwork-2.webp"
  },
  {
    id: "artwork-3",
    alt: "Surreal blue eye and dreamscape line art",
    width: 1600,
    height: 1600,
    bgLight: "#e8eae9",
    bgDark: "#252a30",
    src: "images/artwork-3.webp"
  },
  {
    id: "artwork-4",
    alt: "Surreal atmospheric scene with delicate dark tones",
    width: 1600,
    height: 1600,
    bgLight: "#e3dddc",
    bgDark: "#201d23",
    src: "images/artwork-4.webp"
  },
  {
    id: "artwork-5",
    alt: "Surreal vertical composition with textured details",
    width: 1131,
    height: 1600,
    bgLight: "#e9e6dd",
    bgDark: "#262525",
    src: "images/artwork-5.webp"
  },
  {
    id: "artwork-6",
    alt: "Surreal landscape perspective with subtle shading",
    width: 1600,
    height: 1200,
    bgLight: "#e3e0dd",
    bgDark: "#201f24",
    src: "images/artwork-6.webp"
  }
];

// Render gallery sections dynamically
function renderGallery() {
  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  const fragment = document.createDocumentFragment();

  artworks.forEach((art, artIndex) => {
    const section = document.createElement("section");
    section.className = "artwork-section";
    section.id = art.id;
    section.dataset.bgLight = art.bgLight;
    section.dataset.bgDark = art.bgDark;

    const stage = document.createElement("div");
    stage.className = "artwork-stage";

    const container = document.createElement("div");
    container.className = "artwork-container";

    const img = document.createElement("img");
    img.src = art.src;
    img.className = "artwork-img";
    img.width = art.width;
    img.height = art.height;
    img.style.aspectRatio = `${art.width} / ${art.height}`;
    img.alt = art.alt;

    // First image is eager with high fetchPriority, rest are lazily loaded
    if (artIndex === 0) {
      img.loading = "eager";
      img.fetchPriority = "high";
    } else {
      img.loading = "lazy";
    }

    container.appendChild(img);
    stage.appendChild(container);

    // Scroll cue chevron on the first artwork only
    if (artIndex === 0) {
      const cue = document.createElement("div");
      cue.id = "scroll-cue";
      cue.className = "scroll-cue";
      cue.setAttribute("aria-hidden", "true");
      cue.innerHTML = `
        <svg viewBox="0 0 24 24">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      `;
      section.appendChild(cue);
    }

    section.appendChild(stage);
    fragment.appendChild(section);
  });

  gallery.appendChild(fragment);
}

// Background tint shifting on scroll
function setupScrollObserver() {
  const sections = document.querySelectorAll(".artwork-section");
  if (!sections.length) return;

  const updateBackground = (section) => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const targetBg = isDark ? section.dataset.bgDark : section.dataset.bgLight;
    if (targetBg) {
      document.body.style.setProperty("--bg-current", targetBg);
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          updateBackground(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.55 // Fires when the artwork is predominantly in viewport
    }
  );

  sections.forEach((sec) => observer.observe(sec));
}

// Theme toggle button setup (accessible switch with localStorage support)
function setupThemeToggle() {
  const toggleBtn = document.getElementById("theme-toggle");
  if (!toggleBtn) return;

  // Retrieve theme from localStorage; default to light
  let currentTheme = "light";
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") {
      currentTheme = saved;
    }
  } catch (e) {
    currentTheme = "light";
  }

  // Set theme on html
  document.documentElement.setAttribute("data-theme", currentTheme);
  toggleBtn.setAttribute("aria-checked", currentTheme === "dark" ? "true" : "false");

  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    toggleBtn.setAttribute("aria-checked", theme === "dark" ? "true" : "false");
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {}

    // Re-check current visible artwork to apply matching muted tint
    const viewportMiddle = window.innerHeight / 2;
    const sections = Array.from(document.querySelectorAll(".artwork-section"));
    const activeSection = sections.find((sec) => {
      const rect = sec.getBoundingClientRect();
      return rect.top <= viewportMiddle && rect.bottom >= viewportMiddle;
    }) || sections[0];

    if (activeSection) {
      const targetBg = theme === "dark" ? activeSection.dataset.bgDark : activeSection.dataset.bgLight;
      if (targetBg) {
        document.body.style.setProperty("--bg-current", targetBg);
      }
    }
  };

  toggleBtn.addEventListener("click", () => {
    const activeTheme = document.documentElement.getAttribute("data-theme");
    const nextTheme = activeTheme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
  });
}

// Setup scroll cue removal when scrolling past ~40px
function setupScrollCue() {
  const cue = document.getElementById("scroll-cue");
  if (!cue) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      cue.classList.add("is-hidden");
      setTimeout(() => {
        if (cue && cue.parentNode) {
          cue.parentNode.removeChild(cue);
        }
      }, 500);
      window.removeEventListener("scroll", onScroll);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  renderGallery();
  setupThemeToggle();
  setupScrollObserver();
  setupScrollCue();
});
