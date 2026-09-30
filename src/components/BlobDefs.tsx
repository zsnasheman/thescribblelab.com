/** Shared clip paths so photos can sit inside organic cut-paper shapes (see .blob-a/b/c). */
export function BlobDefs() {
  const s = "scale(0.005682 0.008333)"; // 1/176, 1/120
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
      <defs>
        <clipPath id="blob-a" clipPathUnits="objectBoundingBox">
          <path transform={s} d="M57 6C86-2 128 4 152 30c22 24 14 52-6 70-22 20-58 26-88 14C28 102 4 82 4 54 4 30 28 12 57 6Z" />
        </clipPath>
        <clipPath id="blob-b" clipPathUnits="objectBoundingBox">
          <path transform={s} d="M40 10c30-14 76-6 100 18 18 18 18 44 2 64-18 22-54 28-84 20C26 104 2 84 6 54 8 34 22 18 40 10Z" />
        </clipPath>
        <clipPath id="blob-c" clipPathUnits="objectBoundingBox">
          <path transform={s} d="M18 40C24 14 58 0 92 6c34 6 64 26 62 56-2 30-34 46-68 46C46 108 10 82 18 40Z" />
        </clipPath>
      </defs>
    </svg>
  );
}
