const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const svgCaptcha = require('svg-captcha');
const { password } = require('../config');
console.log('userModel:', userModel);

// 生成随机验证码的函数
const generateRandomCaptcha = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captchaText = '';
    const length = 4; // 验证码长度
    for (let i = 0; i < length; i++) {
        captchaText += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    const captchaId = Date.now().toString(); // 生成唯一的验证码 ID
    const captchaSvg = svgCaptcha.create(); // 这里应替换为真实生成的验证码 SVG 内容
    return { captchaId, captchaSvg, captchaText };
};

// 用户注册
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = await userModel.createUser(username, hashedPassword);
        res.status(201).json({ message: 'User registered successfully', userId });
    } catch (error) {
        res.status(500).json({ message: 'Registration faile', error: error.message });
    }
});

// 用户登录
router.post('/login', async (req, res) => {
    try {
        const { username, password, captcha,captchaSvg } = req.body;
        // 验证验证码
        console.log('23'+captcha);

        if (captcha!== captchaSvg.text) {
            return res.status(400).json({ message: '验证码错误' });
        }

        const user = await userModel.getUserByUsername(username);
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successfully', token });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});

// 更新用户信息
router.put('/updateInfo', async (req, res) => {
    // 检查必要参数是否存在
    if (!req.body.userId ||!req.body.newInfo) {
        return res.status(400).json({ message: 'userId and newInfo are required fields' });
    }
    try {
        const { userId, newInfo } = req.body;
        await userModel.updateUserInfo(userId, newInfo);
        res.status(200).json({ message: 'User info updated successfully' });
        
    } catch (error) {
        // 这里可以根据不同的错误类型返回更详细的提示
        console.error('Update error:', error); 
        res.status(500).json({ message: 'Update failed', error: error.message });
    }
});

// 处理验证码请求
router.get('/captcha', (req, res) => {
    const captchaData = generateRandomCaptcha();
    res.status(200).json(captchaData);//在网络
});

// 获取用户信息
router.get('/getUserInfo', async (req, res) => {
    try {
        // 从请求头中获取 token
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // 验证 token
        const decoded = jwt.verify(token, 'your_secret_key');
        const userId = decoded.userId;

        // 根据用户 ID 获取用户信息
        const user = await userModel.getUserById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Get user info error:', error);
        res.status(500).json({ message: 'Failed to get user info', error: error.message });
    }
});

// 找回密码
router.post('/find', async (req, res) => {
    console.log('收到找回请求');
    //return res.status(200).json({ message: '问题答案正确' });
    try {
        const { username,answer } = req.body;
        console.log(username);
        console.log(answer);
        const user = await userModel.getUserByUsername(username);
        console.log(user);
        console.log(user,password);
        if (!user) {
            return res.status(404).json({ message: '用户不存在' });
        }
        //return res.status(200).json({word:'成功'});
        
        
        console.log(password);
        console.log(password);
        return res.status(200).json({ password:user.password });
    } catch (error) {
        console.log('找回密码时出错:', error);
        return res.status(500).json({error:error, message: '服务器内部错误' });
    }
});
router.post('/reset', async (req, res) => {
    try {
        const { username, newPassword } = req.body;
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await userModel.resetPassword(username, hashedPassword);    
        res.status(200).json({ message: 'Password reset successfully' }); 
    }catch(error){
        return res.status(500).json({error:origin,massage:'服务器内部错误'})

    }
});
router.post('/changeAdvantageSubject',async(req,res)=>{
    try {console.log(123);
        
        const { username,firstSubject,secondSubject,thirdSubject } = req.body;
        console.log(123);
        //return res.status(200).json({ message: '123' });
        await userModel.changeAdvantageSubject(firstSubject,secondSubject,thirdSubject,username);
        //return res.status(200).json({ message: '123' });
        return res.status(200).json({ message: 'Advantage subject updated successfully' }); 
        return res.status(200).json({ message: '123' });
    }
    catch(error){
        return res.status(500).json({message:'error'});
    }
});
router.post('/getAdvantageSubject',async(req,res)=>{
    try {
        const { username } = req.body;
        console.log(123);
        console.log(username);
        //res.status(200).json({ message: '123' });
        const subject = await userModel.getAdvantageSubjectByUsername(username);
        return res.status(200).json(subject);
    }
    catch(error){
        return res.status(500).json({message:'error'});
    }
});


module.exports = router;