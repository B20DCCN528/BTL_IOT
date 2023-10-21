import React from 'react'
import { Helmet } from "react-helmet";
import "./index.css"
import { useState, useEffect} from 'react';
import ReactSwitch from 'react-switch';
import Chart from './Chart';
import { BsLightbulb, BsLightbulbFill} from "react-icons/bs";
import io from 'socket.io-client';


const socket= io('http://localhost:3005'); // địa chỉ ip của server nodejs và port của nó (thay đổi khi kết nối vs wifi khác nhau)
// const temperature= document.querySelector(".item-1 .value"); // lấy ra element để hiển thị giá trị nhiệt độ
// const humidity = document.querySelector(".item-2 .value");// lấy ra element để hiển thị giá trị độ ẩm
// const light = document.querySelector(".item-3 .value");// lấy ra element để hiển thị giá trị ánh sáng
// const dobui= document.querySelector(".item-4 .value");

function ToggleSwitch() {
const [checked, setChecked] = useState(true);

const handleChange = val => {
    setChecked(val)
}

return (
    <div className="switch" style={{textAlign: "center"}}>
      {/* <h4></h4> */}
      <ReactSwitch
          checked={checked}
          onChange={handleChange}
      />
    </div>
);
}


  

const Dashboard = () => {
    const [checkBulbOff, setCheckBulbOff] = useState(true);
    const [checkBulbOn, setCheckBulbOn] = useState(false);

    const [checkFanOff, setCheckFanOff] = useState(true);
    const [checkFanOn, setCheckFanOn] = useState(false);

    // Import jQuery
    var script1 = document.createElement('script');
    script1.src = 'https://code.jquery.com/jquery-3.5.1.slim.min.js';
    document.head.appendChild(script1);

    // Import Popper.js
    var script2 = document.createElement('script');
    script2.src = 'https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.4/dist/umd/popper.min.js';
    document.head.appendChild(script2);

    // Import Bootstrap
    var script3 = document.createElement('script');
    script3.src = 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js';
    document.head.appendChild(script3);

    // Import Chart.js
    var script4 = document.createElement('script');
    script4.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    document.head.appendChild(script4);

    const [arrTemp, setArrTemp] = useState([]);
    const [arrHumidity, setArrHumidity] = useState([]);
    const [arrLight, setArrLight] = useState([]);
    const [arrDoBui, setArrDoBui] = useState([]);
    const [showAlert, setShowAlert] = useState(false);


    const [currentIndex, setCurrentIndex] = useState(0);

    const controlBulb = () => {
        setCheckBulbOff(!checkBulbOff);
        setCheckBulbOn(!checkBulbOn);
        if(checkBulbOff) {
            socket.emit("send-led","l0");
        }
        if(checkBulbOn) {
            socket.emit("send-led","l1");
        }
      
    };

    const controlFan = () => {
        setCheckFanOff(!checkFanOff);
        setCheckFanOn(!checkFanOn);
        if(checkFanOff) {
            socket.emit("send-fan","f0"); //gửi dữ liệu là chuỗi f2 cho server
        }
        if(checkFanOn) {
            socket.emit("send-fan","f1"); // gửi dữ liệu là chuỗi f1 cho server 
        }

    };

    const updateChartData = () => {
        //generate a random value
        socket.on("send-data",(data) => {
            const randomValue1 = data.temperature;
            const randomValue2 = data.humidity;
            const randomValue3 = data.light;
            const randomValue4 = data.dobui;


            setArrTemp((prevArr) => {
                const updateArr = [...prevArr, randomValue1];
    
                if (updateArr.length > 5) {
                    updateArr.shift();
                }
    
                setCurrentIndex(updateArr.length - 1);
    
                return updateArr;
            });
            setArrHumidity((prevArr) => {
                const updateArr = [...prevArr, randomValue2];
    
                if (updateArr.length > 5) {
                    updateArr.shift();
                }
    
                setCurrentIndex(updateArr.length - 1);
    
                return updateArr;
            });
            setArrLight((prevArr) => {
                const updateArr = [...prevArr, randomValue3];
    
                if (updateArr.length > 5) {
                    updateArr.shift();
                }
    
                setCurrentIndex(updateArr.length - 1);
    
                return updateArr;
            });
            setArrDoBui((prevArr) => {
                const updateArr = [...prevArr, randomValue4];
    
                if (updateArr.length > 5) {
                    updateArr.shift();
                }
    
                setCurrentIndex(updateArr.length - 1);
    
                return updateArr;
            });

            
    

        })
        
    };
    useEffect(() => {
        updateChartData(); // goi ham updateChartData truoc interval de he thong hien thi du lieu trong lan render dau tien
        // neu khong goi truoc thi khi lan dau he thong render se khong co bat ki du lieu nao ma phai doi interval dc goi lan dau tien
        const interval = setInterval(updateChartData, 5000);
        return () => {
            clearInterval(interval); // clear Interval di de du lieu se khong tiep tuc chay trong khi ta di chuyen sang component khac khong dung den component nay nua

        };
    }, []);
    
    let addClassTemp = "";
    if(arrTemp[currentIndex] >= 39) {
        addClassTemp = "veryVeryHot";
    }
    else if (arrTemp[currentIndex] >= 34 && arrTemp[currentIndex] < 39) {
        addClassTemp = "veryHot";
    }
    else if (arrTemp[currentIndex] < 34 && arrTemp[currentIndex] >= 29) {
        addClassTemp = "hot";
    }
    else if (arrTemp[currentIndex] < 29 && arrTemp[currentIndex] >= 25) {
        addClassTemp = "cloudy";
    }
    else {
        addClassTemp = "cold";
    }

    let addClassHumidity = "";
    
    if(arrHumidity[currentIndex] <= 20) {
        addClassHumidity = "dry";
    }
    else if (arrHumidity[currentIndex] > 20 && arrHumidity[currentIndex] <= 50) {
        addClassHumidity = "stable";
    }
    else {
        addClassHumidity = "wet";
    }

    let addClassLight = "";
    if(arrLight[currentIndex] < 100) {
        addClassLight = "dark";
    }
    else if(arrLight[currentIndex] >= 100 && arrLight[currentIndex] < 200) {
        addClassLight = "normal";
    }
    else if(arrLight[currentIndex] >= 200 && arrLight[currentIndex] < 300) {
        addClassLight = "normal-2";
    }
    else if(arrLight[currentIndex] >= 300 && arrLight[currentIndex] < 400) {
        addClassLight = "normal-3";
    }
    else if(arrLight[currentIndex] >= 400 && arrLight[currentIndex] < 500) {
        addClassLight = "normal-4";
    }
    else if(arrLight[currentIndex] >= 500 && arrLight[currentIndex] < 600) {
        addClassLight = "normal-5";
    }
    else if(arrLight[currentIndex] >= 600 && arrLight[currentIndex] < 600) {
        addClassLight = "normal-6";
    }
    else {
        addClassLight = "dazzle";
    }

    useEffect(() => {
        const MAX_TEMPERATURE = 30; // Ngưỡng nhiệt độ tối đa
        const MAX_HUMIDITY = 75; // Ngưỡng độ ẩm tối đa
        const MAX_LIGHT = 250;
        if (arrTemp[currentIndex] > MAX_TEMPERATURE || arrHumidity[currentIndex] > MAX_HUMIDITY || arrLight[currentIndex] > MAX_LIGHT) {
          setShowAlert(true);
          socket.emit("send-alert","a1");
        } else {
          setShowAlert(false);
        }
      }, [arrTemp, arrHumidity, arrLight, currentIndex]);
  
  return (
    <>
      <Helmet>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" />
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
      </Helmet>
      <div className="container">
          <div className={`row justify-content-between ${showAlert ? 'alert' : ''}`}>
                  <div className={`card flex-fill p-2 item-1 ${addClassTemp} id="temperature"`}>
                      <div className="card-body">
                          <h5 className="card-title">Nhiệt độ <i class="fa-solid fa-temperature-three-quarters"></i></h5>
                          
                          <p id="temperature-status" className="card-text value">{arrTemp[currentIndex]} &deg;C</p>
                      </div>
                  </div>
                  <div className={`card flex-fill p-2 item-4 ${addClassTemp}`}>
                      <div className="card-body">
                          <h5 className="card-title">Độ Bụi <i class="fa-solid fa-cloud"></i></h5>
                          
                          <p className="card-text value">{arrDoBui[currentIndex]} PM</p>
                      </div>
                  </div>
                  <div className={`card flex-fill p-2 item-2 ${addClassHumidity} id="humidity"`}>
                      <div className="card-body">
                          <h5 className="card-title">Độ ẩm <i class="fa-solid fa-droplet"></i></h5>
                          <p id="humidity-status" className="card-text value">{arrHumidity[currentIndex]} %</p>
                      </div>
                  </div>
                  <div className={`card flex-fill p-2 item-3 ${addClassLight} id="light"`}>
                      <div className="card-body">
                          <h5 className="card-title">Ánh sáng <i class="fa-solid fa-sun"></i></h5>
                          <p id="light-status" className="card-text value">{arrLight[currentIndex]} Lux</p>
                      </div>        
                  </div>
          </div>

          <div className="row">
              <div className="card col-8">
                  <div className="card-body">
                      <div className="chart">
                        <Chart
                            temp={arrTemp}
                            humidity={arrHumidity}
                            light={arrLight}
                            dobui={arrDoBui}
                        />
                      </div>
                      
                   </div>
              </div>
              <div className="card col-4 px-0">
                      <div className="card-body lightpub control-1">
                          {/* <h5 className="card-title">Đèn <i className="fa-solid fa-lightbulb"></i></h5> */}
                          <div className={
                            checkBulbOn
                                ? "inFor3-item flashbulb active"
                                : "inFor3-item flashbulb"
                            }
                        >
                        {checkBulbOn ? (
                            <BsLightbulbFill className="icon icon-bulb active-bulb" />
                        ) : (
                            <BsLightbulb className="icon icon-bulb" />
                        )}
                        <span className="desc">Bóng đèn</span>
                        <div onClick={controlBulb} className="control control-2">
                            <div
                                className={checkBulbOn ? "btn btn-on" : "btn"}
                            >
                                On
                            </div>
                            <div
                                className={
                                    checkBulbOff ? "btn active-btn" : "btn"
                                }
                            >
                                Off
                            </div>
                        </div>
                    </div>
                      </div>

                      {/* <div className="card-body lightpub control-1">
                          <h5 className="card-title">Đèn <i className="fa-solid fa-lightbulb"></i></h5>
                          <div className={
                            checkBulbOn
                                ? "inFor3-item flashbulb active"
                                : "inFor3-item flashbulb"
                            }
                        >
                        {checkBulbOn ? (
                            <BsLightbulbFill className="icon icon-bulb active-bulb" />
                        ) : (
                            <BsLightbulb className="icon icon-bulb" />
                        )}
                        <span className="desc">Bóng đèn</span>
                        <div onClick={controlBulb} className="control control-2">
                            <div
                                className={checkBulbOn ? "btn btn-on" : "btn"}
                            >
                                On
                            </div>
                            <div
                                className={
                                    checkBulbOff ? "btn active-btn" : "btn"
                                }
                            >
                                Off
                            </div>
                        </div>
                    </div>
                      </div> */}
                
                      <div className="card-body fan control-2">
                          {/* <h5 className="card-title">Quạt <i class="fa-solid fa-fan fa-spin"></i></h5> */}
                          <div className={
                            checkFanOn
                                ? "inFor3-item fan active"
                                : "inFor3-item fan"
                            }
                           >
                            {checkFanOff ? (
                                <i className="icon fa-solid fa-fan" />
                            ) : (
                                <i className="icon fa-solid fa-fan fa-spin" />
                            )}
                                <span className="desc"> Quạt</span>
                                <div onClick={controlFan} className="control control-2">
                                    <div
                                        className={checkFanOn ? "btn btn-on" : "btn"}
                                    >
                                        On
                                    </div>
                                    <div
                                        className={
                                            checkFanOff ? "btn active-btn" : "btn"
                                        }
                                    >
                                        Off
                                    </div>
                                </div>
                        </div>
                      </div>
                  
              </div>
          </div>

          
      </div>
    </>
  );
}



export default Dashboard