import gsap from "gsap";

/**
 * The hero sequence: a lecture goes in, questions come out, one gets answered,
 * it comes back on a schedule, and the same knowledge turns up in an exam.
 *
 * Written as one timeline with named beats so the order and the timing can be
 * read and changed here without touching markup. Roughly 14 seconds, then it
 * loops back to a fresh slide.
 *
 * Transforms on a persistent card rather than Flip: Flip earns its keep when an
 * element moves between containers and the layout does the positioning. Here
 * the card owns its own space for the whole sequence, so plain transforms are
 * both simpler and steadier.
 */
export function buildHeroTimeline() {
  const root = document.querySelector("[data-hero-demo]");
  if (!root) return null;

  const q = (sel) => root.querySelector(sel);
  const qa = (sel) => Array.from(root.querySelectorAll(sel));

  const slide = q("[data-slide]");
  const scan = q("[data-scan]");
  const card = q("[data-card]");
  const genScreen = q('[data-screen="gen"]');
  const qScreen = q('[data-screen="q"]');
  const examScreen = q('[data-screen="exam"]');
  const fan = qa("[data-fan]");
  const opts = qa("[data-opt]");
  const examOpts = qa("[data-exam-opt]");
  const exp = q("[data-exp]");
  const strip = qa("[data-strip-item]");
  const countEl = q("[data-count]");
  const timerEl = q("[data-timer]");
  const examFoot = q("[data-exam-foot]");

  if (!slide || !card) return null;

  // The finished state, held still. Someone who has asked the system for less
  // motion should still see what the product is, not an empty box.
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.set(slide, { autoAlpha: 0 });
    gsap.set(card, { autoAlpha: 1 });
    gsap.set(qScreen, { autoAlpha: 1 });
    gsap.set([opts, exp], { autoAlpha: 1, y: 0 });
    gsap.set(strip, { autoAlpha: 1 });
    return null;
  }

  const correct = opts.find((o) => o.dataset.correct);
  const examCorrect = examOpts.find((o) => o.dataset.correct);
  const counter = { n: 0 };
  const clock = { t: 60 };

  const GREEN = "#1f9d55";
  const GREEN_BG = "rgba(31, 157, 85, 0.1)";

  const tl = gsap.timeline({
    repeat: -1,
    repeatDelay: 1.1,
    defaults: { ease: "power2.out" },
  });

  // Everything starts from a known state so a repeat looks like the first run.
  tl.set(card, { autoAlpha: 0, scale: 0.92, y: 18 })
    .set([genScreen, qScreen, examScreen], { autoAlpha: 0 })
    .set(fan, { autoAlpha: 0, y: 12, rotate: 0, x: 0 })
    .set(opts, { autoAlpha: 0, y: 10, borderColor: "", backgroundColor: "", color: "" })
    .set(examOpts, { autoAlpha: 0, y: 8, borderColor: "", backgroundColor: "", color: "" })
    .set([exp, examFoot], { autoAlpha: 0, y: 6 })
    .set(strip, { autoAlpha: 0, y: 8 })
    .set(scan, { autoAlpha: 0, top: "-46%" })
    .set(slide, { autoAlpha: 0, scale: 0.94, y: 26, rotate: -2.5 })
    .set(counter, { n: 0 })
    .set(clock, { t: 60 });

  // ── 1. The lecture is over ──────────────────────────────────────────
  tl.addLabel("lecture")
    .to(slide, { autoAlpha: 1, scale: 1, y: 0, rotate: -1.5, duration: 0.7 })
    .to(slide, { rotate: 0, duration: 0.5 }, "-=0.15");

  // ── 2. It goes in, and is read ──────────────────────────────────────
  tl.addLabel("drop", "+=0.5")
    .to(scan, { autoAlpha: 1, duration: 0.2 }, "drop")
    .to(scan, { top: "100%", duration: 1.0, ease: "none" }, "drop")
    .to(scan, { autoAlpha: 0, duration: 0.2 }, "drop+=0.9")
    // Falls into the card's place and hands over.
    .to(slide, { y: 34, scale: 0.86, autoAlpha: 0, duration: 0.55, ease: "power2.in" }, "drop+=0.85")
    .to(card, { autoAlpha: 1, scale: 1, y: 0, duration: 0.6 }, "drop+=1.0");

  // ── 3. Questions come out of it ─────────────────────────────────────
  tl.addLabel("generate", "drop+=1.35")
    .to(genScreen, { autoAlpha: 1, duration: 0.3 }, "generate")
    .to(
      fan,
      {
        autoAlpha: 1,
        y: 0,
        x: (i) => [-16, 0, 16][i],
        rotate: (i) => [-7, 0, 7][i],
        duration: 0.55,
        stagger: 0.12,
        ease: "back.out(1.6)",
      },
      "generate+=0.1",
    )
    .to(
      counter,
      {
        n: 12,
        duration: 1.0,
        ease: "power1.out",
        onUpdate: () => {
          countEl.textContent = String(Math.round(counter.n));
        },
      },
      "generate+=0.15",
    );

  // ── 4. Answering one ────────────────────────────────────────────────
  tl.addLabel("answer", "generate+=1.7")
    .to(genScreen, { autoAlpha: 0, duration: 0.3 }, "answer")
    .to(qScreen, { autoAlpha: 1, duration: 0.3 }, "answer+=0.2")
    .to(opts, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.07 }, "answer+=0.3")
    // Chosen, then confirmed. The pause between is the reading.
    .to(
      correct,
      { borderColor: GREEN, backgroundColor: GREEN_BG, color: GREEN, duration: 0.3 },
      "answer+=1.15",
    )
    .to(correct, { scale: 1.02, duration: 0.16, yoyo: true, repeat: 1 }, "answer+=1.15")
    .to(exp, { autoAlpha: 1, y: 0, duration: 0.4 }, "answer+=1.4");

  // ── 5. It comes back, further apart each time ───────────────────────
  tl.addLabel("schedule", "answer+=2.6")
    .to(qScreen, { autoAlpha: 0, duration: 0.3 }, "schedule")
    .to(card, { scale: 0.72, y: -16, duration: 0.6, ease: "power2.inOut" }, "schedule")
    .to(
      strip,
      { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.28 },
      "schedule+=0.35",
    );

  // ── 6. Exam day ─────────────────────────────────────────────────────
  tl.addLabel("exam", "schedule+=1.9")
    .to(strip, { autoAlpha: 0, y: -6, duration: 0.35 }, "exam")
    .to(card, { scale: 1, y: 0, duration: 0.6, ease: "power2.inOut" }, "exam")
    .to(examScreen, { autoAlpha: 1, duration: 0.35 }, "exam+=0.3")
    .to(examOpts, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.05 }, "exam+=0.4")
    .to(
      clock,
      {
        t: 58.6,
        duration: 1.4,
        ease: "none",
        onUpdate: () => {
          const s = Math.ceil(clock.t);
          timerEl.textContent = `00:${String(s).padStart(2, "0")}`;
        },
      },
      "exam+=0.4",
    )
    // The payoff is speed, not a mark. No grade appears at any point.
    .to(
      examCorrect,
      { borderColor: GREEN, backgroundColor: GREEN_BG, color: GREEN, duration: 0.25 },
      "exam+=1.05",
    )
    .to(examCorrect, { scale: 1.02, duration: 0.14, yoyo: true, repeat: 1 }, "exam+=1.05")
    .to(examFoot, { autoAlpha: 1, y: 0, duration: 0.35 }, "exam+=1.3");

  // Clear the stage for the loop.
  tl.addLabel("out", "exam+=2.5").to(
    card,
    { autoAlpha: 0, scale: 0.96, duration: 0.45 },
    "out",
  );

  return tl;
}
