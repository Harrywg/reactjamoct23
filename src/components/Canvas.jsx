import { useEffect, useRef, useState } from "react";

export default function Canvas({ draw, height, width, canvasRef }) {
  //   const [context, setContext] = useState(null);
  //   useEffect(() => {
  //     setContext(canvasRef.current.getContext("2d"));
  //   }, []);
  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    draw(context);
  });

  return <canvas id="canvas" height={height} width={width} ref={canvasRef} />;
}
