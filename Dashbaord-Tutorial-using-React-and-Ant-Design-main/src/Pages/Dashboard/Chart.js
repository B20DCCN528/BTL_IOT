import React from "react";
import "./index.css";
import {
    Chart as ChartJS,
    CategoryScale, // tiêu đề trên trục x;
    LinearScale, // tiêu đề trục y
    PointElement, // hiển thị các điểm trên biểu đồ
    LineElement, // Đây là một phần tử dùng để vẽ các đường nối các điểm trên biểu đồ.
    Title, // Đây là một thành phần để thêm tiêu đề cho biểu đồ.
    Tooltip, // Đây là một thành phần dùng để hiển thị thông tin chi tiết khi di chuột qua các phần tử trên biểu đồ.
    Legend, // Đây là một thành phần dùng để hiển thị chú giải (legends) cho các dữ liệu trong biểu đồ,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function chart({ temp, humidity, light, dobui }) {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 1000,
            easing: "linear",
        },
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    font: {
                        size: 18,
                    },
                    color: "black",
                },
            },
            title: {
                display: true,
                text: "Biểu đồ thông số nhiệt độ, độ ẩm , ánh sáng, độ bụi",
                color: "Black",
                font: {
                    size: 20,
                },
            },
            tooltip: {
                titleFont: {
                    size: 18,
                },
                bodyFont: {
                    size: 16,
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    font: {
                        size: 16,
                    },
                    color: "black",
                },
                grid: {
                    color: "#08AEEA", // Màu của đường kẻ dọc theo trục x
                },
            },

            y: {
                ticks: {
                    font: {
                        size: 16,
                    },
                    color: "black",
                },
                grid: {
                    color: "#08AEEA", // Màu của đường kẻ dọc theo trục x
                },
            },
        },
    };
    const data = {
        labels: temp.map((temp, index) => `Data ${index + 1}`),
        // labels: Array.from(Array(10).keys()).map((_, index)=> `Data ${index + 1}`),
        datasets: [
            {
                label: "Nhiệt độ",
                data: temp,
                backgroundColor: "#F44236", // màu của các điểm chấm
                borderColor: "#F44236", // màu của đường nét
            },
            {
                label: "Độ ẩm",
                data: humidity,
                backgroundColor: "#059e68",
                borderColor: "#059e68",
            },
            {
                label: "Ánh sáng",
                data: light,
                backgroundColor: "#FFCA29",
                borderColor: "#FFCA29",
            },
            {
                label: "Độ Bụi",
                data: dobui,
                backgroundColor: "#3333FF",
                borderColor: "#3333FF",
            },
        ],
    };

    return (
        <div style={{ width: 650, height: 500 }}>
            <Line options={options} data={data} />
        </div>
    );
}

export default chart;
