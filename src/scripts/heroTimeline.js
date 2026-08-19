import gsap from "gsap";

/**
 * One place that owns the hero demo's sequence.
 *
 * Kept out of the component so the orchestration can be read top to bottom as
 * a script — which scene, in what order, for how long — instead of being
 * inferred from delays scattered through markup.
 */
export function buildHeroTimeline() {
  const root = document.querySelector("[data-hero-demo]");
  if (!root) return null;

  // Respect the OS setting: show the finished state, animate nothing.
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return null;

  const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });
  return tl;
}
