const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
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

// 解析JSON格式的请求体



app.post('/login', async (req, res) => {
    const { id, name, password } = req.body;

    // 检查请求体中是否包含必要的字段
    if (!id || !password) {
        return res.status(400).json({ message: '用户名和密码是必需的' });
    }

    try {
        console.log(id);
        console.log(password);

        // 从数据库中查询用户信息
        const [rows] = await pool.execute('SELECT * FROM students WHERE id =?', [id]);
        console.log(await pool.execute('SELECT * FROM students WHERE id =?', [id]));
        console.log(rows[0].weakSub);
        console.log(rows);

        if (rows.length === 0) {
            return res.status(401).json({ message: '用户不存在' });
        }

        if (rows[0].password !== password) {
            return res.status(401).json({ message: '密码错误' });
        }

        // 返回登录成功的响应
        res.status(200).json({
            message: '登录成功123',
            advantageSub: rows[0].advantageSub,
            weakSub: rows[0].weakSub,
            studentId: rows[0].id,
            name: rows[0].name,
            knowledgeDegree: rows[0].knowledgeDegree,
            reply: rows[0].reply,
            category: rows[0].class,
            anotherReply: rows[0].anotherReply,
            result: rows[0].result,
            content: rows[0].content,
        });
    } catch (error) {
        console.error('登录时出错45:', error);
        return res.status(500).json({ message: '登录时出错67' });
    }
});
app.post('/updateAdvantageSub', async (req, res) => {
    const { studentId, advantageSub } = req.body;


    try {


        const [result] = await pool.execute('UPDATE students SET advantageSub = ? WHERE id = ?', [advantageSub, studentId]);
        return res.status(200).json({ message: '优势学科更新成功' });
    }
    catch (error) {
        console.error('更新优势学科时出错:', error);
        return res.status(500).json({ message: '更新优势学科时出错' }); 
    }
    
})
app.post('/updateDegree',async(req,res)=>{
    await pool.execute('UPDATE students SET knowledgeDegree = ? WHERE id = ?', [req.body.newDegree, req.body.studentId]);
    return res.json({message:'更新接受度成功'});
});
app.post('/saveClass', async (req, res) => {
    await pool.execute('UPDATE students SET class =? WHERE id =?', [req.body.category, req.body.studentId]);
    return res.json({message:'更新心理倾诉分类成功·'});
});
app.post('/updateResult', async (req, res) => {
    await pool.execute('UPDATE students SET reply =? WHERE id =?', [req.body.result, req.body.studentId]);
    return res.json({message:'更新讲课风格调查结果成功·'}); 
})

// 全局错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
});
app.post('/saveContent', async (req, res) => {
    await pool.execute('UPDATE students SET content =? WHERE id =?', [req.body.content, req.body.studentId]);
    return res.json({message:'更新心理倾诉内容成功·'});
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
