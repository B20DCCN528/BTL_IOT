// Import modules
const express = require('express');
const mysql = require('mysql');

// Create app and database connection
const app = express();
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'sensors'
});

// Set up routes
app.get('/', function(req, res) {
  con.query('SELECT * FROM Sensors ORDER BY ID', function(err, result, fields) {
    if (err) throw err;
    console.log('Full Data selected');
    var fullData = [];
    result.forEach(function(value) {
      var m_time = value.Time.toString().slice(4, 24);
      fullData.push({
        id: value.id,
        time: m_time,
        temperature: value.temperature,
        humidity: value.humidity,
        light: value.light
      });
    });
    res.send(`
      <html>
        <head>
          <style>
            table {
              border-collapse: collapse;
              width: 100%;
              font-family: Arial, Helvetica, sans-serif;
            }
            th, td {
              text-align: left;
              padding: 8px;
            }
            tr:nth-child(even){background-color: #f2f2f2}
            th {
              background-color: #4CAF50;
              color: white;
            }
          </style>
        </head>
        <body>
          <h1>Full Data</h1>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Time</th>
                <th>Temperature</th>
                <th>Humidity</th>
                <th>Light</th>
              </tr>
            </thead>
            <tbody>
              ${fullData.map(data => `
              <tr>
                <td>${data.id}</td>
                <td>${data.time}</td>
                <td>${data.temperature}</td>
                <td>${data.humidity}</td>
                <td>${data.light}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
  });
});

// Start the server
app.listen(3000, function() {
  console.log('Server started on port 3000');
});
