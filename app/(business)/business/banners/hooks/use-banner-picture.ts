"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * The picture a person chose, kept on their device until the form is saved, with an address to preview it.
 * Nothing is sent to the server here, so a picture that is changed or removed costs no storage.
 */
export function useBannerPicture() {
  const [file, setFile] = useState<File | null>(null);
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);
  return { file, setFile, previewUrl };
}
