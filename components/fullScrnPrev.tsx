import { useState } from "react";
import Image from "next/image";

const FullscreenPreview = ({ doc, isPdf }: { doc: any; isPdf: boolean }) => {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <>
      <div
        className="flex flex-col items-center w-full cursor-pointer"
        onClick={() => setFullscreen(true)}
      >
        <p className="font-medium text-sm mb-2">{doc.name}</p>
        {isPdf ? (
          <embed
            src={doc.url}
            type="application/pdf"
            className="w-full h-48 border rounded shadow"
          />
        ) : (
          <img
            src={doc.url}
            alt={doc.name}
            className="w-full h-48 object-cover border rounded shadow"
          />
        )}
        <p className="text-xs text-gray-500 mt-1 italic">Click to enlarge</p>
      </div>

      {fullscreen && (
        <div
          className="fixed inset-0 bg-black/90 flex justify-center items-center z-[60]"
          onClick={() => setFullscreen(false)}
        >
          <div
            className="w-[90%] h-[90%] bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {isPdf ? (
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(
                  doc.url
                )}&embedded=true`}
                className="w-full h-full"
              />
            ) : (
              <img
                src={doc.url}
                alt={doc.name}
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FullscreenPreview;
