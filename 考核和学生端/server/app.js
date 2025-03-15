const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');

const app = express();
const port = 3000;

// 处理favicon.ico请求，避免404错误
app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
});

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

// 解析JSON格式的请求体
app.use(bodyParser.json());
app.use('/api/users', userRoutes);

// 打印 userRoutes 的类型，方便排查问题
console.log('Type of userRoutes:', typeof userRoutes);

// 全局错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});