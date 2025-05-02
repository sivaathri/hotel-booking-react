import React from 'react';
import { Form, Row, Col, Card, Checkbox, Radio } from 'antd';

const Step8 = ({ formData, setFormData, guestTypes, isEditing }) => {
  const handleArrayToggle = (field, value) => {
    if (!isEditing) return;
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
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

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Guest Booking Preferences</h2>
      
      {/* Guest Types */}
      <Card title="Who can book?" className="mb-4">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item>
              <Checkbox.Group 
                value={formData.allowedGuests} 
                onChange={(value) => setFormData(prev => ({ ...prev, allowedGuests: value }))}
                disabled={!isEditing}
              >
                <Row gutter={[16, 16]}>
                  {guestTypes.map(type => (
                    <Col span={8} key={type}>
                      <Checkbox value={type}>{type}</Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* Booking Type */}
      <Card title="Booking Type" className="mb-4">
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item label="Instant Booking">
              <Radio.Group 
                value={formData.instantBooking} 
                onChange={(e) => setFormData(prev => ({ ...prev, instantBooking: e.target.value }))}
                disabled={!isEditing}
              >
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Manual Approval">
              <Radio.Group 
                value={formData.manualApproval} 
                onChange={(e) => setFormData(prev => ({ ...prev, manualApproval: e.target.value }))}
                disabled={!isEditing}
              >
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Step8; 