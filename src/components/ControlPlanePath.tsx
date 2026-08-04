const steps = [
  {
    number: "01",
    label: "Provider",
    description:
      "Choose from the coding-agent runtimes already supported by Synara.",
  },
  {
    number: "02",
    label: "Task",
    description:
      "Give each objective its own conversation, status, and owner.",
  },
  {
    number: "03",
    label: "Environment",
    description:
      "Keep the working directory, terminal, browser, and worktree beside that task.",
  },
  {
    number: "04",
    label: "Handoff",
    description:
      "Move the same task to another provider with its context and environment intact.",
  },
  {
    number: "05",
    label: "Evidence",
    description:
      "Run commands, inspect the rendered result, and return findings to the task.",
  },
  {
    number: "06",
    label: "Delivery",
    description:
      "Review the diff, run checks, commit the intended changes, and open the pull request.",
  },
] as const;

export default function ControlPlanePath() {
  return (
    <section
      id="product-story"
      aria-labelledby="product-story-heading"
      className="border-y border-[var(--divide)] bg-[var(--block-elevated)] py-12 sm:py-16"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
            The control plane
          </p>
          <h2
            id="product-story-heading"
            className="mt-3 text-[1.65rem] font-medium leading-[1.12] tracking-[-0.035em] text-[var(--text-primary)] sm:text-[2rem]"
          >
            The task is the thread through the work.
          </h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-[1.65] text-[var(--text-secondary)] sm:text-[16px]">
            Providers, environments, evidence, and delivery stay legible as
            one task moves from objective to pull request.
          </p>
        </div>

        <ol className="mt-10 grid grid-cols-1 divide-y divide-[var(--divide)] border-y border-[var(--divide)] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-6">
          {steps.map(({ number, label, description }) => (
            <li key={number} className="min-w-0 p-5 sm:p-6">
              <span className="font-mono text-[10px] tabular-nums text-[var(--accent-link)]">
                {number}
              </span>
              <h3 className="mt-5 text-[15px] font-medium text-[var(--text-primary)]">
                {label}
              </h3>
              <p className="mt-2 text-[12px] leading-[1.6] text-[var(--text-secondary)] sm:text-[12.5px]">
                {description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
