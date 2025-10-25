interface StairsElementProps {
  width: number;
  height: number;
  subType?: string;
}

export default function StairsElement({ width, height, subType }: StairsElementProps) {
  if (subType === 'spiral') {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 100 100"
      >
        {/* Spiral stairs */}
        <circle cx="50" cy="50" r="45" fill="none" stroke="#374151" strokeWidth="2" />
        <circle cx="50" cy="50" r="35" fill="none" stroke="#374151" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="25" fill="none" stroke="#374151" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="15" fill="none" stroke="#374151" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="8" fill="#374151" />
        
        {/* Steps radiating from center */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
          <line
            key={angle}
            x1="50"
            y1="50"
            x2={50 + 45 * Math.cos((angle * Math.PI) / 180)}
            y2={50 + 45 * Math.sin((angle * Math.PI) / 180)}
            stroke="#374151"
            strokeWidth="1"
            opacity="0.5"
          />
        ))}
        
        {/* Arrow indicating direction */}
        <path
          d="M 50 20 L 55 30 L 50 28 L 45 30 Z"
          fill="#2563eb"
        />
      </svg>
    );
  }

  // Straight stairs (default)
  const numSteps = Math.floor(height / 15);
  const stepHeight = height / numSteps;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      {/* Background */}
      <rect x="0" y="0" width={width} height={height} fill="#f3f4f6" stroke="#374151" strokeWidth="2" />
      
      {/* Steps */}
      {Array.from({ length: numSteps }).map((_, i) => {
        const y = i * stepHeight;
        const stepWidth = width * 0.9;
        const indent = (width - stepWidth) / 2;
        
        return (
          <g key={i}>
            {/* Step tread */}
            <rect
              x={indent}
              y={y}
              width={stepWidth}
              height={stepHeight * 0.7}
              fill="#d1d5db"
              stroke="#374151"
              strokeWidth="1"
            />
            {/* Step riser */}
            <line
              x1={indent}
              y1={y + stepHeight * 0.7}
              x2={indent + stepWidth}
              y2={y + stepHeight * 0.7}
              stroke="#374151"
              strokeWidth="1.5"
            />
            {/* Shadow */}
            <line
              x1={indent}
              y1={y}
              x2={indent + stepWidth}
              y2={y}
              stroke="#9ca3af"
              strokeWidth="0.5"
              opacity="0.5"
            />
          </g>
        );
      })}
      
      {/* Handrails */}
      <line
        x1="5"
        y1="0"
        x2="5"
        y2={height}
        stroke="#374151"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1={width - 5}
        y1="0"
        x2={width - 5}
        y2={height}
        stroke="#374151"
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      {/* Direction arrow */}
      <path
        d={`M ${width / 2 - 8} ${height - 15} L ${width / 2} ${height - 5} L ${width / 2 + 8} ${height - 15}`}
        fill="none"
        stroke="#2563eb"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
