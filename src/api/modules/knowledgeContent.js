import request from '../request'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'
import isInteger from 'lodash/isInteger'

// 获取知识内容列表
export function list (params) {
  return request({
    url: requestUrl('/knowledge/content/list'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}

// 获取公共知识内容列表
export function common (params) {
  return request({
    url: requestUrl('/knowledge/content/common'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 获取知识内容信息
export function info (id) {
  return request({
    url: requestUrl('/knowledge/content/info' + (isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: requestParam({}, 'get')
  })
}

// 添加知识内容
export function add (params) {
  return request({
    url: requestUrl('/knowledge/content/save'),
    method: 'post',
    data: requestParam(params)
  })
}

// 修改知识内容
export function update (params) {
  return request({
    url: requestUrl('/knowledge/content/update'),
    method: 'post',
    data: requestParam(params)
  })
}

// 删除知识内容
export function del (params) {
  return request({
    url: requestUrl('/knowledge/content/delete'),
    method: 'post',
    data: requestParam(params, 'post', false)
  })
}

// 审核知识内容
export function review (id) {
  return request({
    url: requestUrl('/knowledge/content/review' + (isInteger(id) ? `/${id}` : '')),
    method: 'post',
    params: requestParam({}, 'post')
  })
}
