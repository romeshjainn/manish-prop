import { ImageResponse } from "next/og";
import { business } from "@/config/business";

export const alt = business.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Typographic share image — no stock photography, so nothing misleading. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f7f3ec",
          color: "#1c1c1a",
          padding: "72px 80px",
          borderBottom: "24px solid #2c4636",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 22, height: 22, background: "#2c4636", transform: "rotate(45deg)" }} />
          <div style={{ fontSize: 30, letterSpacing: 6, textTransform: "uppercase", color: "#5f5a51" }}>{business.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, lineHeight: 1.02, fontFamily: "serif", maxWidth: 900 }}>Find a place to call your own.</div>
          <div style={{ marginTop: 28, fontSize: 30, color: "#5f5a51" }}>Properties · Projects · Enquiries</div>
        </div>
      </div>
    ),
    size
  );
}
