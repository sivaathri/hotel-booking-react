import React from 'react';
import { FiClock, FiCalendar, FiWifi, FiCoffee, FiDollarSign, FiShield, FiActivity, FiTv, FiBriefcase, FiShoppingBag, FiUsers } from 'react-icons/fi';

const Step6 = ({ formData, setFormData, isEditing }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    if (!isEditing) return;
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const facilityCategories = [
    {
      title: "Highlighted Amenities",
      icon: <FiActivity className="w-5 h-5" />,
      facilities: [
        { name: "gym", label: "Gym" },
        { name: "swimmingPool", label: "Swimming Pool" },
        { name: "spa", label: "Spa" },
        { name: "restaurant", label: "Restaurant" },
        { name: "roomService", label: "24-hour Room Service" },
        { name: "lounge", label: "Lounge" },
        { name: "steamSauna", label: "Steam and Sauna" },
        { name: "bar", label: "Bar" }
      ]
    },
    {
      title: "Basic Facilities",
      icon: <FiWifi className="w-5 h-5" />,
      facilities: [
        { name: "freeParking", label: "Free Parking" },
        { name: "freeWifi", label: "Free Wi-Fi" },
        { name: "refrigerator", label: "Refrigerator" },
        { name: "laundryService", label: "Laundry Service" },
        { name: "housekeeping", label: "Housekeeping" },
        { name: "airConditioning", label: "Air Conditioning" },
        { name: "powerBackup", label: "Power Backup" },
        { name: "evCharging", label: "EV Charging Station" },
        { name: "smokeDetector", label: "Smoke Detector" },
        { name: "umbrellas", label: "Umbrellas" },
        { name: "elevator", label: "Elevator/Lift" },
        { name: "paidLan", label: "Paid LAN" }
      ]
    },
    {
      title: "Food and Drinks",
      icon: <FiCoffee className="w-5 h-5" />,
      facilities: [
        { name: "diningArea", label: "Dining Area" },
        { name: "cafe24h", label: "24-hour Cafe" },
        { name: "barbeque", label: "Barbeque" },
        { name: "bakery", label: "Bakery" },
        { name: "coffeeShop24h", label: "24-hour Coffee Shop" }
      ]
    },
    {
      title: "Safety and Security",
      icon: <FiShield className="w-5 h-5" />,
      facilities: [
        { name: "fireExtinguishers", label: "Fire Extinguishers" },
        { name: "cctv", label: "CCTV" },
        { name: "securityAlarms", label: "Security Alarms" }
      ]
    },
    {
      title: "Health and Wellness",
      icon: <FiActivity className="w-5 h-5" />,
      facilities: [
        { name: "reflexology", label: "Reflexology" },
        { name: "firstAid", label: "First-aid Services" }
      ]
    },
    {
      title: "Media and Technology",
      icon: <FiTv className="w-5 h-5" />,
      facilities: [
        { name: "tv", label: "TV" }
      ]
    },
    {
      title: "General Services",
      icon: <FiBriefcase className="w-5 h-5" />,
      facilities: [
        { name: "luggageStorage", label: "Luggage Storage" },
        { name: "wakeupCall", label: "Wake-up Call" },
        { name: "concierge", label: "Concierge" },
        { name: "doctorOnCall", label: "Doctor on Call" },
        { name: "wheelchair", label: "Wheelchair" },
        { name: "luggageAssistance", label: "Luggage Assistance" },
        { name: "bellboyService", label: "Bellboy Service" },
        { name: "disabledFacilities", label: "Facilities for Guests with Disabilities" },
        { name: "poolTowels", label: "Pool/Beach towels" },
        { name: "multilingualStaff", label: "Multilingual Staff" }
      ]
    },
    {
      title: "Beauty and Spa",
      icon: <FiUsers className="w-5 h-5" />,
      facilities: [
        { name: "massage", label: "Massage" }
      ]
    },
    {
      title: "Business Center",
      icon: <FiBriefcase className="w-5 h-5" />,
      facilities: [
        { name: "printer", label: "Printer" },
        { name: "photocopying", label: "Photocopying" },
        { name: "conferenceRoom", label: "Conference Room" },
        { name: "banquet", label: "Banquet" }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-6">Facilities & Amenities</h2>
        <div className="space-y-8">
          {facilityCategories.map((category, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                {category.icon}
                <h3 className="text-lg font-medium">{category.title}</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {category.facilities.map((facility) => (
                  <label key={facility.name} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name={facility.name}
                      checked={formData[facility.name] || false}
                      onChange={handleCheckboxChange}
                      disabled={!isEditing}
                      className={!isEditing ? 'cursor-not-allowed' : ''}
                    />
                    {facility.label}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step6; 