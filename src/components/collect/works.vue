<template>
    <div>
        <div class="poster">
            <div style="height: 300px"></div>
            <el-row align="top" class="l1">
                    <span class="hi" >Hi</span>
                    <span>这是</span>
                    <span>我的作品集</span>
            </el-row>
            <div style="height: 300px"></div>
            <el-row style="float: bottom">
                <el-col >
                    <div id="clock">
                        <p class="date">{{ date }}</p>
                        <p class="time">{{ time }}</p>
                    </div>
                    <a herf="http://www.baidu.com/" style="float: right;margin-right: 100px">跳转
                        <!--                    <img src="~@/assets/down.png">-->
                    </a>
                </el-col>
            </el-row>
        </div>
        <div>
            <a id="down11"></a>
            <div style="float: left; width: 40%">
                <img src="~@/assets/readIcon.png">
                <el-col style="color: #707070;font-size: 36px">畅游书海</el-col>
                <el-col>
                    <span style="color: #207bfe;font-size: 55px">书悦</span>
                    <span style="color: black;font-size: 400%">APP</span>
                </el-col>
                <el-col style="color: #7d7d7d;font-size: 200%">一款让你畅游书海的软件，随时随地，想听</el-col>
                <el-col style="color: #7d7d7d;font-size: 200%">就听，想看就看。</el-col>
                <el-col class="part">
                    <span>Part 1</span>
                    <span>Part 2</span>
                    <span>Part 3</span>
                </el-col>
                <el-col class="partText">
                    <span>理念</span>
                    <span>调研</span>
                    <span>界面展示</span>
                </el-col>
            </div>
            <div style="float: left; width: 60%">
                <img src="~@/assets/appMainShow.png">
            </div>
        </div>
        <div>
            <div>
                <div>
                    <el-col>Product Introduction</el-col>
                    <el-col>产品介绍</el-col>
                    <el-col>这款APP，既能满足用户利用碎片时间听/看书，也</el-col>
                    <el-col>能根据用户喜好推荐，节约用户时间。</el-col>
                </div>
                <div>
                    <el-col>设计理念</el-col>
                    <el-col>Design Concept</el-col>
                    <el-col>为了迎合用户碎片化的需求，移动音频在不同场景、不同渠道</el-col>
                    <el-col>优化布局，开放多个入口，深入探索用户在不同场景下的不同</el-col>
                    <el-col>需求，并在界面和交互上持续优化，节约用户使用成本。</el-col>
                </div>
            </div>
            <div>
                <el-col>
                    <span>市场</span>
                    <span>调研</span>
                    <span>&</span>
                    <span>前景</span>
                    <span>分析</span>
                </el-col>
                <el-col><div id="charts" style="height: 600px">条形图渲染失败</div></el-col>
                <el-col>移动音频市场经历了2015年</el-col>
            </div>
        </div>
    </div>
</template>

<script>

    import * as echarts from 'echarts';

    export default {
        name: "works",
        data(){
            return {
                //时钟
                time: '',
                date: '',
                week: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
            }
        },
        mounted(){
            setInterval(this.updateTime, 1000)

            const myChart = echarts.init(document.getElementById('charts'));
            const option = {
                yAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                xAxis: {
                    type: 'value',
                },
                series: [{
                    data: [120, 200, 150, 80, 70, 110, 130],
                    type: 'bar'
                }]
            };
            console.log(myChart)
            myChart.setOption(option)
            console.log(myChart)
        },
        methods:{
            updateTime() {
                const cd = new Date();
                this.time = this.zeroPadding(cd.getHours(), 2) + ':' + this.zeroPadding(cd.getMinutes(), 2) + ':' + this.zeroPadding(cd.getSeconds(), 2);
                this.date = this.zeroPadding(cd.getFullYear(), 4) + '-' + this.zeroPadding(cd.getMonth()+1, 2) + '-' + this.zeroPadding(cd.getDate(), 2) + ' ' + this.week[cd.getDay()];
            },
            zeroPadding(num, digit) {
                let zero = '';
                for(let i = 0; i < digit; i++) {
                    zero += '0';
                }
                return (zero + num).slice(-digit);
            }
        }
    }
</script>

<style scoped>
    .poster{
        background-color: #262626;
        color: white;
        height: 720px;
        width: 1280px;
    }
    .l1{
        float: left;
        margin-left: 10%;
        font-size: 200%;
    }
    .l1 span{
        margin-right: 20px;
    }
    .hi{
        font-size: 150%;
    }
    .hi:hover{
        font-size: 200%;
    }
    .part span{
        color: #505050;
        margin-right: 20px;
    }
    .partText span{
        color: black;
        margin-right: 20px;
        font-size: 150%;
    }
    /*.hiPic:hover{*/
    /*    visibility: visible;*/
    /*}*/
    /*.test{*/
    /*    width: 200px;*/
    /*    height: 200px;*/
    /*}*/
    /*.test img:last-child{*/
    /*    position: relative;*/
    /*    top: -100px;*/
    /*    margin: -20px 0 0 0;*/
    /*    opacity: 0;!*设置透明度0->隐藏*!*/
    /*    transition: all 0.3s ease-in;!*设置缓慢0.3秒出现的动画*!*/
    /*}*/
    /*.test:hover img:last-child{*/
    /*    opacity: 1;*/
    /*}*/
</style>
