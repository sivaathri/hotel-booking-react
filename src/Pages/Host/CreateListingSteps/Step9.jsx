import React from 'react';
import { Form, Row, Col, Card, Checkbox, Input, Select, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

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

  const handleBankDetailsChange = (field, value) => {
    if (!isEditing) return;
    setFormData(prev => ({
      ...prev,
      bankDetails: { ...prev.bankDetails, [field]: value }
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

      {/* PayPal Email for International Owners */}
      <Card title="International Payment Details" className="mb-4">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item label="PayPal Email">
              <Input
                name="paypalEmail"
                value={formData.paypalEmail}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Enter PayPal email for international payments"
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* Tax Information */}
      <Card title="Tax Information" className="mb-4">
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item label="PAN Number" required>
              <Input
                name="panNumber"
                value={formData.panNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Enter PAN Number"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="GST Number">
              <Input
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Enter GST Number (if applicable)"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Business Name (as per GST registration)">
              <Input
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Enter business name as per GST registration"
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* Bank Account Details */}
      <Card title="Bank Account Details" className="mb-4">
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item label="Account Holder Name" required>
              <Input
                value={formData.bankDetails.accountHolderName}
                onChange={(e) => handleBankDetailsChange('accountHolderName', e.target.value)}
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Account Number" required>
              <Input
                value={formData.bankDetails.accountNumber}
                onChange={(e) => handleBankDetailsChange('accountNumber', e.target.value)}
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Bank Name" required>
              <Input
                value={formData.bankDetails.bankName}
                onChange={(e) => handleBankDetailsChange('bankName', e.target.value)}
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="IFSC Code" required>
              <Input
                value={formData.bankDetails.ifscCode}
                onChange={(e) => handleBankDetailsChange('ifscCode', e.target.value)}
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Account Type" required>
              <Select
                value={formData.bankDetails.accountType}
                onChange={(value) => handleBankDetailsChange('accountType', value)}
                disabled={!isEditing}
                options={[
                  { value: 'savings', label: 'Savings' },
                  { value: 'current', label: 'Current' }
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="SWIFT Code">
              <Input
                value={formData.bankDetails.swiftCode}
                onChange={(e) => handleBankDetailsChange('swiftCode', e.target.value)}
                disabled={!isEditing}
                placeholder="For international transfers"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Beneficiary Mobile Number">
              <Input
                value={formData.bankDetails.beneficiaryMobile}
                onChange={(e) => handleBankDetailsChange('beneficiaryMobile', e.target.value)}
                disabled={!isEditing}
                placeholder="For UPI verification"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Payout Frequency">
              <Select
                value={formData.bankDetails.payoutFrequency}
                onChange={(value) => handleBankDetailsChange('payoutFrequency', value)}
                disabled={!isEditing}
                options={[
                  { value: 'daily', label: 'Daily' },
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'after_checkout', label: 'After Checkout' },
                  { value: 'manual', label: 'Manual Request' }
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Bank Verification Documents">
              <Upload
                disabled={!isEditing}
                beforeUpload={() => false}
                onChange={({ fileList }) => handleBankDetailsChange('verificationDocuments', fileList)}
                multiple={false}
              >
                <Button icon={<UploadOutlined />} disabled={!isEditing}>
                  Upload Bank Passbook/Cancelled Cheque
                </Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Step9; 