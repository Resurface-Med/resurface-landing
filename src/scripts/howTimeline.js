import gsap from "gsap";

/**
 * How it works, in three acts: a lecture is dropped in, questions are written
 * from it, then the real practice session appears and one answer lands.
 *
 * One timeline with a label per act. Each act lights its own caption, so the
 * steps underneath and the animation cannot fall out of step with each other.
 *
 * Motion is deliberately springy — back.out and a squash on landing — because
 * the section is an explainer, not a dashboard. Easing does the work that a
 * cartoon would otherwise need a character for.
 */
export function buildHowTimeline() {
  const root = document.querySelector("[data-how-demo]");
  if (!root) return null;

  const q = (s) => root.querySelector(s);
  const qa = (s) => Array.from(root.querySelectorAll(s));

  const doc = q("[data-doc]");
  const scan = q("[data-scan]");
  const source = q("[data-source]");
  const app = q("[data-app]");
  const zone = q("[data-zone]");
  const dropScreen = q('[data-screen="drop"]');
  const makeScreen = q('[data-screen="make"]');
  const ansScreen = q('[data-screen="answer"]');
  const made = qa("[data-made]");
  const countEl = q("[data-count]");
  const opts = qa("[data-opt]");
  const fill = q("[data-fill]");
  const steps = qa("[data-step]");

  if (!doc || !app) return null;

  const correct = opts.find((o) => o.dataset.correct);
  const counter = { n: 0 };

  const BLUE = "#3562f5";

  const clearOptState = () => {
    opts.forEach((el) => {
      el.classList.remove("is-pending", "is-correct", "is-faded");
    });
  };

  /** Light the step the animation is on, and only that one. */
  const step = (i) => () => steps.forEach((el, j) => el.classList.toggle("is-on", j === i));

  // Reduced motion gets the end state and the last step lit — the section still
  // explains itself, it simply does not move.
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.set(doc, { autoAlpha: 0 });
    gsap.set([app, ansScreen], { autoAlpha: 1 });
    app.classList.add("is-session");
    clearOptState();
    opts.forEach((el) => {
      el.classList.add(el.dataset.correct ? "is-correct" : "is-faded");
    });
    gsap.set(fill, { width: "15%" });
    step(2)();
    return null;
  }

  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.4, defaults: { ease: "power2.out" } });

  tl.set(app, { autoAlpha: 0, scale: 0.96, y: 10 })
    .set([dropScreen, makeScreen, ansScreen], { autoAlpha: 0 })
    .set(doc, { autoAlpha: 0, x: -60, y: -40, rotate: -10, scale: 1 })
    .set(scan, { autoAlpha: 0, top: "-40%" })
    .set(source, { backgroundColor: "rgba(53,98,245,0)", color: "", fontWeight: 400 })
    .set(zone, { borderColor: "", scale: 1 })
    .set(made, { autoAlpha: 0, scale: 0.7, y: 8 })
    .set(opts, { autoAlpha: 0, y: 6 })
    .set(fill, { width: "0%" })
    .set(counter, { n: 0 })
    .call(() => {
      app.classList.remove("is-session");
      clearOptState();
    });

  // ── ACT 1 — the lecture goes in ─────────────────────────────────────
  tl.addLabel("drop")
    .call(step(0), null, "drop")
    .to(app, { autoAlpha: 1, scale: 1, y: 0, duration: 0.5 }, "drop")
    .to(dropScreen, { autoAlpha: 1, duration: 0.35 }, "drop+=0.2")
    // Arrives from off to one side, overshoots, then settles into the zone.
    .to(doc, { autoAlpha: 1, duration: 0.3 }, "drop+=0.45")
    .to(
      doc,
      { x: 0, y: 0, rotate: -3, duration: 0.85, ease: "back.out(1.3)" },
      "drop+=0.45",
    )
    // The drop zone reacts as it comes over.
    .to(zone, { borderColor: BLUE, scale: 1.02, duration: 0.3 }, "drop+=0.95")
    .to(zone, { scale: 1, duration: 0.25 }, "drop+=1.3");

  // Read: the scan runs down and the line the question comes from lights.
  tl.addLabel("read", "drop+=1.35")
    .to(scan, { autoAlpha: 1, duration: 0.15 }, "read")
    .to(scan, { top: "100%", duration: 0.9, ease: "none" }, "read")
    .to(scan, { autoAlpha: 0, duration: 0.2 }, "read+=0.8")
    .to(
      source,
      { backgroundColor: "rgba(53,98,245,0.14)", color: BLUE, fontWeight: 600, duration: 0.25 },
      "read+=0.45",
    );

  // ── ACT 2 — it becomes questions ────────────────────────────────────
  tl.addLabel("make", "read+=1.05")
    .call(step(1), null, "make")
    // The page drops into the app and hands over to the cards.
    .to(doc, { y: 26, scale: 0.9, autoAlpha: 0, duration: 0.45, ease: "power2.in" }, "make")
    .to(dropScreen, { autoAlpha: 0, duration: 0.25 }, "make+=0.2")
    .to(makeScreen, { autoAlpha: 1, duration: 0.3 }, "make+=0.35")
    .to(
      made,
      { autoAlpha: 1, scale: 1, y: 0, duration: 0.45, stagger: 0.09, ease: "back.out(2)" },
      "make+=0.45",
    )
    .to(
      counter,
      {
        n: 12,
        duration: 0.85,
        ease: "power1.out",
        onUpdate: () => { countEl.textContent = String(Math.round(counter.n)); },
      },
      "make+=0.5",
    );

  // ── ACT 3 — practice session: select, then confirm ──────────────────
  tl.addLabel("answer", "make+=1.75")
    .call(step(2), null, "answer")
    .call(() => {
      app.classList.add("is-session");
      clearOptState();
    }, null, "answer")
    .to(makeScreen, { autoAlpha: 0, duration: 0.25 }, "answer")
    .to(ansScreen, { autoAlpha: 1, duration: 0.3 }, "answer+=0.2")
    .to(opts, { autoAlpha: 1, y: 0, duration: 0.28, stagger: 0.05 }, "answer+=0.28")
    .to(fill, { width: "15%", duration: 0.45, ease: "power2.out" }, "answer+=0.35")
    // Pending selection (blue), then correct — same states as QuestionCard.
    .call(() => {
      correct?.classList.add("is-pending");
    }, null, "answer+=1.0")
    .call(() => {
      opts.forEach((el) => {
        el.classList.remove("is-pending");
        el.classList.add(el.dataset.correct ? "is-correct" : "is-faded");
      });
    }, null, "answer+=1.55")
    .to(correct, { scale: 1.03, duration: 0.14 }, "answer+=1.55")
    .to(correct, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.5)" }, "answer+=1.69");

  tl.addLabel("out", "answer+=3.2")
    .to(app, { autoAlpha: 0, scale: 0.97, duration: 0.45 }, "out")
    .call(() => {
      app.classList.remove("is-session");
      clearOptState();
      steps.forEach((el) => el.classList.remove("is-on"));
    }, null, "out");

  return tl;
}
