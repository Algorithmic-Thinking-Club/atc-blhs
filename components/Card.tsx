type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 ${className}`}
    >
      {children}
    </div>
  );
}
