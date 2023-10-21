# BTL_IOT
Bài tập lớn IoT sử dụng ESP8266 và DHT11

Chức năng chính : Hiển thị thông tin nhiệt độ, độ ẩm, ánh sáng, độ bụi từ DHT11 và Light Sensor, Hiển thị lịch sử các lần đo, lịch sử bật tắt đèn và quạt, trên giao diện có 2 nút bật tắt đèn và quạt để điều khiển 2 cái đèn tượng trưng cho quạt và đèn được dùng trên phần cứng, khi các giá trị quá mức cho phép ví dụ temperature > 30 thì có cảnh báo trên giao diện, và khi kết nối với phần cứng thì đèn có thể nhấp nháy để cảnh báo...

Sử dụng : Reactjs, Nodejs, Mysql, Mqtt (Broker: MQTTX), Aduino cùng phần cứng DHT11, ESP8266, LED, LightSensor, ...
Cách sử dụng:
  + trong server thì gõ cú pháp node index.js
  + trong phần frontend thì gõ npm start
              
Vì sử dụng Aduino nên hãy đảm bảo cài đủ các thư viện và chỉnh sửa thông số các chân kết nối phù hợp theo cách mình cắm mạch ở phần cứng, và chỉnh sửa thông số wifi hay CSDL theo cách của bạn đang dùng

Nếu có thắc mắc gì hãy liên hệ : https://www.facebook.com/Quangbach115 Nếu mình có thể giúp gì cho bạn thì mình rất sẵn lòng !
