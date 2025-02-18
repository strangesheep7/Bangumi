/*
 * @Author: czy0729
 * @Date: 2022-03-23 13:44:14
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-08-19 07:29:44
 */
import React from 'react'
import { View } from 'react-native'
import { Flex, Text, Input } from '@components'
import { IconTouchable } from '@_'
import { _ } from '@stores'
import { obc } from '@utils/decorators'
import { Ctx } from '../types'
import { memoStyles } from './styles'

const Form = (
  { style = undefined, name = '', url = '', isBase = false },
  { $ }: Ctx
) => {
  const styles = memoStyles()
  const { edit } = $.state
  return (
    <Flex style={[styles.form, style]} align='end'>
      <Flex.Item>
        <Text size={13} bold>
          名字
          {isBase && (
            <Text type='sub' size={10} lineHeight={13} bold>
              {' '}
              示例不允许修改
            </Text>
          )}
        </Text>
        <Input
          style={[styles.input, _.mt.sm]}
          defaultValue={String(name)}
          placeholder='菜单显示名称，唯一'
          onChangeText={isBase ? undefined : text => $.onChangeText('name', text)}
        />
        <Text style={_.mt.md} size={13} bold>
          网址
          {isBase && (
            <Text type='sub' size={10} lineHeight={13} bold>
              {' '}
              默认项不允许修改
            </Text>
          )}
        </Text>
        <Text style={_.mt.sm} type='sub' size={10} lineHeight={13} bold>
          支持参数：
          <Text type='warning' size={10} lineHeight={13} bold>
            [CN]
          </Text>{' '}
          会被替换成条目中文名，
          <Text type='warning' size={10} lineHeight={13} bold>
            [JP]
          </Text>{' '}
          日文名，
          <Text type='warning' size={10} lineHeight={13} bold>
            [CN_S2T]
          </Text>{' '}
          中文繁体名，
          <Text type='warning' size={10} lineHeight={13} bold>
            [TIME]
          </Text>{' '}
          时间戳，
          <Text type='warning' size={10} lineHeight={13} bold>
            [ID]
          </Text>{' '}
          bgm条目id
        </Text>
        <Input
          style={_.mt.sm}
          defaultValue={String(url)}
          multiline
          numberOfLines={4}
          textAlignVertical='top'
          placeholder='https://'
          onChangeText={isBase ? undefined : text => $.onChangeText('url', text)}
        />
        <Text style={_.mt.md} size={13} bold>
          排序
        </Text>
        <Input
          style={[styles.input, _.mt.sm]}
          value={String(edit.item.sort)}
          placeholder='数字，越大越前，选填'
          keyboardType='number-pad'
          onChangeText={text => $.onChangeText('sort', text)}
        />
      </Flex.Item>
      <IconTouchable
        style={_.ml.md}
        name='md-check'
        size={22}
        color={_.colorDesc}
        onPress={$.submitEdit}
      />
      <View style={styles.close}>
        <IconTouchable
          name='md-close'
          size={22}
          color={_.colorDesc}
          onPress={$.closeEdit}
        />
      </View>
    </Flex>
  )
}

export default obc(Form)
