/*
 * @Author: czy0729
 * @Date: 2019-04-26 13:40:51
 * @Last Modified by: czy0729
 * @Last Modified time: 2019-08-11 14:13:29
 */
import React from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import {
  StatusBarEvents,
  Popover,
  IconTabsHeader,
  IconTabBar,
  IconNotify
} from '@screens/_'
import { open } from '@utils'
import { inject, withTabsHeader } from '@utils/decorators'
import { hm } from '@utils/fetch'
import { HTML_NEW_TOPIC } from '@constants/html'
import _ from '@styles'
import Tabs from './tabs'
import List from './list'
import Store from './store'

const title = '超展开'

export default
@inject(Store)
@withTabsHeader()
@observer
class Rakuen extends React.Component {
  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <IconTabBar name='planet' color={tintColor} />
    ),
    tabBarLabel: '超展开'
  }

  static contextTypes = {
    $: PropTypes.object,
    navigation: PropTypes.object
  }

  async componentDidMount() {
    const { $, navigation } = this.context
    await $.init()

    // $不能通过contextType传递进去navigation里面, 只能通过下面的方法传递
    withTabsHeader.setTabs(navigation, <Tabs $={$} />)

    navigation.setParams({
      headerLeft: <IconNotify navigation={navigation} />,
      headerRight: (
        <Popover
          data={['设置', '新讨论']}
          onSelect={title => {
            switch (title) {
              case '设置':
                navigation.push('RakuenSetting')
                break
              case '新讨论':
                open(HTML_NEW_TOPIC())
                break
              default:
                break
            }
          }}
        >
          <IconTabsHeader
            name='more'
            position='right'
            // onPress={() => {
            //   if ($.isWebLogin) {
            //     navigation.push('WebView', {
            //       uri: HTML_NEW_TOPIC(),
            //       title: '添加新讨论'
            //     })
            //   } else {
            //     navigation.push('LoginV2')
            //   }
            // }}
          />
        </Popover>
      )
    })

    hm('rakuen', title)
  }

  render() {
    const { $ } = this.context
    const { _loaded } = $.state
    if (!_loaded) {
      return <View style={_.container.screen} />
    }

    return (
      <SafeAreaView style={_.container.screen} forceInset={{ top: 'never' }}>
        <StatusBarEvents />
        <Tabs $={$} tabBarStyle={withTabsHeader.tabBarStyle}>
          {$.tabs.map((item, index) => (
            <List key={item._title} index={index} />
          ))}
        </Tabs>
      </SafeAreaView>
    )
  }
}
