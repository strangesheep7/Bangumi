/*
 * @Author: czy0729
 * @Date: 2021-01-21 14:56:00
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-07-11 17:45:07
 */
import React from 'react'
import { Flex, Heatmap, Iconfont, Touchable } from '@components'
import { _ } from '@stores'
import { obc } from '@utils/decorators'

function BtnFavor({ subjectId, subject, isFirst }, { $ }) {
  return (
    <Touchable
      style={styles.touch}
      onPress={() =>
        $.showManageModal(subjectId, {
          title: subject.name_cn || subject.name,
          desc: subject.name
        })
      }
    >
      <Flex style={styles.btn} justify='center'>
        <Iconfont name='md-star-outline' size={19.5} />
      </Flex>
      {isFirst && <Heatmap id='首页.显示收藏管理' />}
    </Touchable>
  )
}

export default obc(BtnFavor)

const styles = _.create({
  touch: {
    marginRight: _.device(2, 4),
    borderRadius: 20,
    overflow: 'hidden'
  },
  btn: {
    width: 34,
    height: 34
  }
})
