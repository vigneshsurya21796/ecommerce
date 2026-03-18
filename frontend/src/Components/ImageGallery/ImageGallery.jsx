import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaSearchPlus, FaTimes } from "react-icons/fa";

function ImageGallery({ images = [], alt = "" }) {
  const [selected, setSelected] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [zoom, setZoom] = useState(false);

  if (!images.length) return null;

  const prev = () => setSelected((s) => (s === 0 ? images.length - 1 : s - 1));
  const next = () => setSelected((s) => (s === images.length - 1 ? 0 : s + 1));

  return (
    <>
      <div className="flex flex-col gap-3 h-full">
        {/* Main image */}
        <div className="relative bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden min-h-72 group">
          <img
            src={images[selected]}
            alt={`${alt} ${selected + 1}`}
            className="max-w-full max-h-72 object-contain transition-transform duration-300 group-hover:scale-105"
          />

          {/* Zoom button */}
          <button
            onClick={() => setLightbox(true)}
            className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-600 p-2 rounded-lg shadow opacity-0 group-hover:opacity-100 transition-opacity"
            title="View full size"
          >
            <FaSearchPlus size={14} />
          </button>

          {/* Prev / Next arrows — only show if multiple images */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow transition"
              >
                <FaChevronLeft size={13} />
              </button>
              <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow transition"
              >
                <FaChevronRight size={13} />
              </button>
            </>
          )}

          {/* Image counter dot */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === selected ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden bg-gray-50 transition-all ${
                  i === selected
                    ? "border-indigo-500 shadow-md"
                    : "border-gray-200 hover:border-indigo-300"
                }`}
              >
                <img
                  src={src}
                  alt={`${alt} thumb ${i + 1}`}
                  className="w-full h-full object-contain p-1"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => { setLightbox(false); setZoom(false); }}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
            onClick={() => { setLightbox(false); setZoom(false); }}
          >
            <FaTimes size={24} />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition"
              >
                <FaChevronLeft size={18} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition"
              >
                <FaChevronRight size={18} />
              </button>
            </>
          )}

          <img
            src={images[selected]}
            alt={alt}
            onClick={(e) => { e.stopPropagation(); setZoom(!zoom); }}
            className={`max-h-screen object-contain rounded-lg transition-transform duration-300 cursor-zoom-in ${
              zoom ? "scale-150 cursor-zoom-out" : "max-w-3xl"
            }`}
          />

          <div className="absolute bottom-4 text-white/60 text-sm">
            {selected + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}

export default ImageGallery;
