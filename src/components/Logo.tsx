export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 shadow-lg flex-shrink-0">
        <div className="absolute inset-0 flex flex-col">
          <div className="flex-1 bg-[#003580]" />
          <div className="flex-1 bg-[#CC2229]" />
          <div className="flex-1 bg-[#00997A]" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-xs tracking-tighter leading-none" style={{ fontFamily: "'DM Serif Display', serif" }}>AZ</span>
        </div>
      </div>
      <div className="leading-tight">
        <p className="text-white font-bold text-base tracking-wide leading-none">Az Youth UK</p>
        <p className="text-blue-200 text-[10px] tracking-wider uppercase leading-none mt-0.5">Azerbaijan UK Youth Association</p>
      </div>
    </div>
  );
}
