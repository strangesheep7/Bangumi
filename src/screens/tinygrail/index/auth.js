/*
 * @Author: czy0729
 * @Date: 2019-09-04 21:58:42
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-09-01 00:22:57
 */
import React from 'react'
import { Flex, Text, Touchable } from '@components'
import { IconBack, IconTouchable, Avatar } from '@_'
import { _ } from '@stores'
import { tinygrailOSS } from '@utils/app'
import { obc } from '@utils/decorators'
import Btns from './btns'

function Auth(props, { $, navigation }) {
  const styles = memoStyles()
  const { _loaded } = $.state
  const { nickname, avatar = {} } = $.userInfo
  return (
    <Flex>
      <IconBack
        style={styles.back}
        navigation={navigation}
        color={_.colorTinygrailPlain}
      />
      <Avatar
        key={tinygrailOSS(avatar && avatar.large)}
        style={styles.avatar}
        src={tinygrailOSS(avatar && avatar.large)}
        size={36}
        name={nickname}
        borderColor='transparent'
      />
      <Flex.Item>
        <Flex>
          <Touchable style={styles.touch} onPress={() => navigation.push('Qiafan')}>
            <Text type='tinygrailPlain' size={13} bold>
              {nickname}
            </Text>
            {$.advance ? (
              <Text size={11} lineHeight={12} type='warning'>
                高级会员
              </Text>
            ) : (
              !!_loaded && (
                <Text type='tinygrailText' size={11} lineHeight={12}>
                  普通会员
                </Text>
              )
            )}
          </Touchable>
          <IconTouchable
            style={_.ml._xs}
            name={_.tSelect('md-brightness-2', 'md-brightness-5')}
            color={_.colorTinygrailPlain}
            size={18}
            onPress={_.toggleTinygrailThemeMode}
          />
        </Flex>
      </Flex.Item>
      <Btns />
    </Flex>
  )
}

export default obc(Auth)

const memoStyles = _.memoStyles(() => ({
  back: {
    marginLeft: -8
  },
  avatar: {
    marginLeft: _.xs,
    backgroundColor: _.tSelect(_._colorDarkModeLevel2, _.colorTinygrailBg)
  },
  touch: {
    paddingVertical: _.xs,
    paddingHorizontal: _.sm,
    borderRadius: _.radiusSm,
    overflow: 'hidden'
  }
}))
