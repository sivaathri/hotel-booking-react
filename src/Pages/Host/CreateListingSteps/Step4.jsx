import React from 'react';
import { FiImage } from 'react-icons/fi';

const Step4 = ({ formData, setFormData, isEditing }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Room Photos</h2>
      <div className="space-y-4">
        <p className="text-sm text-gray-600">Upload up to 20 separate images for each room (Max size: 5MB per image)</p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 20 }).map((_, index) => {
            const photo = formData.roomPhotos[index];
            return (
              <div key={index} className="relative group">
                {photo ? (
                  <>
                    <div className="relative">
                      <img 
                        src={URL.createObjectURL(photo)} 
                        alt={`Room photo ${index + 1}`} 
                        className="w-full h-48 object-cover rounded-lg transition-transform duration-200 group-hover:scale-110"
                      />
                      {isEditing && (
                        <button
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            roomPhotos: prev.roomPhotos.filter((_, i) => i !== index)
                          }))}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <label className={`border-2 border-dashed rounded-lg p-4 h-48 flex flex-col items-center justify-center gap-2 ${
                    isEditing ? 'cursor-pointer hover:border-gray-400' : 'cursor-not-allowed opacity-50'
                  }`}>
                    <FiImage className="text-2xl" />
                    <span className="text-sm">Upload Photo {index + 1}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={!isEditing}
                      onChange={(e) => {
                        if (!isEditing) return;
                        const file = e.target.files[0];
                        if (!file) return;

                        // Check file size
                        if (file.size > 5 * 1024 * 1024) {
                          alert('File exceeds the 5MB size limit');
                          return;
                        }

                        setFormData(prev => {
                          const newPhotos = [...prev.roomPhotos];
                          newPhotos[index] = file;
                          return {
                            ...prev,
                            roomPhotos: newPhotos
                          };
                        });
                      }}
                    />
                  </label>
                )}
              </div>
            );
          })}
        </div>
        {formData.roomPhotos.length > 0 && (
          <p className="text-sm text-gray-600">
            {formData.roomPhotos.length} photo(s) uploaded. {20 - formData.roomPhotos.length} photo(s) remaining.
          </p>
        )}
      </div>
    </div>
  );
};

export default Step4; 