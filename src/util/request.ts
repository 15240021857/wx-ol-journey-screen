import axios from 'axios'

const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },
  timeout: 50000
})

request.interceptors.request.use(
  config => {
    // const token = localStorage.getItem('token')
    console.log('VITE_WEATHER_KEY', import.meta.env.VITE_WEATHER_KEY)
    console.log('url', config.url)
    if (config.url?.startsWith('/v7')) {
      const weather_token = import.meta.env.VITE_WEATHER_KEY
      config.headers['X-QW-Api-Key'] = weather_token
    }
    // if (token) {
    //   config.headers['Authorization'] = 'Bearer' + token
    // }
    return config
  },
  error => {
    console.log('请求发送失败', error)
    return Promise.reject(error)
  }
)
const responseWhiteUrlList = ['/airquality/v1/current', '/weatheralert/v1/current']
request.interceptors.response.use(
  response => {
    const res = response.data
    console.log('response===========', response)
    const isWhiteUrl = responseWhiteUrlList.some(item => response.config?.url?.startsWith(item))
    if (isWhiteUrl) {
      // 兼容不同接口的响应格式
      return res
    }
    if (res.code === 200 || res.code === '200') {
      console.log('响应成功', res)
      if (res.code === 401 || res.code === '401') {
        localStorage.removeItem('token')
        return Promise.reject(res)
      }
      return res
    } else {
      return Promise.reject(res)
    }
  },
  error => {
    console.log('响应失败', error)
    const status = error.response?.status
    switch (status) {
      case 400:
      case '400':
        console.log('请求参数错误', error.response?.data)
        break
      case 401:
      case '401':
        console.log('未登录或登录过期', error.response?.data)
        localStorage.removeItem('token')
        break
      case 403:
      case '403':
        console.log('没有权限访问', error.response?.data)
        break
      case 404:
      case '404':
        console.log('请求资源不存在', error.response?.data)
        break
      case 500:
      case '500':
        console.log('服务器内部错误', error.response?.data)
        break
      default:
        console.log('未知错误或网络错误', error.response?.data)
        break
    }

    return Promise.reject(error)
  }
)
export default request
