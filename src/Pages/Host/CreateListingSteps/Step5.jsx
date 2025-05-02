import React from 'react';
import { Form, Row, Col, Card, Checkbox, Input, InputNumber, Radio, Select, TimePicker } from 'antd';

const { TextArea } = Input;

const Step5 = ({ formData, setFormData, languages, isEditing }) => {
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Property Rules & Policies</h2>
      
      {/* Must Read Rules */}
      <Card title="Must Read Rules" className="mb-4">
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Form.Item label="Check-in Time">
              <TimePicker 
                format="HH:mm"
                value={formData.checkInTime}
                onChange={(time) => handleChange('checkInTime', time)}
                placeholder="Select check-in time"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Check-out Time">
              <TimePicker 
                format="HH:mm"
                value={formData.checkOutTime}
                onChange={(time) => handleChange('checkOutTime', time)}
                placeholder="Select check-out time"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Minimum Age of Primary Guest">
              <InputNumber 
                min={18} 
                value={formData.minAge} 
                onChange={(value) => handleChange('minAge', value)}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Accepted ID Proofs">
              <Checkbox.Group 
                value={formData.acceptedIds} 
                onChange={(value) => handleChange('acceptedIds', value)}
              >
                <Checkbox value="passport">Passport</Checkbox>
                <Checkbox value="aadhar">Aadhar</Checkbox>
                <Checkbox value="govtId">Govt ID</Checkbox>
                <Checkbox value="dl">Driving License</Checkbox>
              </Checkbox.Group>
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* Guest Profile */}
      <Card title="Guest Profile" className="mb-4">
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Form.Item label="Unmarried Couples Allowed">
              <Radio.Group 
                value={formData.unmarriedCouplesAllowed} 
                onChange={(e) => handleChange('unmarriedCouplesAllowed', e.target.value)}
              >
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Male-Only Groups Allowed">
              <Radio.Group 
                value={formData.maleOnlyGroupsAllowed} 
                onChange={(e) => handleChange('maleOnlyGroupsAllowed', e.target.value)}
              >
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Scanty Baggage Allowed">
              <Radio.Group 
                value={formData.scantyBaggageAllowed} 
                onChange={(e) => handleChange('scantyBaggageAllowed', e.target.value)}
              >
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* Smoking & Alcohol */}
      <Card title="Smoking & Alcohol" className="mb-4">
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item label="Smoking Allowed">
              <Radio.Group 
                value={formData.smokingAllowed} 
                onChange={(e) => handleChange('smokingAllowed', e.target.value)}
              >
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Alcohol Consumption Allowed">
              <Radio.Group 
                value={formData.alcoholAllowed} 
                onChange={(e) => handleChange('alcoholAllowed', e.target.value)}
              >
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* Food Arrangement */}
      <Card title="Food Arrangement" className="mb-4">
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item label="Non-veg Food Allowed">
              <Radio.Group 
                value={formData.nonVegAllowed} 
                onChange={(e) => handleChange('nonVegAllowed', e.target.value)}
              >
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Outside Food Allowed">
              <Radio.Group 
                value={formData.outsideFoodAllowed} 
                onChange={(e) => handleChange('outsideFoodAllowed', e.target.value)}
              >
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Food Delivery Options">
              <Checkbox.Group 
                value={formData.foodDeliveryOptions} 
                onChange={(value) => handleChange('foodDeliveryOptions', value)}
              >
                <Checkbox value="zomato">Zomato</Checkbox>
                <Checkbox value="swiggy">Swiggy</Checkbox>
                <Checkbox value="local">Local</Checkbox>
                <Checkbox value="ubereats">UberEats</Checkbox>
              </Checkbox.Group>
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* Property Accessibility */}
      <Card title="Property Accessibility" className="mb-4">
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item label="Wheelchair Accessible">
              <Radio.Group 
                value={formData.wheelchairAccessible} 
                onChange={(e) => handleChange('wheelchairAccessible', e.target.value)}
              >
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Wheelchair Provided">
              <Radio.Group 
                value={formData.wheelchairProvided} 
                onChange={(e) => handleChange('wheelchairProvided', e.target.value)}
              >
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* Pet Policy */}
      <Card title="Pet Policy" className="mb-4">
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item label="Pets Allowed">
              <Radio.Group 
                value={formData.petsAllowed} 
                onChange={(e) => handleChange('petsAllowed', e.target.value)}
              >
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Pets on Property">
              <Radio.Group 
                value={formData.petsOnProperty} 
                onChange={(e) => handleChange('petsOnProperty', e.target.value)}
              >
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* Child & Extra Bed Policy */}
      <Card title="Child & Extra Bed Policy" className="mb-4">
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Form.Item label="Extra Mattress Cost (Child)">
              <InputNumber 
                min={0}
                prefix="₹"
                value={formData.extraMattressChildCost}
                onChange={(value) => handleChange('extraMattressChildCost', value)}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Extra Mattress Cost (Adult)">
              <InputNumber 
                min={0}
                prefix="₹"
                value={formData.extraMattressAdultCost}
                onChange={(value) => handleChange('extraMattressAdultCost', value)}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Extra Cot Cost">
              <InputNumber 
                min={0}
                prefix="₹"
                value={formData.extraCotCost}
                onChange={(value) => handleChange('extraCotCost', value)}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* Other Rules */}
      <Card title="Other Rules" className="mb-4">
        <Form.Item label="Additional Rules & Policies">
          <TextArea 
            rows={4}
            value={formData.otherRules}
            onChange={(e) => handleChange('otherRules', e.target.value)}
            placeholder="Enter party/event policy, swimming pool timings, check-in/check-out policies, gala dinner charges, refund/cancellation policies, and any extra notes"
          />
        </Form.Item>
      </Card>
    </div>
  );
};

export default Step5; 