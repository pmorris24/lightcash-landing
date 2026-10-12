export type FieldPalette = "dusk" | "ember" | "twilight";

// Static gradients that match each palette, so the panel looks right before (or without) JavaScript.
const fallback: Record<FieldPalette, string> = {
  dusk: "bg-[linear-gradient(180deg,#dfe6f6_0%,#bccaee_38%,#e2a7bd_58%,#c9553b_80%,#35231f_100%)]",
  ember: "bg-[linear-gradient(110deg,#b8483a_0%,#5a2a26_45%,#8f86c4_80%,#d9d1ee_100%)]",
  twilight: "bg-[linear-gradient(160deg,#e3a3bf_0%,#93acdf_40%,#8aa3dc_60%,#7a2f2a_90%,#2b2230_100%)]",
};

/**
 * A blurred photographic gradient with a drifting ASCII overlay.
 * The canvases are drawn by `mountField` in src/lib/enhance.ts.
 */
export function Field({ palette, className = "" }: { palette: FieldPalette; className?: string }) {
  return (
    <div
      data-field={palette}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden font-ascii ${fallback[palette]} ${className}`}
    >
      <canvas className="absolute inset-0 size-full scale-110 blur-2xl" />
      <canvas className="absolute inset-0 size-full" />
      <div className="grain" />
    </div>
  );
}
