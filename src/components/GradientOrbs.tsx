export default function GradientOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #8B5CF6, transparent)',
        }}
      />

      <div
        className="absolute top-1/3 -right-20 w-80 h-80 rounded-full opacity-15 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #EC4899, transparent)',
        }}
      />

      <div
        className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full opacity-15 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #A855F7, transparent)',
        }}
      />
    </div>
  );
}