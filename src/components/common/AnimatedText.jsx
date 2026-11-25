import { cn } from "@turtle-ui/utils";

/**
 * Splits text into words that slide up one by one (with useScrollAnimations).
 * Words listed in `highlight` get `highlightClassName`.
 *
 *   <AnimatedText as="h2" text="Ads that make your brand buzz" highlight={["buzz"]} />
 */
export const AnimatedText = ({
  as: Tag = "h2",
  text,
  highlight = [],
  highlightClassName = "text-bee-yellow",
  className,
  delay,
}) => {
  const words = text.split(" ");
  return (
    <Tag
      className={cn(className)}
      data-animate="words"
      data-delay={delay}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden="true"
          className="inline-block overflow-hidden pb-[0.08em] align-bottom"
        >
          <span
            className={cn(
              "word-inner inline-block",
              highlight.includes(word.replace(/[.,!?]/g, "")) &&
                highlightClassName,
            )}
          >
            {word}
            {i < words.length - 1 && " "}
          </span>
        </span>
      ))}
    </Tag>
  );
};
