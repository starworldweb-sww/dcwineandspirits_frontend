/**
 * Compresses an image in the browser (resize + quality reduction)
 * before upload. Give it even a 20MB image, and it will bring it
 * down within the target size.
 *
 * @param {File} file - original image file from <input type="file">
 * @param {Object} options
 * @param {number} options.maxSizeMB - target max size in MB (default 2)
 * @param {number} options.maxWidthOrHeight - max width/height in px (default 1600)
 * @param {number} options.initialQuality - starting JPEG quality 0-1 (default 0.8)
 * @returns {Promise<File>} compressed file
 */
export const compressImage = (
  file,
  { maxSizeMB = 2, maxWidthOrHeight = 1600, initialQuality = 0.8 } = {},
) => {
  return new Promise((resolve, reject) => {
    // if it's not an image at all (wrong file type slipped in), leave it as-is
    if (!file.type.startsWith("image/")) {
      resolve(file);
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        // Step 1: calculate new dimensions — keep aspect ratio, just
        // cap the longer side at maxWidthOrHeight
        let { width, height } = img;
        if (width > height && width > maxWidthOrHeight) {
          height = Math.round((height * maxWidthOrHeight) / width);
          width = maxWidthOrHeight;
        } else if (height >= width && height > maxWidthOrHeight) {
          width = Math.round((width * maxWidthOrHeight) / height);
          height = maxWidthOrHeight;
        }

        // Step 2: draw onto a canvas at the new (smaller) size
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Step 3: keep lowering quality until the size is within
        // maxSizeMB, or quality gets too low to go further
        const tryCompress = (quality) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Failed to compress image"));
                return;
              }

              const sizeMB = blob.size / (1024 * 1024);

              if (sizeMB <= maxSizeMB || quality <= 0.3) {
                // Convert the Blob back into a File, since
                // FormData/backend expects a File (keeping the same
                // name, extension changed to .jpg since we always
                // export as JPEG)
                const compressedFile = new File(
                  [blob],
                  file.name.replace(/\.[^/.]+$/, ".jpg"),
                  { type: "image/jpeg" },
                );
                resolve(compressedFile);
              } else {
                tryCompress(Number((quality - 0.1).toFixed(2)));
              }
            },
            "image/jpeg",
            quality,
          );
        };

        tryCompress(initialQuality);
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = event.target.result;
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};