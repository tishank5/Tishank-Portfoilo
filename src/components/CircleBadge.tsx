import { Asterisk } from "lucide-react";

export const CircleBadge = () => {
  return (
    <div className="relative w-[120px] h-[120px]">
      {/* Circular Text */}
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
        <defs>
          <path
            id="circlePath"
            d="M 60, 60 m -50, 0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0"
          />
        </defs>
        <text className="fill-white uppercase tracking-[0.3em]" style={{ fontSize: '11px', letterSpacing: '0.3em' }}>
          <textPath href="#circlePath" startOffset="0%">
            SCROLL DOWN • SCROLL DOWN • 
          </textPath>
        </text>
      </svg>
      
      {/* Center Asterisk */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Asterisk className="w-8 h-8 text-white" />
      </div>
    </div>
  );
};
