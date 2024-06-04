import Image from "next/image";
import React, { forwardRef, useEffect, useState } from "react";
import { GrDocumentExcel } from "react-icons/gr";

const FileInput = forwardRef(
  (
    { onFileSelected, title, value, onDelete, accept, disabled, preventDelete },
    ref
  ) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [file, setFile] = useState(null);
    const [image, setImage] = useState(value || null);

    const handleDragOver = (e) => {
      e.preventDefault();
      if (disabled) return;
      setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      if (disabled) return;
      setIsDragOver(false);
    };

    const handleDrop = (e) => {
      e.preventDefault();
      if (disabled) return;
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        onFileSelected(file);
        setFile(file);
      }
    };

    const handleInputChange = (e) => {
      const file = e.target.files[0];
      if (disabled) return;
      if (file) {
        onFileSelected(file);
        setFile(file);
        const reader = new FileReader();
        reader.onload = function (e) {
          setImage(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleRemove = () => {
      setFile(null);
      setImage(null);
      onDelete();
    };

    useEffect(() => {
      if (value) {
        const reader = new FileReader();
        reader.onload = function (e) {
          setImage(e.target.result);
        };
        reader.readAsDataURL(value);
      } else {
        setImage(null);
      }
    }, [value]);

    return (
      <div className="w-full">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold">{title}</label>
          {file && !preventDelete && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-xs">{file.name}</span>
              <button className="text-sm" title="Delete" onClick={handleRemove}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center ${
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          } ${
            isDragOver
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-white"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && ref.current?.click()}
        >
          <input
            type="file"
            className="hidden"
            ref={ref}
            onChange={handleInputChange}
            accept={accept || undefined}
          />
          <div className="flex flex-col items-center gap-2 text-gray-600">
            {image ? (
              image?.includes("image") ? (
                <Image
                  src={image}
                  className="max-h-96 w-72"
                  alt=""
                  height={0}
                  width={0}
                />
              ) : (
                <GrDocumentExcel />
              )
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>

                <p className="mt-2 text-sm">
                  {isDragOver
                    ? "Drop the file here"
                    : "Drag and drop a file here, or click to browse"}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
);
FileInput.displayName = "FileInput";
export default FileInput;
