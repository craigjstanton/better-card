"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";

interface FileUploadProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
}

export default function FileUpload({ onUpload, isLoading }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const name = file.name.toLowerCase();
    if (!name.endsWith(".pdf") && !name.endsWith(".csv")) {
      alert("Please upload a PDF or CSV file.");
      return;
    }
    setSelectedFile(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="w-full">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isLoading && inputRef.current?.click()}
        className={`
          relative flex flex-col items-center justify-center gap-4
          border-2 border-dashed rounded-3xl px-8 py-14
          transition-all duration-200 cursor-pointer select-none
          ${isDragging
            ? "border-green-400 bg-green-50 scale-[1.01]"
            : selectedFile
              ? "border-green-400 bg-green-50"
              : "border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/50"
          }
          ${isLoading ? "pointer-events-none opacity-70" : ""}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.csv"
          onChange={handleChange}
          className="hidden"
          disabled={isLoading}
        />

        {/* Icon */}
        <div className={`
          w-16 h-16 rounded-2xl flex items-center justify-center text-2xl
          transition-colors duration-200
          ${selectedFile ? "bg-green-500 text-white" : "bg-green-100 text-green-600"}
        `}>
          {selectedFile ? "✓" : "↑"}
        </div>

        {/* Text */}
        <div className="text-center">
          {selectedFile ? (
            <>
              <p className="font-semibold text-gray-800">{selectedFile.name}</p>
              <p className="text-sm text-gray-400 mt-1">
                {(selectedFile.size / 1024).toFixed(0)} KB · click to change
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold text-gray-700 text-lg">
                Drop your bank statement here
              </p>
              <p className="text-sm text-gray-400 mt-1">
                or <span className="text-green-600 font-medium">browse files</span> — PDF or CSV accepted
              </p>
            </>
          )}
        </div>

        {/* Supported formats */}
        {!selectedFile && (
          <div className="flex items-center gap-3 mt-1">
            {["PDF", "CSV"].map((fmt) => (
              <span
                key={fmt}
                className="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full"
              >
                {fmt}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* CTA button */}
      {selectedFile && !isLoading && (
        <button
          onClick={() => onUpload(selectedFile)}
          className="
            mt-4 w-full py-4 px-6 rounded-2xl font-semibold text-white text-base
            bg-green-500 hover:bg-green-600 active:bg-green-700
            shadow-lg shadow-green-200 hover:shadow-green-300
            transition-all duration-200
          "
        >
          Analyze My Spending →
        </button>
      )}
    </div>
  );
}
