import React, { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { KALOS_ROUTES, KALOS_CITIES } from '../../constants/kalosMapData';

export const RouteLines = ({ isLight = false }) => {
  const cityMap = useMemo(() => {
    const map = new Map();
    KALOS_CITIES.forEach((c) => map.set(c.id, c.position));
    return map;
  }, []);

  const routePaths = useMemo(() => {
    return KALOS_ROUTES.map((route) => {
      const fromPos = cityMap.get(route.from);
      const toPos = cityMap.get(route.to);
      if (!fromPos || !toPos) return null;

      // Create a slight arc above ground
      const midX = (fromPos[0] + toPos[0]) / 2;
      const midZ = (fromPos[2] + toPos[2]) / 2;
      const midY = Math.max(fromPos[1], toPos[1]) + 0.35;

      return {
        id: route.id,
        points: [
          [fromPos[0], fromPos[1] + 0.1, fromPos[2]],
          [midX, midY, midZ],
          [toPos[0], toPos[1] + 0.1, toPos[2]]
        ]
      };
    }).filter(Boolean);
  }, [cityMap]);

  const routeColor = isLight ? '#0284C7' : '#00E5FF';

  return (
    <group>
      {routePaths.map((r) => (
        <Line
          key={r.id}
          points={r.points}
          color={routeColor}
          lineWidth={1.5}
          dashed
          dashSize={0.3}
          dashScale={2}
          gapSize={0.15}
          transparent
          opacity={isLight ? 0.45 : 0.6}
        />
      ))}
    </group>
  );
};
