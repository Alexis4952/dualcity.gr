"use client"

export function ShopBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden">
      {/* Βασικό gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, #050816 0%, #0a1029 50%, #0c1f3b 100%)",
        }}
      />

      {/* Διακοσμητικά στοιχεία - Οριζόντιες γραμμές */}
      <div className="absolute inset-0">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={`line-${i}`}
            className="absolute h-[1px] w-full opacity-20"
            style={{
              top: `${10 + i * 10}%`,
              background:
                "linear-gradient(90deg, transparent 0%, rgba(0, 204, 255, 0.3) 20%, rgba(0, 204, 255, 0.6) 50%, rgba(0, 204, 255, 0.3) 80%, transparent 100%)",
              boxShadow: "0 0 15px rgba(0, 204, 255, 0.5)",
            }}
          />
        ))}
      </div>

      {/* Κύκλοι στο background */}
      <div
        className="absolute top-[10%] right-[5%] w-[300px] h-[300px] rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, rgba(0, 204, 255, 0.4) 0%, rgba(0, 204, 255, 0.1) 50%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div
        className="absolute bottom-[15%] left-[10%] w-[400px] h-[400px] rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, rgba(128, 0, 255, 0.4) 0%, rgba(128, 0, 255, 0.1) 50%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      {/* Εξαγωνικό pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15L30 0z' fillRule='evenodd' stroke='%23ffffff' strokeWidth='1' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Αστέρια */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
          backgroundSize: "70px 70px",
        }}
      />

      {/* Διακοσμητικό στοιχείο - Γωνίες */}
      <div className="absolute top-0 left-0 w-[100px] h-[100px] opacity-30">
        <div className="absolute top-0 left-0 w-[50px] h-[2px] bg-cyan-500"></div>
        <div className="absolute top-0 left-0 w-[2px] h-[50px] bg-cyan-500"></div>
      </div>

      <div className="absolute top-0 right-0 w-[100px] h-[100px] opacity-30">
        <div className="absolute top-0 right-0 w-[50px] h-[2px] bg-purple-500"></div>
        <div className="absolute top-0 right-0 w-[2px] h-[50px] bg-purple-500"></div>
      </div>

      <div className="absolute bottom-0 left-0 w-[100px] h-[100px] opacity-30">
        <div className="absolute bottom-0 left-0 w-[50px] h-[2px] bg-purple-500"></div>
        <div className="absolute bottom-0 left-0 w-[2px] h-[50px] bg-purple-500"></div>
      </div>

      <div className="absolute bottom-0 right-0 w-[100px] h-[100px] opacity-30">
        <div className="absolute bottom-0 right-0 w-[50px] h-[2px] bg-cyan-500"></div>
        <div className="absolute bottom-0 right-0 w-[2px] h-[50px] bg-cyan-500"></div>
      </div>
    </div>
  )
}
