import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Polyfill DOMMatrix for PDF.js in Node environment
    if (typeof global.DOMMatrix === 'undefined') {
      (global as any).DOMMatrix = class DOMMatrix {
        constructor() {}
        static fromFloat32Array() { return new DOMMatrix(); }
        static fromFloat64Array() { return new DOMMatrix(); }
      };
    }

    // Use legacy builds of PDF.js
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const path = require('path');
    const workerPath = path.join(process.cwd(), 'node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs');
    pdfjs.GlobalWorkerOptions.workerSrc = workerPath;

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    const loadingTask = pdfjs.getDocument({
      data: bytes,
      useSystemFonts: true,
      disableFontFace: true,
      verbosity: 0
    });

    const pdfDocument = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str || '')
        .join(' ');
      fullText += pageText + '\n\n';
    }

    return NextResponse.json({ 
      text: fullText.trim(),
      pages: pdfDocument.numPages 
    });
  } catch (error: any) {
    console.error('❌ PDF Error:', error);
    return NextResponse.json({ 
      message: 'Failed to parse PDF: ' + (error.message || 'Unknown error'),
      error: error.toString()
    }, { status: 500 });
  }
}
