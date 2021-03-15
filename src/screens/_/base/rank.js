/*
 * @Author: czy0729
 * @Date: 2021-03-06 04:57:31
 * @Last Modified by: czy0729
 * @Last Modified time: 2021-03-14 21:37:46
 */
import React from 'react'
import { Text } from '@components'
import { _ } from '@stores'
import { ob } from '@utils/decorators'

export const Rank = ob(({ style, size = 10, value }) => {
  if (!value) {
    return null
  }

  const styles = memoStyles()
  return (
    <Text style={[styles.rank, style]} size={size} bold align='center'>
      {value}
    </Text>
  )
})

const memoStyles = _.memoStyles(_ => ({
  rank: {
    minWidth: 20,
    paddingHorizontal: _.xs,
    marginRight: 6,
    color: _.__colorPlain__,
    textShadowOffset: {
      width: 1,
      hegith: 1
    },
    textShadowRadius: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.48)',
    backgroundColor: _.select('#ffc107', '#f2b600'),
    borderRadius: _.radiusXs,
    overflow: 'hidden'
  }
}))
