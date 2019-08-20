import {
  getHomeCasual,
  getHomeNav,
  getHomeShopList,
  getRecommendShopList,
  getSearchGoods,
  getUserInfo
} from '../api'

import {
  HOME_CASUAL,
  HOME_NAV,
  HOME_SHOP_LIST,
  RECOMMEND_SHOP_LIST,
  SEARCH_GOODS,
  USER_INFO
} from './mutation-types'

export default {
  // 1. 获取首页的轮播图
  async reqHomeCasual ({commit}) {
    const result = await getHomeCasual()
    commit(HOME_CASUAL, {homecasual: result.message})
  },

  // 2. 获取首页的导航
  async reqHomeNav ({commit}) {
    const result = await getHomeNav()
    commit(HOME_NAV, {homenav: result.message.data})
  },

  // 3. 获取首页的商品列表
  async reqHomeShopList ({commit}) {
    const result = await getHomeShopList()
    commit(HOME_SHOP_LIST, {homeshoplist: result.message.goods_list})
  },

  // 4. 获取推荐的商品数据
  async reqRecommendShopList ({commit}, params) {
    const result = await getRecommendShopList(params)
    commit(RECOMMEND_SHOP_LIST, {recommendshoplist: result.message})
    params.callback && params.callback()
  },

  // 5. 获取推荐的商品数据
  async reqSearchGoods ({commit}, callback) {
    const result = await getSearchGoods()
    commit(SEARCH_GOODS, {searchgoods: result.items})
    callback && callback()
  },

  // 6. 同步用户的信息
  syncUserInfo ({commit}, userInfo) {
    commit(USER_INFO, {userInfo})
  },

  // 7. 异步获取用户信息
  async getUserInfo ({commit}) {
    const result = await getUserInfo()
    console.log(result)
    if (result.success_code === 200) {
      commit(USER_INFO, {userInfo: result.message})
    }
  }
}
