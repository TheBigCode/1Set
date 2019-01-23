// 1. 引入对应模块
import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from './../pages/Home/Home'
import Recommend from './../pages/Recommend/Recommend'
import Search from './../pages/Search/Search'
import Chat from './../pages/Chat/Chat'
import Me from './../pages/Me/Me'
import Login from './../pages/Login/Login'

// 2. 声明使用
Vue.use(VueRouter)

// 3. 输出路由对象
export default new VueRouter({
  // 3.1 配置一级路由
  routes: [
    {
      path: '/home',
      component: Home,
      meta: {showBottomTabBar: true}
    },
    {
      path: '/recommend',
      component: Recommend,
      meta: {showBottomTabBar: true}
    },
    {
      path: '/search',
      component: Search,
      meta: {showBottomTabBar: true}
    },
    {
      path: '/chat',
      component: Chat,
      meta: {showBottomTabBar: true}
    },
    {
      path: '/me',
      component: Me,
      meta: {showBottomTabBar: true}
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/',
      redirect: '/home'
    }
  ]
})
