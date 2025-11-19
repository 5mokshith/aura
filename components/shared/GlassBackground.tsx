"use client";

export function GlassBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Subtle yellow accent orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-yellow-500/5 rounded-full filter blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-yellow-400/5 rounded-full filter blur-3xl" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(250, 204, 21, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(250, 204, 21, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  );
}
