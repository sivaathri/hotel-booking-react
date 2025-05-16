import React from 'react';
import { Form, Row, Col, Card, Checkbox, Radio, Input, InputNumber, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';
import './RichTextEditor.css';

const Step8 = ({ formData, setFormData, guestTypes, isEditing }) => {
  const handleEditorChange = (content) => {
    if (!isEditing) return;
    setFormData(prev => ({ ...prev, description: content }));
  };

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
      {/* Property Description */}
      <Card 
        title={
          <div className="flex items-center gap-2">
            About this property
            <Tooltip title="Write a detailed description of your property. Include unique features, amenities, and what makes it special. A good description helps attract more guests.">
              <InfoCircleOutlined className="text-blue-500 cursor-help" />
            </Tooltip>
          </div>
        } 
        className="mb-6"
      >
        <Form.Item>
          <div className={`border rounded-lg ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}>
            <Editor
              apiKey="lq1ipb4lm97xlal4jcgck7qi4m4k2y1522763ta8ojddoh7q"
              value={formData.description || ''}
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
                  'searchreplace', 'visualblocks', 'fullscreen',
                  'insertdatetime', 'table', 'help', 'wordcount'
                ],
                toolbar: isEditing ? 
                  'undo redo | formatselect | bold italic underline | ' +
                  'alignleft aligncenter alignright alignjustify | ' +
                  'bullist numlist | removeformat help' : false,
                content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif; font-size: 14px }',
                readonly: !isEditing,
                branding: false,
                statusbar: false,
                placeholder: "Write a detailed description of your property (minimum 1000 words). Include information about the location, amenities, nearby attractions, and what makes your property special."
              }}
              onEditorChange={handleEditorChange}
              disabled={!isEditing}
            />
          </div>
        </Form.Item>
      </Card>

      {/* Distance Information */}
      <Card title="Distance" className="mb-6">
        <Form.Item label="How many kilometers to the nearest beach?">
          <InputNumber
            value={formData.nearest_beach_distance || 0}
            onChange={(value) => setFormData(prev => ({ ...prev, nearest_beach_distance: value }))}
            disabled={!isEditing}
            min={0}
            max={100}
            step={0.1}
            addonAfter="km"
            style={{ width: '200px' }}
          />
        </Form.Item>
        <Form.Item label="How many kilometers to the nearest railway station?">
          <InputNumber
            value={formData.nearest_railway_station_distance || 0}
            onChange={(value) => setFormData(prev => ({ ...prev, nearest_railway_station_distance: value }))}
            disabled={!isEditing}
            min={0}
            max={100}
            step={0.1}
            addonAfter="km"
            style={{ width: '200px' }}
          />
        </Form.Item>
        <Form.Item label="How many kilometers to the nearest airport?">
          <InputNumber
            value={formData.nearest_airport_distance || 0}
            onChange={(value) => setFormData(prev => ({ ...prev, nearest_airport_distance: value }))}
            disabled={!isEditing}
            min={0}
            max={100}
            step={0.1}
            addonAfter="km"
            style={{ width: '200px' }}
          />
        </Form.Item>
        <Form.Item label="How many kilometers to the nearest bus stand?">
          <InputNumber
            value={formData.nearest_bus_stand_distance || 0}
            onChange={(value) => setFormData(prev => ({ ...prev, nearest_bus_stand_distance: value }))}
            disabled={!isEditing}
            min={0}
            max={100}
            step={0.1}
            addonAfter="km"
            style={{ width: '200px' }}
          />
        </Form.Item>
      </Card>

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
                value={formData.instant_booking} 
                onChange={(e) => setFormData(prev => ({ ...prev, instant_booking: e.target.value }))}
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
                value={formData.manual_approval} 
                onChange={(e) => setFormData(prev => ({ ...prev, manual_approval: e.target.value }))}
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