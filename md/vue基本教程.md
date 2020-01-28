## 环境搭建

### 安装node（node.js v8以上版本）

### 安装vue

`npm install vue`

### 安装vue-cli

vue-cli是官方的脚手架工具，可以快速搭建项目。

`npm install -g @vue/cli`

### 创建一个项目

`vue create demo`

命令行创建，选择插件（建议取消eslint）

`vue ui` 

可视化界面创建项目，选择插件

### 运行项目

`npm run serve`

不一定是serve，我们采用cli3版本，默认serve，cli2默认dev，可自己配置。

访问localhost:8080。

### 项目打包

`npm run build`

在默认配置下会在根目录生成一个dist文件夹，里面包含了static文件夹和index.html文件。

## vue开发

### 文件目录结构

### webpack配置

在根目录下新建vue.config.js。
```
const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    lintOnSave: true,
    chainWebpack: (config) => {    //配置路径别名
        config.resolve.alias
            .set('@', resolve('src'))
    },
    pages: {
        index: {
            entry: 'src/main.js',
            template: 'index.html',
        }
    },
    devServer: {                 //设置代理
        proxy: {
            '/api/': {
                target: 'http://localhost:8098',    //后台服务IP地址
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/'                    //url填入 /api + 后台提供接口
                }
            }
        },
    },
}
```
由于是2个服务，所以需要解决跨域问题

安装axios

`npm install axios --save-dev`

在src/main.js添加
```
import axios from "axios";

Vue.prototype.$http = axios;
```
### 添加路由拦截和导航守卫

路由拦截：拦截401和403错误，并跳入登录页。

在main.js里添加
```
axios.interceptors.response.use(
	response => {
		return response;
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
		return Promise.reject(error.response.data)
	});
```
导航守卫：未登录拦截首页加载

在main.vue里添加
```
beforeRouteEnter(to, from, next) {
    axios.get('/api/security/current') //一般为获取用户信息接口
        .then((response) => {
            if (response.status === 200) {
                next(true);
            } else {
                next(false)
            };
        }, (error) => {
            next(false);
        })
    },
```
### vue文件结构
```
<template>
    <div>
        {{url | capitalize}}
        这里写html代码，但是最外层只能有一个div。

    </div>
</template>
<script>
    export default {
        name: "demo", //只有作为组件选项时起作用
        computed: mapState([]),//计算属性
        data() { //定义变量
            return {
                url: "api/demo",
                dataList: []
            }
        },
        filters: {
            capitalize: function (value) {
            }
        }
        watch: {
            // 如果 `url` 发生改变，这个函数就会运行
            url: function (new, old) {
                this.loadData();
            }
        },
        created() { //在页面dom结构创建之前执行
            this.loadData();
        },
        mounted() { //在页面dom结构创建完毕之后执行
            this.dataChange();
        },
        methods: { //定义方法
            loadData() {
                this.$http.get(this.url).then(res => { //这里一定要用箭头函数，不让this的指向会有问题
                    this.dataList = res.data; //在页面F12调试中，this是无效的，但页面可以正常运行，如需要调试可以在前面定义 let that = this来调试
                    this.dataList.forEach(element => {
                        element.url = this.url;
                    });
                }).catch(err => {
                    console.log(err.data);
                })
            },
            dataChange() {

            }
        }
    }
</script>
<style>
</style>
```
## vue语法

### v-bind

双大括号赋值不能用于设置标签属性

绑定变量
```
<span v-bind:title="message"></span>
```
可简写成
```
<span :title="message"></span>
```
在一些插件中，有时候为了方便直接赋值，则除了字符串，布尔值和数字都要加上:

### v-on

绑定函数
```
<button v-on:click="reverseMessage"></button>
```
可简写成
```
<button @click="reverseMessage"></button>
```
不再像ng一样有众多的指令，只有一个v-on去绑定各个事件，click，input，change等等。

input框有2个事件，input和change，input在输入时触发，change在失焦的时候触发

事件修饰符
```
<!-- 阻止单击事件继续传播 -->
<a v-on:click.stop="doThis"></a>

<!-- 提交事件不再重载页面 -->
<form v-on:submit.prevent="onSubmit"></form>

<!-- 修饰符可以串联 -->
<a v-on:click.stop.prevent="doThat"></a>

<!-- 只有修饰符 -->
<form v-on:submit.prevent></form>

<!-- 添加事件监听器时使用事件捕获模式 -->
<!-- 即元素自身触发的事件先在此处处理，然后才交由内部元素进行处理 -->
<div v-on:click.capture="doThis">...</div>

<!-- 只当在 event.target 是当前元素自身时触发处理函数 -->
<!-- 即事件不是从内部元素触发的 -->
<div v-on:click.self="doThat">...</div>

<!-- 点击事件将只会触发一次 -->
<a v-on:click.once="doThis"></a>

<!-- 滚动事件的默认行为 (即滚动行为) 将会立即触发 -->
<!-- 而不会等待 `onScroll` 完成  -->
<!-- 这其中包含 `event.preventDefault()` 的情况 -->
<div v-on:scroll.passive="onScroll">...</div>
```
按键修饰符

在监听键盘事件时，我们经常需要检查常见的键值。Vue 允许为 v-on 在监听键盘事件时添加按键修饰符：
```
<!-- 只有在 `keyCode` 是 13 时调用 `vm.submit()` -->
<input v-on:keyup.13="submit">
```
记住所有的 keyCode 比较困难，所以 Vue 为最常用的按键提供了别名：
```
<!-- 同上 -->
<input v-on:keyup.enter="submit">

<!-- 缩写语法 -->
<input @keyup.enter="submit">
```
全部的按键别名：
```
.enter
.tab
.delete (捕获“删除”和“退格”键)
.esc
.space
.up
.down
.left
.right
```
可以通过全局 config.keyCodes 对象自定义按键修饰符别名：
```
// 可以使用 `v-on:keyup.f1`
Vue.config.keyCodes.f1 = 112
```
### v-if,v-else,v-else-if
```
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Not A/B/C
</div>
```
### v-show

用法大致一样，可参照ng-if和ng-show，但这里推荐使用v-if，因为它并没有作用域的问题，而v-show只是简单的切换dom的display属性，渲染页面会造成闪烁。

### v-for

用法和ng-repeat一致，以下给出几种其他用法

带上索引
```
<ul>
    <li v-for="(item, index) in items"></li>
</ul>
```
迭代对象
```
<ul id="v-for-object" class="demo">
    <li v-for="value in object">
        {{ value }}
    </li>
</ul>
```
或者
```
<div v-for="(value, key) in object">
    {{ key }}: {{ value }}
</div>
```
或者
```
<div v-for="(value, key, index) in object">
    {{ index }}. {{ key }}: {{ value }}
</div>
```
防止重复渲染,类似ng-repeat后面加上track by $index
```
<div v-for="item in items" :key="item.id">
    <!-- 内容 -->
</div>
```
和template，v-if一起使用
```
<ul>
    <template v-for="item in items">
        <li>{{ item.msg }}</li>
        <li class="divider" role="presentation"></li>
    </template>
</ul>
```
在这里面template是一个无意义标签，有时候可以搭配v-if渲染一些复杂的dom

### v-model

用法与ng-model基本一致

修饰符
```
<!-- 在“change”时而非“input”时更新 -->
<input v-model.lazy="msg" >
<!-- 自动将用户的输入值转为数值类型 -->
<input v-model.number="age" type="number">
<!-- 自动过滤用户输入的首尾空白字符 -->
<input v-model.trim="msg">
```

### 自定义组件

自定义组件与angular自定义指令相像
```
<custom-input
    v-bind:value="searchText"
    v-on:input="searchText = $event"
></custom-input>
Vue.component('custom-input', {
    props: ['value'],
    template: `
        <input
            v-bind:value="value"
            v-on:input="$emit('input', $event.target.value)"
        >
    `
})
```
插槽

类似ng-translate

[查看详细](https://segmentfault.com/a/1190000012996217)

### 动画
```
<div id="demo">
    <button v-on:click="show = !show">
        Toggle
    </button>
    <transition name="fade">
        <p v-if="show">hello</p>
    </transition>
</div>

.fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
    animation: bounce-in .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}
@keyframes bounce-in {
    0% {
        transform: scale(0);
    }
    50% {
        transform: scale(1.5);
    }
    100% {
        transform: scale(1);
    }
}
```
在进入/离开的过渡中，会有 6 个 class 切换。

`v-enter`：定义进入过渡的开始状态。在元素被插入之前生效，在元素被插入之后的下一帧移除。

`v-enter-active`：定义进入过渡生效时的状态。在整个进入过渡的阶段中应用，在元素被插入之前生效，在过渡/动画完成之后移除。这个类可以被用来定义进入过渡的过程时间，延迟和曲线函数。

`v-enter-to`: 2.1.8版及以上 定义进入过渡的结束状态。在元素被插入之后下一帧生效 (与此同时 v-enter 被移除)，在过渡/动画完成之后移除。

`v-leave`: 定义离开过渡的开始状态。在离开过渡被触发时立刻生效，下一帧被移除。

`v-leave-active`：定义离开过渡生效时的状态。在整个离开过渡的阶段中应用，在离开过渡被触发时立刻生效，在过渡/动画完成之后移除。这个类可以被用来定义离开过渡的过程时间，延迟和曲线函数。

`v-leave-to`: 2.1.8版及以上 定义离开过渡的结束状态。在离开过渡被触发之后下一帧生效 (与此同时 v-leave 被删除)，在过渡/动画完成之后移除。

## vuex

vuex是一个状态管理工具
```
const store = new Vuex.Store({
    state: {
        count: 0
    },
    mutations: {
        increment (state) {
            state.count++
        }
    }
})
```
### state

全局变量对象

调用变量
```
const Counter = {
    template: `<div>{{ count }}</div>`,
    computed: {
        count () {
            return this.$store.state.count
        }
    }
}
```
或者使用辅助函数mapState
```
import { mapState } from 'vuex'

export default {
    // ...
    computed: mapState({
    // 箭头函数可使代码更简练
        count: state => state.count,
        
        // 传字符串参数 'count' 等同于 `state => state.count`
        countAlias: 'count',
        
        // 为了能够使用 `this` 获取局部状态，必须使用常规函数
        countPlusLocalState (state) {
            return state.count + this.localCount
        }
    })
}
//简单点就是
computed: mapState([
    // 映射 this.count 为 store.state.count
    'count'
])
```
### getter

vuex的计算属性
```
const store = new Vuex.Store({
    state: {
        todos: [
            { id: 1, text: '...', done: true },
            { id: 2, text: '...', done: false }
        ]
    },
    getters: {
        doneTodos: state => {
            return state.todos.filter(todo => todo.done)
        }
    }
})
```
调用同state一样或者使用辅助函数mapGetters

### Mutation

更改state中的值
```
const store = new Vuex.Store({
    state: {
        count: 1
    },
    mutations: {
        increment (state,{}) {
      // 变更状态
            state.count++
        }
    }
})
```
调用

`store.commit('increment', {})`

在页面组件中

`this.$store.commit('GET_ROUTE_NAME', '');`

或者使用mapMutations辅助函数(...对象展开运算符)

```
import { mapMutations } from 'vuex'

export default {
// ...
    methods: {
        ...mapMutations([
            'increment', // 将 `this.increment()` 映射为 `this.$store.commit('increment')`
            
            // `mapMutations` 也支持载荷：
            'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
        ]),
        ...mapMutations({
            add: 'increment' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
        })
    }
}
```
### action

Action 类似于 mutation，不同在于：

Action 提交的是 mutation，而不是直接变更状态。

Action 可以包含任意异步操作。

调用
```
this.$store.dispatch('xxx')
```
或者同上使用mapActions辅助函数

通常可以用来获取全局的信息，比如获取当前登录用户。
```
export default {

	async getUserInfo({
		commit,
		state
	}) {
		let res = (await axios.get('/api/security/current')).data;
		commit(GET_USERINFO, res)
	},
}
```
async/await,promise等，可以自行了解。在某些逻辑中很好用。

### module

可以使用多个store
```
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```
## Vue Router

页面视图

`<router-view></router-view>`

等价于`ui-view`

跳转
```
<router-link to="/foo">Go to Foo</router-link>
```
或者
```
this.$router.push({
	path: '/home/purchasePlan/planJournal',
	query: {
		id: item.id
	}
});
```
或者`router.replace`顾名思义替换，在history中不会有记录

或者`router.go(n)`向前或向后几步

在跳转中，如果路由设置了name，也可以用name替代path

定义路由
```
import Vue from 'vue'
import Router from 'vue-router'
import login from './views/login.vue'

Vue.use(Router)

export default new Router({
	routes: [{
			path: '',
			redirect: '/main',
		},
		{
			path: '/login',
			component: login,
		},
		{ //懒加载
			path: '/main',
			meta: {
				title: 'demo'
			},
			component: () =>
				import ('./views/main/main.vue'),
			children: [{
					path: '',
					redirect: 'user',
				},
				{
					path: 'user',
					component: () =>
						import ('./views/user.vue')
				}, {
					path: 'role',
					component: () =>
						import ('./views/role.vue')
				}
			]
		}
	]
})
```
我们可以在任何组件内通过`this.$router`访问路由器，也可以通过`this.$route`访问当前路由
```
export default {
    computed: {
        username () {
          // 我们很快就会看到 `params` 是什么
            return this.$route.params.username
        }
    },
    methods: {
        goBack () {
            window.history.length > 1? this.$router.go(-1):this.$router.push('/')
        }
    }
}
```
`this.$router.go(-1)`直接返回上一级路由，相当于浏览器中的后退

注意：一个是route，一个是router。

路由传参

`params`

需要在路由后面配置,例如`/:id`

调用`this.$route.params.id`

`query`

不需要路由配置，路由会显示为`?id=`

调用`this.$route.params.query`

## UI框架

[iview](https://www.iviewui.com/docs/guide/install)

[element-ui](http://element-cn.eleme.io/#/zh-CN/component/installation)

以iview为主，有些组件可以使用element，都支持按需加载，可以混着用

## vue相关链接

[官方教程](https://cn.vuejs.org/v2/guide/)

[官方API](https://cn.vuejs.org/v2/api/)