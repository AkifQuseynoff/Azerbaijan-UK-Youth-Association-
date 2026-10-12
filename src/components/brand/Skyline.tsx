import { useMemo } from "react";

/**
 * The Baku skyline, drawn once (viewBox 0 350 1600 440; the ground line is y = 764).
 *  far:    a pale generic low-rise horizon (not a copy of the landmarks, so nothing looks doubled)
 *  near:   the landmarks: Old City wall and Maiden Tower, mosque with minaret, TV Tower, Heydar Aliyev Centre
 *  towers: the three Flame Towers as separate paths so they can take the logo's blue, red and green
 * Every building runs down to y = 770 and the ground starts at y = 756, so no hairline gap can appear between them.
 */
type Props = {
  className?: string;
  nearFill?: string;
  nearOpacity?: number;
  farFill?: string;
  farOpacity?: number;
  /** "colour" paints the Flame Towers blue, red and green; "same" paints them like the rest. */
  towers?: "colour" | "same";
  /** Draw the ground strip under the skyline in the near colour. */
  ground?: boolean;
};

function flame(x: number, w: number, h: number, lean: number) {
  return `M${x} 770C${x - 3} ${764 - h * 0.45} ${x + w * 0.05 + lean * 0.4} ${764 - h * 0.78} ${x + w * 0.5 + lean} ${764 - h}C${x + w * 0.96 + lean * 0.5} ${764 - h * 0.74} ${x + w + 3} ${764 - h * 0.42} ${x + w} 770Z`;
}

export default function Skyline({ className, nearFill = "#0e1f45", nearOpacity = 1, farFill = "#1b4793", farOpacity = 0.09, towers = "colour", ground = false }: Props) {
  const far = useMemo(
    () =>
      Array.from({ length: 64 }, (_, i) => {
        const w = 22 + ((i * 7) % 5) * 7;
        const h = 46 + 58 * Math.abs(Math.sin(i * 0.73)) + 36 * Math.abs(Math.sin(i * 1.9 + 1));
        return <rect key={i} x={i * 26 - 20} y={770 - h} width={w} height={h} />;
      }),
    [],
  );
  const towerPaths = [flame(1232, 62, 300, 16), flame(1316, 66, 350, -12), flame(1404, 58, 255, 14)];
  return (
    <svg className={className} viewBox="0 350 1600 440" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">
      <g className="sk-far"><g fill={farFill} opacity={farOpacity}>{far}</g></g>
      <g className="sk-near">
        <g fill={nearFill} opacity={nearOpacity}>
          {/* Old City wall, ending in a tower at x = 592 */}
          <rect x="-20" y="724" width="612" height="46" />
          {Array.from({ length: 17 }, (_, i) => <rect key={`m${i}`} x={-14 + i * 34} y="712" width="20" height="12" />)}
          <rect x="226" y="640" width="50" height="130" /><rect x="222" y="628" width="58" height="14" />
          {Array.from({ length: 4 }, (_, i) => <rect key={`t${i}`} x={224 + i * 15} y="616" width="10" height="14" />)}
          <rect x="548" y="662" width="44" height="108" /><rect x="544" y="650" width="52" height="14" />
          {Array.from({ length: 3 }, (_, i) => <rect key={`e${i}`} x={546 + i * 20} y="638" width="12" height="13" />)}
          {/* Maiden Tower */}
          <path d="M360 770L368 556L452 556L460 770Z" /><rect x="376" y="528" width="68" height="30" /><rect x="372" y="520" width="76" height="10" />
          {Array.from({ length: 5 }, (_, i) => <rect key={`c${i}`} x={374 + i * 16} y="508" width="10" height="13" />)}
          <polygon points="460,596 490,650 490,770 460,770" />
          {/* Mosque: main dome, smaller dome, minaret */}
          <rect x="632" y="734" width="104" height="36" /><path d="M636 734A48 48 0 0 1 732 734Z" /><rect x="683" y="662" width="2" height="26" /><circle cx="684" cy="660" r="3.4" />
          <rect x="740" y="750" width="48" height="20" /><path d="M742 750A22 22 0 0 1 786 750Z" /><rect x="763.2" y="722" width="1.6" height="8" />
          <rect x="806" y="548" width="12" height="222" /><rect x="801" y="606" width="22" height="8" /><rect x="803" y="560" width="16" height="4" /><polygon points="806,548 812,514 818,548" /><rect x="811.2" y="496" width="1.6" height="20" />
          {/* Baku TV Tower */}
          <rect x="881" y="452" width="6" height="318" /><ellipse cx="884" cy="590" rx="30" ry="9" /><ellipse cx="884" cy="552" rx="10" ry="24" /><rect x="883" y="412" width="2" height="42" />
          {/* Heydar Aliyev Centre: one long wave */}
          <path d="M940 770C964 724 1012 704 1054 716C1094 728 1124 702 1166 692C1190 687 1206 706 1212 770Z" />
          {/* low blocks, far right */}
          {([[1480, 90], [1514, 54], [1546, 110], [1580, 66]] as const).map(([x, h]) => <rect key={x} x={x} y={770 - h} width="30" height={h} />)}
          {towers === "same" && towerPaths.map((d, i) => <path key={i} d={d} />)}
        </g>
        {towers === "colour" && (
          <g className="sk-towers">
            {towerPaths.map((d, i) => <path key={i} className={`sk-t${i + 1}`} d={d} />)}
          </g>
        )}
      </g>
      {ground && <rect y="756" width="1600" height="40" fill={nearFill} />}
    </svg>
  );
}
