// Client-side image compression and resizing utility
// Ensures uploaded mobile photos (often 10MB-30MB) are resized to an optimal
// resolution (e.g. max 1280px, ~200KB JPEG) before transmission.
// This prevents Cloud Run 403/413 payload rejections and speeds up AI vision analysis.

export async function compressImageFile(
  file: File,
  maxDimension = 1280,
  quality = 0.85
): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    // If the file is not an image, fail gracefully
    if (!file.type.startsWith("image/") && !file.name.match(/\.(jpe?g|png|webp|heic|bmp|gif)$/i)) {
      reject(new Error("Selected file is not an image format."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read image file."));
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) {
        reject(new Error("Empty image data received."));
        return;
      }

      const img = new Image();
      img.onerror = () => {
        // Fallback: return data URI as-is if image decode fails (e.g. edge browser support)
        resolve({ base64: result, mimeType: file.type || "image/jpeg" });
      };

      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Scale down proportionally if larger than maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve({ base64: result, mimeType: "image/jpeg" });
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to efficient JPEG
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve({
          base64: compressedDataUrl,
          mimeType: "image/jpeg",
        });
      };

      img.src = result;
    };

    reader.readAsDataURL(file);
  });
}

// Compress data URL directly (useful for canvas captures)
export function compressDataUrl(
  dataUrl: string,
  maxDimension = 1280,
  quality = 0.85
): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onerror = () => {
      resolve({ base64: dataUrl, mimeType: "image/jpeg" });
    };

    img.onload = () => {
      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;

      if (width <= maxDimension && height <= maxDimension && dataUrl.length < 800_000) {
        // Already compact enough
        resolve({ base64: dataUrl, mimeType: "image/jpeg" });
        return;
      }

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, width);
      canvas.height = Math.max(1, height);

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve({ base64: dataUrl, mimeType: "image/jpeg" });
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve({
        base64: canvas.toDataURL("image/jpeg", quality),
        mimeType: "image/jpeg",
      });
    };

    img.src = dataUrl;
  });
}
