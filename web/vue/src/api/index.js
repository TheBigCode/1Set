import ajax from './ajax'

// 1. 基础路径
const BASE_URL = '/api'
// const BASE_URL = 'http://mjlib.cn'

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
export const getSearchGoods = () => ajax(BASE_URL + '/category/index')

// 2.6 请求短信验证码
export const getPhoneCode = (phone) => ajax(BASE_URL + '/user/send_code', { phone }, 'POST')

// 2.7 手机验证码登录
export const phoneCodeLogin = (phone, code) => ajax(BASE_URL + '/user/login_code', { phone, code }, 'POST')

// 2.8 用户名和密码登录
export const pwdLogin = (name, pwd, captcha, randstr) => ajax(BASE_URL + '/user/login_pwd', { name, pwd, captcha, randstr }, 'POST')

// 2.9 获取登录的用户信息
export const getUserInfo = () => ajax(BASE_URL + '/user/user_info')

// 2.8 用户名和密码注册
export const pwdRegister = (name, pwd, captcha, randstr) => ajax(BASE_URL + '/user/register', { name, pwd, captcha, randstr }, 'POST')

// 2.9 退出登录
export const logout = () => ajax(BASE_URL + '/user/logout')

// 2.7 手机验证码注册
export const phoneCodeRegister = (phone, code) => ajax(BASE_URL + '/user/register_phone', { phone, code }, 'POST')

// 修改昵称
export const changeNikename = (nike) => ajax(BASE_URL + '/user/change_nike', { nike }, 'POST')

// 修改头像
export const changeAvatar = (avatar) => ajax(BASE_URL + '/user/change_avatar', { avatar }, 'POST')

// 绑定手机
export const bindPhone = (phone, code) => ajax(BASE_URL + '/user/bind_phone', { phone, code }, 'POST')

// 重置密码
export const changePassword = (phone, code, password) => ajax(BASE_URL + '/user/change_password', { phone, code, password }, 'POST')

// 获取wxToken
export const wxToken = (code) => ajax(BASE_URL + '/wx/getToken', { code })

// 微信登陆
export const wxLogin = (access_token, refresh_token, openid) => ajax(BASE_URL + '/user/login_wx', { access_token, refresh_token, openid }, 'POST')