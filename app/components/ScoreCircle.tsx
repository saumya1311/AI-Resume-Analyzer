const ScoreCircle = ({ score = 75 }: { score: number }) => {
  const radius = 42;
  const stroke = 7.5;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const progress = score / 100;
  const strokeDashoffset = circumference * (1 - progress);

  const currentColor = "#2f6b25"; // A darker green for readability against light green/blue

  return (
    <div className="relative w-[96px] h-[96px]">
      <svg
        height="100%"
        width="100%"
        viewBox="0 0 100 100"
        className="transform -rotate-90 drop-shadow-sm"
      >
        <defs>
          <linearGradient id="scoreGreenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            {/* Multi-stop gradient for 4 quarters */}
            <stop offset="0%" stopColor="#69f558" />   {/* Quarter 4 (End) */}
            <stop offset="33%" stopColor="#93ee88" />  {/* Quarter 3 */}
            <stop offset="66%" stopColor="#bdf0b7" />  {/* Quarter 2 */}
            <stop offset="100%" stopColor="#cdebc9" /> {/* Quarter 1 (Start) */}
          </linearGradient>
        </defs>
        
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={normalizedRadius}
          stroke="#f3f4f6"
          strokeWidth={stroke}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={normalizedRadius}
          stroke="url(#scoreGreenGradient)"
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Score text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span 
          className="font-bold text-[14px] tracking-tighter transition-colors duration-500" 
          style={{ color: currentColor }}
        >
          {`${score}/100`}
        </span>
      </div>
    </div>
  );
};

export default ScoreCircle;