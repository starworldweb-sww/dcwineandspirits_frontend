const IMAGE_BASE = process.env.NEXT_PUBLIC_PRODUCTION_IMAGE_URL ?? "";

export const getImageUrl = (path) => {
  if (!path || !String(path).trim()) return null;
  const p = String(path).trim();
  const full = /^https?:\/\//i.test(p)
    ? p
    : `${IMAGE_BASE.replace(/\/$/, "")}/${p.replace(/^\//, "")}`;
  return encodeURI(full);
};