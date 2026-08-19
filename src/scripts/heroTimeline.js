import gsap from "gsap";

/**
 * Hero sequence on one persistent card.
 *
 * 1. Lecture lands
 * 2. Scan reads the line that will become the question
 * 3. That line births a fan of questions
 * 4. First try — wrong answer
 * 5. Same question returns quieter, answered right
 *
 * Named labels so beats can be retimed without hunting absolute offsets.
 * Transforms only — the card never swaps for a second element.
 */
export function buildHeroTimeline() {
  const root = document.querySelector("[data-hero-demo]");
  if (!root) return null;

  const q = (sel) => root.querySelector(sel);
  const qa = (sel) => Array.from(root.querySelectorAll(sel));

  const card = q("[data-card]");
  const lecture = q('[data-layer="lecture"]');
  const make = q('[data-layer="make"]');
  const quiz = q('[data-layer="quiz"]');
  const scan = q("[data-scan]");
  const source = q("[data-source]");
  const bullets = qa(".hd-bullets li");
  const fan = qa("[data-fan]");
  const countEl = q("[data-count]");
  const stem = q("[data-stem]");
  const opts = qa("[data-opt]");
  const wrong = opts.find((o) => o.dataset.wrong);
  const correct = opts.find((o) => o.dataset.correct);
  const verdict = q("[data-verdict]");
  const ret = q("[data-return]");
  const caps = qa("[data-cap]");

  if (!card || !lecture || !quiz || !wrong || !correct) return null;

  const BLUE = "#3562f5";
  const BLUE_BG = "rgba(53, 98, 245, 0.12)";
  const INK_SOFT = "#5a6485";
  const counter = { n: 0 };

  const caption = (i, pos) => {
    tl.to(
      caps.filter((_, j) => j !== i),
      { autoAlpha: 0, duration: 0.2 },
      pos,
    ).to(caps[i], { autoAlpha: 1, y: 0, duration: 0.3 }, pos);
  };

  // Still end-state for reduced motion — the product, not an empty box.
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.set([lecture, make], { autoAlpha: 0 });
    gsap.set([card, quiz], { autoAlpha: 1 });
    gsap.set(ret, { autoAlpha: 1 });
    gsap.set(opts, { autoAlpha: 1 });
    gsap.set(correct, {
      borderColor: BLUE,
      backgroundColor: BLUE_BG,
      color: BLUE,
    });
    gsap.set(verdict, { autoAlpha: 1 });
    verdict.textContent = "Known.";
    verdict.classList.add("is-hit");
    gsap.set(caps[3], { autoAlpha: 1 });
    return null;
  }

  const tl = gsap.timeline({
    repeat: -1,
    repeatDelay: 1.1,
    defaults: { ease: "power2.out" },
  });

  // Known start — every repeat looks like the first run.
  tl.set(card, { autoAlpha: 0, scale: 0.9, y: 28, rotate: -2.2 })
    .set(lecture, { autoAlpha: 0, y: 0 })
    .set(make, { autoAlpha: 0, scale: 1 })
    .set(quiz, { autoAlpha: 0, y: 0 })
    .set(scan, { autoAlpha: 0, top: "-42%" })
    .set(source, {
      backgroundColor: "rgba(53,98,245,0)",
      color: "",
      fontWeight: 500,
      scale: 1,
      y: 0,
      clearProps: "backgroundColor,color,fontWeight",
    })
    .set(
      bullets.filter((b) => b !== source),
      { autoAlpha: 1, x: 0 },
    )
    .set(fan, { autoAlpha: 0, y: 18, rotate: 0, x: 0, scale: 0.85 })
    .set(opts, {
      autoAlpha: 0,
      y: 12,
      x: 0,
      borderColor: "",
      backgroundColor: "",
      color: "",
      scale: 1,
      opacity: 1,
      clearProps: "borderColor,backgroundColor,color,textDecoration",
    })
    .set(stem, { autoAlpha: 1, y: 0 })
    .set(ret, { autoAlpha: 0, y: -4 })
    .set(verdict, { autoAlpha: 0, y: 4 })
    .set(caps, { autoAlpha: 0, y: 6 })
    .set(counter, { n: 0 })
    .call(() => {
      countEl.textContent = "0";
      verdict.textContent = "";
      verdict.classList.remove("is-miss", "is-hit");
      quiz.classList.remove("is-quiet");
    });

  // ── 1. Lecture lands ────────────────────────────────────────────────
  tl.addLabel("lecture")
    .to(card, { autoAlpha: 1, scale: 1, y: 0, rotate: -0.6, duration: 0.7, ease: "back.out(1.4)" }, "lecture")
    .to(lecture, { autoAlpha: 1, duration: 0.35 }, "lecture+=0.15")
    .to(card, { rotate: 0, duration: 0.45 }, "lecture+=0.45");
  caption(0, "lecture+=0.25");

  // ── 2. Read the line that becomes the question ──────────────────────
  tl.addLabel("read", "+=0.55")
    .to(scan, { autoAlpha: 1, duration: 0.18 }, "read")
    .to(scan, { top: "100%", duration: 1.05, ease: "none" }, "read")
    .to(scan, { autoAlpha: 0, duration: 0.2 }, "read+=0.95")
    .to(
      source,
      {
        backgroundColor: "rgba(53,98,245,0.16)",
        color: BLUE,
        fontWeight: 700,
        duration: 0.28,
      },
      "read+=0.48",
    )
    // Other bullets step aside — attention collapses onto one fact.
    .to(
      bullets.filter((b) => b !== source),
      { autoAlpha: 0.28, x: -4, duration: 0.35, stagger: 0.04 },
      "read+=0.55",
    )
    .to(source, { scale: 1.04, duration: 0.35, ease: "power2.out" }, "read+=0.7");

  // ── 3. That line becomes questions ──────────────────────────────────
  tl.addLabel("make", "read+=1.25")
    .to(lecture, { autoAlpha: 0, y: -10, duration: 0.4, ease: "power2.in" }, "make")
    .to(make, { autoAlpha: 1, duration: 0.35 }, "make+=0.25")
    .to(
      fan,
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        x: (i) => [-22, 0, 22][i],
        rotate: (i) => [-9, 0, 9][i],
        duration: 0.55,
        stagger: 0.1,
        ease: "back.out(1.7)",
      },
      "make+=0.3",
    )
    .to(
      counter,
      {
        n: 12,
        duration: 0.95,
        ease: "power1.out",
        onUpdate: () => {
          countEl.textContent = String(Math.round(counter.n));
        },
      },
      "make+=0.35",
    );
  caption(1, "make+=0.2");

  // ── 4. First try — miss ─────────────────────────────────────────────
  tl.addLabel("try", "make+=1.7")
    .to(make, { autoAlpha: 0, scale: 0.96, duration: 0.3 }, "try")
    .set(quiz, { autoAlpha: 0, y: 10 }, "try")
    .to(quiz, { autoAlpha: 1, y: 0, duration: 0.4 }, "try+=0.2")
    .to(opts, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.07 }, "try+=0.35")
    // Hesitation, then the wrong pick.
    .to(
      wrong,
      {
        borderColor: "rgba(15,27,61,0.35)",
        backgroundColor: "rgba(15,27,61,0.06)",
        color: INK_SOFT,
        duration: 0.28,
      },
      "try+=1.25",
    )
    .to(wrong, { x: -5, duration: 0.07 }, "try+=1.35")
    .to(wrong, { x: 5, duration: 0.07 }, "try+=1.42")
    .to(wrong, { x: -3, duration: 0.06 }, "try+=1.49")
    .to(wrong, { x: 0, duration: 0.08 }, "try+=1.55")
    .to(
      wrong,
      {
        textDecoration: "line-through",
        opacity: 0.55,
        duration: 0.25,
      },
      "try+=1.6",
    )
    .call(
      () => {
        verdict.textContent = "Not yet.";
        verdict.classList.add("is-miss");
      },
      null,
      "try+=1.6",
    )
    .to(verdict, { autoAlpha: 1, y: 0, duration: 0.3 }, "try+=1.65");
  caption(2, "try+=0.25");

  // Sink — the gap before it resurfaces.
  tl.addLabel("sink", "try+=2.55")
    .to(verdict, { autoAlpha: 0, duration: 0.25 }, "sink")
    .to(card, { y: 18, scale: 0.94, autoAlpha: 0.35, duration: 0.55, ease: "power2.in" }, "sink")
    .to(caps, { autoAlpha: 0, duration: 0.25 }, "sink");

  // ── 5. Comes back easier ────────────────────────────────────────────
  tl.addLabel("return", "sink+=0.7")
    .call(() => {
      quiz.classList.add("is-quiet");
      verdict.textContent = "";
      verdict.classList.remove("is-miss");
      // Reset option chrome for the quieter pass.
      gsap.set(opts, {
        borderColor: "",
        backgroundColor: "",
        color: "",
        textDecoration: "none",
        opacity: 1,
        scale: 1,
      });
      // Distractors start already faded — less to think about.
      gsap.set(
        opts.filter((o) => o !== correct),
        { opacity: 0.35 },
      );
    }, null, "return")
    .set(ret, { autoAlpha: 0, y: -6 }, "return")
    .to(
      card,
      { y: 0, scale: 1, autoAlpha: 1, duration: 0.65, ease: "back.out(1.5)" },
      "return",
    )
    .to(ret, { autoAlpha: 1, y: 0, duration: 0.35 }, "return+=0.15")
    .to(
      correct,
      {
        borderColor: BLUE,
        backgroundColor: BLUE_BG,
        color: BLUE,
        duration: 0.35,
      },
      "return+=0.85",
    )
    .to(correct, { scale: 1.03, duration: 0.14 }, "return+=0.85")
    .to(correct, { scale: 1, duration: 0.35, ease: "elastic.out(1, 0.55)" }, "return+=0.99")
    .call(
      () => {
        verdict.textContent = "Got it — less effort this time.";
        verdict.classList.add("is-hit");
      },
      null,
      "return+=1.15",
    )
    .to(verdict, { autoAlpha: 1, y: 0, duration: 0.35 }, "return+=1.15");
  caption(3, "return+=0.1");

  // Hold, then clear for the loop.
  tl.addLabel("out", "return+=3.0")
    .to(card, { autoAlpha: 0, scale: 0.96, y: -8, duration: 0.45 }, "out")
    .to(caps, { autoAlpha: 0, duration: 0.3 }, "out")
    .set(lecture, { y: 0 }, "out+=0.4")
    .set(make, { scale: 1 }, "out+=0.4");

  return tl;
}
