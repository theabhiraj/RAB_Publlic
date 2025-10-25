interface WindowElementProps {
  width: number;
  height: number;
  subType?: string;
}

export default function WindowElement({ width, height, subType }: WindowElementProps) {
  const isLarge = subType === 'large';
  const panes = isLarge ? 4 : 2;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      {/* Window frame */}
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill="#8b7355"
        stroke="#654321"
        strokeWidth="2"
      />

      {/* Glass panes */}
      <rect
        x="3"
        y="3"
        width={width - 6}
        height={height - 6}
        fill="#e0f2fe"
        stroke="#0284c7"
        strokeWidth="1"
        opacity="0.7"
      />

      {/* Window dividers */}
      {panes === 2 ? (
        <>
          {/* Vertical divider */}
          <line
            x1={width / 2}
            y1="3"
            x2={width / 2}
            y2={height - 3}
            stroke="#654321"
            strokeWidth="2"
          />
        </>
      ) : (
        <>
          {/* Vertical divider */}
          <line
            x1={width / 2}
            y1="3"
            x2={width / 2}
            y2={height - 3}
            stroke="#654321"
            strokeWidth="2"
          />
          {/* Horizontal divider */}
          <line
            x1="3"
            y1={height / 2}
            x2={width - 3}
            y2={height / 2}
            stroke="#654321"
            strokeWidth="2"
          />
        </>
      )}

      {/* Glass reflection effect */}
      <rect
        x="5"
        y="5"
        width={width * 0.3}
        height={height * 0.3}
        fill="white"
        opacity="0.4"
      />
    </svg>
  );
}
