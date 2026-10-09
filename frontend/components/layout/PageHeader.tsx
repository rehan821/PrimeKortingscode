import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Optional controls (search, filters) rendered under the description. */
  children?: ReactNode;
}

/** Consistent page hero for every non-home route. */
export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <section className="border-b border-ink-100 bg-brand-50/60">
      <div className="shell py-8 sm:py-10">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-600 sm:text-base">
            {description}
          </p>
        ) : null}
        {children ? <div className="mt-5">{children}</div> : null}
      </div>
    </section>
  );
}
