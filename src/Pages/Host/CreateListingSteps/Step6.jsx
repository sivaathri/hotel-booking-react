import React from 'react';
import { Form, Row, Col, Card, Checkbox } from 'antd';
import { FiActivity, FiWifi, FiCoffee, FiShield, FiTv, FiBriefcase, FiUsers } from 'react-icons/fi';

const Step6 = ({ formData, setFormData, isEditing }) => {
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
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Facilities & Amenities</h2>
      <div className="space-y-4">
        {facilityCategories.map((category, index) => (
          <Card 
            key={index} 
            title={
              <div className="flex items-center gap-2">
                {category.icon}
                <span>{category.title}</span>
              </div>
            }
            className="mb-4"
          >
            <Row gutter={[16, 16]}>
              {category.facilities.map((facility) => (
                <Col span={8} key={facility.name}>
                  <Form.Item>
                    <Checkbox
                      name={facility.name}
                      checked={formData[facility.name] || false}
                      onChange={handleCheckboxChange}
                      disabled={!isEditing}
                    >
                      {facility.label}
                    </Checkbox>
                  </Form.Item>
                </Col>
              ))}
            </Row>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Step6; 