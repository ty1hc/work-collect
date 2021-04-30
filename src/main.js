import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Avue from '@smallwei/avue';
import '@smallwei/avue/lib/index.css';
import * as echarts from 'echarts';


// import axios from 'axios'

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(Avue);
Vue.use(echarts);

new Vue({
  render: h => h(App),
}).$mount('#app')
// window.axios = axios


