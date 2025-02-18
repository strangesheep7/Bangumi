/*
 * @Author: czy0729
 * @Date: 2021-01-21 15:22:21
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-07-14 18:16:06
 */
import React from 'react'
import { Flex, Text } from '@components'
import { IconExpand } from '@_'
import { _ } from '@stores'
import { obc } from '@utils/decorators'
import { Ctx } from '../../types'
import { Props } from './types'

function Count({ subjectId, subject, epStatus }: Props, { $ }: Ctx) {
  const { expand } = $.$Item(subjectId)
  return (
    <Flex style={styles.count}>
      <Text type='primary' size={20}>
        {$.countFixed(subjectId, epStatus)}
        <Text type='sub' lineHeight={20}>
          {' '}
          / {subject.eps || subject.eps_count || '?'}
        </Text>
      </Text>
      <IconExpand style={styles.icon} expand={expand} />
    </Flex>
  )
}

export default obc(Count)

const styles = _.create({
  count: {
    marginTop: -2
  },
  icon: {
    marginTop: 5
  }
})
