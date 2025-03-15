const mysql = require('mysql2/promise');
const config = require('../config');

// 创建数据库连接池
const pool = mysql.createPool(config);

/**
 * 创建新用户
 * @param {string} username - 用户名
 * @param {string} password - 加密后的密码
 * @returns {Promise<number>} - 新用户的ID
 */
const createUser = async (username, password) => {
    const [rows] = await pool.execute('INSERT INTO users (username, password) VALUES (?,?)', [username, password]);
    return rows.insertId;
};

/**
 * 根据用户名获取用户信息
 * @param {string} username - 用户名
 * @returns {Promise<Object|null>} - 用户信息对象，如果未找到则返回 null
 */
const getUserByUsername = async (username) => {
    console.log('Entering getUserByUsername function with username:', username);
    const [rows] = await pool.execute('SELECT * FROM users WHERE username =?', [username]);
    console.log('Query result:', rows);
    return rows[0];
};
const getPasswordByUsername = async (username) => {
    const [rows] = await pool.execute('SELECT password FROM users WHERE username =?', [username]);
    return rows[0];
};

/**
 * 更新用户信息
 * @param {number} userId - 用户ID
 * @param {Object} newInfo - 包含新信息的对象，如 { email, phone }
 * @returns {Promise<void>}
 */
const updateUserInfo = async (userId, newInfo) => {
    const { email, phone } = newInfo;
    await pool.execute('UPDATE users SET email =?, phone =? WHERE id =?', [email, phone, userId]);
};

/**
 * 根据用户 ID 获取用户信息
 * @param {number} userId - 用户 ID
 * @returns {Promise<Object|null>} - 用户信息对象，如果未找到则返回 null
 */
const getUserById = async (userId) => {
    const [rows] = await pool.execute('SELECT * FROM users WHERE id =?', [userId]);
    return rows[0];
};
const resetPassword=async(username,password)=>{
    const [rows] = await pool.execute('UPDATE users SET password =? WHERE username =?', [password, username]);
    return rows[0];
}
const changeAdvantageSubject = async (username, firstSubject, secondSubject, thirdSubject) => {
    try {
        
        
        
       
        // 定义 SQL 语句，更新 subject 表中姓名为 username 的记录的三个字段
        const sql = 'UPDATE subject SET first_subject =?, second_subject =?, third_subject =? WHERE name =?';
        // 执行 SQL 语句，将参数传递给占位符
        const [rows] = await pool.execute(sql, [username,firstSubject, secondSubject, thirdSubject]);

        // 检查是否有记录被更新
        if (rows.affectedRows === 0) {
            console.log(`未找到姓名为 ${username} 的记录，未进行更新。`);
        } else {
            console.log(`成功更新姓名为 ${username} 的记录的优势学科。`);
        }

        return rows;
    } catch (error) {
        console.error('更新优势学科时出现错误:', error);
        throw error;
    }
};
const getAdvantageSubjectByUsername = async (username) => {
    const [rows] = await pool.execute('SELECT first_subject, second_subject, third_subject FROM subject WHERE name =?', [username]);
    return rows[0]; 
}

// 导出数据库操作函数
module.exports = {
    createUser,
    getUserByUsername,
    updateUserInfo,
    getUserById,
    getPasswordByUsername,
    resetPassword,
    changeAdvantageSubject,
    getAdvantageSubjectByUsername
};