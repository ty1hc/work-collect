import request from 'axios';

export const baseURL = 'http://127.0.0.1:9999';

export const getBaseData = (params) => { // 获取本底数据接口
    return request({
        baseURL: baseURL,
        url: '/yidian/OriginData/list',
        method: 'post',
        withCredentials: false,
        params: params,
    });
}
export const getBaseDataMap = (params) => { // 获取本底数据定位
    return request({
        baseURL: baseURL,
        url: '/yidian/OriginData/geoInfoAllC',
        method: 'get',
        withCredentials: false,
        params: params,
    });
}
