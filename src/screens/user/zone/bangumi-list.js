/*
 * @Author: czy0729
 * @Date: 2019-05-06 00:28:36
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-08-14 17:43:29
 */
import React from 'react'
import {
  Loading,
  ListView,
  Flex,
  Touchable,
  Text,
  Iconfont,
  Heatmap
} from '@components'
import { SectionHeader, ItemBangumiList } from '@_'
import { _ } from '@stores'
import { cnjp } from '@utils'
import { obc } from '@utils/decorators'
import { keyExtractor } from '@utils/app'
import { t } from '@utils/fetch'
import { TABS } from './ds'

const event = {
  id: '空间.跳转'
}

class BangumiList extends React.Component {
  connectRef = ref => {
    const { $ } = this.context
    const index = TABS.findIndex(item => item.title === '番剧')
    return $.connectRef(ref, index)
  }

  renderSectionHeader = ({ section: { title, count } }) => {
    const { $ } = this.context
    const { expand } = $.state
    return (
      <Touchable style={this.styles.section} onPress={() => $.onToggleSection(title)}>
        <SectionHeader
          style={this.styles.sectionHeader}
          type='title'
          size={15}
          right={
            <Iconfont
              style={this.styles.arrow}
              name={expand[title] ? 'md-keyboard-arrow-down' : 'md-keyboard-arrow-up'}
            />
          }
        >
          {title}{' '}
          <Text type='sub' size={12} bold lineHeight={15}>
            {count}{' '}
          </Text>
        </SectionHeader>
        {title === '在看' && <Heatmap id='空间.展开分组' />}
      </Touchable>
    )
  }

  ListFooterComponent = ($, navigation) => (
    <Flex style={_.mt.lg} justify='center'>
      <Touchable
        style={this.styles.touch}
        onPress={() => {
          t('空间.跳转', {
            to: 'User'
          })

          $.navigateToUser(navigation)
        }}
      >
        <Text>查看TA的所有收藏</Text>
        <Heatmap id='空间.跳转' to='User' alias='所有收藏' />
      </Touchable>
    </Flex>
  )

  render() {
    const { $, navigation } = this.context
    if (!$.userCollections._loaded) return <Loading style={this.styles.loading} />

    const { expand } = $.state
    const sections = []
    $.userCollections.list.forEach(item => {
      sections.push({
        title: item.status,
        count: item.count,
        data: [
          {
            list: item.list
          }
        ]
      })
    })

    return (
      <ListView
        ref={this.connectRef}
        contentContainerStyle={this.styles.contentContainerStyle}
        keyExtractor={keyExtractor}
        sections={sections}
        renderSectionHeader={this.renderSectionHeader}
        renderItem={({ item, section: { title } }) => {
          if (!expand[title]) return null

          return (
            <Flex wrap='wrap' align='start'>
              {item.list
                .filter((item, index) => index < 15)
                .map(item => (
                  <ItemBangumiList
                    key={item.id}
                    navigation={navigation}
                    subjectId={item.id}
                    images={item.images}
                    name={cnjp(item.name_cn, item.name)}
                    event={event}
                  />
                ))}
              {title.includes('在看') && (
                <Heatmap id='空间.跳转' to='Subject' alias='条目' />
              )}
            </Flex>
          )
        }}
        animated
        showFooter={false}
        ListFooterComponent={() => this.ListFooterComponent($, navigation)}
        {...this.props}
      />
    )
  }

  get styles() {
    return memoStyles()
  }
}

export default obc(BangumiList)

const memoStyles = _.memoStyles(() => ({
  loading: {
    marginTop: _.window.height / 3
  },
  contentContainerStyle: {
    paddingHorizontal: _.wind - _._wind,
    paddingBottom: _.bottom,
    minHeight: _.window.height + _.parallaxImageHeight - _.tabBarHeight
  },
  sectionHeader: {
    paddingHorizontal: _._wind,
    backgroundColor: _.colorPlain
  },
  section: {
    backgroundColor: _.colorBg
  },
  touch: {
    paddingVertical: _.sm,
    paddingHorizontal: _.md,
    borderRadius: _.radiusSm,
    overflow: 'hidden'
  },
  arrow: {
    marginRight: -3
  }
}))
