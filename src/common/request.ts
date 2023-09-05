import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios'

type IRequestPostParams = Record<string, any>

class Request {
  private instance: AxiosInstance | undefined
  config: CreateAxiosDefaults | undefined
  constructor(defaultConfig?: CreateAxiosDefaults) {
    this.config = defaultConfig
    this.init()
  }

  init(defaultConfig) {
    if (defaultConfig) {
      this.config = defaultConfig
    }

    // 创建请求实例
    this.instance = axios.create({
      baseURL: '/api',
      // 指定请求超时的毫秒数
      timeout: 25000,
      // 表示跨域请求时是否需要使用凭证
      withCredentials: false,
      ...this.config
    }) as AxiosInstance

    // 前置拦截器（发起请求之前的拦截）
    this.instance.interceptors.request.use(
      (config) => {
        /**
         * 在这里一般会携带前台的参数发送给后台，比如下面这段代码：
         * const token = getToken()
         * if (token) {
         *  config.headers.token = token
         * }
         */
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // 后置拦截器（获取到响应时的拦截）
    this.instance.interceptors.response.use(
      (response): Promise<any> => {
        /**
         * 根据你的项目实际情况来对 response 和 error 做处理
         * 这里对 response 和 error 不做任何处理，直接返回
         */
        return response
      },
      (error) => {
        const { response } = error
        if (response && response.data) {
          return Promise.reject(error)
        }
        const { message } = error
        console.error(message)
        switch (error.response.status) {
          case 302:
            message = '接口重定向了！'
            break
          case 400:
            message = '参数不正确！'
            break
          case 401:
            message = '您未登录，或者登录已经超时，请先登录！'
            break
          case 403:
            message = '您没有权限操作！'
            break
          case 404:
            message = `请求地址出错: ${error.response?.config?.url}`
            break
          case 408:
            message = '请求超时！'
            break
          case 409:
            message = '系统已存在相同数据！'
            break
          case 500:
            message = '服务器内部错误！'
            break
          case 501:
            message = '服务未实现！'
            break
          case 502:
            message = '网关错误！'
            break
          case 503:
            message = '服务不可用！'
            break
          case 504:
            message = '服务暂时无法访问，请稍后再试！'
            break
          case 505:
            message = 'HTTP 版本不受支持！'
            break
          default:
            message = '异常问题，请联系管理员！'
            break
        }
        return Promise.reject(message)
      }
    )
  }

  public async send({ url, method, ...rest }) {
    const res = await this.instance[method](url, ...rest)

    return res
  }
  /**
   * @param {string} url
   * @param {object} data
   * @param {object} params
   */
  public async post(url: string, params?: IRequestPostParams, ...rest): Promise<any> {
    const res = await this.instance?.post(url, params || null, { ...rest })

    return res
  }

  // async get(url: string, params?: IRequestPostParams): Promise<any> {
  //   const urlParams = new URLSearchParams(params);
  //   const apiUrl = `${url}?${urlParams.toString()}`;
  //   const res = await this.instance?.get(apiUrl);

  //   return res;
  // }

  /**
   * @param {string} url
   * @param {object} params
   */
  public get(url, params = {}) {
    return instance({
      method: 'get',
      url,
      params
    })
  }

  /**
   * @param {string} url
   * @param {object} data
   * @param {object} params
   */
  public put(url, data = {}, params = {}) {
    return instance({
      method: 'put',
      url,
      params,
      data
    })
  }

  /**
   * @param {string} url
   * @param {object} params
   */
  public delete(url, params = {}) {
    return instance({
      method: 'delete',
      url,
      params
    })
  }
}

export default Request
