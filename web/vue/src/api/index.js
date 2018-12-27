import ajax from './ajax'

// 1. 基础路径
const BASE_URL = '/api'
// const BASE_URL = 'http://118.24.240.127'

// 2. 请求方法

// 2.1 请求首页的轮播图
export const getHomeCasual = () => ajax(BASE_URL + '/api/homecasual')

// 2.2 请求首页的导航
export const getHomeNav = () => ajax(BASE_URL + '/api/homenav')

// 2.3 请求首页的商品数据
export const getHomeShopList = () => ajax(BASE_URL + '/api/homeshoplist')

// 2.4 请求推荐的商品数据
export const getRecommendShopList = (params) => ajax(BASE_URL + '/api/recommendshoplist', params)

// 2.5 请求搜索的列表数据
export const getSearchGoods = () => ajax(BASE_URL + '/api/searchgoods')

// 2.6 请求短信验证码
export const getPhoneCode = (phone) => ajax(BASE_URL + '/api/send_code', {phone})

// 2.7 手机验证码登录
export const phoneCodeLogin = (phone, code) => ajax(BASE_URL + '/api/login_code', {phone, code}, 'POST')

// 2.8 用户名和密码登录
export const pwdLogin = (name, pwd, captcha) => ajax(BASE_URL + '/api/login_pwd', {name, pwd, captcha}, 'POST')

// 2.9 获取登录的用户信息
export const getUserInfo = () => ajax(BASE_URL + '/api/user_info')
