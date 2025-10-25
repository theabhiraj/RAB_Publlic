interface DoorElementProps {
  width: number;
  height: number;
  subType?: string;
}

export default function DoorElement({ width, height, subType }: DoorElementProps) {
  const isDouble = subType === 'double';

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      {/* Door frame */}
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill="#8b4513"
        stroke="#654321"
        strokeWidth="2"
      />

      {isDouble ? (
        <>
          {/* Double door - left panel */}
          <rect
            x="2"
            y="2"
            width={width / 2 - 3}
            height={height - 4}
            fill="#d2691e"
            stroke="#654321"
            strokeWidth="1"
          />
          {/* Double door - right panel */}
          <rect
            x={width / 2 + 1}
            y="2"
            width={width / 2 - 3}
            height={height - 4}
            fill="#d2691e"
            stroke="#654321"
            strokeWidth="1"
          />
          {/* Door handles */}
          <circle cx={width / 2 - 5} cy={height / 2} r="2" fill="#ffd700" />
          <circle cx={width / 2 + 5} cy={height / 2} r="2" fill="#ffd700" />
          {/* Center line */}
          <line
            x1={width / 2}
            y1="2"
            x2={width / 2}
            y2={height - 2}
            stroke="#654321"
            strokeWidth="2"
          />
        </>
      ) : (
        <>
          {/* Single door panel */}
          <rect
            x="2"
            y="2"
            width={width - 4}
            height={height - 4}
            fill="#d2691e"
            stroke="#654321"
            strokeWidth="1"
          />
          {/* Door handle */}
          <circle cx={width - 8} cy={height / 2} r="2.5" fill="#ffd700" />
          {/* Door panels (decorative) */}
          <rect
            x={width * 0.15}
            y={height * 0.15}
            width={width * 0.7}
            height={height * 0.3}
            fill="none"
            stroke="#654321"
            strokeWidth="1"
            opacity="0.5"
          />
          <rect
            x={width * 0.15}
            y={height * 0.55}
            width={width * 0.7}
            height={height * 0.3}
            fill="none"
            stroke="#654321"
            strokeWidth="1"
            opacity="0.5"
          />
        </>
      )}
    </svg>
  );
}
