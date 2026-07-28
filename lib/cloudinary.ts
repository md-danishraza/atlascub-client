export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
  folder: "atlascub/products",
  allowedFormats: ["jpg", "jpeg", "png", "webp"],
  maxFileSize: 5 * 1024 * 1024, // 5MB
};

export const getCloudinaryUrl = (
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
  }
) => {
  const { cloudName } = cloudinaryConfig;
  const transformations = [];

  if (options?.width) transformations.push(`w_${options.width}`);
  if (options?.height) transformations.push(`h_${options.height}`);
  if (options?.quality) transformations.push(`q_${options.quality}`);

  const transformationStr = transformations.length
    ? `${transformations.join(",")}/`
    : "";
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationStr}${publicId}`;
};
