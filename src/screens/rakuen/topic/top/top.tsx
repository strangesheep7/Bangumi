/*
 * @Author: czy0729
 * @Date: 2019-05-01 20:14:08
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-09-08 18:32:43
 */
import React, { useState, useCallback } from 'react'
import { View } from 'react-native'
import {
  HeaderPlaceholder,
  Touchable,
  Flex,
  Text,
  Divider,
  Loading,
  Heatmap,
  UserStatus
} from '@components'
import { Avatar } from '@_'
import { _ } from '@stores'
import { simpleTime, findSubjectCn, appNavigate, HTMLDecode } from '@utils'
import { memo } from '@utils/decorators'
import { HOST } from '@constants'
import Content from '../content'
import Ep from '../ep'
import SectionTitle from '../section-title'
import Milestone from '../milestone'
import { DEFAULT_PROPS } from './ds'

export default memo(
  ({
    navigation,
    styles,
    topicId,
    title,
    time,
    replies,
    group,
    groupHref,
    groupThumb,
    avatar,
    userId,
    userName,
    userSign,
    html,
    commentsLoaded,
    monoId,
    isMono,
    delete: topicDelete
  }) => {
    global.rerender('Topic.Top.Main')

    const [lines, setLines] = useState(1)
    const setLines2 = useCallback(() => setLines(2), [])

    const event = {
      id: '帖子.跳转',
      data: {
        from: '#1',
        topicId
      }
    } as const

    // 人物这里不显示详情, 所以要把小组的相关信息替换成人物信息, 跳转到人物页面查看
    const groupPress = isMono
      ? () => appNavigate(`${HOST}/${monoId}`, navigation, {}, event)
      : () =>
          appNavigate(
            groupHref,
            navigation,
            {
              _jp: group
            },
            event
          )
    const isGroup = topicId.includes('group/')
    const isEp = topicId.includes('ep/')
    return (
      <>
        <HeaderPlaceholder />
        <View style={styles.container}>
          <Milestone />
          <Text type='title' size={20} bold>
            {title}
            {!!replies && (
              <Text type='main' size={12} lineHeight={26} bold>
                {'  '}
                {replies}
              </Text>
            )}
          </Text>
          <Flex style={styles.groupWrap}>
            {!!group && (
              <Touchable onPress={groupPress}>
                <Flex style={styles.groupLabel}>
                  {!!groupThumb && (
                    <Avatar
                      style={isEp ? _.mr.sm : _.mr.xs}
                      size={isEp ? 40 : 20}
                      src={groupThumb}
                    />
                  )}
                  <Text size={13} numberOfLines={1}>
                    {HTMLDecode(findSubjectCn(group))}
                  </Text>
                </Flex>
              </Touchable>
            )}
            {!!time && (
              <Text type='sub' size={13}>
                {simpleTime(time)}
              </Text>
            )}
            <Heatmap right={74} id='帖子.跳转' to='Group' alias='小组' />
            <Heatmap id='帖子.跳转' to='Subject' alias='条目' transparent />
          </Flex>
          {isGroup && (
            <Flex style={styles.userWrap}>
              {!!avatar && (
                <UserStatus userId={userId}>
                  <Avatar
                    navigation={navigation}
                    event={event}
                    size={40}
                    src={avatar}
                    userId={userId}
                    name={userName}
                  />
                </UserStatus>
              )}
              {!!userId && (
                <Flex.Item style={_.ml.sm}>
                  <Text numberOfLines={1} bold>
                    {userName}
                  </Text>
                  <Text
                    style={_.mt.xs}
                    type='sub'
                    size={12}
                    numberOfLines={lines}
                    onPress={setLines2}
                  >
                    @{userId}
                    {!!userSign && ` (${userSign.slice(1, userSign.length - 1)})`}
                  </Text>
                </Flex.Item>
              )}
              <Heatmap id='帖子.跳转' to='Zone' alias='空间' />
            </Flex>
          )}
          <Content />
          {topicDelete && (
            <Text style={_.mb.md} size={15} lineHeight={18} bold align='center'>
              数据库中没有查询到指定话题{'\n'}话题可能正在审核或已被删除
            </Text>
          )}
        </View>
        <Divider />
        <Ep />
        <SectionTitle />
        {!!html && !commentsLoaded && <Loading style={styles.loading} />}
      </>
    )
  },
  DEFAULT_PROPS
)
