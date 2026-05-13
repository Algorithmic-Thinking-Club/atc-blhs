type SectionProps = {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
};

export default function Section({
  title,
  subtitle,
  children,
  className = "",
}: SectionProps) {
  return (
    <section className={`py-16 sm:py-20 ${className}`}>
      <div className="mx-auto max-w-6xl px-6">
        {title && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-zinc-400">{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
