import Vue from 'vue'
import App from './App.vue'
// 引入路由文件
import router from './router'
// 引入 store
import store from './stores'
// 引入 处理后的axios
import axios from './utils/axios'

//引入公共样式
import './styles/common.scss'

// 引入iview 4.0
import ViewUI from 'view-design'

Vue.use(ViewUI)

Vue.config.productionTip = false

// http response 服务器相应拦截，拦截401，403错误
axios.interceptors.response.use(
    response => {
      // 处理相应数据
      if(!response.data.status==='200'){
        return Promise.resolve(response);
      } else {
        return Promise.reject(response);
      }
    },
    error => {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            router.replace({
              path: '/login',
            });
            break;
          case 403:
            router.replace({
              path: '/login',
            });
            break;
        }
      }
    }
)


// 全局加载进度条
router.beforeEach((to,from,next) => {
  ViewUI.LoadingBar.start();
  next()
})

router.afterEach(route => {
  ViewUI.LoadingBar.finish();
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
