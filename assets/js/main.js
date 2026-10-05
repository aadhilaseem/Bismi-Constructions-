// BISMI Construction — site script

// Header gets a soft shadow once the page scrolls
const header = document.querySelector(".site-header");
const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 8);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// Mobile menu: full-screen on phones; tapping a section link jumps there and closes it
const toggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("site-nav");
if (toggle && nav) {
  const mq = window.matchMedia("(max-width: 860px)");
  const setOpen = (open) => {
    nav.dataset.open = String(open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.documentElement.classList.toggle("menu-locked", open && mq.matches);
  };
  const sync = () => setOpen(!mq.matches);
  sync();
  mq.addEventListener("change", sync);
  toggle.addEventListener("click", () => setOpen(nav.dataset.open !== "true"));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => { if (mq.matches) setOpen(false); }));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mq.matches && nav.dataset.open === "true") { setOpen(false); toggle.focus(); }
  });
}

// Project filters: All / Homes / Interiors
const gallery = document.querySelector(".gallery");
const shots = [...document.querySelectorAll(".shot")];
document.querySelectorAll(".filters button").forEach((btn, _, all) => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.filter;
    all.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    shots.forEach((s) => { s.hidden = type !== "all" && s.dataset.type !== type; });
    gallery.classList.toggle("filtered", type !== "all");
  });
});

// Photo viewer with previous / next, arrow keys and swipe
const box = document.getElementById("lightbox");
if (box && typeof box.showModal === "function") {
  const img = box.querySelector("img");
  const count = box.querySelector(".lb-count");
  let list = [];
  let index = 0;
  const show = (i) => {
    index = (i + list.length) % list.length;
    const thumb = list[index].querySelector("img");
    img.src = thumb.currentSrc || thumb.src;
    img.alt = thumb.alt;
    count.textContent = `${index + 1} / ${list.length}`;
  };
  shots.forEach((shot) => {
    shot.querySelector("button").addEventListener("click", () => {
      list = shots.filter((s) => !s.hidden);
      show(list.indexOf(shot));
      box.showModal();
    });
  });
  box.querySelector(".lb-close").addEventListener("click", () => box.close());
  box.querySelector(".lb-prev").addEventListener("click", () => show(index - 1));
  box.querySelector(".lb-next").addEventListener("click", () => show(index + 1));
  box.addEventListener("click", (e) => { if (e.target === box) box.close(); });
  box.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
  let startX = null;
  box.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    startX = null;
  });
}

// Gentle reveal as sections scroll in (content is already visible; this only adds a small slide)
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
}

// Footer year
document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
