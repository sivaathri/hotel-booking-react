import React from 'react';

const galleryImages = [
  { src: '/images/gallery1.jpg', alt: 'Deluxe Room' },
  { src: '/images/gallery2.jpg', alt: 'Swimming Pool' },
  { src: '/images/gallery3.jpg', alt: 'Hotel Lobby' },
  { src: '/images/gallery4.jpg', alt: 'Dining Area' },
  { src: '/images/gallery5.jpg', alt: 'Suite Room' },
  { src: '/images/gallery6.jpg', alt: 'Gym & Fitness' },
];

const Gallery = () => {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center mb-8">Our Gallery</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {galleryImages.map((img, index) => (
          <div key={index} className="overflow-hidden rounded shadow-md">
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
            />
            <div className="p-2 text-center font-medium">{img.alt}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
