// Script to generate valid PWA PNG icons from brand SVG specifications
import fs from "fs";
import path from "path";
import zlib from "zlib";

function createPng(width, height, drawPixel) {
  // RGBA buffer: height rows, width pixels + 1 filter byte per row
  const rawData = Buffer.alloc(height * (width * 4 + 1));

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (width * 4 + 1);
    rawData[rowOffset] = 0; // Filter type 0 (None)

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = drawPixel(x, y, width, height);
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: 6 (RGBA)
  ihdr[10] = 0; // Compression: 0
  ihdr[11] = 0; // Filter: 0
  ihdr[12] = 0; // Interlace: 0
  const ihdrChunk = createChunk("IHDR", ihdr);

  // IDAT Chunk
  const idatChunk = createChunk("IDAT", compressedData);

  // IEND Chunk
  const iendChunk = createChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(4 + 4 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, "ascii");
  data.copy(buf, 8);
  const crc = crc32(buf.subarray(4, 8 + len));
  buf.writeUInt32BE(crc, 8 + len);
  return buf;
}

// CRC32 implementation
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Drawing function for Vibe Coding Hub brand icon:
// Dark Obsidian (#0A0A0F) rounded background + Signal Cyan (#00D4FF) code symbol </>
function drawBrandIcon(x, y, w, h, isMaskable = false) {
  const nx = x / w;
  const ny = y / h;

  // Background corner radius
  const cornerRadius = isMaskable ? 0 : 0.22;
  const isCorner = !isMaskable && (
    (nx < cornerRadius && ny < cornerRadius && Math.hypot(nx - cornerRadius, ny - cornerRadius) > cornerRadius) ||
    (nx > 1 - cornerRadius && ny < cornerRadius && Math.hypot(nx - (1 - cornerRadius), ny - cornerRadius) > cornerRadius) ||
    (nx < cornerRadius && ny > 1 - cornerRadius && Math.hypot(nx - cornerRadius, ny - (1 - cornerRadius)) > cornerRadius) ||
    (nx > 1 - cornerRadius && ny > 1 - cornerRadius && Math.hypot(nx - (1 - cornerRadius), ny - (1 - cornerRadius)) > cornerRadius)
  );

  if (isCorner) {
    return [0, 0, 0, 0]; // Transparent outside corner
  }

  // Draw </> symbol inside center area
  const cx = nx - 0.5;
  const cy = ny - 0.5;

  // Simple clean rendering of </> code brackets in Signal Cyan
  // Slash: cy = -2 * cx
  const isSlash = Math.abs(cy + 2.2 * cx) < 0.04 && Math.abs(cy) < 0.22;
  // Left bracket: <
  const isLeftBracket = (
    (Math.abs(cy - (-1.8 * (cx + 0.22))) < 0.04 && cx < -0.22 && cx > -0.36 && cy < 0) ||
    (Math.abs(cy - (1.8 * (cx + 0.22))) < 0.04 && cx < -0.22 && cx > -0.36 && cy > 0)
  );
  // Right bracket: >
  const isRightBracket = (
    (Math.abs(cy - (1.8 * (cx - 0.22))) < 0.04 && cx > 0.22 && cx < 0.36 && cy < 0) ||
    (Math.abs(cy - (-1.8 * (cx - 0.22))) < 0.04 && cx > 0.22 && cx < 0.36 && cy > 0)
  );

  if (isSlash || isLeftBracket || isRightBracket) {
    return [0, 212, 255, 255]; // #00D4FF
  }

  // Dark obsidian background #0A0A0F
  return [10, 10, 15, 255];
}

const outDir = path.resolve("client/public");
fs.writeFileSync(path.join(outDir, "pwa-192x192.png"), createPng(192, 192, (x, y, w, h) => drawBrandIcon(x, y, w, h, false)));
fs.writeFileSync(path.join(outDir, "pwa-512x512.png"), createPng(512, 512, (x, y, w, h) => drawBrandIcon(x, y, w, h, false)));
fs.writeFileSync(path.join(outDir, "maskable-icon-512x512.png"), createPng(512, 512, (x, y, w, h) => drawBrandIcon(x, y, w, h, true)));
fs.writeFileSync(path.join(outDir, "apple-touch-icon.png"), createPng(180, 180, (x, y, w, h) => drawBrandIcon(x, y, w, h, false)));

console.log("Successfully generated all PWA icons in client/public!");
