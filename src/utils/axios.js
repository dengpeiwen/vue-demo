import axios from 'axios'
import qs from 'qs'

// 全局设置超时时间
axios.defaults.timeout = 10000;

// 配置请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

if (process.env.NODE_ENV === 'development') {
    //开发环境 do something
    axios.defaults.baseURL = "./api";
} else if (process.env.NODE_ENV === 'debug') {
    //debug do something

} else if(process.env.NODE_ENV == 'production'){
    //生产环境 do something
}

// post 传参序列化(添加请求拦截器)
axios.interceptors.request.use(
    (config) => {
        // 可添加判断token是否合法
          //  不合法可抛异常
        //在发送请求前
        if(config.method === 'post') {
            config.data = qs.stringify(config.data);
        }
        return config
    },
    (error => {
        console.log('错误的传参');
        return Promise.reject(error);
    })
)

export default axios;
