/*
 * @Author: czy0729
 * @Date: 2020-12-21 16:03:04
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-09-26 23:30:07
 */
import React from 'react'
import { View } from 'react-native'
import { Flex, Text, RenderHtml, UserStatus } from '@components'
import { _, rakuenStore } from '@stores'
import { getTimestamp, open } from '@utils'
import { memo, obc } from '@utils/decorators'
import { appNavigate } from '@utils/app'
import { HTMLDecode, removeHTMLTag } from '@utils/html'
import { matchUserIdFromAvatar } from '@utils/match'
import decoder from '@utils/thirdParty/html-entities-decoder'
import { EVENT } from '@constants'
import { Avatar, Name } from '../../base'
import UserLabel from './user-label'
import FloorText from './floor-text'
import IconExtra from './icon-extra'
import PlusOne from './plus-one'
import Mark from './mark'
import { isBlockUser } from './utils'
import { REG_MARK } from './ds'

const avatarWidth = 32
const regPlus = /\+\d/
const regBgm =
  /^<img src="\/img\/smiles\/tv\/\d+\.gif" smileid="\d+" alt="\(bgm\d+\)">$/
const defaultProps = {
  navigation: {},
  styles: {},
  authorId: '',
  avatar: '',
  blockKeywords: [],
  erase: '',
  filterDelete: true,
  floor: '',
  id: '',
  isBlockUser: false,
  matchLink: false,
  message: '',
  myFriendsMap: {},
  postId: '',
  postUsersMap: {},
  quote: true,
  quoteAvatar: true,
  wide: false,
  readedTime: 0,
  replySub: '',
  showFixedTextare: false,
  time: '',
  translate: '',
  uid: '',
  url: '',
  userId: '',
  userName: '',
  event: EVENT
}

const ItemSub = memo(
  ({
    navigation,
    styles,
    authorId,
    avatar,
    blockKeywords,
    erase,
    filterDelete,
    floor,
    id,
    isBlockUser,
    matchLink,
    message,
    myFriendsMap,
    postId,
    postUsersMap,
    quote,
    quoteAvatar,
    wide,
    readedTime,
    replySub,
    showFixedTextare,
    time,
    translate,
    uid,
    url,
    userId,
    userName,
    event
  }) => {
    global.rerender('Topic.ItemSub.Main')

    let msg = decoder(message)
    const rawMsg = removeHTMLTag(msg)
    if (filterDelete && rawMsg.includes('内容已被用户删除')) return null

    // +N的楼层, 只有表情的楼层
    if ((rawMsg.length <= 10 && regPlus.test(rawMsg)) || regBgm.test(msg.trim())) {
      return (
        <PlusOne
          id={id}
          message={message}
          userId={userId}
          userName={userName}
          avatar={avatar}
          url={url}
          event={event}
        />
      )
    }

    if (rawMsg.length <= 8 && REG_MARK.test(rawMsg)) {
      return (
        <Mark
          id={id}
          message={msg}
          userId={userId}
          userName={userName}
          avatar={avatar}
          url={url}
          event={event}
        />
      )
    }

    // 回复引用的用户是屏蔽用户也要隐藏
    const quoteUserName = rawMsg.match(/^(.+?)说:/)?.[1]
    const quoteUser = quoteUserName ? postUsersMap[quoteUserName] : ''
    if (quoteUser) {
      const quoteUserId = matchUserIdFromAvatar(quoteUser.avatar)
      if (quoteUserId && isBlockUser(quoteUserId, quoteUserName)) return null
    }

    if (blockKeywords.some(item => rawMsg.includes(item))) {
      message =
        '<span style="color:#999;font-size:12px">命中自定义关键字，已被App屏蔽</span>'
    }

    // 遗留问题, 给宣传语增加一点高度
    msg = msg.replace(
      '<span style="font-size:10px; line-height:10px;">[来自Bangumi for',
      '<span style="font-size:10px; line-height:20px;">[来自Bangumi for'
    )

    const isAuthor = authorId === userId
    const isLayer = !isAuthor && uid === userId
    const isFriend = myFriendsMap[userId]

    const isNew = !!readedTime && getTimestamp(time) > readedTime
    const isJump = !!postId && postId === id
    const showQuoteAvatar = quote && quoteAvatar && !!quoteUser
    const imagesMaxWidthSub = _.window.width - 2 * _.wind - 2 * avatarWidth - 2 * _.sm
    return (
      <Flex style={[isNew && styles.itemNew, isJump && styles.itemJump]} align='start'>
        <View style={_.mt.md}>
          <UserStatus userId={userId}>
            <Avatar
              navigation={navigation}
              userId={userId}
              name={userName}
              src={avatar}
              size={36}
              event={event}
            />
          </UserStatus>
        </View>
        <Flex.Item style={styles.subContent}>
          <Flex align='start'>
            <Flex.Item>
              <Name
                userId={userId}
                size={userName.length > 10 ? 12 : 14}
                lineHeight={14}
                bold
                right={
                  <UserLabel
                    isAuthor={isAuthor}
                    isFriend={isFriend}
                    isLayer={isLayer}
                  />
                }
              >
                {HTMLDecode(userName)}
              </Name>
            </Flex.Item>
            <IconExtra
              id={id}
              replySub={replySub}
              erase={erase}
              userId={userId}
              userName={userName}
              message={message}
              msg={msg}
              showFixedTextare={showFixedTextare}
            />
          </Flex>
          <FloorText time={time} floor={floor} />
          <View style={_.mt.xs}>
            <RenderHtml
              style={
                // eslint-disable-next-line react-native/no-inline-styles
                wide && {
                  marginTop: 4,
                  marginLeft: -(avatarWidth + styles.subContent.marginLeft + 4)
                }
              }
              baseFontStyle={_.baseFontStyle.md}
              imagesMaxWidth={imagesMaxWidthSub}
              html={msg}
              matchLink={matchLink}
              onLinkPress={href => appNavigate(href, navigation, {}, event)}
              onImageFallback={() => open(`${url}#post_${id}`)}
            />
            {!!translate && (
              <Text style={styles.translate} size={11}>
                {translate}
              </Text>
            )}
            {showQuoteAvatar && (
              <Flex
                style={[
                  styles.quoteUserRound,
                  // eslint-disable-next-line react-native/no-inline-styles
                  wide && {
                    top: 15,
                    left: 11,
                    marginLeft: -(avatarWidth + styles.subContent.marginLeft + 4)
                  }
                ]}
              >
                <Avatar
                  navigation={navigation}
                  size={13}
                  userId={quoteUser.userId}
                  name={quoteUser.userName}
                  src={quoteUser.avatar}
                  event={event}
                />
                <Text type={_.select('desc', 'sub')} size={12} bold>
                  {' '}
                  {quoteUser.userName}:
                </Text>
              </Flex>
            )}
          </View>
        </Flex.Item>
      </Flex>
    )
  },
  defaultProps
)

export default obc(
  (
    {
      authorId,
      avatar,
      erase,
      floor,
      id,
      matchLink,
      message,
      postId,
      readedTime,
      replySub,
      showFixedTextare,
      time,
      uid,
      url,
      userId,
      userName,
      event
    },
    { $, navigation }
  ) => {
    global.rerender('Topic.ItemSub')

    // 屏蔽脏数据
    if (!userId) return null

    if (isBlockUser(userId, userName, replySub)) return null

    const { translateResultFloor } = $.state
    const { blockKeywords, quote, quoteAvatar, wide } = rakuenStore.setting
    return (
      <ItemSub
        navigation={navigation}
        styles={memoStyles()}
        authorId={authorId}
        avatar={avatar}
        blockKeywords={blockKeywords}
        erase={erase}
        filterDelete={$.filterDelete}
        floor={floor}
        id={id}
        isBlockUser={$.isBlockUser}
        matchLink={matchLink}
        message={message}
        myFriendsMap={$.myFriendsMap}
        postId={postId}
        postUsersMap={$.postUsersMap}
        quote={quote}
        quoteAvatar={quoteAvatar}
        wide={wide}
        readedTime={readedTime}
        replySub={replySub}
        showFixedTextare={showFixedTextare}
        time={time}
        translate={translateResultFloor?.[id]}
        uid={uid}
        url={url}
        userId={userId}
        userName={userName}
        event={event}
      />
    )
  }
)

const memoStyles = _.memoStyles(() => ({
  itemNew: {
    paddingLeft: _.sm,
    marginLeft: -_.sm,
    backgroundColor: _.colorMainLight
  },
  itemJump: {
    borderBottomWidth: 2,
    borderColor: _.colorSuccess
  },
  border: {
    borderTopColor: _.colorBorder,
    borderTopWidth: _.hairlineWidth
  },
  subContent: {
    paddingVertical: _.md,
    marginLeft: _.sm
  },
  quoteUserRound: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 1,
    padding: 2,
    backgroundColor: _.colorBg
  },
  translate: {
    padding: _.sm,
    marginTop: _.sm,
    marginRight: _.sm,
    backgroundColor: _.select(_.colorBg, _._colorDarkModeLevel1),
    borderRadius: _.radiusXs,
    overflow: 'hidden'
  }
}))
