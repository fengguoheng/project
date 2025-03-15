const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql2/promise');

// 创建数据库连接池
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '2794840873',
    database: 'learnCareer'
})
pool.getConnection((err, connection) => {
    if (err) {
        console.error('数据库连接出错:', err);
    } else {
        console.log('数据库连接成功');
        connection.release();
    }
});
app.use(bodyParser.json());
// 手动设置跨域请求的响应头
app.use((req, res, next) => {
    // 允许所有来源的请求，生产环境建议指定具体的域名
    res.setHeader('Access-Control-Allow-Origin', '*');
    // 允许的请求方法
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    // 允许的请求头
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // 允许携带凭证（如cookie）
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // 如果是预检请求（OPTIONS），直接返回200状态码
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    next();
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
});
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

app.post('/login', async (req, res) => {
    const { teacherName, password } = req.body;
    const [rows] = await pool.execute('SELECT * FROM teachers WHERE id = 1');
    const [rowss] = await pool.execute('SELECT * FROM students WHERE id = 1');
    //if (rows[0].teacherName === teacherName && rows[0].password === password) {
    res.json({
        message: '登录成功',
        teacherName: rows[0].teacherName,
        password: rows[0].password,
        teacherId: rows[0].id,
        name: rowss[0].name,
        id: rowss[0].id,
        time: rowss[0].time,
        message: '111111111',

    });
    //};
});