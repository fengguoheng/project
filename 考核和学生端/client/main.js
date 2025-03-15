new Vue({
    el: '#app',
    data: {
        isLoggedIn: false,
        isLoginForm: false,
        registerUsername: '',
        registerPassword: '',
        loginUsername: '',
        loginPassword: '',
        captcha: '',
        captchaId: '',
        captchaSvg: {},
        captchaText: '', // 新增验证码文本字段
        token: '',
        user: {},
        isEditing: false,
        newInfo: {
            email: '',
            phone: ''
        },
        answer: '',
        isFinding: false,
        isResetting: false,
        
        newPassword: '',
        answerRight: false,
        
    },
    mounted() {
        if (this.isLoginForm) {
            this.getCaptcha();
        }
    },
    methods: {
        register() {
            fetch('http://localhost:3000/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: this.registerUsername,
                    password: this.registerPassword
                })
            })
                .then(response => response.json())
                .then(data => {//data就是浏览器网络res对象
                    console.log('1');
                    console.log(data);
                    if (data.message === 'User registered successfully') {
                        alert('注册成功');
                    }
                    if (data.message === "Registration faile") {
                        alert('注册失败');

                    }
                })
                .catch(error => {//如果收到data，则不执行
                    alert('注册失败');
                    console.log('Registration error:', error);
                });
        },
        login() {
            fetch('http://localhost:3000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: this.loginUsername,
                    password: this.loginPassword,
                    captcha: this.captcha,//用户输入的
                    captchaId: this.captchaId,
                    captchaText: this.captchaText, // 正确的
                    captchaSvg: this.captchaSvg
                })
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data.message.length);
                    console.log('验证码错误'.length);
                    if (data.message == '验证码错误') {
                        alert('登录失败');
                        this.getCaptcha();
                    }

                    if (data.token) {
                        this.isLoggedIn = true;
                        this.token = data.token;
                        // 获取用户信息
                        fetch('http://localhost:3000/api/users/getUserInfo', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${this.token}`
                            }
                        })
                            .then(userResponse => userResponse.json())
                            .then(userData => {

                                console.log(userData);
                                console.log('this.user');
                                this.user = userData;
                                if (this.isLoginForm)
                                    alert('登录成功');
                                else {
                                    alert('登录失败');
                                }
                            })
                            .catch(userError => {
                                alert('登录失败');
                                console.error('获取用户信息出错:', userError);
                            });
                    }
                    console.log(data);
                    if (data.message === 'Invalid captcha') {
                        this.getCaptcha();
                    }
                })
                .catch(error => {
                    console.error('Login error:', error);
                });
        },
        toggleForm() {
            this.isLoginForm = !this.isLoginForm;
            if (this.isLoginForm) {
                this.getCaptcha();
            }
        },
        getCaptcha() {
            fetch('http://localhost:3000/api/users/captcha')
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    this.captchaId = data.captchaId;
                    this.captchaSvg = data.captchaSvg;
                    this.captchaText = data.captchaText; // 更新验证码文本
                    //alert(this.captchaSvg.text);
                    console.log(this.captchaSvg.text);
                    // 提示用户验证码
                })
                .catch(error => {
                    console.error('Captcha error:', error);
                });
        },
        editInfo() {
            this.isEditing = true;
            this.newInfo.email = this.user.email;
            this.newInfo.phone = this.user.phone;
        },
        saveInfo() {
            console.log('userId的值:', this.user.id);
            console.log('newInfo的值:', this.newInfo);
            fetch('http://localhost:3000/api/users/updateInfo', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: this.user.id,
                    newInfo: this.newInfo
                })
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    this.isEditing = false;
                    alert('信息保存成功');
                    // 更新用户信息
                })
                .catch(error => {
                    console.error('Update error:', error);
                });
        },
        cancelEdit() {
            this.isEditing = false;
        },
        logout() {
            this.isLoggedIn = false;
            this.token = '';
            alert('退出成功');
        },
        findPassword() {




            if (this.answer === '此心光明，亦复何虑。') {
                answerRight = true;
                fetch('http://localhost:3000/api/users/find', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({//req.body
                        username: this.loginUsername,


                        answer: this.answer
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        // 假设返回的数据里有 password 字段
                        if (data.password) {
                            alert(`你的密码为: ${data.password}`);
                            alert('如果看不懂此哈希密码，请重置密码');
                        } else {
                            alert('未成功获取到密码');
                        }
                    })
                    .catch(error => {
                        console.error('找回密码失败:', error);
                    });
            }
        },
        toFind() {

            console.log('isFinding 的值:', this.isFinding);
            this.isFinding = true;

            console.log('isFinding 的值:', this.isFinding);
        },
        resetPassword() {
            
            // 向后端发送重置密码的请求
            // 假设后端返回一个新的密码
            fetch('http://localhost:3000/api/users/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    // req.body
                    username: this.loginUsername,
                    newPassword: this.newPassword // 去掉引号，正确获取属性值
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('密码重置成功');
                alert('密码重置成功');
            })
            .catch(error => {
                console.error('密码重置失败:', error);
            });
            // 去掉多余的 })
        },
            // 向后端发送重置密码的请求
            // 假设后端返回一个新的密码
            
            // 去掉多余的 })
            toReset(){
                this.isResetting=true;
            },
            toRegister(){
                this.isFinding=false; 
            },
            backToFind(){
                this.isResetting=false;
            },
            toPractise(){
                window.location.href = '十二xue登录界面.html'; 
            }

        
    },
    

});
