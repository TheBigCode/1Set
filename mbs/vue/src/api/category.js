import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/categoryManage/list',
    method: 'get',
    params: query
  })
}

export function fetchIndex(query) {
  return request({
    url: '/categoryManage/index',
    method: 'get',
    params: query
  })
}

export function updateIndex(query) {
  return request({
    url: '/categoryManage/updateIndex',
    method: 'get',
    params: query
  })
}

export function createCategory(data) {
  return request({
    url: '/categoryManage/create',
    method: 'post',
    data
  })
}

export function updateCategory(data) {
  return request({
    url: '/categoryManage/update',
    method: 'post',
    data
  })
}

export function deleteCategory(data) {
  return request({
    url: '/categoryManage/delete',
    method: 'post',
    data
  })
}

export function modifyStatus(data) {
  return request({
    url: '/categoryManage/modify_status',
    method: 'post',
    data
  })
}

