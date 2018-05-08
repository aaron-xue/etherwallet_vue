/**
    AaronXue <xch1523480@gmail.com>
    * 
    2018.4.26
    *
    二次封装axios请求,添加loading
    通过qs.stringify()将对象 序列化成URL的形式，以&进行拼接
 */
import axios from 'axios'
import qs from 'qs'
import '../css/mystyle.css'
import etherapi from '../../src/utils/etherapi'
import crypto from 'crypto'



//开启loading
function openLoading() {
    var loading = document.createElement('div')
    loading.className = 'loading'
    document.body.appendChild(loading);
}
//关闭loading
function closeLoading() {
    document.body.querySelector('.loading').remove();
}

//创建axios实例
var instance = axios.create({
});

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    openLoading();
    //请求参数序列化
    // config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    // if (config.method === 'post') {
    //     config.data = qs.stringify(config.data)
    // }
    return config;
}, function (error) {
    // 对请求错误做些什么
    closeLoading();
    console.log(error);
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    closeLoading();
    console.log(response);
    return response;
}, function (error) {
    // 对响应错误做点什么
    closeLoading();
    console.log(error);
    return Promise.reject(error);
});

export default {
    get(url, params) {
        return instance.get(url, params)
    },

    post(method, params) {
        let param = {
            id: crypto.randomBytes(16).toString('hex'),
            jsonrpc: '2.0',
            method: method,
            params: params
        }
        return instance.post(etherapi.Endpoints, param)
    },
    postMany(posts) {
        let param = posts.map(item => {
            return {
                id: crypto.randomBytes(16).toString('hex'),
                jsonrpc: '2.0',
                method: item.method,
                params: item.params
            }
        })
        return instance.post(etherapi.Endpoints, param)
    }
}
