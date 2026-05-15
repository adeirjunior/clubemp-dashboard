"use client";

import { type ChangeEvent, useRef, useState } from "react";
import { LucideIcon } from "./lucide-icon";

export function ImagePicker({
  defaultValue,
  label,
  name,
  help,
  required,
}: {
  defaultValue?: string;
  label?: string;
  name: string;
  help?: string;
  required?: boolean;
}) {
  const [preview, setPreview] = useState<string | null>(defaultValue || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="form-control w-full">
      {label && <span className="label-text mb-1 font-semibold">{label}</span>}

      <div
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all
          ${preview ? "border-primary/50 bg-base-200" : "border-base-300 bg-base-100 hover:border-primary/30"}
          min-h-[200px] overflow-hidden group`}
      >
        {preview ? (
          <div className="relative w-full h-full min-h-[200px]">
            {/* biome-ignore lint/performance/noImgElement: Preview base64 local. */}
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover max-h-[400px]"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                className="btn btn-circle btn-primary btn-sm"
                onClick={() => fileInputRef.current?.click()}
                title="Trocar imagem"
              >
                <LucideIcon name="pencil" className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="btn btn-circle btn-error btn-sm"
                onClick={handleRemove}
                title="Remover imagem"
              >
                <LucideIcon name="trash-2" className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="flex flex-col items-center gap-2 p-8 w-full h-full text-center"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <LucideIcon name="image-plus" className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold">Clique para selecionar</p>
              <p className="text-xs text-base-content/60">
                SVG, PNG, JPG ou WEBP
              </p>
            </div>
          </button>
        )}

        <input
          type="file"
          ref={fileInputRef}
          name={name}
          className="hidden"
          accept="image/*"
          required={required && !preview}
          onChange={handleFileChange}
        />
      </div>

      {help && (
        <span className="label-text-alt mt-1 text-base-content/65">{help}</span>
      )}
    </div>
  );
}
