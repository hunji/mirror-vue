import request from '../request'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'
import isInteger from 'lodash/isInteger'

// 获取知识类型列表
export function list (params) {
  return request({
    url: requestUrl('/knowledge/type/list'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}

// 获取知识类型信息
export function info (id) {
  return request({
    url: requestUrl('/knowledge/type/info' + (isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: requestParam({}, 'get')
  })
}

// 添加知识类型
export function add (params) {
  return request({
    url: requestUrl('/knowledge/type/save'),
    method: 'post',
    data: requestParam(params)
  })
}

// 修改知识类型
export function update (params) {
  return request({
    url: requestUrl('/knowledge/type/update'),
    method: 'post',
    data: requestParam(params)
  })
}

// 删除知识类型
export function del (params) {
  return request({
    url: requestUrl('/knowledge/type/delete'),
    method: 'post',
    data: requestParam(params, 'post', false)
  })
}

// 获取全部类型
export function allInfo () {
  return request({
    url: requestUrl('/knowledge/type/allInfo'),
    method: 'get',
    params: requestParam({}, 'get')
  })
}
