// CodeLogo — SVG code symbol used as app logo in Navbar and footer
interface CodeLogoProps {
  size?: number;
  className?: string;
}

export default function CodeLogo({ size = 32, className = "" }: CodeLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="VibeHub logo"
    >
      <rect width="64" height="64" rx="14" fill="#0A0A0F" />
      <text
        x="50%"
        y="54%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="38"
        fontFamily="monospace"
        fill="#00D4FF"
      >
        {"</>"} 
      </text>
    </svg>
  );
}

