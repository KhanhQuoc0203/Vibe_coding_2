import React, { useState, useEffect } from 'react';
import { Table, Card, Typography, Spin, Tag, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import axiosInstance from '../api/axiosInstance';
import moment from 'moment';

const { Title } = Typography;

const OverdueReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm lấy dữ liệu từ API
  const fetchData = async () => {
    setLoading(true);
    try {
      // Gọi đúng Endpoint báo cáo ở Backend
      const response = await axiosInstance.get('/bao-cao/chua-tra');
      setData(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy báo cáo:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Cấu hình các cột hiển thị của bảng
  const columns = [
    { 
      title: 'Mã Phiếu', 
      dataIndex: 'ma_phieu', 
      key: 'ma_phieu',
      width: 100 
    },
    { 
      title: 'Tên Độc giả', 
      dataIndex: 'doc_gia', 
      key: 'doc_gia',
      render: (text) => <b>{text}</b> // Làm đậm tên độc giả cho dễ nhìn
    },
    { 
      title: 'Lớp', 
      dataIndex: 'lop', 
      key: 'lop',
      filters: [ // Cho phép lọc theo lớp (KHDL19B)
        { text: 'KHDL19B', value: 'KHDL19B' },
      ],
      onFilter: (value, record) => record.lop.indexOf(value) === 0,
    },
    { 
      title: 'Mã Sách', 
      dataIndex: 'sach', 
      key: 'sach',
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    { 
      title: 'Ngày Mượn', 
      dataIndex: 'ngay_muon', 
      key: 'ngay_muon',
      sorter: (a, b) => moment(a.ngay_muon).unix() - moment(b.ngay_muon).unix(),
      render: (text) => text ? moment(text).format('DD/MM/YYYY') : 'Chưa rõ'
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: () => <Tag color="error">Chưa trả</Tag>
    }
  ];

  return (
    <Card 
      style={{ margin: '20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={3} style={{ margin: 0 }}>📊 Báo cáo: Độc giả chưa trả sách</Title>
          <Button 
            type="primary" 
            icon={<ReloadOutlined />} 
            onClick={fetchData}
            loading={loading}
          >
            Làm mới
          </Button>
        </div>
      }
    >
      <Table 
        dataSource={data} 
        columns={columns} 
        loading={loading}
        rowKey={(record) => record.ma_phieu} // Dùng ID phiếu mượn làm key duy nhất
        bordered 
        pagination={{ pageSize: 5 }} // Chia trang, mỗi trang 5 dòng
        locale={{ emptyText: 'Hiện tại không có độc giả nào nợ sách' }}
      />
    </Card>
  );
};

export default OverdueReport;