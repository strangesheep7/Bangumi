/*
 * @Author: czy0729
 * @Date: 2019-11-28 17:18:49
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-09-29 17:33:54
 */
import { observable, computed } from 'mobx'
import { rakuenStore, userStore } from '@stores'
import store from '@utils/store'
import { t } from '@utils/fetch'
import { info } from '@utils/ui'
import i18n from '@constants/i18n'
import { TopicId } from '@types'

const NAMESPACE = 'ScreenRakuenHistory'

export default class ScreenRakuenHistory extends store {
  state = observable({
    favor: false,
    _loaded: false
  })

  init = async () => {
    const state = await this.getStorage(NAMESPACE)
    this.setState({
      ...state,
      _loaded: true
    })

    await rakuenStore.downloadFavorTopic()
    this.sync()

    return state
  }

  // -------------------- get --------------------
  @computed get isLogin() {
    return userStore.isLogin
  }

  /** 需要把 rakuenStore.state.topic 和 rakuenStore.state.cloudTopic key 值合并计算 */
  @computed get keys() {
    const { favor } = this.state
    const { topic, cloudTopic } = rakuenStore.state
    return Array.from(new Set([...Object.keys(topic), ...Object.keys(cloudTopic)]))
      .filter((topicId: TopicId) => {
        // 不知道哪里有问题, 有时会出现undefined的key值, 过滤掉
        if (!topicId.includes('group/') || topicId.includes('undefined')) return false
        if (favor) return this.isFavor(topicId)
        return true
      })
      .sort((a, b) => b.localeCompare(a))
  }

  @computed get sections() {
    const sections = []
    const map = {}
    this.keys.forEach(item => {
      const target = rakuenStore.state.topic[item] || rakuenStore.state.cloudTopic[item]
      const title = (target.time || '').split(' ')[0]
      if (!(title in map)) {
        map[title] = sections.length
        sections.push({
          title,
          data: []
        })
      }
      sections[map[title]].data.push({
        topicId: item,
        ...target
      })
    })
    return sections
  }

  /** 是否收藏 */
  isFavor(topicId: TopicId) {
    return computed(() => rakuenStore.favor(topicId)).get()
  }

  // -------------------- page --------------------
  /** 切换收藏 */
  toggleFavor = (label: string) => {
    const { favor } = this.state
    if (label) {
      if (label === '收藏' && favor) return
      if (label === '缓存' && !favor) return
    }

    const nextFavor = !favor
    t('本地帖子.切换收藏', {
      favor: nextFavor
    })

    this.setState({
      favor: nextFavor
    })
    this.setStorage(NAMESPACE)
  }

  /** 同步到云 */
  sync = async () => {
    if (!this.isLogin || !userStore.userInfo.id) {
      info(`云同步需先${i18n.login()}`)
      return
    }

    const result = await rakuenStore.uploadFavorTopic()
    if (result) {
      // info('已同步到云')
    }
  }
}
