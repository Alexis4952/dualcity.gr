"use client"

export function StaticBackground() {
  return (
    <div className="fixed inset-0 z-[-1]" style={{ backgroundColor: "#050816" }}>
      {/* Προσθέτουμε μερικά στατικά αστέρια ως background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  )
}
