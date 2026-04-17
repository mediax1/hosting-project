export default function NoiseBg() {
  return (
    <div
      aria-hidden="true"
      style={{
        opacity: 0.4,
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
      }}
      dangerouslySetInnerHTML={{
        __html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700" width="100%" height="100%" preserveAspectRatio="none" opacity="1"><defs><filter id="nnnoise-filter" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="linearRGB"><feTurbulence type="turbulence" baseFrequency="0.178" numOctaves="4" seed="15" stitchTiles="stitch" x="0%" y="0%" width="100%" height="100%" result="turbulence"></feTurbulence><feSpecularLighting surfaceScale="29" specularConstant="1.1" specularExponent="20" lighting-color="#f5a623" x="0%" y="0%" width="100%" height="100%" in="turbulence" result="specularLighting"><feDistantLight azimuth="3" elevation="108"></feDistantLight></feSpecularLighting></filter></defs><rect width="700" height="700" fill="#040404"></rect><rect width="700" height="700" fill="#f5a623" filter="url(#nnnoise-filter)"></rect></svg>`,
      }}
    />
  );
}
