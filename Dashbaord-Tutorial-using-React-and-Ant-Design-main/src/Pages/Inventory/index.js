import { Space, Table, Typography, DatePicker, InputNumber } from "antd";
import { useEffect, useState } from "react";
import moment from "moment";
import socketIOClient from "socket.io-client";
import "./index.css"

const ENDPOINT = "http://localhost:3005";

function Orders() {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [searchDate, setSearchDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTemperature, setSearchTemperature] = useState(null);
  const [searchHuminity, setSearchHuminity] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(moment());
  const [searchLight, setSearchLight] = useState(null);

  const [filteredInfo, setFilteredInfo] = useState(null);
  const [sortedInfo, setSortedInfo] = useState(null);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("send-full-data", (data) => {
      setDataSource(data);
      setLoading(false);
    });
  }, []);
  
  const handleTableChange = (filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };



  useEffect(() => {
    if (searchDate || searchTemperature || searchHuminity || searchLight) {
      setLoading(true);
      const filteredData = dataSource.filter((data) => {
        const isSameDate = searchDate
          ? moment(searchDate).isSame(data.createdAT, "minute")
          : true;
        const isSameTemperature = searchTemperature
          ? data.Temperature === searchTemperature
          : true;
        const isSameHuminity = searchHuminity
          ? data.Huminity === searchHuminity
          : true;
        const isSameLight = searchLight
          ? data.Light === searchLight
          : true;
        return isSameDate && isSameTemperature && isSameHuminity && isSameLight;
      });
      setFilteredData(filteredData);
      setLoading(false);
    } else {
      setFilteredData(dataSource);
    }
  }, [searchDate, searchTemperature, searchHuminity, searchLight, dataSource]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(moment());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleSearch = (date, dateString) => {
    setSearchDate(dateString);
  };
  const handleTemperatureSearch = (value) => {
    setSearchTemperature(value);
  };
  const handleHuminitySearch = (value) => {
    setSearchHuminity(value);
  };
  const handleLightSearch = (value) => {
    setSearchLight(value);
  };
  

  return (
    <Space size={20} direction="vertical">
      <Typography.Title level={4}>Actions<p style={{fontSize: 20}}>{currentDateTime.format("YYYY-MM-DD HH:mm:ss")}</p></Typography.Title> 
  
      <div className="SearchByTime" style={{ display: "flex", alignItems: "center" }}>
        <p style={{ marginRight: "10px" }}>Tìm kiếm theo thời gian</p>
        <DatePicker showTime onChange={handleSearch} />
      </div>
      <div className="searchByTemp" style={{ display: "flex", alignItems: "center" }}>
        <p style={{ marginRight: "10px" }}>Tìm kiếm theo nhiệt độ</p>
        <InputNumber
          style={{
            width: 200,
            marginRight: 10
          }}
          defaultValue="1"
          min="0"
          max="100"
          step="1"
          onChange={handleTemperatureSearch}
          // stringMode
        />
         <p style={{ marginRight: "10px" }}>Tìm kiếm theo Độ ẩm</p>
        <InputNumber
          style={{
            width: 200,
            marginRight: 10
          }}
          defaultValue="1"
          min="0"
          max="100"
          step="1"
          onChange={handleHuminitySearch}
          // stringMode
        />
         <p style={{ marginRight: "10px" }}>Tìm kiếm theo Ánh sáng</p>
        <InputNumber
          style={{
            width: 200,
            marginRight: 10
          }}
          defaultValue="1"
          min="0"
          max="500"
          step="1"
          onChange={handleLightSearch}
          // stringMode
        />
      </div>
      
      <Table
        loading={loading}
        columns={[
          {
            title: "ID",
            dataIndex: "id",
          },
          {
            title: "Cum Cam Bien",
            dataIndex: "ClusterSensor",
          },
          {
            title: "Temperature",
            dataIndex: "Temperature",
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.Temperature - b.Temperature,
            // render: (value) => <span>{value}</span>,
          },
          {
            title: "Humidity",
            dataIndex: "Huminity",
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.Huminity - b.Huminity,
            // render: (value) => <span>${value}</span>,
          },
          {
            title: "Light",
            dataIndex: "Light",
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.Light - b.Light,
          },
          {
            title: "Thoi Gian",
            dataIndex: "createdAT",
            defaultSortOrder: 'descend',
            // sorter: (a, b) => a.createdAT - b.createdAT,
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            sortDirections: ['descend', 'ascend'],
          },
        ]}
        dataSource={filteredData}
        pagination={{
          pageSize: 5,
          total:100,
        }}
        onChange={handleTableChange}
      ></Table>
    </Space>
  );
}
export default Orders;
