/*
 * @Author: czy0729
 * @Date: 2021-01-21 15:34:49
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-07-11 17:44:00
 */
import React from 'react'
import { View } from 'react-native'
import { Touchable, Heatmap } from '@components'
import { _ } from '@stores'
import { obc } from '@utils/decorators'
import { MODEL_SUBJECT_TYPE } from '@constants/model'
import CountBook from './count-book'
import CountVideo from './count-video'

function Count({ subjectId, subject, epStatus, isFirst }, { $ }) {
  const label = MODEL_SUBJECT_TYPE.getTitle(subject.type)
  if (label === '游戏') return null

  if (label === '书籍') {
    return (
      <View style={styles.count}>
        <CountBook subjectId={subjectId} isFirst={isFirst} />
      </View>
    )
  }

  return (
    <Touchable style={styles.count} onPress={() => $.itemToggleExpand(subjectId)}>
      <CountVideo epStatus={epStatus} subjectId={subjectId} subject={subject} />
      {isFirst && <Heatmap right={44} bottom={5} id='首页.展开或收起条目' />}
    </Touchable>
  )
}

export default obc(Count)

const styles = _.create({
  count: {
    minHeight: 24,
    paddingHorizontal: _.sm,
    marginHorizontal: -_.sm,
    borderRadius: _.radiusSm,
    overflow: 'hidden'
  }
})
