/*
 * @Author: czy0729
 * @Date: 2020-02-02 05:04:04
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-08-19 11:19:58
 */
import { observable, computed } from 'mobx'
import { userStore } from '@stores'
import { info, feedback } from '@utils'
import store from '@utils/store'
import { t } from '@utils/fetch'
import { HTML_PM_DETAIL } from '@constants'
import { Params } from './types'

export default class ScreenPM extends store {
  params: Params

  state = observable({
    title: '',
    value: '',
    _loaded: false
  })

  init = async (scrollView?: any) => {
    const { userId } = this.params
    if (userId) return this.fetchPMParams()

    const { _loaded } = this.pmDetail
    if (_loaded) this.scrollToBottom(scrollView)

    await this.fetchPMDetail()

    this.scrollToBottom(scrollView)
    return true
  }

  /** 新短信参数 */
  fetchPMParams = () => {
    const { userId } = this.params
    return userStore.fetchPMParams({
      userId
    })
  }

  /** 短信详情 */
  fetchPMDetail = () => {
    const { id } = this.params
    return userStore.fetchPMDetail({
      id
    })
  }

  // -------------------- get --------------------
  /** 短信详情 */
  @computed get pmDetail() {
    const { id } = this.params
    return userStore.pmDetail(id)
  }

  /** 新短信参数 */
  @computed get pmParams() {
    const { userId } = this.params
    return userStore.pmParams(userId)
  }

  /** 自己用户Id (改过用户名后) */
  @computed get myId() {
    return userStore.myId
  }

  /** 网址 */
  @computed get url() {
    const { id } = this.params
    return HTML_PM_DETAIL(id)
  }

  // -------------------- page --------------------
  /** 滚动到底 */
  scrollToBottom = scrollView => {
    if (scrollView && scrollView.scrollToEnd) {
      setTimeout(() => {
        scrollView.scrollToEnd({
          animated: false
        })
      }, 160)
    }
  }

  /** 收起评论框 */
  closeFixedTextarea = () => {
    t('短信.显示评论框')

    this.setState({
      placeholder: '',
      replySub: '',
      message: ''
    })
  }

  /** 标题改变 */
  onTitleChange = title => {
    return this.setState({
      title
    })
  }

  /**  内容改变 */
  onChange = value => {
    return this.setState({
      value
    })
  }

  // -------------------- action --------------------
  /** 提交 */
  doSubmit = (content, scrollView, navigation) => {
    const { userId } = this.params
    if (userId) {
      const { formhash } = this.pmParams
      if (!formhash) {
        info('获取表单授权码失败')
        return
      }

      this.doCreate(content, navigation)
      return
    }

    // @ts-ignore
    const { form = {} } = this.pmDetail
    if (!form?.formhash) {
      info('获取表单授权码失败, 需要别人回复过才能继续发送')
      return
    }

    this.doReply(content, scrollView)
  }

  /** 新短信 */
  doCreate = (content, navigation) => {
    t('短信.新短信')

    const { title } = this.state
    userStore.doPM(
      {
        msg_title: title,
        msg_body: content,
        submit: '发送',
        ...this.pmParams
      },
      async () => {
        feedback()
        this.setState({
          title: '',
          value: ''
        })

        navigation.goBack()
        navigation.push('Notify', {
          type: 'out'
        })
      }
    )
  }

  /** 回复短信 */
  doReply = (content, scrollView) => {
    t('短信.回复短信')

    // @ts-ignore
    const { form = {} } = this.pmDetail
    userStore.doPM(
      {
        msg_body: content,
        chat: 'on',
        submit: '回复',
        ...form
      },
      async () => {
        this.setState({
          value: ''
        })
        await this.fetchPMDetail()
        feedback()

        if (scrollView && scrollView.scrollToEnd) {
          setTimeout(() => {
            scrollView.scrollToEnd()
          }, 0)
        }
      }
    )
  }
}
