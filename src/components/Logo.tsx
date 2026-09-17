// -----------------------------------------------------------------------------
// Logo.tsx — a small, self-contained "brand mark" component.
// Author: Bill Chen
//
// SVG can be written directly inside JSX. The tags look like HTML but attribute
// names are camelCased (e.g. `stroke-width` in HTML → `strokeWidth` in JSX).
//
// The props type is declared explicitly with `LogoProps`; each field is
// optional (note the `?:`) and has a default value in the destructuring
// pattern below, so callers can use `<Logo />`, `<Logo size={100} />`, or
// `<Logo size={100} title="Custom label" />`.
// -----------------------------------------------------------------------------
type LogoProps = {
  size?: number;
  title?: string;
};

export default function Logo({ size = 40, title = 'Bill Chen logo' }: LogoProps) {
  return (
    // role="img" + aria-label together tell screen readers to treat the entire
    // SVG as a single labeled image, instead of announcing each shape inside.
    <svg
      role="img"
      aria-label={title}
      width={size}
      height={size}
      // `viewBox` sets the SVG's internal coordinate system. Everything inside
      // is drawn in a 64×64 grid; the SVG scales that to whatever `size` says.
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* A linear gradient reusable via `fill="url(#logoGradient)"` below. */}
        <linearGradient id="logoGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="100%" stopColor="#22d3aa" />
        </linearGradient>
      </defs>

      {/* Hexagon container. The `points` list is (x,y) corner pairs.
          32,4 → top center · 58,18 → upper right · etc. */}
      <polygon
        points="32,4 58,18 58,46 32,60 6,46 6,18"
        fill="url(#logoGradient)"
        stroke="#0f1226"
        strokeWidth="2"
      />

      {/* Initials centered inside the hex. `textAnchor="middle"` centers the
          text horizontally at x=50%; `dominantBaseline="middle"` centers it
          vertically at y=54%. */}
      <text
        x="50%"
        y="54%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="system-ui, sans-serif"
        fontWeight="700"
        fontSize="22"
        fill="#0f1226"
      >
        BC
      </text>
    </svg>
  );
}
