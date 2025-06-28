export function CenteredContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      {children}
    </div>
  );
}
