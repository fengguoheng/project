const { createApp } = Vue;
const app = createApp({
    data() {
        return {
            first: '100%',
            second: '100',
            third: '100',
            fourth: '100',
            knowledgeDegree: [],
            degree: ['100%', '80%', '60%', '40%', '20%', '0%'],
            isPop: false,
            showChoosed: false,
            newDegree: ['', '', '', ''],


        }
    },
    methods: {

        getStudentId() {
            console.log(localStorage.getItem('knowledgeDegree'));
            this.knowledgeDegree = localStorage.getItem('knowledgeDegree') || '未获取到知识点接受度';
            //this.first = this.knowledgeDegree.slice(0, 3);
            //this.second = this.knowledgeDegree.slice(3, 5);

        },
        updateDegree() {
            // 关闭弹窗
            this.isPop = false;

            // 遍历 newDegree 数组
            for (let i = 0; i < this.newDegree.length; i++) {
                // 检查 newDegree 数组当前位置是否为空字符串
                if (this.newDegree[i] === '') {
                    // 如果为空字符串，则用 knowledgeDegree 数组中对应位置的元素填充
                    this.newDegree[i] = this.knowledgeDegree[i];
                }
            }
            console.log('填充后的 newDegree 数组:', this.newDegree);

            fetch('http://localhost:3000/updateDegree', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentId: localStorage.getItem('studentId'),
                    newDegree: this.newDegree,
                }),
            })
        }
    },



    created() {
        // 在组件实例创建后调用获取学生 ID 的函数，即获取一些数据
        this.getStudentId();
        console.log(this.knowledgeDegree);
        console.log(localStorage.getItem('knowledgeDegree'));
        console.log(this.first);
        console.log(typeof this.knowledgeDegree === 'string');
        console.log(this.knowledgeDegree.split(','));
        this.knowledgeDegree = this.knowledgeDegree.split(',');
        console.log(Array.isArray(this.knowledgeDegree));
        console.log(this.knowledgeDegree[0]);
        this.first = this.knowledgeDegree[0];
        this.second = this.knowledgeDegree[1];
        this.third = this.knowledgeDegree[2];
        this.fourth = this.knowledgeDegree[3] || '请选择知识点接受度';
        console.log(this.first);

    },
}).mount('#app');

// 新增的点击切换网页代码
const subjectItems = document.querySelectorAll('.subject-item');

subjectItems.forEach((item) => {
    item.addEventListener('click', () => {
        const url = item.dataset.url;
        if (url) {
            window.location.href = url;
        }
    });
});




