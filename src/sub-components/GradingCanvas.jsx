import React, { useRef, useState, useEffect } from "react";

export const GradingCanvas = ({ image, onSubmit }) => {
  const canvasRef = useRef(null);
  const [img, setImg] = useState(null);

  const [leftLine, setLeftLine] = useState(null);
  const [rightLine, setRightLine] = useState(null);
  const [referenceColor, setReferenceColor] = useState(null);
  const [startHold, setStartHold] = useState(null);
  const [endHold, setEndHold] = useState(null);
  const [clickMode, setClickMode] = useState("line"); // 'line' | 'color' | 'start' | 'end'
  const [holds, setHolds] = useState([]); // clicked points

  useEffect(() => {
    if (!image) return;
    const newImg = new Image();
    newImg.onload = () => setImg(newImg);
    newImg.src = `data:image/jpeg;base64,${image}`;
  }, [image]);

  useEffect(() => {
    if (!img || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    drawAnnotations(ctx);
  }, [img, leftLine, rightLine, referenceColor, holds, startHold, endHold]);

  const drawAnnotations = (ctx) => {
    if (leftLine !== null) {
      ctx.beginPath();
      ctx.strokeStyle = "red";
      ctx.moveTo(leftLine, 0);
      ctx.lineTo(leftLine, ctx.canvas.height);
      ctx.stroke();
    }
    if (rightLine !== null) {
      ctx.beginPath();
      ctx.strokeStyle = "green";
      ctx.moveTo(rightLine, 0);
      ctx.lineTo(rightLine, ctx.canvas.height);
      ctx.stroke();
    }
    holds.forEach((pt, i) => {
      ctx.beginPath();
      ctx.fillStyle = i === startHold ? "blue" : i === endHold ? "purple" : "orange";
      ctx.arc(pt.x, pt.y, 6, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  const handleClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    const ctx = canvas.getContext("2d");
    const pixel = ctx.getImageData(x, y, 1, 1).data;

    if (clickMode === "line") {
      if (leftLine === null) setLeftLine(x);
      else if (rightLine === null) setRightLine(x);
    } else if (clickMode === "color") {
      const hsv = rgbToHsv(pixel[0], pixel[1], pixel[2]);
      setReferenceColor(hsv);
    } else if (clickMode === "start") {
      const newHolds = [...holds, { x, y }];
      setHolds(newHolds);
      setStartHold(newHolds.length - 1);
    } else if (clickMode === "end") {
      const newHolds = [...holds, { x, y }];
      setHolds(newHolds);
      setEndHold(newHolds.length - 1);
    }
  };

  const rgbToHsv = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, v = max;
    const d = max - min;
    s = max === 0 ? 0 : d / max;
    if (max === min) h = 0;
    else {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return [Math.round(h * 180), Math.round(s * 255), Math.round(v * 255)];
  };

  const handleSubmit = () => {
    if (leftLine === null || rightLine === null || !referenceColor || startHold === null || endHold === null) {
      alert("Please complete all selections first.");
      return;
    }
    onSubmit({
      imageBase64: image,
      left_line: Math.min(leftLine, rightLine),
      right_line: Math.max(leftLine, rightLine),
      reference_color_hsv: referenceColor,
      start_hold: `contour_${startHold}.jpg`,
      end_hold: `contour_${endHold}.jpg`,
      hold_points: holds
    });
  };

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setClickMode("line")}>Select Lines</button>
        <button onClick={() => setClickMode("color")}>Pick Hold Color</button>
        <button onClick={() => setClickMode("start")}>Select Start Hold</button>
        <button onClick={() => setClickMode("end")}>Select End Hold</button>
        <button onClick={handleSubmit}>Submit</button>
      </div>
      <canvas ref={canvasRef} onClick={handleClick} style={{ border: "1px solid #aaa" }} />
    </div>
  );
};
