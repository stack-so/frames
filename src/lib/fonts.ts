import fs from 'fs/promises';
import path from 'path';

export async function getFont(style: string) {
  const fontPath = path.resolve(process.cwd(), `public/inter/Inter-${style}.ttf`);
  const fontBuffer = await fs.readFile(fontPath);

  console.log(`Loaded font: Inter-${style}.ttf`);
  // Convert the Node.js Buffer to an ArrayBuffer
  const fontArrayBuffer = Uint8Array.from(fontBuffer).buffer;

  return fontArrayBuffer;
}