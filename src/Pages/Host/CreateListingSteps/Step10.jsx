import React from 'react';
import { Form, Row, Col, Card, Checkbox, Input } from 'antd';

const Step10 = ({ formData, setFormData, isEditing }) => {
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
      <h2 className="text-2xl font-bold mb-6">Verification & Submission</h2>
      
      {/* Document Verification */}
      <Card title="Document Verification" className="mb-4">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item label="ID Proof">
              <Input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  if (!isEditing) return;
                  setFormData(prev => ({
                    ...prev,
                    idProof: e.target.files[0]
                  }));
                }}
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Property Ownership Proof">
              <Input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  if (!isEditing) return;
                  setFormData(prev => ({
                    ...prev,
                    propertyProof: e.target.files[0]
                  }));
                }}
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* Terms & Conditions */}
      <Card title="Terms & Conditions" className="mb-4">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item>
              <Checkbox
                checked={formData.termsAccepted}
                onChange={handleCheckboxChange}
                name="termsAccepted"
                disabled={!isEditing}
              >
                I confirm all details are correct
              </Checkbox>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item>
              <Checkbox
                checked={formData.termsAccepted}
                onChange={handleCheckboxChange}
                name="termsAccepted"
                disabled={!isEditing}
              >
                I accept TripNGrub's terms and policies
              </Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Step10; 