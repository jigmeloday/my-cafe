/** Advice when the picture's shape is far from the one it is meant for. Resolves to null when it fits or can't be read. */
export function adviseOnShape(file: File, ideal: number, note: string): Promise<string | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const ratio = img.naturalWidth / img.naturalHeight;
      resolve(ratio < ideal * 0.75 || ratio > ideal * 1.4 ? note : null);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}
