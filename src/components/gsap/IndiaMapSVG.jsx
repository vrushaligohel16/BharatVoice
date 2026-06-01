import { useLayoutEffect, useRef } from 'react';
import indiaMap from '@svg-maps/india';
import { getRegionForState, getRegionMeta } from '../../constants/indiaMapRegions';

/**
 * Proportional India map from @svg-maps/india (MapSVG / CC BY 4.0).
 * Each state/UT is a separate <path> with correct geographic alignment.
 */
export default function IndiaMapSVG({
  activeRegionId = null,
  onMapReady,
  onLocationEnter,
  onLocationLeave,
  onLocationClick,
  className = '',
}) {
  const svgRef = useRef(null);
  const pathRefs = useRef({});

  useLayoutEffect(() => {
    onMapReady?.({
      svg: svgRef.current,
      paths: pathRefs.current,
      getPath: (stateId) => pathRefs.current[stateId],
    });
  }, [onMapReady]);

  const getFill = (stateId) => {
    const regionId = getRegionForState(stateId);
    const meta = getRegionMeta(regionId);
    if (!meta) return '#EDE6DC';
    if (!activeRegionId) return meta.color;
    if (activeRegionId === 'pan_india') return meta.hoverColor;
    if (activeRegionId === regionId) return meta.hoverColor;
    return meta.color;
  };

  const getOpacity = (stateId) => {
    if (!activeRegionId || activeRegionId === 'pan_india') return 1;
    return getRegionForState(stateId) === activeRegionId ? 1 : 0.4;
  };

  return (
    <div
      className={`relative flex h-full min-h-0 w-full items-center justify-center ${className}`}
      data-india-map-root
    >
      <svg
        ref={svgRef}
        viewBox={indiaMap.viewBox}
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full select-none"
        role="img"
        aria-label="Map of India showing states and language regions"
      >
        <defs>
          <filter id="india-map-soft-shadow" x="-8%" y="-8%" width="116%" height="116%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#1C1410" floodOpacity="0.1" />
          </filter>
        </defs>

        <g filter="url(#india-map-soft-shadow)">
          {indiaMap.locations.map((location) => {
            const regionId = getRegionForState(location.id);

            return (
              <path
                key={location.id}
                ref={(el) => {
                  pathRefs.current[location.id] = el;
                }}
                id={location.id}
                name={location.name}
                d={location.path}
                fill={getFill(location.id)}
                fillOpacity={getOpacity(location.id)}
                stroke="#FFFFFF"
                strokeWidth={1}
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                className="cursor-pointer outline-none transition-[fill,fill-opacity] duration-300 ease-out focus-visible:stroke-[#8B6347] focus-visible:stroke-[2px]"
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                tabIndex={0}
                role="button"
                aria-label={`${location.name}, ${getRegionMeta(regionId)?.label ?? 'India'}`}
                onMouseEnter={(e) => onLocationEnter?.(location, e.currentTarget, e)}
                onMouseLeave={(e) => onLocationLeave?.(location, e.currentTarget, e)}
                onFocus={(e) => onLocationEnter?.(location, e.currentTarget, e)}
                onBlur={(e) => onLocationLeave?.(location, e.currentTarget, e)}
                onClick={(e) => onLocationClick?.(location, e.currentTarget, e)}
                data-region={regionId}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
