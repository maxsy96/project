"use client";

import { useState } from "react";

export function AdminAlbumUploadField({ label = "Album photos" }: { label?: string }) {
  const [fileCount, setFileCount] = useState(0);

  return (
    <label className="block rounded-md border border-dashed border-emerald-300 bg-emerald-50 p-3 text-sm font-semibold text-emerald-950">
      {label}
      <input
        name="albumPhotos"
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={(event) => setFileCount(event.target.files?.length || 0)}
        className="mt-2 block w-full text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-emerald-700 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-800"
      />
      <span className="mt-2 block text-xs font-medium text-emerald-800">
        {fileCount ? `${fileCount} photo${fileCount === 1 ? "" : "s"} will be added to the event album when you save.` : "Select one or many JPG, PNG, WebP, or GIF photos. Each file can be up to 8 MB."}
      </span>
    </label>
  );
}
