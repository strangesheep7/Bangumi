/*
 * @Author: czy0729
 * @Date: 2020-01-09 16:41:59
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-03-16 05:41:12
 */
import React from 'react'
import { Flex } from '@components'
import { _ } from '@stores'
import { obc } from '@utils/decorators'
import MenuItem from './menu-item'

function Menus({ navigation }) {
  const styles = memoStyles()
  return (
    <Flex style={styles.section} wrap='wrap'>
      <MenuItem
        style={styles.bid}
        navigation={navigation}
        title='买入推荐'
        pathname='TinygrailAdvanceAsk'
        icon='md-add-circle-outline'
      />
      <MenuItem
        style={styles.ask}
        navigation={navigation}
        title='卖出推荐'
        pathname='TinygrailAdvanceBid'
        icon='md-remove-circle-outline'
      />
      <MenuItem
        navigation={navigation}
        title='拍卖推荐'
        pathname='TinygrailAdvanceAuction'
        icon='md-gavel'
      />
      <MenuItem
        navigation={navigation}
        title='拍卖推荐 B'
        pathname='TinygrailAdvanceAuction2'
        icon='md-gavel'
      />
      {/* <MenuItem
        navigation={navigation}
        title='献祭推荐'
        pathname='TinygrailAdvanceSacrifice'
        icon='md-workspaces-outline'
      /> */}
      <MenuItem
        navigation={navigation}
        title='低价股'
        pathname='TinygrailAdvanceState'
        icon='md-attach-money'
      />
      <MenuItem
        navigation={navigation}
        title='资金分析'
        pathname='TinygrailTree'
        icon='md-insert-chart-outlined'
      />
    </Flex>
  )
}

export default obc(Menus)

const memoStyles = _.memoStyles(() => ({
  section: {
    marginLeft: _.wind
  },
  bid: {
    backgroundColor: _.colorDepthBid
  },
  ask: {
    backgroundColor: _.colorDepthAsk
  }
}))
