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
    <section className="relative overflow-hidden border-b border-ink-200 bg-brand-50">
      {/* Decorative pattern overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 hidden w-1/3 border-l border-brand-100 bg-white/40 lg:block"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="shell relative py-8 sm:py-10">
        <h1 className="text-3xl font-black tracking-tight text-ink-950 sm:text-4xl lg:text-[2.75rem]">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink-600 sm:text-lg">
            {description}
          </p>
        ) : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </section>
  );
}
