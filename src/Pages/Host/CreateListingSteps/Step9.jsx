import React from 'react';
import { Form, Row, Col, Card, Checkbox, Input } from 'antd';

const Step9 = ({ formData, setFormData, paymentOptions, isEditing }) => {
  const handleArrayToggle = (field, value) => {
    if (!isEditing) return;
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleInputChange = (e) => {
    if (!isEditing) return;
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Payment Setup</h2>
      
      {/* Payment Methods */}
      <Card title="Payment Methods" className="mb-4">
        <Row gutter={[16, 16]}>
          {paymentOptions.map(method => (
            <Col span={8} key={method}>
              <Form.Item>
                <Checkbox
                  checked={formData.paymentMethods.includes(method)}
                  onChange={() => handleArrayToggle('paymentMethods', method)}
                  disabled={!isEditing}
                >
                  {method}
                </Checkbox>
              </Form.Item>
            </Col>
          ))}
        </Row>
      </Card>

      {/* PAN/GST Details */}
      <Card title="Tax Information" className="mb-4">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item label="PAN/GST ID">
              <Input
                name="panGstId"
                value={formData.panGstId}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Enter PAN or GST ID"
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* Bank Account Details */}
      <Card title="Bank Account Details" className="mb-4">
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item label="Account Number">
              <Input
                value={formData.bankDetails.accountNumber}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  bankDetails: { ...prev.bankDetails, accountNumber: e.target.value }
                }))}
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="IFSC Code">
              <Input
                value={formData.bankDetails.ifscCode}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  bankDetails: { ...prev.bankDetails, ifscCode: e.target.value }
                }))}
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Account Holder Name">
              <Input
                value={formData.bankDetails.accountHolderName}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  bankDetails: { ...prev.bankDetails, accountHolderName: e.target.value }
                }))}
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Step9; 