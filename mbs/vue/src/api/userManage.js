import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/userManage/list',
    method: 'get',
    params: query
  })
}

export function update(data) {
  return request({
    url: '/userManage/update',
    method: 'post',
    data
  })
}

