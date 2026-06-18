"use client";

import React, { useState, useRef, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set up the pdf worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


const PageComponent = React.forwardRef(({ pageNumber, width }, ref) => {
  return (
    <div ref={ref} className="bg-white border-l border-black/10 overflow-hidden flex items-center justify-center" style={{ overflow: 'hidden' }}>
      <Page 
        pageNumber={pageNumber} 
        width={width}
        renderAnnotationLayer={false}
        renderTextLayer={false}
      />
    </div>
  );
});

PageComponent.displayName = "PageComponent";

export default function FlipbookViewer({ pdfUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [width, setWidth] = useState(400); 
  const [loadError, setLoadError] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        // clientWidth includes padding. We have p-4 (16px) or p-8 (32px).
        // Subtract padding and some extra margin to ensure 2 pages fit perfectly.
        const containerWidth = containerRef.current.clientWidth - 80;
        const calculatedWidth = Math.min(containerWidth / 2, 450); // max 450px per page
        setWidth(Math.max(calculatedWidth, 250)); // min 250px
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setLoadError("");
  }

  if (!pdfUrl) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative bg-[#ebe5da] p-4 md:p-8 overflow-hidden" ref={containerRef}>
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(err) => setLoadError(err.message)}
        loading={
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="w-8 h-8 border-4 border-[#fc0a7a] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#9a8070] font-medium">Loading magazine...</p>
          </div>
        }
        error={
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <p className="text-red-500 font-medium">Failed to load magazine PDF.</p>
            <p className="text-red-400 text-xs text-center max-w-sm">{loadError}</p>
          </div>
        }
      >
        {numPages && (
          <div className="flex items-center justify-center w-full pb-10 drop-shadow-2xl">
            <HTMLFlipBook
              width={width}
              height={width * 1.414}
              size="fixed"
              usePortrait={false}
              minWidth={280}
              maxWidth={500}
              minHeight={396}
              maxHeight={707}
              maxShadowOpacity={0.5}
              showCover={true}
              mobileScrollSupport={true}
              className="bg-white"
            >
              {Array.from(new Array(numPages), (el, index) => (
                <PageComponent key={`page_${index + 1}`} pageNumber={index + 1} width={width} />
              ))}
            </HTMLFlipBook>
          </div>
        )}
      </Document>
      
      {numPages && (
        <div className="absolute bottom-6 flex gap-4 text-[12px] font-medium text-[#4a3728] bg-white/90 px-6 py-2.5 rounded-full shadow-md backdrop-blur">
          <span className="hidden sm:inline">Drag corners or click to turn pages</span>
          <span className="sm:hidden">Swipe to turn pages</span>
          <span className="text-[#fc0a7a]">•</span>
          <span>{numPages} Pages</span>
        </div>
      )}
    </div>
  );
}
