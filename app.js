/**
 * Ultra-Reliable Canvas Scroll Animation Engine
 * Fullscreen high-quality frame animation synced to mouse wheel, touch, and page scroll.
 */

(function () {
  const TOTAL_FRAMES = 210;
  const images = new Array(TOTAL_FRAMES);
  const loadedFlags = new Array(TOTAL_FRAMES).fill(false);
  let loadedCount = 0;

  let currentFrameFloat = 1;
  let targetFrameFloat = 1;
  let lastDrawnFrame = -1;

  let canvas, ctx, preloader, loaderBar, loaderPercent, heroOverlay;

  function getFramePath(index) {
    const padded = String(index).padStart(3, '0');
    return `ezgif-8869634aa2d21de6-jpg/ezgif-frame-${padded}.jpg`;
  }

  function init() {
    canvas = document.getElementById('heroCanvas');
    ctx = canvas.getContext('2d');
    preloader = document.getElementById('preloader');
    loaderBar = document.getElementById('loaderBar');
    loaderPercent = document.getElementById('loaderPercent');
    heroOverlay = document.getElementById('heroOverlay');

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('scroll', onScroll, { passive: true });

    // Fallback wheel scroll drive
    window.addEventListener('wheel', (e) => {
      // Allow natural page scroll, but update target frame directly for instant response
      onScroll();
    }, { passive: true });

    // Start preloading images
    preloadAllFrames();

    // Start render loop immediately
    requestAnimationFrame(renderLoop);

    // Safety timeout to dismiss preloader after 1 second max
    setTimeout(dismissPreloader, 1000);

    // Setup transparent navbar interactions and scroll spy
    setupNav();
  }

  function resizeCanvas() {
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    drawFrame(Math.round(currentFrameFloat));
  }

  function preloadAllFrames() {
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const idx = i - 1;

      img.onload = () => {
        loadedFlags[idx] = true;
        loadedCount++;
        updateProgress();

        if (i === 1 || lastDrawnFrame === -1) {
          drawFrame(1);
        }

        if (loadedCount >= TOTAL_FRAMES) {
          dismissPreloader();
        }
      };

      img.onerror = () => {
        setTimeout(() => {
          img.src = getFramePath(i);
        }, 200);
      };

      img.src = getFramePath(i);
      images[idx] = img;
    }
  }

  function updateProgress() {
    const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100);
    if (loaderBar) loaderBar.style.width = pct + '%';
    if (loaderPercent) loaderPercent.textContent = pct + '%';
    if (pct > 20) {
      dismissPreloader();
    }
  }

  function dismissPreloader() {
    document.body.classList.remove('loading');
    if (preloader && !preloader.classList.contains('hidden')) {
      preloader.classList.add('hidden');
    }
  }

  function onScroll() {
    const scrollWrapper = document.getElementById('scrollWrapper');
    const wrapperTop = scrollWrapper ? scrollWrapper.offsetTop : 0;
    const scrollDistance = scrollWrapper
      ? Math.max(1, scrollWrapper.offsetHeight - window.innerHeight)
      : Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const scrollY = Math.max(0, window.scrollY - wrapperTop);
    const fraction = Math.min(1, Math.max(0, scrollY / scrollDistance));
    targetFrameFloat = 1 + fraction * (TOTAL_FRAMES - 1);

    // Fade heading and subheading away when scrolled past 30% of scroll animation
    if (heroOverlay) {
      const fadeProgress = Math.min(1, Math.max(0, fraction / 0.3));
      const opacity = 1 - fadeProgress;
      heroOverlay.style.opacity = opacity.toFixed(3);
      heroOverlay.style.transform = `translateY(${-fadeProgress * 24}px)`;
    }
  }

  function getBestLoadedFrameIndex(targetIndex) {
    if (loadedFlags[targetIndex - 1]) return targetIndex;

    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      if (targetIndex - offset >= 1 && loadedFlags[targetIndex - offset - 1]) {
        return targetIndex - offset;
      }
      if (targetIndex + offset <= TOTAL_FRAMES && loadedFlags[targetIndex + offset - 1]) {
        return targetIndex + offset;
      }
    }
    return 1;
  }

  function drawFrame(frameIndex) {
    const bestIndex = getBestLoadedFrameIndex(frameIndex);
    const img = images[bestIndex - 1];
    if (!img || !img.complete || !img.naturalWidth) return;

    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const imgW = img.naturalWidth || 1920;
    const imgH = img.naturalHeight || 1080;

    ctx.clearRect(0, 0, viewportW, viewportH);

    // Aspect ratio cover algorithm
    const scale = Math.max(viewportW / imgW, viewportH / imgH);
    const drawW = imgW * scale;
    const drawH = imgH * scale;
    const offsetX = (viewportW - drawW) / 2;
    const offsetY = (viewportH - drawH) / 2;

    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    lastDrawnFrame = bestIndex;
  }

  function renderLoop() {
    onScroll();

    // Smooth lerp calculation
    currentFrameFloat += (targetFrameFloat - currentFrameFloat) * 0.25;

    const frameToDraw = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(currentFrameFloat)));
    if (frameToDraw !== lastDrawnFrame) {
      drawFrame(frameToDraw);
    }

    requestAnimationFrame(renderLoop);
  }

  function setupNav() {
    const mainNav = document.getElementById('mainNav');
    const toggleBtn = document.getElementById('mobileMenuToggle');
    const toggleIcon = document.getElementById('menuToggleIcon');
    const mobileDropdown = document.getElementById('mobileMenuDropdown');
    const navItems = document.querySelectorAll('.nav-item');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (toggleBtn && mobileDropdown) {
      toggleBtn.addEventListener('click', () => {
        const isOpen = !mobileDropdown.classList.contains('hidden');
        if (isOpen) {
          mobileDropdown.classList.add('hidden');
          if (toggleIcon) toggleIcon.textContent = 'menu';
        } else {
          mobileDropdown.classList.remove('hidden');
          if (toggleIcon) toggleIcon.textContent = 'close';
        }
      });

      mobileLinks.forEach((link) => {
        link.addEventListener('click', () => {
          mobileDropdown.classList.add('hidden');
          if (toggleIcon) toggleIcon.textContent = 'menu';
        });
      });
    }

    const sections = [
      { id: 'scrollWrapper', el: document.getElementById('scrollWrapper') },
      { id: 'taste-profile', el: document.getElementById('taste-profile') },
      { id: 'formats', el: document.getElementById('formats') },
      { id: 'ritual', el: document.getElementById('ritual') },
      { id: 'nutrition', el: document.getElementById('nutrition') },
      { id: 'locator', el: document.getElementById('locator') }
    ];

    function updateNavState() {
      const scrollY = window.scrollY;

      if (mainNav) {
        if (scrollY > 40) {
          mainNav.classList.add('bg-surface/30', 'backdrop-blur-lg', 'border-outline-variant/20', 'shadow-[0_2px_16px_rgba(0,0,0,0.04)]');
          mainNav.classList.remove('bg-surface/20', 'border-outline-variant/10');
        } else {
          mainNav.classList.remove('bg-surface/30', 'backdrop-blur-lg', 'border-outline-variant/20', 'shadow-[0_2px_16px_rgba(0,0,0,0.04)]');
          mainNav.classList.add('bg-surface/20', 'border-outline-variant/10');
        }
      }

      let currentId = 'scrollWrapper';
      sections.forEach(({ id, el }) => {
        if (el) {
          const top = el.offsetTop - 140;
          if (scrollY >= top) {
            currentId = id;
          }
        }
      });

      navItems.forEach((item) => {
        const href = item.getAttribute('href');
        if (href === `#${currentId}`) {
          item.classList.add('text-primary', 'font-bold', 'bg-primary-fixed/40');
          item.classList.remove('text-on-surface-variant');
        } else {
          item.classList.remove('text-primary', 'font-bold', 'bg-primary-fixed/40');
          item.classList.add('text-on-surface-variant');
        }
      });
    }

    window.addEventListener('scroll', updateNavState, { passive: true });
    updateNavState();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
