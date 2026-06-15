import React, { useState } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { uploadReferenceImage, uploadReferenceImage as uploadThunk } from "./customOrderThunk";
import { removeUploadedImageUrl } from "./customOrderSlice";

interface ImageUploaderProps {
  maxImages?: number;
}

export default function ImageUploader({ maxImages = 5 }: ImageUploaderProps) {
  const dispatch = useAppDispatch();
  const { uploadedImageUrls, isUploading, error } = useAppSelector(
    (state) => state.customOrders
  );
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = async (files: FileList) => {
    const remainingSlots = maxImages - uploadedImageUrls.length;
    if (remainingSlots <= 0) {
      alert(`Bạn chỉ được tải lên tối đa ${maxImages} ảnh mẫu!`);
      return;
    }

    const filesToUpload = Array.from(files)
      .slice(0, remainingSlots)
      .filter((file) => {
        const isValidType = ["image/jpeg", "image/png", "image/webp"].includes(file.type);
        if (!isValidType) {
          alert(`File ${file.name} không đúng định dạng (Chỉ hỗ trợ JPG, PNG, WEBP)`);
        }
        return isValidType;
      });

    for (const file of filesToUpload) {
      await dispatch(uploadReferenceImage(file));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleRemove = (url: string) => {
    dispatch(removeUploadedImageUrl(url));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-bold text-stone-700">
          Ảnh mẫu tham khảo <span className="text-red-500">*</span>
        </label>
        <span className="text-xs text-stone-500">
          {uploadedImageUrls.length}/{maxImages} ảnh (Tải lên ít nhất 1 ảnh)
        </span>
      </div>

      {/* Drag & Drop Area */}
      {uploadedImageUrls.length < maxImages && (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-stone-200 hover:border-primary/50 hover:bg-stone-50"
          }`}
        >
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          <div className="flex flex-col items-center justify-center gap-2">
            {isUploading ? (
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            ) : (
              <Upload className="w-10 h-10 text-stone-400 group-hover:text-primary transition-colors" />
            )}
            <p className="text-sm font-semibold text-stone-700 mt-2">
              {isUploading ? "Đang tải ảnh lên..." : "Kéo thả hoặc click để chọn ảnh"}
            </p>
            <p className="text-xs text-stone-400">
              Định dạng hỗ trợ: JPG, PNG, WEBP (Tối đa 5MB)
            </p>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

      {/* Previews Grid */}
      {uploadedImageUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-4">
          {uploadedImageUrls.map((url, index) => (
            <div
              key={index}
              className="group relative aspect-square rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm"
            >
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <button
                type="button"
                onClick={() => handleRemove(url)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-red-500 hover:text-white text-stone-600 transition-colors shadow-md"
                title="Xóa ảnh này"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
