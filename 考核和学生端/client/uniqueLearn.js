const app = new Vue({
    el: '#app',
    data() {
        return {
            allSubjects: ["语文", "数学", "英语", "物理", "化学", "生物", "政治", "日语", "俄语"],
            selectedAdvantageSubjects: ["数学", "英语", "化学"],
            selectedWeaknessSubjects: [],
            isAdvantageModalVisible: false,
            isWeaknessModalVisible: false,
            studentId: null,// 新增 studentId 属性
            studentName: null,// 新增 studentName 属性
            advantageSub: null,
            weakSub: null,
            knowledgeDegree: null,
        };
    },
    methods: {
        // 显示优势学科选择弹窗
        showAdvantageModal() {
            this.isAdvantageModalVisible = true;
        },
        // 隐藏优势学科选择弹窗
        hideAdvantageModal() {
            this.isAdvantageModalVisible = false;
        },
        // 显示薄弱学科选择弹窗
        showWeaknessModal() {
            this.isWeaknessModalVisible = true;
        },
        // 隐藏薄弱学科选择弹窗
        hideWeaknessModal() {
            this.isWeaknessModalVisible = false;
        },
        // 切换优势学科的选中状态
        toggleAdvantageSubjectSelection(subject) {
            if (this.selectedAdvantageSubjects.includes(subject)) {
                this.selectedAdvantageSubjects = this.selectedAdvantageSubjects.filter(s => s !== subject);
            } else {
                this.selectedAdvantageSubjects.push(subject);
            }
        },
        // 判断优势学科是否被选中
        isAdvantageSubjectSelected(subject) {
            return this.selectedAdvantageSubjects.includes(subject);
        },
        // 确认优势学科选择
        confirmAdvantageSubjects() {
            this.isAdvantageModalVisible = false;
        },
        // 切换薄弱学科的选中状态
        toggleWeaknessSubjectSelection(subject) {
            if (this.selectedWeaknessSubjects.includes(subject)) {
                this.selectedWeaknessSubjects = this.selectedWeaknessSubjects.filter(s => s !== subject);
            } else {
                this.selectedWeaknessSubjects.push(subject);
            }
        },
        // 判断薄弱学科是否被选中
        isWeaknessSubjectSelected(subject) {
            return this.selectedWeaknessSubjects.includes(subject);
        },
        // 确认薄弱学科选择
        confirmWeaknessSubjects() {
            this.isWeaknessModalVisible = false;
        },
        // 获取学生 ID 的函数
        getStudentId() {
            this.studentId = localStorage.getItem('studentId') || '未获取到 ID';
            this.studentName = localStorage.getItem('studentName') || '未获取到姓名';
            this.advantageSub = localStorage.getItem('advantageSub') || '未获取到优势学科';
            this.weakSub = localStorage.getItem('weakSub') || '未获取到薄弱学科';
            this.knowledgeDegree = localStorage.getItem('knowledgeDegree') || '未获取到知识程度';
            
        },
        goToStudyPage() {
            localStorage.setItem('studentId', this.studentId);
            localStorage.setItem('studentName', this.studentName);
            localStorage.setItem('studentPassword', this.studentPassword);
            localStorage.setItem('advantageSub', this.advantageSub);
            localStorage.setItem('weakSub', this.weakSub);
            localStorage.setItem('knowledgeDegree', this.knowledgeDegree);
            console.log(this.knowledgeDegree);
            window.location.href = '学习生涯首页.html';
        }

    },
    created() {
        // 在组件实例创建后调用获取学生 ID 的函数
        this.getStudentId();
        console.log(this.knowledgeDegree);
        console.log(localStorage.getItem('knowledgeDegree'));

    },

});