/*
 * 标签
 * @Author: czy0729
 * @Date: 2019-06-08 03:25:36
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-07-30 12:06:50
 */
import { observable, computed } from 'mobx'
import { getTimestamp } from '@utils'
import store from '@utils/store'
import { fetchHTML } from '@utils/fetch'
import { LIST_EMPTY, HTML_TAG, HTML_RANK, HTML_BROSWER } from '@constants'
import {
  BrowserSort,
  RankAnimeFilter,
  RankBookFilter,
  RankGameFilter,
  RankRealFilter,
  StoreConstructor,
  SubjectType,
  TagOrder
} from '@types'
import { NAMESPACE, DEFAULT_TYPE } from './init'
import { analysisTags, analysiRank } from './common'
import { Browser, Rank, Tag } from './types'

const state = {
  /** 标签条目 */
  tag: {
    0: LIST_EMPTY
  },

  /** 排行榜 */
  rank: {
    0: LIST_EMPTY
  },

  /** 索引 */
  browser: {
    0: LIST_EMPTY
  }
}

class TagStore extends store implements StoreConstructor<typeof state> {
  state = observable(state)

  // -------------------- get --------------------
  /** 标签条目 */
  tag(text: string = '', type: SubjectType = DEFAULT_TYPE, airtime: string = '') {
    return computed<Tag>(() => {
      const key = `${text.replace(/ /g, '+')}|${type}|${airtime}`
      return this.state.tag[key] || LIST_EMPTY
    }).get()
  }

  /** 排行榜 */
  rank(
    type: SubjectType = DEFAULT_TYPE,
    page: number = 1,
    filter: RankAnimeFilter | RankBookFilter | RankGameFilter | RankRealFilter = '',
    airtime: string = ''
  ) {
    return computed<Rank>(() => {
      const key = `${type}|${page}|${filter}|${airtime}`
      return this.state.rank[key] || LIST_EMPTY
    }).get()
  }

  /** 索引 */
  browser(
    type: SubjectType = DEFAULT_TYPE,
    airtime: string = '',
    sort: BrowserSort = ''
  ) {
    return computed<Browser>(() => {
      const key = `${type}|${airtime}|${sort}`
      return this.state.browser[key] || LIST_EMPTY
    }).get()
  }

  init = () => {
    return this.readStorage(['tag', 'rank', 'browser'], NAMESPACE)
  }

  // -------------------- fetch --------------------
  /** 标签条目 */
  fetchTag = async (
    args: {
      /** 关键字 */
      text: string

      /** 类型 */
      type?: SubjectType

      /** 排序 */
      order?: TagOrder

      /** 时间 */
      airtime?: string
    },
    refresh?: boolean
  ) => {
    const { text = '', type = DEFAULT_TYPE, order, airtime = '' } = args || {}
    const _text = text.replace(/ /g, '+')
    const { list, pagination } = this.tag(_text, type, airtime)
    const page = refresh ? 1 : pagination.page + 1

    // -------------------- 请求HTML --------------------
    const raw = await fetchHTML({
      url: HTML_TAG(_text, type, order, page, airtime)
    })
    const { pageTotal, tag } = analysisTags(raw, page, pagination)

    const key = 'tag'
    const stateKey = `${_text}|${type}|${airtime}`
    const data = {
      list: refresh ? tag : [...list, ...tag],
      pagination: {
        page,
        pageTotal: parseInt(pageTotal)
      },
      _loaded: getTimestamp()
    }
    this.setState({
      [key]: {
        [stateKey]: data
      }
    })
    this.setStorage(key, undefined, NAMESPACE)

    return data
  }

  /** 排行榜 (与标签相似, 所以共用逻辑) */
  fetchRank = async (args: {
    /** 类型 */
    type?: SubjectType

    /** 筛选类型 */
    filter?: RankAnimeFilter | RankBookFilter | RankGameFilter | RankRealFilter

    /** 2024-1960 */
    airtime?: string
    page?: number
  }) => {
    const { type = DEFAULT_TYPE, filter = '', airtime = '', page = 1 } = args || {}
    const key = 'rank'
    const raw = await fetchHTML({
      url: HTML_RANK(type, 'rank', page, filter, airtime)
    })
    const list = analysiRank(raw)

    const stateKey = `${type}|${page}|${filter}|${airtime}`
    const data: Rank = {
      list,
      pagination: {
        page: 1,
        pageTotal: 1
      },
      _loaded: getTimestamp()
    }
    this.setState({
      [key]: {
        [stateKey]: data
      }
    })
    this.setStorage(key, undefined, NAMESPACE)

    return data
  }

  /**
   * 请求索引
   * @param {*} args
   * @param {*} refresh
   */
  fetchBrowser = async (
    args: {
      type?: SubjectType
      airtime?: string
      sort?: BrowserSort
    },
    refresh?: boolean
  ) => {
    const { type = DEFAULT_TYPE, airtime, sort } = args || {}
    const { list, pagination } = this.browser(type, airtime, sort)
    const page = refresh ? 1 : pagination.page + 1

    // -------------------- 请求HTML --------------------
    const raw = await fetchHTML({
      url: HTML_BROSWER(type, airtime, page, sort)
    })
    const { pageTotal, tag } = analysisTags(raw, page, pagination)

    const key = 'browser'
    const stateKey = `${type}|${airtime}|${sort}`
    const data = {
      list: refresh ? tag : [...list, ...tag],
      pagination: {
        page,
        pageTotal: parseInt(pageTotal)
      },
      _loaded: getTimestamp()
    }
    this.setState({
      [key]: {
        [stateKey]: data
      }
    })
    this.setStorage(key, undefined, NAMESPACE)

    return data
  }
}

export default new TagStore()
