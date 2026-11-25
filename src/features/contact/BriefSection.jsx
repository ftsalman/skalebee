import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  ArrowRightIcon,
  CaretLeftIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { CONTACT_INFO } from "@/constants/constants";
import { HERO } from "@/features/home/constants/homeData";
import { BRIEF } from "./briefData";
import "./brief.css";

// Same delivery as the other contact form: a form endpoint if set, otherwise the visitor's email app.
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TOTAL = BRIEF.steps.length;
const reduceMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const Avatar = () => (
  <span className="brief-avatar" aria-hidden="true">
    {HERO.avatar ? (
      <img src={HERO.avatar} alt="" />
    ) : (
      <img src="/svgs/icon.svg" alt="" className="brief-avatar-mark" />
    )}
  </span>
);

/* Chat message that "types" first (three dots), then pops in. */
const ChatBubble = ({ lines, meta, start = true }) => {
  const [typing, setTyping] = useState(true);
  useEffect(() => {
    if (!start) return;
    const t = setTimeout(() => setTyping(false), reduceMotion() ? 0 : 1300);
    return () => clearTimeout(t);
  }, [start]);
  return (
    <div className="brief-chat">
      <Avatar />
      <div className="brief-chat-body">
        {typing ? (
          <span className="brief-typing" aria-label="Typing">
            <i />
            <i />
            <i />
          </span>
        ) : (
          <p className="brief-bubble" role="status">
            {lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        )}
        {!typing && meta && <span className="brief-meta">{meta}</span>}
      </div>
    </div>
  );
};

const Progress = ({ step }) => (
  <div className="brief-progress" aria-label={`Step ${step + 1} of ${TOTAL}`}>
    <span className="brief-progress-text">
      {step + 1} of {TOTAL}
    </span>
    <span className="brief-progress-bars" aria-hidden="true">
      {BRIEF.steps.map((s, i) => (
        <i
          key={s.key}
          className={i === step ? "is-current" : i < step ? "is-done" : ""}
        />
      ))}
    </span>
  </div>
);

/**
 * 4-step brief form.
 *   id:           section id (the home page uses "contact" so /#contact links land here)
 *   headingLevel: "h1" on the Contact page, "h2" on the home page (the hero has the h1)
 *   variant:      "section" (intro column + card) or "modal" (compact header + card, for the popup)
 *   intent:       popup header: "general" | "call" | "proposal" (see BRIEF.modal)
 */
export const BriefSection = ({ id, headingLevel = "h1", variant = "section", intent = "general" }) => {
  const Heading = headingLevel;
  const isModal = variant === "modal";
  // Unique ids: the home section and the popup can be on the page at the same time
  const uid = useId();
  const ids = { title: `${uid}-title`, name: `${uid}-name`, email: `${uid}-email` };
  const header = BRIEF.modal[intent] || BRIEF.modal.general;
  const sectionRef = useRef(null);
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

  const choose = (option) => {
    if (picked) return;
    setPicked(option);
    setAnswers((a) => ({ ...a, [current.key]: option }));
    setTimeout(
      () => {
        setPicked(null);
        go(step + 1);
      },
      reduceMotion() ? 0 : 260,
    );
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

  return (
    <section
      id={id}
      className={`brief${focused ? " is-focused" : ""}${isModal ? " is-modal" : ""}`}
      ref={sectionRef}
      aria-labelledby={ids.title}
    >
      {isModal ? (
        <header className="brief-modal-head">
          <Heading id={ids.title} className="brief-modal-title">
            {header.title} <span>{header.muted}</span>
          </Heading>
        </header>
      ) : (
        <div className="brief-intro" aria-hidden={focused}>
          <Heading id={ids.title} className="brief-title">
            {BRIEF.title} <span>{BRIEF.muted}</span>
          </Heading>
          <p className="brief-note">{BRIEF.note}</p>
          <div className="brief-intro-chat">
            <ChatBubble lines={BRIEF.message} start={chatVisible} />
            <span className="brief-signature">{BRIEF.signature}</span>
          </div>
        </div>
      )}

      <div className="brief-card">
        {status === "sent" ? (
          <div className="brief-step brief-done" ref={stepRef}>
            <ChatBubble
              lines={[BRIEF.thanks.replace("{name}", firstName || "there")]}
              meta={BRIEF.delivered}
            />
          </div>
        ) : (
          <div className="brief-step" ref={stepRef} key={step}>
            <h2 className="brief-question" aria-live="polite">
              {current.question}
            </h2>

            {current.options ? (
              <div
                className="brief-options"
                role="group"
                aria-label={current.question}
              >
                {current.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`brief-option${answers[current.key] === option ? " is-selected" : ""}${picked === option ? " is-picked" : ""}`}
                    aria-pressed={answers[current.key] === option}
                    onClick={() => choose(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <form className="brief-form" onSubmit={submit} noValidate>
                <div className="brief-fields">
                  <label className="brief-field">
                    <span>{BRIEF.fields.name}</span>
                    <input
                      id={ids.name}
                      value={form.name}
                      onChange={set("name")}
                      autoComplete="name"
                      aria-invalid={error && !form.name.trim()}
                      className={error && !form.name.trim() ? "has-error" : ""}
                    />
                  </label>
                  <label className="brief-field">
                    <span>{BRIEF.fields.email}</span>
                    <input
                      id={ids.email}
                      type="email"
                      inputMode="email"
                      value={form.email}
                      onChange={set("email")}
                      autoComplete="email"
                      aria-invalid={error && !EMAIL_RE.test(form.email.trim())}
                      className={
                        error && !EMAIL_RE.test(form.email.trim())
                          ? "has-error"
                          : ""
                      }
                    />
                  </label>
                </div>
                {error && (
                  <p className="brief-error" role="alert">
                    <WarningCircleIcon size={16} aria-hidden="true" />{" "}
                    {BRIEF.error}
                  </p>
                )}
                <label className="brief-field">
                  <span>{BRIEF.fields.about}</span>
                  <textarea
                    rows={4}
                    value={form.about}
                    onChange={set("about")}
                    placeholder={BRIEF.fields.aboutPlaceholder}
                  />
                </label>
                {status === "failed" && (
                  <p className="brief-error" role="alert">
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
                  className="brief-submit"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? BRIEF.sending : BRIEF.submit}
                  {status !== "sending" && (
                    <span className="brief-submit-arrow" aria-hidden="true">
                      <ArrowRightIcon size={16} weight="bold" />
                    </span>
                  )}
                </button>
                <p className="brief-privacy">
                  {BRIEF.privacy} {BRIEF.privacyLink}.
                </p>
              </form>
            )}
          </div>
        )}

        {status !== "sent" && (
          <div className="brief-foot">
            {step > 0 ? (
              <button
                type="button"
                className="brief-back"
                onClick={() => go(step - 1)}
                aria-label="Previous step"
              >
                <CaretLeftIcon size={18} weight="bold" />
              </button>
            ) : (
              <span className="brief-back-spacer" />
            )}
            <Progress step={step} />
            <span className="brief-back-spacer" />
          </div>
        )}
      </div>
    </section>
  );
};
