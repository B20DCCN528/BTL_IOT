import { Space, Table, Typography, DatePicker } from "antd";
import { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import moment from "moment";
const ENDPOINT = "http://localhost:3005";
function Orders() {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [searchDate, setSearchDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState(moment());
  const [sortOrder, setSortOrder] = useState(null);


  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("send-status-data", (data) => {
      setDataSource(data);
      setLoading(false);
    });
  }, []);
  

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(moment());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);


  const handleTableChange = (pagination, filters, sorter) => {
    setSortOrder(sorter.order);
  };

  useEffect(() => {
    if (searchDate) {
      setLoading(true);
      const formattedSearchDate = moment(searchDate).format("YYYY-MM-DD HH:mm:ss");
      const filteredData = dataSource.filter(
        (data) =>
          moment(data.createdAT).isSameOrAfter(formattedSearchDate, "minute") &&
          moment(data.createdAT).isSameOrBefore(formattedSearchDate, "minute")
      );
      setFilteredData(filteredData);
      setLoading(false);
    } else {
      setFilteredData(dataSource);
    }
  }, [searchDate, dataSource]);


  // useEffect(() => {
  //   if (searchDate) {
  //     setLoading(true);
  //     const filteredData = dataSource.filter(
  //       (data) =>
  //         moment(searchDate).isSame(data.createdAT, "minute")
  //     );
  //     setFilteredData(filteredData);
  //     setLoading(false);
  //   } else {
  //     setFilteredData(dataSource);
  //   }
  // }, [searchDate, dataSource]);

  const handleSearch = (date, dateString) => {
    setSearchDate(dateString);
  };

  useEffect(() => {
    if (searchDate) {
      setLoading(true);
      const formattedSearchDate = moment(searchDate).format("YYYY-MM-DD HH:mm:ss");
      const filteredData = dataSource.filter(
        (data) =>
          moment(data.createdAT).isSame(formattedSearchDate, "minute")
      );
      setFilteredData(filteredData);
      setLoading(false);
    } else {
      setFilteredData(dataSource);
    }
  }, [searchDate, dataSource]);

  return (
    <Space size={20} direction="vertical">
      <Typography.Title level={4}>Actions<p style={{fontSize: 20}}>{currentDateTime.format("YYYY-MM-DD HH:mm:ss")}</p></Typography.Title>
      <p>Tìm kiếm theo thời gian</p>
      <DatePicker showTime onChange={handleSearch} />
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
            title: "Title",
            dataIndex: "Item",
          },
        
          {
            title: "Trang Thai",
            dataIndex: "Statuss",
          },
          {
            title: "Thoi Gian",
            dataIndex: "createdAT",
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.createdAT - b.createdAT,
          },
        ]}
        dataSource={filteredData}
        pagination={{
          pageSize: 5,
          total:100,
        }}
      ></Table>
    </Space>
  );
}
export default Orders;
