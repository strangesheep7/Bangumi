/*
 * @Author: czy0729
 * @Date: 2019-05-24 01:34:26
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-08-16 03:56:30
 */
import React, { useState } from 'react'
import { Header, Page, ScrollView, Flex, Input, Text } from '@components'
import { IconTouchable, NavigationBarEvents } from '@_'
import { _, systemStore, userStore } from '@stores'
import { date } from '@utils'
import { useRunAfter, useObserver } from '@utils/hooks'
import i18n from '@constants/i18n'
import { NavigationProps } from '@types'
import Block from './block'
import Tip from './tip'
import Version from './version'
import Zhinan from './zhinan'
import User from './user'
import UserSetting from './user-setting'
import Rakuen from './rakuen'
import Subject from './subject'
import Timeline from './timeline'
import Theme from './theme'
import Custom from './custom'
import UI from './ui'
import CDN from './cdn'
import Tinygrail from './tinygrail'
import Katakana from './katakana'
import Origin from './origin'
import Route from './route'
import Home from './home'
import Contact from './contact'
import Storage from './storage'
import System from './system'
import DangerZone from './danger-zone'
import { styles } from './styles'

const Setting = ({ navigation }: NavigationProps) => {
  const [filter, setFilter] = useState('')
  useRunAfter(() => {
    systemStore.fetchAdvance()
  })

  return useObserver(() => {
    const ts = String(userStore.userCookie.userAgent).match(/(\d{10})/g)
    return (
      <>
        <Header title={i18n.setting()} alias='设置' hm={['settings', 'Setting']} />
        <Page style={_.select(_.container.bg, _.container.plain)}>
          <NavigationBarEvents />
          <ScrollView contentContainerStyle={styles.container}>
            <Block>
              <Input
                style={styles.input}
                placeholder='搜索'
                defaultValue={filter}
                onChangeText={setFilter}
              />
            </Block>
            <Block>
              <Version filter={filter} />
            </Block>
            <Block>
              <Tip>基本</Tip>
              <Theme navigation={navigation} filter={filter} />
              <UI filter={filter} />
              <Custom filter={filter} />
              <CDN filter={filter} />
              <Route filter={filter} />
              <Katakana filter={filter} />
              <Origin navigation={navigation} filter={filter} />
            </Block>
            <Block>
              <Tip>模块</Tip>
              <Home filter={filter} />
              <Timeline filter={filter} />
              <Rakuen navigation={navigation} filter={filter} />
              <User filter={filter} />
              <UserSetting navigation={navigation} filter={filter} />
              <Subject filter={filter} />
              <Tinygrail filter={filter} />
            </Block>
            <Block>
              <Tip>{i18n.contact()}</Tip>
              <Contact navigation={navigation} filter={filter} />
              <Zhinan navigation={navigation} filter={filter} />
            </Block>
            <Block>
              <Tip>系统</Tip>
              <Storage filter={filter} />
              <System navigation={navigation} filter={filter} />
              <DangerZone navigation={navigation} filter={filter} />
            </Block>
            {!!ts?.[0] && (
              <Text style={_.mt.xs} size={10} type='icon' bold align='center'>
                last logged on: {date('y-m-d H:i', ts[0])}
              </Text>
            )}
            <Flex style={_.mt.lg} justify='center'>
              <IconTouchable
                style={styles.transparent}
                name='md-more-horiz'
                onPress={() => navigation.push('DEV')}
              />
            </Flex>
          </ScrollView>
        </Page>
      </>
    )
  })
}

export default Setting
