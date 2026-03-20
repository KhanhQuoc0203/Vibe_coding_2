import React, { useState, useEffect } from 'react';
import { Layout, Menu, Typography, Table, Form, Input, Button, Card, notification, Divider, Tag } from 'antd';
import { BookOutlined, AreaChartOutlined, UserOutlined } from '@ant-design/icons';
import axiosInstance from './api/axiosInstance';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/bao-cao/chua-tra');
      setData(res.data);
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  };

  const handleMuon = async (values) => {
    try {
      const res = await axiosInstance.post(`/muon-sach/?ma_dg=${values.ma_dg}&ma_sach=${values.ma_sach}`);
      notification.success({ message: 'Thành công', description: res.data.message });
      fetchData(); // Cập nhật lại bảng
    } catch (e) {
      notification.error({ message: 'Lỗi', description: e.response?.data?.detail || 'Lỗi kết nối' });
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#001529', display: 'flex', alignItems: 'center', color: 'white' }}>
        <Title level={3} style={{ color: 'white', margin: 0 }}>LMS - KHDL19B - KHÁNH</Title>
      </Header>
      
      <Layout>
        <Sider width={250} theme="light">
          <Menu mode="inline" defaultSelectedKeys={['1']} items={[
            { key: '1', icon: <BookOutlined />, label: 'Mượn Sách' },
            { key: '2', icon: <UserOutlined />, label: 'Quản lý Độc giả' },
            { key: '3', icon: <AreaChartOutlined />, label: 'Báo cáo chưa trả' }
          ]} />
        </Sider>

        <Content style={{ padding: '24px' }}>
          <Card title="Ghi nhận mượn sách mới" bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Form layout="vertical" onFinish={handleMuon}>
              <div style={{ display: 'flex', gap: '20px' }}>
                <Form.Item name="ma_dg" label="Mã Độc giả (Thử: 23711381)" rules={[{required: true}]} style={{ flex: 1 }}>
                  <Input placeholder="Nhập mã thẻ sinh viên" />
                </Form.Item>
                <Form.Item name="ma_sach" label="Mã Sách (Thử: PY-001)" rules={[{required: true}]} style={{ flex: 1 }}>
                  <Input placeholder="Nhập mã vạch trên sách" />
                </Form.Item>
              </div>
              <Button type="primary" htmlType="submit" size="large">Xác nhận cho mượn</Button>
            </Form>
          </Card>

          <Divider />

          <Card title="Danh sách Độc giả chưa trả sách (Báo cáo định kỳ)">
            <Table 
              dataSource={data} 
              loading={loading}
              rowKey="id"
              columns={[
                { title: 'Tên Độc giả', dataIndex: 'ho_ten', key: 'name' },
                { title: 'Lớp', dataIndex: 'lop', key: 'class' },
                { title: 'Mã Sách', dataIndex: 'ma_sach', render: (t) => <Tag color="blue">{t}</Tag> },
                { title: 'Ngày mượn', dataIndex: 'ngay_muon', key: 'date' },
                { title: 'Tình trạng', render: () => <Tag color="error">Đang giữ sách</Tag> }
              ]} 
            />
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;