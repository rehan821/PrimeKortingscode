import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Optional controls (search, filters) rendered under the description. */
  children?: ReactNode;
}

/** Clean, editorial title band shared by directory pages. */
export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <section className="border-b border-ink-100 bg-white">
      <div className="shell py-7 sm:py-9">
        <h1 className="text-3xl font-black tracking-tight text-ink-950 sm:text-4xl lg:text-[2.75rem]">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm font-semibold uppercase leading-relaxed tracking-wide text-ink-600 sm:text-base">{description}</p> : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </section>
  );
}
