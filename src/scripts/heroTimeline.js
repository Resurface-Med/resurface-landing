import gsap from "gsap";

/**
 * Hero editorial loop: the lecture sinks, the fact resurfaces.
 *
 * Motion is big on purpose — y travel, blur, scale — so the metaphor reads
 * without captions or UI chrome. Reduced motion freezes on the resurfaced
 * state (the product promise).
 */
export function buildHeroTimeline() {
  const root = document.querySelector("[data-hero-demo]");
  if (!root) return null;

  const q = (sel) => root.querySelector(sel);

  const sheet = q("[data-sheet]");
  const note = q("[data-note]");
  const line = q("[data-line]");
  const back = q("[data-back]");
  const tag = q("[data-tag]");
  const qu = q("[data-q]");
  const ans = q("[data-a]");
  const ghost = q("[data-ghost]");

  if (!sheet || !back) return null;

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.set(sheet, { autoAlpha: 0 });
    gsap.set(back, { autoAlpha: 1 });
    gsap.set(ghost, { autoAlpha: 0.12 });
    if (ghost) ghost.textContent = "rise";
    return null;
  }

  const tl = gsap.timeline({
    repeat: -1,
    repeatDelay: 0.9,
    defaults: { ease: "power3.out" },
  });

  const setGhost = (word) => () => {
    if (ghost) ghost.textContent = word;
  };

  tl.set(sheet, {
    autoAlpha: 0,
    y: -48,
    rotate: -6,
    scale: 0.92,
    filter: "blur(0px)",
  })
    .set(back, { autoAlpha: 0 })
    .set([tag, qu, ans], { autoAlpha: 0, y: 36 })
    .set(ghost, { autoAlpha: 0.07 })
    .call(setGhost("sink"))
    .set(note, { autoAlpha: 0, y: 8 })
    .set(line, { scale: 1 });

  // ── Lecture lands hard ─────────────────────────────────────────────
  tl.addLabel("in")
    .to(
      sheet,
      {
        autoAlpha: 1,
        y: 0,
        rotate: -1.5,
        scale: 1,
        duration: 0.75,
        ease: "back.out(1.6)",
      },
      "in",
    )
    .to(sheet, { rotate: 0, duration: 0.4 }, "in+=0.55")
    .to(note, { autoAlpha: 1, y: 0, duration: 0.45 }, "in+=0.5")
    .to(line, { scale: 1.03, duration: 0.35, yoyo: true, repeat: 1 }, "in+=0.85");

  // ── It sinks — the whole point ─────────────────────────────────────
  tl.addLabel("sink", "+=1.1")
    .to(ghost, { autoAlpha: 0.14, duration: 0.3 }, "sink")
    .to(
      sheet,
      {
        y: "55%",
        scale: 0.78,
        rotate: 3,
        autoAlpha: 0,
        filter: "blur(10px)",
        duration: 1.05,
        ease: "power2.in",
      },
      "sink",
    )
    .to(ghost, { autoAlpha: 0.04, duration: 0.4 }, "sink+=0.7");

  // Beat of empty water
  tl.addLabel("hold", "+=0.35").call(setGhost("rise"), null, "hold");

  // ── Resurfaces as the question ─────────────────────────────────────
  tl.addLabel("rise", "hold+=0.15")
    .to(ghost, { autoAlpha: 0.11, duration: 0.35 }, "rise")
    .to(back, { autoAlpha: 1, duration: 0.2 }, "rise")
    .fromTo(
      tag,
      { autoAlpha: 0, y: 28, scale: 0.9 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.45 },
      "rise+=0.05",
    )
    .fromTo(
      qu,
      { autoAlpha: 0, y: 64, filter: "blur(8px)" },
      { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.7, ease: "power3.out" },
      "rise+=0.15",
    )
    .fromTo(
      ans,
      { autoAlpha: 0, y: 80, scale: 0.85, filter: "blur(12px)" },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.85,
        ease: "back.out(1.4)",
      },
      "rise+=0.45",
    )
    .to(ghost, { autoAlpha: 0.05, duration: 0.5 }, "rise+=0.8");

  // Hold the promise, then clear
  tl.addLabel("out", "+=2.4")
    .to(back, { autoAlpha: 0, y: -20, duration: 0.45 }, "out")
    .to(ghost, { autoAlpha: 0, duration: 0.3 }, "out")
    .set(sheet, { filter: "blur(0px)", y: -48, rotate: -6, scale: 0.92 }, "out+=0.4")
    .set(back, { y: 0 }, "out+=0.4")
    .set([tag, qu, ans], { filter: "blur(0px)", y: 36 }, "out+=0.4")
    .call(setGhost("sink"), null, "out+=0.4")
    .set(ghost, { autoAlpha: 0.07 }, "out+=0.4");

  return tl;
}
