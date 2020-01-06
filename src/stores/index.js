import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const state = {
    userInfo: null
}

export  default new Vuex.Store({
    /*state在vuex中用于存储数据*/
    state: state,
    /*mutations里放的是方法，主要用于改变state里的数据*/
    mutations: {

    },
    /*异步处理*/
    actions: {}
})
