import React, { useRef, useState, useEffect } from "react";

interface SignatureModalProps {
  onClose: () => void;
  onSave: (file: File) => void;
  visible: boolean;
}

const SignatureModal: React.FC<SignatureModalProps> = ({ visible, onClose, onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawing = useRef(false);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;

    ctxRef.current = ctx;
  }, []);

  const getPositionMouse = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const getPositionTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
    };
  };

  // ---- Mouse handlers ----
  const startDrawingMouse = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const { x, y } = getPositionMouse(e);
    ctxRef.current?.beginPath();
    ctxRef.current?.moveTo(x, y);
  };

  const drawMouse = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const { x, y } = getPositionMouse(e);
    ctxRef.current?.lineTo(x, y);
    ctxRef.current?.stroke();
  };

  const stopDrawingMouse = () => {
    isDrawing.current = false;
    ctxRef.current?.closePath();
  };

  // ---- Touch handlers ----
  const startDrawingTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const { x, y } = getPositionTouch(e);
    ctxRef.current?.beginPath();
    ctxRef.current?.moveTo(x, y);
  };

  const drawTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const { x, y } = getPositionTouch(e);
    ctxRef.current?.lineTo(x, y);
    ctxRef.current?.stroke();
  };

  const stopDrawingTouch = () => {
    isDrawing.current = false;
    ctxRef.current?.closePath();
  };

  // ---- Utils ----
  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setSignatureFile(null);
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "signature.png", { type: "image/png" });
        setSignatureFile(file);
        onSave(file);
      }
    });
  };

  return (
    <div
      hidden={!visible}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ background: "#fff", padding: 20, borderRadius: 8 }}>
        <h3>Firma del paciente</h3>
        <canvas
          ref={canvasRef}
          width={400}
          height={200}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#fff",
            cursor: "default",
          }}
          onMouseDown={startDrawingMouse}
          onMouseMove={drawMouse}
          onMouseUp={stopDrawingMouse}
          onMouseLeave={stopDrawingMouse}
          onTouchStart={startDrawingTouch}
          onTouchMove={drawTouch}
          onTouchEnd={stopDrawingTouch}
        />
        <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
          <button onClick={handleClear}>Limpiar</button>
          <button onClick={handleSave}>Guardar</button>
          <button onClick={onClose}>Cerrar</button>
        </div>
        {signatureFile && (
          <p style={{ fontSize: 12, marginTop: 10 }}>
            ✅ Firma lista para enviar al servidor
          </p>
        )}
      </div>
    </div>
  );
};

export default SignatureModal;
