import { useState } from "react";

export default function ProductGallery({ product }) {
  const images = product.images || [];

  const [selectedImage, setSelectedImage] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex min-h-[500px] items-center justify-center rounded-2xl border border-gray-200 bg-white">
        <div className="text-center">
          <div className="text-9xl">💻</div>

          <p className="mt-5 text-sm text-gray-400">
            Product image coming soon
          </p>
        </div>
      </div>
    );
  }

  const currentImage = images[selectedImage];

  return (
    <div>
      {/* Main image */}
      <div className="flex h-[500px] items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-white p-8">
        <img
          src={currentImage.image_url}
          alt={currentImage.alt_text || product.name}
          className="max-h-full max-w-full object-contain transition duration-300"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelectedImage(index)}
              className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-white p-1 ${
                selectedImage === index
                  ? "border-blue-600"
                  : "border-gray-200"
              }`}
            >
              <img
                src={image.image_url}
                alt={image.alt_text || product.name}
                className="h-full w-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}