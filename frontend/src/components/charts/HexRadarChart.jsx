import React from 'react';
import { motion } from 'framer-motion';

/**
 * Animated SVG Hexagonal Radar/Spider Chart for Pokemon Base Combat Stats.
 * Clean, lightweight, fully responsive, and styled with 9th-Gen Kalos aesthetics.
 */
export const HexRadarChart = ({
  stats = { hp: 78, attack: 84, defense: 78, spAtk: 109, spDef: 85, speed: 100 },
  maxStat = 200,
  size = 320,
  isLight = false
}) => {
  const statKeys = [
    { key: 'hp', label: 'HP' },
    { key: 'attack', label: 'ATK' },
    { key: 'defense', label: 'DEF' },
    { key: 'speed', label: 'SPD' },
    { key: 'spDef', label: 'S.DEF' },
    { key: 'spAtk', label: 'S.ATK' }
  ];

  const center = size / 2;
  const radius = (size / 2) - 40; // leave padding for labels

  // Get point coordinates for an angle and normalized distance (0 to 1)
  const getCoordinates = (index, factor = 1) => {
    // 6 stats: 60 degrees (Math.PI / 3) intervals starting at top (-Math.PI / 2)
    const angle = (Math.PI / 3) * index - Math.PI / 2;
    const x = center + radius * factor * Math.cos(angle);
    const y = center + radius * factor * Math.sin(angle);
    return [x, y];
  };

  // Generate concentric polygon path strings for background grid (0.25, 0.5, 0.75, 1.0)
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  // Calculate actual Pokémon stat points
  const points = statKeys.map((s, idx) => {
    const rawVal = stats[s.key] || stats[s.label.toLowerCase()] || 60;
    const factor = Math.min(rawVal / maxStat, 1.0);
    return getCoordinates(idx, factor);
  });

  const pointsString = points.map(([x, y]) => `${x},${y}`).join(' ');

  const strokeColor = isLight ? '#0284C7' : '#00E5FF';
  const fillColor = isLight ? 'rgba(2, 132, 199, 0.25)' : 'rgba(0, 229, 255, 0.22)';
  const gridLineColor = isLight ? 'rgba(100, 116, 139, 0.2)' : 'rgba(255, 255, 255, 0.1)';

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      <svg width={size} height={size} className="overflow-visible">
        <defs>
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FF3366" stopOpacity="0.25" />
          </linearGradient>
          <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Concentric Guide Hexagons */}
        {gridLevels.map((lvl) => {
          const hexPoints = statKeys
            .map((_, i) => getCoordinates(i, lvl))
            .map(([x, y]) => `${x},${y}`)
            .join(' ');

          return (
            <polygon
              key={lvl}
              points={hexPoints}
              fill="none"
              stroke={gridLineColor}
              strokeWidth={lvl === 1.0 ? 1.5 : 1}
              strokeDasharray={lvl < 1.0 ? '3 3' : 'none'}
            />
          );
        })}

        {/* Radial Axis Lines from Center */}
        {statKeys.map((_, i) => {
          const [x, y] = getCoordinates(i, 1.0);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke={gridLineColor}
              strokeWidth="1"
            />
          );
        })}

        {/* Dynamic Animated Pokémon Stat Polygon */}
        <motion.polygon
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          points={pointsString}
          fill="url(#radarGradient)"
          stroke={strokeColor}
          strokeWidth="2.5"
          filter="url(#radarGlow)"
        />

        {/* Glowing Data Vertex Nodes */}
        {points.map(([x, y], idx) => (
          <circle
            key={idx}
            cx={x}
            cy={y}
            r="4"
            fill={strokeColor}
            stroke="#FFFFFF"
            strokeWidth="1.5"
            className="animate-pulse"
          />
        ))}

        {/* Stat Labels & Values */}
        {statKeys.map((s, idx) => {
          const [x, y] = getCoordinates(idx, 1.18);
          const rawVal = stats[s.key] || stats[s.label.toLowerCase()] || 0;

          return (
            <g key={s.key} transform={`translate(${x}, ${y})`}>
              <text
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[9px] font-mono font-black uppercase fill-current"
                fill={isLight ? '#0F172A' : '#F8FAFC'}
              >
                {s.label}
              </text>
              <text
                y="11"
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[10px] font-mono font-bold"
                fill={strokeColor}
              >
                {rawVal}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default HexRadarChart;
