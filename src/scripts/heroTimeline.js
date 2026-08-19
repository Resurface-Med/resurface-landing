import gsap from "gsap";

/**
 * The hero sequence: a lecture goes in, questions come out, one gets answered.
 *
 * Written as one timeline with named beats so the order and the timing can be
 * read and changed here without touching markup. About nine seconds, then it
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
  const fan = qa("[data-fan]");
  const opts = qa("[data-opt]");
  const exp = q("[data-exp]");
  const countEl = q("[data-count]");
  const caps = qa("[data-cap]");
  const source = q("[data-source]");

  if (!slide || !card) return null;

  // The finished state, held still. Someone who has asked the system for less
  // motion should still see what the product is, not an empty box.
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.set(slide, { autoAlpha: 0 });
    gsap.set([card, qScreen], { autoAlpha: 1 });
    gsap.set([opts, exp], { autoAlpha: 1, y: 0 });
    gsap.set(caps[2], { autoAlpha: 1 });
    return null;
  }

  const correct = opts.find((o) => o.dataset.correct);
  const counter = { n: 0 };

  const GREEN = "#1f9d55";
  const GREEN_BG = "rgba(31, 157, 85, 0.1)";

  const tl = gsap.timeline({
    repeat: -1,
    repeatDelay: 1.2,
    defaults: { ease: "power2.out" },
  });

  // Everything starts from a known state so a repeat looks like the first run.
  tl.set(card, { autoAlpha: 0, scale: 0.92, y: 18 })
    .set([genScreen, qScreen], { autoAlpha: 0 })
    .set(fan, { autoAlpha: 0, y: 12, rotate: 0, x: 0 })
    .set(opts, { autoAlpha: 0, y: 10, borderColor: "", backgroundColor: "", color: "" })
    .set(exp, { autoAlpha: 0, y: 6 })
    .set(scan, { autoAlpha: 0, top: "-46%" })
    .set(slide, { autoAlpha: 0, scale: 0.94, y: 26, rotate: -2.5 })
    .set(caps, { autoAlpha: 0, y: 5 })
    .set(source, { backgroundColor: "rgba(53,98,245,0)", color: "" })
    .set(counter, { n: 0 });

  /**
   * Swap the caption line. `pos` is any GSAP position — a number or a label —
   * so a caption is placed against the beat it names rather than a time that
   * has to be kept in step by hand. Labels resolve on insert, so each call has
   * to come after the label it refers to has been added.
   */
  const caption = (i, pos) => {
    tl.to(caps.filter((_, j) => j !== i), { autoAlpha: 0, duration: 0.22 }, pos)
      .to(caps[i], { autoAlpha: 1, y: 0, duration: 0.32 }, pos);
  };

  // ── 1. The lecture is over ──────────────────────────────────────────
  tl.addLabel("lecture")
    .to(slide, { autoAlpha: 1, scale: 1, y: 0, rotate: -1.5, duration: 0.7 })
    .to(slide, { rotate: 0, duration: 0.5 }, "-=0.15");
  caption(0, 0.35);

  // ── 2. It goes in, and is read ──────────────────────────────────────
  tl.addLabel("drop", "+=0.45")
    .to(scan, { autoAlpha: 1, duration: 0.2 }, "drop")
    .to(scan, { top: "100%", duration: 0.95, ease: "none" }, "drop")
    .to(scan, { autoAlpha: 0, duration: 0.2 }, "drop+=0.85")
    // The line the question below is taken from lights as the scan passes it,
    // so "written from your lecture" is shown rather than claimed.
    .to(
      source,
      { backgroundColor: "rgba(53,98,245,0.14)", color: "var(--blue)", duration: 0.25 },
      "drop+=0.5",
    )
    // Falls into the card's place and hands over.
    .to(slide, { y: 34, scale: 0.86, autoAlpha: 0, duration: 0.5, ease: "power2.in" }, "drop+=0.8")
    .to(card, { autoAlpha: 1, scale: 1, y: 0, duration: 0.55 }, "drop+=0.95");

  // ── 3. Questions come out of it ─────────────────────────────────────
  tl.addLabel("generate", "drop+=1.25")
    .to(genScreen, { autoAlpha: 1, duration: 0.3 }, "generate")
    .to(
      fan,
      {
        autoAlpha: 1,
        y: 0,
        x: (i) => [-16, 0, 16][i],
        rotate: (i) => [-7, 0, 7][i],
        duration: 0.5,
        stagger: 0.11,
        ease: "back.out(1.6)",
      },
      "generate+=0.1",
    )
    .to(
      counter,
      {
        n: 12,
        duration: 0.9,
        ease: "power1.out",
        onUpdate: () => {
          countEl.textContent = String(Math.round(counter.n));
        },
      },
      "generate+=0.15",
    );
  caption(1, "generate+=0.1");

  // ── 4. Answering one ────────────────────────────────────────────────
  tl.addLabel("answer", "generate+=1.55")
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
  caption(2, "answer+=0.25");

  // Hold on the answered question, then clear for the loop.
  tl.addLabel("out", "answer+=3.1")
    .to(card, { autoAlpha: 0, scale: 0.96, duration: 0.45 }, "out")
    .to(caps, { autoAlpha: 0, duration: 0.3 }, "out");

  return tl;
}
