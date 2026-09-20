(() => {
  const nav = document.querySelector(".scroll-nav");
  if (!nav) return;

  const topThreshold = 80;
  const switchThreshold = 10;

  function getScrollY() {
    const max = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    );
    return Math.min(max, Math.max(0, window.scrollY));
  }

  let lastY = getScrollY();
  let accumulated = 0;

  window.addEventListener("scroll", () => {
    const currentY = getScrollY();
    const delta = currentY - lastY;
    lastY = currentY;

    if (
      currentY <= topThreshold ||
      nav.contains(document.activeElement)
    ) {
      nav.classList.remove("is-scroll-hidden");
      accumulated = 0;
      return;
    }

    if (delta === 0) return;

    // 改變捲動方向時，重新累計距離
    if (Math.sign(delta) !== Math.sign(accumulated)) {
      accumulated = 0;
    }

    accumulated += delta;

    if (Math.abs(accumulated) >= switchThreshold) {
      nav.classList.toggle("is-scroll-hidden", accumulated > 0);
      accumulated = 0;
    }
  }, { passive: true });

  nav.addEventListener("focusin", () => {
    nav.classList.remove("is-scroll-hidden");
    accumulated = 0;
  });
})();