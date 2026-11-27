import { AnimatedText } from "@/components/common/AnimatedText";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ArrowRightIcon,
  CaretLeftIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { cn } from "@turtle-ui/utils";
import { CONTACT_INFO } from "@/constants/constants";
import { HERO } from "@/features/home/constants/homeData";
import { hoverTo } from "@/hooks/useHoverMotion";
import { BRIEF } from "./briefData";

gsap.registerPlugin(useGSAP);

// Same delivery as the other contact form: a form endpoint if set, otherwise the visitor's email app.
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TOTAL = BRIEF.steps.length;
const reduceMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const WIDE = "(min-width: 901px)"; // two columns (intro + card) from here up

// Colours
const INK = "text-[#3d3b52]";
const MUTED = "text-[#8d8aa3]";
const FOCUS_DARK = "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#17171b]";
const MONO = "font-home-mono font-medium";

const Avatar = () => (
  <span
    className="grid size-[50px] flex-none place-items-center overflow-hidden rounded-full bg-avatar"
    aria-hidden="true"
  >
    {HERO.avatar ? (
      <img src={HERO.avatar} alt="" className="size-full object-cover" />
    ) : (
      <img src="/svgs/icon.svg" alt="" className="size-1/2 object-contain" />
    )}
  </span>
);

/* Three dots bouncing in turn (GSAP loop) */
const TypingDots = () => {
  const ref = useRef(null);
  useGSAP(() => {
    if (reduceMotion()) return;
    gsap.to(ref.current.children, {
      keyframes: [
        { y: -4, opacity: 1, duration: 0.3, ease: "sine.out" },
        { y: 0, opacity: 0.45, duration: 0.3, ease: "sine.in" },
        { duration: 0.4 },
      ],
      repeat: -1,
      stagger: 0.15,
    });
  }, { scope: ref });
  return (
    <span
      ref={ref}
      className="inline-flex gap-[5px] rounded-[18px_18px_18px_6px] bg-[#f3f3f6] px-[18px] py-4"
      aria-label="Typing"
    >
      <i className="size-[7px] rounded-full bg-[#8d8aa3] opacity-45" />
      <i className="size-[7px] rounded-full bg-[#8d8aa3] opacity-45" />
      <i className="size-[7px] rounded-full bg-[#8d8aa3] opacity-45" />
    </span>
  );
};

/* Message bubble that pops in with a little overshoot */
const Bubble = ({ lines }) => {
  const ref = useRef(null);
  useGSAP(() => {
    if (reduceMotion()) return;
    gsap.from(ref.current, { autoAlpha: 0, scale: 0.85, y: 8, duration: 0.45, ease: "back.out(2.2)" });
  });
  return (
    <p
      ref={ref}
      className="m-0 flex origin-bottom-left flex-col rounded-[22px_22px_22px_6px] bg-[#f3f3f6] px-7 py-[18px] text-[18px] leading-[1.55] max-[560px]:px-5 max-[560px]:py-3.5 max-[560px]:text-base"
      role="status"
    >
      {lines.map((line) => (
        <span key={line}>{line}</span>
      ))}
    </p>
  );
};

/* Chat message that "types" first (three dots), then pops in. */
const ChatBubble = ({ lines, meta, start = true }) => {
  const [typing, setTyping] = useState(true);
  useEffect(() => {
    if (!start) return;
    const t = setTimeout(() => setTyping(false), reduceMotion() ? 0 : 1300);
    return () => clearTimeout(t);
  }, [start]);
  return (
    <div className="flex items-end gap-3.5">
      <Avatar />
      <div className="flex flex-col gap-2">
        {typing ? <TypingDots /> : <Bubble lines={lines} />}
        {!typing && meta && (
          <span className={cn(MONO, MUTED, "text-right text-xs leading-[1.4]")}>{meta}</span>
        )}
      </div>
    </div>
  );
};

/* "2 of 4" + bars; the current bar is longer and dark. Bars grow/shrink with GSAP. */
const BAR = { current: { width: 40, backgroundColor: "#17171b" }, done: { width: 26, backgroundColor: "#8d8aa3" }, next: { width: 26, backgroundColor: "#d7d6e0" } };
const barState = (i, step) => (i === step ? "current" : i < step ? "done" : "next");

const Progress = ({ step }) => {
  const barsRef = useRef(null);
  const prevStep = useRef(step);
  useGSAP(() => {
    const from = prevStep.current;
    prevStep.current = step;
    if (from === step || reduceMotion()) return;
    [...barsRef.current.children].forEach((bar, i) => {
      const was = barState(i, from);
      const now = barState(i, step);
      if (was !== now) gsap.fromTo(bar, BAR[was], { ...BAR[now], duration: 0.4, ease: "power2.out", clearProps: "width,backgroundColor" });
    });
  }, { dependencies: [step] });

  return (
    <div className="flex items-center justify-center gap-[18px]" aria-label={`Step ${step + 1} of ${TOTAL}`}>
      <span className={cn(MONO, "text-sm leading-none text-[#6c6a80]")}>
        {step + 1} of {TOTAL}
      </span>
      <span ref={barsRef} className="flex gap-2.5" aria-hidden="true">
        {BRIEF.steps.map((s, i) => {
          const state = barState(i, step);
          return (
            <i
              key={s.key}
              className={cn(
                "block h-[3px] w-[26px] rounded-[3px] bg-[#d7d6e0]",
                state === "done" && "bg-[#8d8aa3]",
                state === "current" && "w-10 bg-[#17171b]",
              )}
            />
          );
        })}
      </span>
    </div>
  );
};

// Section grid, open (intro + card) and focused (card only, centred)
const GRID_OPEN = "minmax(0px, 0.9fr) minmax(0px, 1.1fr)";
const GRID_FOCUSED = "minmax(0px, 0fr) minmax(0px, 1fr)";
const openGap = () => `${Math.min(110, Math.max(32, window.innerWidth * 0.06))}px`; // clamp(32px, 6vw, 110px)

/**
 * 4-step brief form.
 *   id:           section id (the home page uses "contact" so /#contact links land here)
 *   headingLevel: "h1" on the Contact page, "h2" on the home page (the hero has the h1)
 *   variant:      "section" (intro column + card) or "modal" (compact header + card, for the popup)
 *   intent:       popup header: "general" | "call" | "proposal" (see BRIEF.modal)
 *   className:    extra classes for the section (e.g. the home page's vertical rhythm)
 */
export const BriefSection = ({ id, headingLevel = "h1", variant = "section", intent = "general", className }) => {
  const Heading = headingLevel;
  const isModal = variant === "modal";
  // Unique ids: the home section and the popup can be on the page at the same time
  const uid = useId();
  const ids = { title: `${uid}-title`, name: `${uid}-name`, email: `${uid}-email` };
  const header = BRIEF.modal[intent] || BRIEF.modal.general;
  const sectionRef = useRef(null);
  const introRef = useRef(null);
  const stepRef = useRef(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [picked, setPicked] = useState(null); // option just clicked (pressed look before moving on)
  const [form, setForm] = useState({ name: "", email: "", about: "" });
  const [error, setError] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | failed
  const [chatVisible, setChatVisible] = useState(false);
  const dir = useRef(1);
  const current = BRIEF.steps[step];

  // Start the left-hand chat when the section scrolls into view
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setChatVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  // Each new step slides in (from the right going forward, from the left going back)
  useLayoutEffect(() => {
    const el = stepRef.current;
    if (!el || reduceMotion()) return;
    const tween = gsap.fromTo(
      el,
      { autoAlpha: 0, x: 28 * dir.current },
      { autoAlpha: 1, x: 0, duration: 0.5, ease: "power3.out" },
    );
    return () => tween.kill();
  }, [step, status]);

  const go = (next) => {
    dir.current = next > step ? 1 : -1;
    const el = stepRef.current;
    if (!el || reduceMotion()) {
      setStep(next);
      return;
    }
    gsap.to(el, {
      autoAlpha: 0,
      x: -20 * dir.current,
      duration: 0.22,
      ease: "power2.in",
      onComplete: () => setStep(next),
    });
  };

  const choose = (option, button) => {
    if (picked) return;
    setPicked(option);
    setAnswers((a) => ({ ...a, [current.key]: option }));
    if (!reduceMotion()) gsap.to(button, { scale: 0.97, duration: 0.15, ease: "power1.out" });
    setTimeout(
      () => {
        setPicked(null);
        go(step + 1);
      },
      reduceMotion() ? 0 : 260,
    );
  };

  // Press feedback on the option buttons
  const press = (scale) => (e) => {
    if (!reduceMotion()) gsap.to(e.currentTarget, { scale, duration: 0.15, ease: "power1.out" });
  };

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (error) setError(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    const name = form.name.trim();
    const email = form.email.trim();
    if (!name || !EMAIL_RE.test(email)) {
      setError(true);
      document.getElementById(!name ? ids.name : ids.email)?.focus();
      return;
    }
    const payload = {
      ...answers,
      name,
      email,
      about: form.about.trim(),
      source: "brief",
      page: window.location.href,
    };
    setStatus("sending");
    try {
      if (ENDPOINT) {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(String(res.status));
      } else {
        const body = [
          `Name: ${name}`,
          `Email: ${email}`,
          `Needs: ${answers.service || "-"}`,
          `Start: ${answers.start || "-"}`,
          `Monthly budget: ${answers.budget || "-"}`,
          "",
          payload.about,
        ].join("\n");
        window.location.href = `mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(`New brief from ${name}`)}&body=${encodeURIComponent(body)}`;
      }
      dir.current = 1;
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  };

  // After step 1 the card moves to the centre (the popup has no intro column, so it starts there)
  const focused = isModal || step > 0 || status === "sent";
  const firstName = form.name.trim().split(/\s+/)[0];

  // Animate between the open and focused layouts: the intro fades out while its column
  // closes, and the card glides to the centre. Tailwind classes hold each end state;
  // GSAP only plays the change, then clears its inline styles.
  const wasFocused = useRef(focused);
  useGSAP(
    () => {
      const from = wasFocused.current;
      wasFocused.current = focused;
      if (isModal || from === focused || reduceMotion() || !window.matchMedia(WIDE).matches) return;
      const ease = "power2.inOut";
      gsap.fromTo(
        sectionRef.current,
        { gridTemplateColumns: from ? GRID_FOCUSED : GRID_OPEN, columnGap: from ? "0px" : openGap() },
        {
          gridTemplateColumns: focused ? GRID_FOCUSED : GRID_OPEN,
          columnGap: focused ? "0px" : openGap(),
          duration: 0.7,
          ease,
          clearProps: "gridTemplateColumns,columnGap",
        },
      );
      gsap.fromTo(
        introRef.current,
        { autoAlpha: from ? 0 : 1 },
        { autoAlpha: focused ? 0 : 1, duration: 0.35, ease: "power1.out", clearProps: "opacity,visibility" },
      );
    },
    { dependencies: [focused, isModal] },
  );

  const optionBase = cn(
    "min-h-16 cursor-pointer rounded-full border border-transparent bg-white px-5 font-[inherit] text-[17px] max-[560px]:min-h-14",
    INK,
    FOCUS_DARK,
  );
  const inputBase = cn(
    "min-h-[60px] w-full rounded-[18px] border border-transparent bg-white px-5 py-4 font-[inherit] text-base placeholder:text-[#8d8aa3] focus:border-[#17171b] focus:shadow-[0_0_0_4px_rgba(255,212,0,0.45)] focus:outline-none",
    INK,
  );
  const inputError = "border-[#e5484d] shadow-[0_0_0_3px_rgba(229,72,77,0.15)]";
  const fieldLabel = cn(MONO, "pl-5 text-sm leading-[1.4] text-[#6c6a80]");
  const errorText = "-mt-1.5 mb-0 ml-1 flex items-center gap-1.5 text-sm text-[#c8323a] [&_a]:underline";

  return (
    <section
      id={id}
      ref={sectionRef}
      aria-labelledby={ids.title}
      className={cn(
        INK,
        isModal
          ? "block w-full"
          : cn(
              "mx-auto grid w-full max-w-[1640px] grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-stretch gap-[clamp(32px,6vw,110px)] px-[clamp(22px,4vw,80px)] pt-[clamp(40px,6vw,90px)] pb-[clamp(70px,8vw,120px)] max-[900px]:grid-cols-1 max-[900px]:gap-9",
              focused && "min-[901px]:grid-cols-[minmax(0,0fr)_minmax(0,1fr)] min-[901px]:gap-0",
            ),
        className,
      )}
    >
      {isModal ? (
        <header className="pr-14 pb-[22px] pl-1">
          <AnimatedText as={Heading} id={ids.title} className="m-0 text-[clamp(26px,2.4vw,36px)] font-normal leading-[1.12] tracking-[-0.04em]">
            {header.title} <span className={cn("block", MUTED)}>{header.muted}</span>
          </AnimatedText>
        </header>
      ) : (
        <div
          ref={introRef}
          aria-hidden={focused}
          className={cn(
            // Children keep their own width while the column closes (clipped, not re-wrapped)
            "flex min-w-0 flex-col overflow-hidden [&>*]:w-[clamp(320px,38vw,640px)] [&>*]:max-w-none max-[900px]:[&>*]:w-auto",
            focused && "invisible opacity-0 max-[900px]:hidden",
          )}
        >
          <AnimatedText as={Heading} id={ids.title} className="m-0 text-[clamp(36px,3.4vw,58px)] font-normal leading-[1.08] tracking-[-0.05em]">
            {BRIEF.title} <span className={cn("block", MUTED)}>{BRIEF.muted}</span>
          </AnimatedText>
          <AnimatedText as="p" className="mt-[22px] mb-0 text-[18px] text-[#6c6a80]">{BRIEF.note}</AnimatedText>
          <div className="mt-auto pt-14 max-[900px]:pt-8">
            <ChatBubble lines={BRIEF.message} start={chatVisible} />
            <span className={cn(MONO, MUTED, "mt-2 ml-16 block text-[13px] leading-[1.4]")}>{BRIEF.signature}</span>
          </div>
        </div>
      )}

      <div
        className={cn(
          "flex w-full flex-col justify-self-center rounded-[32px] bg-[#f3f3f6] px-[clamp(20px,3.4vw,56px)] pt-[clamp(28px,3.4vw,56px)] pb-7",
          isModal
            ? "min-h-[440px] max-[560px]:min-h-0 max-[560px]:rounded-3xl max-[560px]:px-4 max-[560px]:pt-6 max-[560px]:pb-[18px]"
            : "min-h-[480px] max-w-[1000px] shadow-[0_0_0_1px_#ededf2,0_24px_60px_rgba(40,40,70,0.05)] max-[900px]:min-h-0",
        )}
      >
        {status === "sent" ? (
          <div className="flex flex-1 flex-col items-center justify-center" ref={stepRef}>
            <ChatBubble
              lines={[BRIEF.thanks.replace("{name}", firstName || "there")]}
              meta={BRIEF.delivered}
            />
          </div>
        ) : (
          <div className="flex flex-1 flex-col justify-center" ref={stepRef} key={step}>
            <h2
              className="mt-0 mb-[clamp(24px,3vw,44px)] text-center text-[clamp(24px,2vw,32px)] font-normal tracking-[-0.03em]"
              aria-live="polite"
            >
              {current.question}
            </h2>

            {current.options ? (
              <div
                className="mx-auto grid w-full max-w-[700px] grid-cols-2 gap-3.5 max-[560px]:grid-cols-1"
                role="group"
                aria-label={current.question}
              >
                {current.options.map((option) => {
                  const selected = answers[current.key] === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      className={cn(
                        optionBase,
                        selected && "border-bee-yellow bg-bee-yellow text-[#17171b] shadow-[0_6px_18px_rgba(255,196,0,0.35)]",
                      )}
                      aria-pressed={selected}
                      onClick={(e) => choose(option, e.currentTarget)}
                      onPointerDown={press(0.97)}
                      onPointerUp={picked ? undefined : press(1)}
                      onPointerLeave={picked ? undefined : press(1)}
                      {...(selected ? {} : { "data-hover": "", ...hoverTo({ borderColor: "#ffd400", backgroundColor: "#fffbe6", duration: 0.2 }) })}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            ) : (
              <form className="mx-auto flex w-full max-w-[660px] flex-col gap-[18px]" onSubmit={submit} noValidate>
                <div className="grid grid-cols-2 gap-5 max-[560px]:grid-cols-1">
                  <label className="flex flex-col gap-2.5">
                    <span className={fieldLabel}>{BRIEF.fields.name}</span>
                    <input
                      id={ids.name}
                      value={form.name}
                      onChange={set("name")}
                      autoComplete="name"
                      aria-invalid={error && !form.name.trim()}
                      className={cn(inputBase, error && !form.name.trim() && inputError)}
                    />
                  </label>
                  <label className="flex flex-col gap-2.5">
                    <span className={fieldLabel}>{BRIEF.fields.email}</span>
                    <input
                      id={ids.email}
                      type="email"
                      inputMode="email"
                      value={form.email}
                      onChange={set("email")}
                      autoComplete="email"
                      aria-invalid={error && !EMAIL_RE.test(form.email.trim())}
                      className={cn(inputBase, error && !EMAIL_RE.test(form.email.trim()) && inputError)}
                    />
                  </label>
                </div>
                {error && (
                  <p className={errorText} role="alert">
                    <WarningCircleIcon size={16} aria-hidden="true" />{" "}
                    {BRIEF.error}
                  </p>
                )}
                <label className="flex flex-col gap-2.5">
                  <span className={fieldLabel}>{BRIEF.fields.about}</span>
                  <textarea
                    rows={4}
                    value={form.about}
                    onChange={set("about")}
                    placeholder={BRIEF.fields.aboutPlaceholder}
                    className={cn(inputBase, "min-h-[120px] resize-y")}
                  />
                </label>
                {status === "failed" && (
                  <p className={errorText} role="alert">
                    <WarningCircleIcon size={16} aria-hidden="true" /> Something
                    went wrong. Please try again or email{" "}
                    <a href={`mailto:${CONTACT_INFO.email}`}>
                      {CONTACT_INFO.email}
                    </a>
                    .
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className={cn(
                    "relative mt-2.5 inline-flex min-h-[60px] cursor-pointer items-center justify-center gap-3 rounded-full border-0 font-[inherit] text-[18px] font-medium text-white",
                    "bg-[radial-gradient(120%_120%_at_50%_0%,#34343a_0%,#17171b_55%,#0b0b0d_100%)] shadow-[0_10px_24px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.18)]",
                    "disabled:cursor-progress disabled:bg-none disabled:bg-[#b9b8c4] disabled:shadow-none",
                    FOCUS_DARK,
                  )}
                  {...(status === "sending"
                    ? {}
                    : {
                        "data-hover": "",
                        ...hoverTo({ y: -2, boxShadow: "0 14px 30px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.18)", duration: 0.25 }),
                      })}
                >
                  {status === "sending" ? BRIEF.sending : BRIEF.submit}
                  {status !== "sending" && (
                    <span
                      className="grid size-[30px] place-items-center rounded-full bg-bee-yellow text-[#17171b]"
                      aria-hidden="true"
                      {...hoverTo({ x: 4, duration: 0.25 })}
                    >
                      <ArrowRightIcon size={16} weight="bold" />
                    </span>
                  )}
                </button>
                <p className="m-0 text-center text-[15px] text-[#6c6a80]">
                  {BRIEF.privacy} {BRIEF.privacyLink}.
                </p>
              </form>
            )}
          </div>
        )}

        {status !== "sent" && (
          <div className="mt-[clamp(24px,3vw,40px)] grid grid-cols-[44px_1fr_44px] items-center">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => go(step - 1)}
                aria-label="Previous step"
                data-hover=""
                {...hoverTo({ backgroundColor: "#ffd400", x: -2, duration: 0.2 })}
                className={cn(
                  "grid size-11 cursor-pointer place-items-center rounded-full border-0 bg-white shadow-[0_4px_12px_rgba(40,40,70,0.06)]",
                  INK,
                  FOCUS_DARK,
                )}
              >
                <CaretLeftIcon size={18} weight="bold" />
              </button>
            ) : (
              <span className="size-11" />
            )}
            <Progress step={step} />
            <span className="size-11" />
          </div>
        )}
      </div>
    </section>
  );
};
