export const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 to-black">
    <div className="text-center animate-in fade-in-0 duration-300">
      <img
        src="/m5logo.svg"
        alt="M5 Max"
        className="w-16 h-16 mx-auto opacity-80 animate-pulse"
        style={{ willChange: 'opacity' }}
      />
    </div>
  </div>
);
