import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/banner/list',
    method: 'get',
    params: query
  })
}

export function createBanner(data) {
  return request({
    url: '/banner/create',
    method: 'post',
    data
  })
}

export function updateBanner(data) {
  return request({
    url: '/banner/update',
    method: 'post',
    data
  })
}

export function deleteBanner(data) {
  return request({
    url: '/banner/delete',
    method: 'post',
    data
  })
}

export function modifyStatus(data) {
  return request({
    url: '/banner/modify_status',
    method: 'post',
    data
  })
}

