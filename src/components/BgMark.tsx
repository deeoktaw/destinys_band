/** Decorative cube + arrow watermark (Cursor-inspired geometry, original mark). */
export function BgMark() {
  return (
    <div className="bg-mark" aria-hidden="true">
      <svg
        className="bg-mark__svg"
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft block face */}
        <rect
          x="48"
          y="72"
          width="120"
          height="120"
          rx="18"
          stroke="currentColor"
          strokeWidth="10"
          opacity="0.55"
        />
        {/* Depth lip — suggests a cube edge */}
        <path
          d="M68 72 L88 48 H188 Q206 48 206 66 V166 L168 192"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity="0.35"
        />
        {/* Built-in arrow / cursor wedge */}
        <path
          d="M92 148 L92 96 L148 124 Z"
          fill="currentColor"
          opacity="0.7"
        />
        <path
          d="M92 148 L148 124 L128 168 Z"
          fill="currentColor"
          opacity="0.4"
        />
      </svg>
    </div>
  );
}
