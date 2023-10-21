const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server,{
  cors:{
    origin:"*",
  }
})
var mqtt = require('mqtt');
var mysql = require('mysql');

var con = mysql.createConnection({ // khai báo config database
    host: "localhost",
    user:'root',
    password:'12345',
    database: "iot"
});

var options = { // khai báo config mqtt
    host:"broker.emqx.io",
    port: 1883,
    protocol: 'mqtt',
    username: 'Quang',
    password: '12345'
}
let status_LED = "l0"; // biến lưu trạng trạng thái đèn led ban đầu (l0-tắt , l1-bật)
let status_FAN = "f0";// biến lưu trạng trạng thái đèn quạt ban đầu (f0-tắt , f1-bật)

// initialize the MQTT client
var client = mqtt.connect(options);

// subscribe vào 'topic_0'
client.subscribe('topic_0');

// Kiem tra ket noi với MQTT
client.on('connect', function () {
  console.log('Connected MQTT');
});

// log ra lỗi nếu kết nối vs mqtt có lỗi
client.on('error', function (error) {
  console.log(error);
});

// Create TABLE
con.connect(function(err) {
    if (err) throw err;
    
    var sql = "CREATE TABLE IF NOT EXISTS Sensors (id int(10) PRIMARY KEY AUTO_INCREMENT, ClusterSensor INT(1) DEFAULT 1,Temperature FLOAT(2),Huminity FLOAT(2),Light FlOAT(2), DoBui INT(2),createdAT datetime default NOW())" // câu lệnh sql để tạo ra table có tên là sensor
    
    var sql5 = "CREATE TABLE IF NOT EXISTS Status (id int(10) PRIMARY KEY AUTO_INCREMENT, ClusterSensor INT(1) DEFAULT 1, Item VARCHAR(10), Statuss VARCHAR(3),createdAT datetime default NOW())" // câu lệnh sql để tạo ra table có tên là status

    con.query(sql, function (err) { // lệnh query đến database đê tạo table
      if (err) throw err;
      console.log("Table Sensors created");
    });

    con.query(sql5, function (err) { // lệnh query đến database đê tạo table
      if (err) throw err;
      console.log("Table Status created");
    });

});


 // lắng nghe xem có client nào kết nối với server không 
io.on('connection', (socket) => {
  console.log(`${io.engine.clientsCount} users active`); // log ra số lượng client đang kết nối đến server
  io.emit('data-connect',{status_LED,status_FAN}); // gửi dữ liệu trạng thái đèn của led và quạt hiện tại cho client vừa kết nối vào
  socket.on('send-alert', (data) => {
    client.publish('topic_3', data);
  })
  socket.on('send-led',(data) => {  // lắng nghe sự thay đổi trạng thái của đèn LED từ client
    status_LED = data; // gán trạng thái vừa nhận được vào biến toàn cục để gửi cho các client mới kết nối vào sau
    io.emit('led-change',data) //gửi dữ liệu thay đổi đèn led đến các client khác (Các client không phải là client trực tiếp nhấn nút nhấn)
    client.publish('topic_2',data); // gửi dữ liệu thay đổi đèn led cho broker mqtt ở topic_2 để mqtt gửi dữ liệu này về phần cứng điều khiển đèn bật tắt
    if(status_LED === 'f1') {
      statuss = 'ON';
    }
    else {
      statuss = 'OFF';
    }
    itemm = 'LED';
    const created1 = new Date().toLocaleString(); 
    var sql10 = `INSERT INTO Status (Item, Statuss) VALUES ('LED','${statuss}')`; 
    con.query(sql10, function (err, result) { 
        if (err) throw err;
            console.log(`1 record inserted`);
    });
    io.emit('send-data-led',{itemm,statuss,created1}); 



  })
  socket.on('send-fan',(data) => { //lắng nghe sự thay đổi trạng thái của đèn Quạt(Fan) từ client
    status_FAN = data; // gán trạng thái vừa nhận được vào biến toàn cục để gửi cho các client mới kết nối vào sau
    io.emit('fan-change',data) //gửi dữ liệu thay đổi đèn Quạt đến các client khác (Các client không phải là client trực tiếp nhấn nút nhấn)
    client.publish('topic_1',data);//gửi dữ liệu thay đổi đèn Quạt cho broker mqtt ở topic_2 để mqtt gửi dữ liệu này về phần cứng điều khiển đèn bật tắt

    if(status_FAN === 'f1') {
      statuss = 'ON';
    }
    else {
      statuss = 'OFF';
    }
    itemm = 'FAN';
    const created1 = new Date().toLocaleString(); // tạo giá trị thời gian tại thời điểm nhân được dữ liệu nhiệt độ, độ ẩm , ánh sáng
    var sql10 = `INSERT INTO Status (Item, Statuss) VALUES ('FAN','${statuss}')`; // câu lệnh sql để thêm giá trị nhiệt độ, độ ẩm, ánh sáng  vào database
    con.query(sql10, function (err, result) { // lệnh thêm giá trị nhiệt độ, độ ẩm, ánh sáng  vào database
        if (err) throw err;
            console.log(`1 record inserted`);
    });
    io.emit('send-data-fan',{itemm,statuss,created1});  // gửi giá trị nhiệt độ, độ ẩm, ánh sáng, thời gian nhận cho các client để các client hiển thị giá trị và vẽ đồ thị
  })

  // Send data to History
  var sql7 = "Select * FROM Sensors ODERS"
  con.query(sql7, function (err, result, fields) {
    if(err) throw err;
    console.log("Full Data selected");
    io.emit('send-full-data', result);
  })
 
  //  Send data to Status
   var sql8 = "Select * FROM Status STATUS"
   con.query(sql8, function (err, result, fields) {
     if(err) throw err;
     console.log("Full Data selected");
     io.emit('send-status-data', result);
   })
   function searchSensorsByTime(startTime, endTime, callback) {
    var sql11 = `SELECT * FROM Sensors WHERE createdAT >= '${startTime}' AND createdAT <= '${endTime}'`;
    con.query(sql11, function (err, result) {
      if(err) throw err;
      console.log("Full Data selected");
      io.emit('send-searchSensor-data', result);
    });
   }
  function searchStatusByTime(startTime, endTime, callback) {
    var sql12 = `SELECT * FROM Status WHERE createdAT >= '${startTime}' AND createdAT <= '${endTime}'`;
    con.query(sql12, function (err, result) {
      if(err) throw err;
      console.log("Full Data selected");
      io.emit('send-seachstatus-data', result);
    });
  }


});


// lắng nghe những topic mà đã subscribe vào
client.on('message', function (topic, message) {
  console.log(topic,message.toLocaleString()) // log ra màn hình tên topic và giá trị nhận được
    if(topic === "topic_0" && message){
        const data = message.toLocaleString().split(","); // tách các giá trị nhiệt độ, độ ẩm , ánh sáng từ chuỗi về thành mảng gồm 3 phần tử
        const temperature = Math.round(data[0]); // làm tròn giá trị nhiệt độ và gán cho biến temperature
        const humidity =  Math.round(data[1]); // làm tròn giá trị độ ẩm và gán cho biến humidity
        const light =  Math.round(data[2]);// làm tròn giá trị ánh sáng và gabs cho biến light
        const dobui =  Math.round(data[3]);// làm tròn giá trị ánh sáng và gabs cho biến Do Bui

        const created = new Date().toLocaleString(); // tạo giá trị thời gian tại thời điểm nhân được dữ liệu nhiệt độ, độ ẩm , ánh sáng
        var sql = `INSERT INTO Sensors (Temperature,Huminity,Light, DoBui) VALUES (${temperature},${humidity},${light}, ${dobui})`; // câu lệnh sql để thêm giá trị nhiệt độ, độ ẩm, ánh sáng  vào database
        con.query(sql, function (err, result) { // lệnh thêm giá trị nhiệt độ, độ ẩm, ánh sáng  vào database
            if (err) throw err;
            console.log(`1 record inserted`);
        });
        io.emit('send-data',{temperature,humidity,light,dobui,created});  // gửi giá trị nhiệt độ, độ ẩm, ánh sáng, thời gian nhận cho các client để các client hiển thị giá trị và vẽ đồ thị
    }
});


server.listen(3005, () => { // port mà server hoạt động (có thể thay đổi nếu b muốn -vd : 3001,3002,3003....)
    console.log('listening on *:3005');
  });

module.exports = {
    getData: function() {
        return fullData;
    }
}
