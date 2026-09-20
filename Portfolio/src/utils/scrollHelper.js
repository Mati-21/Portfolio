let activeScrollAnim = null;
let lastScrollTime = 0;

/**
 * Smoothly scrolls to a section so that the top of the viewport
 * starts precisely at the section's top boundary, ensuring any
 * preceding section (such as Hero) is completely out of view.
 */
export const scrollToSection = (sectionId, lenisInstance) => {
  const now = Date.now();
  if (now - lastScrollTime < 400) return;
  lastScrollTime = now;

  const cleanId = sectionId.replace("#", "");
  const el = document.getElementById(cleanId);
  if (!el) return;

  if (activeScrollAnim) {
    cancelAnimationFrame(activeScrollAnim);
    activeScrollAnim = null;
  }

  const targetY = Math.ceil(el.getBoundingClientRect().top + window.scrollY);
  const startY = window.scrollY;
  const distance = targetY - startY;

  if (Math.abs(distance) < 4) return;

  const lenis = lenisInstance || window.__lenis;

  // Use Lenis native smooth scroll if available for a pristine, single-pass glide
  if (lenis && typeof lenis.scrollTo === "function") {
    lenis.scrollTo(targetY, {
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    return;
  }

  // Fallback smooth rAF loop
  const duration = Math.min(1000, Math.max(500, Math.abs(distance) * 0.45));
  const startTime = performance.now();
  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

  const step = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(1, elapsed / duration);
    const currentY = startY + distance * easeOutQuart(progress);

    window.scrollTo(0, currentY);

    if (progress < 1) {
      activeScrollAnim = requestAnimationFrame(step);
    } else {
      activeScrollAnim = null;
    }
  };

  activeScrollAnim = requestAnimationFrame(step);
};

/**
 * Scrolls smoothly to the Contact section at the exact position
 * where the sticky portal is 100% completely revealed and interactive.
 * Fast, snappy, single-pass glide with zero double scrolling.
 */
export const scrollToContactRevealed = (lenisInstance) => {
  const now = Date.now();
  // Prevent duplicate execution within 500ms
  if (now - lastScrollTime < 500) return;
  lastScrollTime = now;

  const contactEl = document.getElementById("contact");
  if (!contactEl) return;

  if (activeScrollAnim) {
    cancelAnimationFrame(activeScrollAnim);
    activeScrollAnim = null;
  }

  const targetY = Math.max(0, contactEl.offsetTop + contactEl.offsetHeight - window.innerHeight);
  const startY = window.scrollY;
  const distance = targetY - startY;

  if (Math.abs(distance) < 8) return;

  const lenis = lenisInstance || window.__lenis;

  // If Lenis is active, let Lenis handle the single, continuous glide natively
  if (lenis && typeof lenis.scrollTo === "function") {
    lenis.scrollTo(targetY, {
      duration: 0.95,
      easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    });
    return;
  }

  // Fallback fast smooth rAF loop
  const duration = Math.min(1000, Math.max(650, Math.abs(distance) * 0.22));
  const startTime = performance.now();
  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const step = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(1, elapsed / duration);
    const currentY = startY + distance * easeInOutCubic(progress);

    window.scrollTo(0, currentY);

    if (progress < 1) {
      activeScrollAnim = requestAnimationFrame(step);
    } else {
      activeScrollAnim = null;
    }
  };

  activeScrollAnim = requestAnimationFrame(step);
};
