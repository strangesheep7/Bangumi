/*
 * 超展开
 * @Author: czy0729
 * @Date: 2019-04-26 13:45:38
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-09-29 16:59:56
 */
import { observable, computed } from 'mobx'
import { getTimestamp, HTMLTrim } from '@utils'
import { fetchHTML, xhr, xhrCustom } from '@utils/fetch'
import { put, read } from '@utils/db'
import { getUserStoreAsync } from '@utils/async'
import store from '@utils/store'
import {
  CDN_RAKUEN,
  CDN_RAKUEN_USER_TOPICS,
  HOST,
  HTML_ACTION_BLOG_REPLY,
  HTML_ACTION_RAKUEN_REPLY,
  HTML_BLOG,
  HTML_BOARD,
  HTML_GROUP,
  HTML_GROUP_INFO,
  HTML_GROUP_MINE,
  HTML_NOTIFY,
  HTML_RAKUEN_HOT,
  HTML_REVIEWS,
  HTML_TOPIC,
  LIMIT_LIST,
  LIST_EMPTY
} from '@constants'
import {
  CoverGroup,
  Id,
  RakuenScope,
  RakuenScrollDirection,
  RakuenType,
  RakuenTypeGroup,
  RakuenTypeMono,
  StoreConstructor,
  SubjectId,
  TopicId,
  UserId
} from '@types'
import {
  DEFAULT_SCOPE,
  DEFAULT_TYPE,
  INIT_GROUP_INFO,
  INIT_GROUP_ITEM,
  INIT_NOTIFY,
  INIT_READED_ITEM,
  INIT_SETTING,
  INIT_TOPIC,
  NAMESPACE
} from './init'
import {
  analysisGroup,
  cheerioBlog,
  cheerioBoard,
  cheerioGroupInfo,
  cheerioHot,
  cheerioMine,
  cheerioNotify,
  cheerioReviews,
  cheerioTopic,
  fetchRakuen
} from './common'
import {
  Board,
  Comments,
  Group,
  GroupInfo,
  Mine,
  Notify,
  Rakuen,
  Readed,
  Reviews,
  Topic,
  UserTopicsFormCDN
} from './types'
import { RakuenReplyType } from '@constants/html/types'

const state = {
  /** 超展开列表 */
  rakuen: {
    0: LIST_EMPTY
  },

  /** 帖子历史查看信息 */
  readed: {
    0: INIT_READED_ITEM
  },

  /** 帖子内容 */
  topic: {
    0: INIT_TOPIC
  },

  /** 帖子回复 */
  comments: {
    0: LIST_EMPTY
  },

  /** 帖子内容CDN自维护数据 (用于帖子首次渲染加速) */
  topicFormCDN: {
    0: INIT_TOPIC
  },

  /** 云端帖子内容 */
  cloudTopic: {
    0: INIT_TOPIC
  },

  /** 电波提醒 */
  notify: INIT_NOTIFY,

  /** 超展开设置 */
  setting: INIT_SETTING,

  /** 是否本地收藏 */
  favor: {
    0: false
  },

  /** 小组帖子列表 */
  group: {
    0: INIT_GROUP_ITEM
  },

  /** 小组信息 */
  groupInfo: {
    0: INIT_GROUP_INFO
  },

  /** 小组缩略图缓存 */
  groupThumb: {
    0: ''
  },

  /** 我的小组 */
  mine: LIST_EMPTY,

  /** 日志内容 */
  blog: {
    0: INIT_TOPIC
  },

  /** 日志回复 */
  blogComments: {
    0: LIST_EMPTY
  },

  /** 用户历史超展开帖子 (CDN) */
  userTopicsFormCDN: {
    0: LIST_EMPTY
  },

  /** 条目帖子列表 */
  board: {
    0: LIST_EMPTY
  },

  /** 条目讨论版 */
  reviews: {
    0: LIST_EMPTY
  },

  /** 超展开热门 */
  hot: LIST_EMPTY
}

class RakuenStore extends store implements StoreConstructor<typeof state> {
  state = observable(state)

  // -------------------- get --------------------
  /** 超展开列表 */
  rakuen(
    scope = DEFAULT_SCOPE,
    type: RakuenType | RakuenTypeMono | RakuenTypeGroup = DEFAULT_TYPE
  ) {
    return computed<Rakuen>(() => {
      const key = `${scope}|${type}`
      return this.state.rakuen[key] || LIST_EMPTY
    }).get()
  }

  /** 帖子历史查看信息 */
  readed(topicId: TopicId) {
    return computed<Readed>(() => {
      return this.state.readed[topicId] || INIT_READED_ITEM
    }).get()
  }

  /** 帖子内容 */
  topic(topicId: TopicId) {
    return computed<Topic>(() => {
      return this.state.topic[topicId] || INIT_TOPIC
    }).get()
  }

  /** 帖子回复 */
  comments(topicId: TopicId) {
    return computed<Comments>(() => {
      return this.state.comments[topicId] || LIST_EMPTY
    }).get()
  }

  /** 帖子内容CDN自维护数据 (用于帖子首次渲染加速) */
  topicFormCDN(topicId: string | number) {
    return computed<Topic>(() => {
      return this.state.topicFormCDN[topicId] || INIT_TOPIC
    }).get()
  }

  /** 云端帖子内容 */
  cloudTopic(topicId: TopicId) {
    return computed<Topic>(() => {
      return this.state.cloudTopic[topicId] || INIT_TOPIC
    }).get()
  }

  /** 电波提醒 */
  @computed get notify(): Notify {
    return this.state.notify
  }

  /** 超展开设置 */
  @computed get setting() {
    return this.state.setting
  }

  /** 是否本地收藏 */
  favor(topicId: TopicId) {
    return computed<boolean>(() => {
      return this.state.favor[topicId] || false
    }).get()
  }

  /** 小组帖子列表 */
  group(groupId: Id, page: number = 1) {
    return computed<Group>(() => {
      const key = `${groupId}|${page}`
      return this.state.group[key] || INIT_GROUP_ITEM
    }).get()
  }

  /** 小组信息 */
  groupInfo(groupId: Id) {
    return computed<GroupInfo>(() => {
      return this.state.groupInfo[groupId] || INIT_GROUP_INFO
    }).get()
  }

  /** 小组缩略图缓存 */
  groupThumb(name: string) {
    return computed<CoverGroup<'l'>>(() => {
      return this.state.groupThumb[name] || ''
    }).get()
  }

  /** 我的小组 */
  @computed get mine(): Mine {
    return this.state.mine || LIST_EMPTY
  }

  /** 日志内容 */
  blog(blogId: Id) {
    return computed<Topic>(() => {
      return this.state.blog[blogId] || INIT_TOPIC
    }).get()
  }

  /** 日志回复 */
  blogComments(blogId: Id) {
    return computed<Comments>(() => {
      return this.state.blogComments[blogId] || LIST_EMPTY
    }).get()
  }

  /** 用户历史超展开帖子 (CDN) */
  userTopicsFormCDN(userId: UserId) {
    return computed<UserTopicsFormCDN>(() => {
      return this.state.userTopicsFormCDN[userId] || LIST_EMPTY
    }).get()
  }

  /** 条目帖子列表 */
  board(subjectId: SubjectId) {
    return computed<Board>(() => {
      return this.state.board[subjectId] || LIST_EMPTY
    }).get()
  }

  /** 条目讨论版 */
  reviews(subjectId: SubjectId) {
    return computed<Reviews>(() => {
      return this.state.reviews[subjectId] || LIST_EMPTY
    }).get()
  }

  /** 超展开热门 */
  @computed get hot(): Rakuen {
    return this.state.hot || LIST_EMPTY
  }

  /** @deprecated 日志内容 (CDN) */
  blogFormCDN() {
    return INIT_TOPIC
  }

  // -------------------- computed --------------------
  /** 收藏的帖子 */
  @computed get favorTopic() {
    const { favor, topic, cloudTopic } = this.state
    const data = {
      ...cloudTopic,
      _favor: favor
    }

    Object.keys(topic)
      .filter((topicId: TopicId) => {
        // 不知道哪里有问题, 有时会出现undefined的key值, 过滤掉
        if (!topicId.includes('group/') || topicId.includes('undefined')) return false
        return this.favor(topicId)
      })
      .sort((a, b) => b.localeCompare(a))
      .forEach(topicId => {
        const target = topic[topicId] || cloudTopic[topicId]
        if (target) {
          data[topicId] = {
            topicId,
            avatar: target.avatar || '',
            userName: target.userName || '',
            title: target.title || '',
            group: target.group || '',
            time: target.time || '',
            userId: target.userId || 0
          }
        }
      })
    return data
  }

  init = () => {
    return this.readStorage(
      [
        'blog',
        'cloudTopic',
        'comments',
        'favor',
        'groupInfo',
        'groupThumb',
        'hot',
        'mine',
        'notify',
        'rakuen',
        'readed',
        'setting',
        'topic'
      ],
      NAMESPACE
    )
  }

  // -------------------- fetch --------------------
  /**
   * 获取超展开聚合列表 (高流量, 20k左右1次)
   * @issue 官网没有分页, 这接口居然一次返回250项
   * 为了提高体验, 做模拟分页加载效果
   */
  fetchRakuen = async (
    args: {
      scope?: RakuenScope
      type?: RakuenType | RakuenTypeMono | RakuenTypeGroup
    },
    refresh?: boolean
  ) => {
    const { scope = DEFAULT_SCOPE, type = DEFAULT_TYPE } = args || {}

    const key = 'rakuen'
    const stateKey = `${scope}|${type}`
    let res

    // 制造分页数据
    if (refresh) {
      const res = fetchRakuen({ scope, type })
      const rakuen = await res
      this.setState({
        [key]: {
          [stateKey]: {
            list: rakuen.slice(0, LIMIT_LIST),
            pagination: {
              page: 1,
              pageTotal: Math.ceil(rakuen.length / LIMIT_LIST)
            },
            _list: rakuen,
            _loaded: getTimestamp()
          }
        }
      })
    } else {
      // 加载下一页
      const rakuen = this.rakuen(scope, type)
      const page = rakuen.pagination.page + 1
      this.setState({
        [key]: {
          [stateKey]: {
            ...rakuen,
            list: rakuen._list.slice(0, LIMIT_LIST * page),
            pagination: {
              ...rakuen.pagination,
              page
            }
          }
        }
      })
    }
    this.setStorage(key, undefined, NAMESPACE)

    return res
  }

  /** 获取帖子内容和留言 */
  fetchTopic = async (args: { topicId: TopicId }) => {
    const { topicId } = args || {}
    const HTML = await fetchHTML({
      url: HTML_TOPIC(topicId)
    })
    const { topic, comments } = cheerioTopic(HTML)
    const _loaded = getTimestamp()

    // 缓存帖子内容
    const stateKey = topicId
    const topicKey = 'topic'
    this.setState({
      [topicKey]: {
        [stateKey]: {
          ...topic,
          _loaded
        }
      }
    })
    this.setStorage(topicKey, undefined, NAMESPACE)

    // 缓存帖子回复
    const commentsKey = 'comments'
    this.setState({
      [commentsKey]: {
        [stateKey]: {
          list: comments,
          pagination: {
            page: 1,
            pageTotal: 1
          },
          _list: [],
          _loaded
        }
      }
    })
    this.setStorage(commentsKey, undefined, NAMESPACE)
    this.updateGroupThumb(topic.group, topic.groupThumb)

    return {
      topic,
      comments
    }
  }

  /** CDN 获取帖子信息 */
  fetchTopicFormCDN = async (topicId: string | number) => {
    try {
      const { _response } = await xhrCustom({
        url: CDN_RAKUEN(topicId)
      })

      const data = {
        ...INIT_TOPIC,
        ...JSON.parse(_response)
      }
      const key = 'topicFormCDN'
      this.setState({
        [key]: {
          [topicId]: data
        }
      })
      return data
    } catch (error) {
      return INIT_TOPIC
    }
  }

  /**
   * 电波提醒
   * @param {*} analysis 是否分析回复内容
   */
  fetchNotify = async (analysis: boolean = false) => {
    const res = fetchHTML({
      url: HTML_NOTIFY(),
      raw: true
    })
    const raw = await res

    let setCookie
    if (raw.headers && raw.headers.map && raw.headers.map['set-cookie']) {
      setCookie = raw.headers.map['set-cookie']
    }
    const text = await raw.text()
    const HTML = HTMLTrim(text)

    const { _loaded } = this.notify
    let { unread, clearHref, list } = this.notify

    // 清除动作
    const clearHTML = HTML.match(
      /<a id="notify_ignore_all" href="(.+?)">\[知道了\]<\/a>/
    )
    if (clearHTML) clearHref = clearHTML[1]

    // 未读数
    const countHTML = HTML.match(/<span id="notify_count">(.+?)<\/span>/)
    if (countHTML) unread = parseInt(countHTML[1])

    // 回复内容
    if (analysis) {
      const listHTML = HTML.match(
        /<div id="comment_list">(.+?)<\/div><\/div><\/div><div id="footer"/
      )
      if (listHTML) list = cheerioNotify(listHTML[1])
    }

    const key = 'notify'
    this.setState({
      [key]: {
        unread,
        clearHref,
        list,
        _loaded: analysis ? getTimestamp() : _loaded
      }
    })
    this.setStorage(key, undefined, NAMESPACE)

    return {
      setCookie,
      html: HTML
    }
  }

  /** 小组信息 */
  fetchGroupInfo = async (args: { groupId: Id }) => {
    const { groupId = 0 } = args || {}
    const html = await fetchHTML({
      url: HTML_GROUP_INFO(groupId)
    })
    const groupInfo = cheerioGroupInfo(html)

    const key = 'groupInfo'
    this.setState({
      [key]: {
        [groupId]: {
          ...groupInfo,
          _loaded: getTimestamp()
        }
      }
    })
    this.setStorage(key, undefined, NAMESPACE)

    return groupInfo
  }

  /** 小组帖子列表 */
  fetchGroup = async (args: { groupId: Id; page?: number }) => {
    const { groupId, page = 1 } = args || {}
    const html = await fetchHTML({
      url: HTML_GROUP(groupId, page)
    })

    const group = analysisGroup(html)
    this.setState({
      group: {
        [`${groupId}|${page}`]: {
          list: group || [],
          _loaded: getTimestamp()
        }
      }
    })

    return group
  }

  /** 条目帖子列表 */
  fetchBoard = async (args: { subjectId: SubjectId }) => {
    const { subjectId } = args || {}
    const key = 'board'
    const html = await fetchHTML({
      url: HTML_BOARD(subjectId)
    })

    const data = cheerioBoard(html)
    this.setState({
      [key]: {
        [subjectId]: {
          list: data || [],
          _loaded: getTimestamp()
        }
      }
    })

    return this.board(subjectId)
  }

  /** 条目影评列表 (日志) */
  fetchReviews = async (args: { subjectId: SubjectId }) => {
    const { subjectId } = args || {}
    const html = await fetchHTML({
      url: HTML_REVIEWS(subjectId)
    })

    const data = cheerioReviews(html)
    const key = 'reviews'
    this.setState({
      [key]: {
        [subjectId]: {
          list: data || [],
          _loaded: getTimestamp()
        }
      }
    })

    return this.reviews(subjectId)
  }

  /** 我的小组 */
  fetchMine = async () => {
    const html = await fetchHTML({
      url: HTML_GROUP_MINE()
    })
    const { list } = cheerioMine(html)

    const key = 'mine'
    this.setState({
      [key]: {
        list,
        pagination: {
          page: 1,
          pageTotal: 1
        },
        _loaded: getTimestamp()
      }
    })
    this.setStorage(key, undefined, NAMESPACE)

    return this[key]
  }

  /** 获取日志内容和留言 */
  fetchBlog = async (args: { blogId: Id }) => {
    const { blogId } = args || {}
    const HTML = await fetchHTML({
      url: HTML_BLOG(blogId)
    })
    const { blog, blogComments } = cheerioBlog(HTML)
    const _loaded = getTimestamp()

    // 缓存帖子内容
    const stateKey = blogId
    const blogKey = 'blog'
    this.setState({
      [blogKey]: {
        [stateKey]: {
          ...blog,
          _loaded
        }
      }
    })
    this.setStorage(blogKey, undefined, NAMESPACE)

    // 缓存帖子回复
    const commentsKey = 'blogComments'
    this.setState({
      [commentsKey]: {
        [stateKey]: {
          list: blogComments,
          pagination: {
            page: 1,
            pageTotal: 1
          },
          _list: [],
          _loaded
        }
      }
    })
    this.setStorage(commentsKey, undefined, NAMESPACE)

    return {
      blog,
      blogComments
    }
  }

  /** @deprecated 日志内容 (CDN) */
  fetchBlogFormCDN = () => {}

  /** CDN 获取用户历史超展开帖子 */
  fetchUserTopicsFormCDN = async (userId: UserId) => {
    try {
      const { _response } = await xhrCustom({
        url: CDN_RAKUEN_USER_TOPICS(userId)
      })

      const data = {
        ...LIST_EMPTY,
        list: JSON.parse(_response).map(item => ({
          topicId: `group/${item.id}`,
          title: item.t,
          group: item.g,
          date: item.ti.split(' ')[0],
          time: item.ti.split(' ')[1],
          avatar: item.av,
          userId: item.uid,
          userName: item.un
        })),
        pagination: {
          page: 1,
          pageTotal: 1
        },
        _loaded: getTimestamp()
      }

      const key = 'userTopicsFormCDN'
      this.setState({
        [key]: {
          [userId]: data
        }
      })
      return data
    } catch (error) {
      return {
        ...LIST_EMPTY,
        _loaded: getTimestamp()
      }
    }
  }

  /** 超展开热门数据 */
  fetchRakuenHot = async () => {
    const html = await fetchHTML({
      url: HTML_RAKUEN_HOT()
    })
    const list = cheerioHot(html)

    const key = 'hot'
    this.setState({
      [key]: {
        list,
        pagination: {
          page: 1,
          pageTotal: 1
        },
        _loaded: getTimestamp()
      }
    })
    this.setStorage(key, undefined, NAMESPACE)

    return this[key]
  }

  // -------------------- action --------------------
  /** 清除电波提醒未读 */
  doClearNotify = async () => {
    const { clearHref } = this.notify
    if (clearHref) {
      await fetchHTML({
        url: `${HOST}${clearHref}`
      })

      const key = 'notify'
      this.setState({
        [key]: {
          ...this.notify,
          unread: 0,
          clearHTML: ''
        }
      })
      this.setStorage(key, undefined, NAMESPACE)
    }
  }

  /** 回复帖子 | 回复帖子子回复 */
  doReply = async (
    args: {
      topicId: string | number
      type?: RakuenReplyType
      content?: string
      formhash?: string
      related?: any
      sub_reply_uid?: any
      post_uid?: any
    },
    success?: (arg?: any) => any
  ) => {
    const { topicId, type = 'group/topic', ...other } = args || {}
    xhr(
      {
        url: HTML_ACTION_RAKUEN_REPLY(topicId, type),
        data: {
          ...other,
          related_photo: 0,
          lastview: getTimestamp(),
          submit: 'submit'
        }
      },
      success
    )
  }

  /** 删除回复 */
  doDeleteReply = async (args: { url: string }, success?: () => any) => {
    const { url } = args || {}
    xhr(
      {
        url
      },
      success
    )
  }

  /** 回复日志 */
  doReplyBlog = async (
    args: {
      blogId: TopicId
      content?: string
      formhash?: string
      related?: any
      sub_reply_uid?: any
      post_uid?: any
    },
    success?: (responseText?: string, request?: any) => any
  ) => {
    const { blogId, ...other } = args || {}
    xhr(
      {
        url: HTML_ACTION_BLOG_REPLY(blogId),
        data: {
          ...other,
          related_photo: 0,
          lastview: getTimestamp(),
          submit: 'submit'
        }
      },
      success
    )
  }

  /** 删除日志回复 */
  doDeleteReplyBlog = async (args: { url: string }, success?: () => any) => {
    const { url } = args || {}
    xhr(
      {
        url
      },
      success
    )
  }

  // -------------------- page --------------------
  /**
   * 更新帖子历史查看信息
   * @param {*} topicId 帖子Id
   * @param {Int} replies 回复数
   */
  updateTopicReaded = (topicId: TopicId, replies: number = 0) => {
    const readed = this.readed(topicId)
    const key = 'readed'
    const time = getTimestamp()
    this.setState({
      [key]: {
        [topicId]: {
          replies,
          time,
          _time: readed.time === 0 ? time : readed.time
        }
      }
    })
    this.setStorage(key, undefined, NAMESPACE)
  }

  /** 设置`楼层导航条方向` */
  setScrollDirection = (scrollDirection: RakuenScrollDirection) => {
    const key = 'setting'
    this.setState({
      [key]: {
        ...this.setting,
        scrollDirection
      }
    })
    this.setStorage(key, undefined, NAMESPACE)
  }

  /** 切换 */
  switchSetting = (switchKey: keyof typeof INIT_SETTING) => {
    const key = 'setting'
    this.setState({
      [key]: {
        ...this.setting,
        [switchKey]: !this.setting[switchKey]
      }
    })
    this.setStorage(key, undefined, NAMESPACE)
  }

  /** 添加屏蔽关键字 */
  addBlockKeyword = (keyword: string) => {
    const { blockKeywords } = this.setting
    if (blockKeywords.includes(keyword)) return

    const key = 'setting'
    this.setState({
      [key]: {
        ...this.setting,
        blockKeywords: [...blockKeywords, keyword]
      }
    })
    this.setStorage(key, undefined, NAMESPACE)
  }

  /** 删除屏蔽关键字 */
  deleteBlockKeyword = (keyword: string) => {
    const { blockKeywords } = this.setting
    const key = 'setting'
    this.setState({
      [key]: {
        ...this.setting,
        blockKeywords: blockKeywords.filter(item => item !== keyword)
      }
    })
    this.setStorage(key, undefined, NAMESPACE)
  }

  /**
   * 添加屏蔽小组
   * @param {string} group 小组名字
   */
  addBlockGroup = (group: string) => {
    const { blockGroups } = this.setting
    if (blockGroups.includes(group)) return

    const key = 'setting'
    this.setState({
      [key]: {
        ...this.setting,
        blockGroups: [...blockGroups, group]
      }
    })
    this.setStorage(key, undefined, NAMESPACE)
  }

  /**
   * 删除屏蔽小组
   * @param {string} group 小组名字
   */
  deleteBlockGroup = (group: string) => {
    const { blockGroups } = this.setting
    const key = 'setting'
    this.setState({
      [key]: {
        ...this.setting,
        blockGroups: blockGroups.filter(item => item !== group)
      }
    })
    this.setStorage(key, undefined, NAMESPACE)
  }

  /**
   * 添加屏蔽用户
   * @param {string} userNameSpace `${userName}@${userId}`
   */
  addBlockUser = (userNameSpace: string) => {
    const { blockUserIds } = this.setting
    if (blockUserIds.includes(userNameSpace)) return

    const key = 'setting'
    this.setState({
      [key]: {
        ...this.setting,
        blockUserIds: [...blockUserIds, userNameSpace]
      }
    })
    this.setStorage(key, undefined, NAMESPACE)
  }

  /**
   * 删除屏蔽用户
   * @param {string} userNameSpace `${userName}@${userId}`
   */
  deleteBlockUser = (userNameSpace: string) => {
    const { blockUserIds } = this.setting
    const key = 'setting'
    this.setState({
      [key]: {
        ...this.setting,
        blockUserIds: blockUserIds.filter(item => item !== userNameSpace)
      }
    })
    this.setStorage(key, undefined, NAMESPACE)
  }

  /** 设置是否收藏*/
  setFavor = (topicId: TopicId, isFover: boolean) => {
    const key = 'favor'
    this.setState({
      [key]: {
        [topicId]: isFover
      }
    })
    this.setStorage(key, undefined, NAMESPACE)
  }

  /** 更新小组缩略图 */
  updateGroupThumb = (name: string, thumb: string) => {
    const key = 'groupThumb'
    this.setState({
      [key]: {
        [name]: thumb
      }
    })
    this.setStorage(key, undefined, NAMESPACE)
  }

  /** 上传收藏帖子到云端 */
  uploadFavorTopic = () => {
    const { id } = getUserStoreAsync().userInfo
    return put({
      path: `topic/${id}.json`,
      content: escape(JSON.stringify(this.favorTopic))
    })
  }

  /** 同步云端收藏帖子 */
  downloadFavorTopic = async () => {
    const { id } = getUserStoreAsync().userInfo
    const { content } = await read({
      path: `topic/${id}.json`
    })
    if (!content) return false

    try {
      const { favor } = this.state
      const { _favor, ...cloudTopic } = JSON.parse(unescape(content))
      this.setState({
        favor: {
          ..._favor,
          ...favor
        },
        cloudTopic
      })

      this.setStorage('favor', undefined, NAMESPACE)
      this.setStorage('cloudTopic', undefined, NAMESPACE)
      return true
    } catch (error) {
      return false
    }
  }

  /** 上传当前设置到云端 */
  uploadSetting = () => {
    const { id } = getUserStoreAsync().userInfo
    return put({
      path: `rakuen-setting/${id}.json`,
      content: JSON.stringify({
        ...this.setting,
        blockKeywords: escape(JSON.stringify(this.setting.blockKeywords)),
        blockGroups: escape(JSON.stringify(this.setting.blockGroups)),
        blockUserIds: escape(JSON.stringify(this.setting.blockUserIds))
      })
    })
  }

  /** 恢复到云端的设置 */
  downloadSetting = async () => {
    const { id } = getUserStoreAsync().userInfo
    const { content } = await read({
      path: `rakuen-setting/${id}.json`
    })

    if (!content) return false

    try {
      const setting = JSON.parse(content)
      const key = 'setting'

      // 屏蔽的数据还需要跟现在的合并
      let { blockKeywords, blockGroups, blockUserIds } = setting
      blockKeywords = JSON.parse(unescape(blockKeywords))
      blockGroups = JSON.parse(unescape(blockGroups))
      blockUserIds = JSON.parse(unescape(blockUserIds))
      this.setting.blockKeywords.forEach(item => {
        if (!blockKeywords.includes(item)) blockKeywords.push(item)
      })
      this.setting.blockGroups.forEach(item => {
        if (!blockGroups.includes(item)) blockGroups.push(item)
      })
      this.setting.blockUserIds.forEach(item => {
        if (!blockUserIds.includes(item)) blockUserIds.push(item)
      })

      this.setState({
        [key]: {
          ...this.setting,
          ...setting,
          blockKeywords,
          blockGroups,
          blockUserIds
        }
      })
      this.setStorage(key, undefined, NAMESPACE)
      return true
    } catch (error) {
      console.info('rakuenStore downloadSetting', error)
      return false
    }
  }
}

export default new RakuenStore()
