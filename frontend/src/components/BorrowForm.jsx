import React from 'react';
import { Form, Input, Button, Card, notification } from 'antd';
import { BookOutlined, UserOutlined } from '@ant-design/icons';
import axiosInstance from '../api/axiosInstance';

const BorrowForm = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      // Gọi API từ Backend đã viết
      const response = await axiosInstance.post(`/muon-sach/?ma_dg=${values.ma_dg}&ma_sach=${values.ma_sach}&ma_tt=Admin`);
      
      notification.success({
        message: 'Thành công',
        description: response.data.message,
        placement: 'topRight',
      });
      form.resetFields(); // Reset form sau khi mượn thành công
    } catch (error) {
      // Hiển thị lỗi từ Backend (ví dụ: đang mượn sách chưa trả)
      notification.error({
        message: 'Lỗi mượn sách',
        description: error.response?.data?.detail || 'Có lỗi xảy ra!',
        placement: 'topRight',
      });
    }
  };

  return (
    <Card title="Ghi nhận mượn sách mới" style={{ maxWidth: 600, margin: '20px auto' }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Mã Độc giả" name="ma_dg" rules={[{ required: true, message: 'Vui lòng nhập mã độc giả!' }]}>
          <Input prefix={<UserOutlined />} placeholder="Ví dụ: SV001" />
        </Form.Item>
        
        <Form.Item label="Mã Sách" name="ma_sach" rules={[{ required: true, message: 'Vui lòng nhập mã sách!' }]}>
          <Input prefix={<BookOutlined />} placeholder="Ví dụ: PYTHON01" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Thực hiện mượn
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default BorrowForm;
