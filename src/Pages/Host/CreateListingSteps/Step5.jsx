import React from 'react';

const Step5 = ({ formData, setFormData, languages }) => {
  const handleArrayToggle = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Language Preference</h2>
      <div className="space-y-4">
        <p className="text-sm text-gray-600">Select languages spoken by staff</p>
        <div className="grid grid-cols-2 gap-4">
          {languages.map(language => (
            <label key={language} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.languages.includes(language)}
                onChange={() => handleArrayToggle('languages', language)}
              />
              {language}
            </label>
          ))}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2">Other Language</label>
            <input
              type="text"
              name="otherLanguage"
              value={formData.otherLanguage}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter other language"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step5; 