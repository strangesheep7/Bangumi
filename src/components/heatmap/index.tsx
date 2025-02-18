/*
 * 事件热力区域可视化
 *
 * @Author: czy0729
 * @Date: 2020-12-14 10:25:24
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-09-01 09:09:18
 */
import React from 'react'
import { View } from 'react-native'
import { observer } from 'mobx-react'
import { systemStore } from '@stores'
import { formatNumber, toFixed } from '@utils'
import heatmapData from '@assets/json/heatmap/index.json'
import heatmapEventData from '@assets/json/heatmap/event.json'
import { EventKeys } from '@constants/events'
import { EventType } from '@types'
import { Text } from '../text'
import { Control } from './control'
import { PageText } from './page-text'
import { memoStyles } from './styles'

type Props = {
  [key: string]: string | number | boolean
} & {
  id?: EventKeys
  right?: number
  bottom?: number
  transparent?: boolean
  data?: EventType
  mini?: boolean
}

const totalWithoutView = (heatmapData?.total || 0) - heatmapData['其他.查看']

const Heatmap = observer(
  ({
    right = 1,
    bottom = 1,
    transparent,
    id = '',
    screen,
    mini,

    // @todo data里面通常都是title, to, alias, 后来避免rerender每次生成新Object, 把这些key都拆开单独传
    data = {},
    title,
    to,
    alias,
    from,
    type
  }: Props) => {
    const { enabled, grid, text, sum, mini: devEventMini } = systemStore.devEvent
    if (!enabled || (!grid && !text && !sum && !devEventMini)) return null

    const styles = memoStyles()
    const isPage = !id.includes('.') // 是否页面
    const page = id.split('.')[0] // 页面名称

    // 额外参数
    const _data = {
      title,
      to,
      alias,
      from,
      type,
      ...data
    }
    const key = Object.keys(_data)[0] || ''
    const value = _data[key]

    // 计算
    const count = key
      ? heatmapEventData[`${id}.${key}`]?.[value] || 0
      : heatmapData[id] || 0 // 事件数量
    const total =
      (isPage ? totalWithoutView : heatmapData[page]) -
      (heatmapData[`${page}.查看`] || 0) // 事件百分比需要排除[页面.查看]
    const percentStyle = Math.min(count / (heatmapData[page] || 1), 0.56) // 红色背景透明度百分比
    let percent: any = (count / (total || 1)) * 100
    percent = percent < 1 ? toFixed(percent, 1) : parseInt(String(percent)) // 百分比
    const percentTo = !!key && parseInt(String((count / (heatmapData[id] || 1)) * 100)) // 跳转事件百分比

    // 样式
    const backgroundColor = `rgba(232, 8, 13, ${percentStyle})`
    const borderColor = `rgba(232, 8, 13, ${Math.min(percentStyle + 0.24, 1)})`
    const gridStyle = [
      styles.block,
      {
        borderColor
      }
    ]
    const textStyle = [
      styles.text,
      {
        right,
        bottom
      },
      key === 'to' && styles.textTo,
      key === 'from' && styles.textFrom
    ]

    if (devEventMini || mini) {
      return (
        <View style={gridStyle} pointerEvents='none'>
          <View style={textStyle}>
            <Text style={styles.textMini} type='__plain__' size={8} bold align='right'>
              {formatNumber(count, 0)}
            </Text>
          </View>
        </View>
      )
    }

    const eventName = isPage
      ? `${id}(日)`
      : id.includes('跳转.')
      ? key
      : id.split('.')[1]
    const eventDetail = value ? `.${_data.alias || value}` : ''
    const eventCount = formatNumber(count / 30, count >= 30 || count === 0 ? 0 : 1)
    const eventAppPercent = count !== 0 ? ` / ${percent}%` : ''
    const eventPagePercent =
      percentTo && percentTo !== percent ? ` (${percentTo}%)` : ''
    return (
      <>
        {!!grid && !isPage && !transparent && (
          <View
            style={[
              gridStyle,
              {
                backgroundColor
              }
            ]}
            pointerEvents='none'
          />
        )}
        {!!text && (
          <View style={isPage ? styles.page : styles.position} pointerEvents='none'>
            <View style={textStyle}>
              <Text type='__plain__' size={10} bold align='right'>
                {eventName}
                {eventDetail}
              </Text>
              <Text type='__plain__' size={9} bold align='right'>
                {sum
                  ? formatNumber(count, 0)
                  : `${eventCount}${eventAppPercent}${eventPagePercent}`}
              </Text>
              {isPage && <PageText page={page} screen={screen} />}
            </View>
          </View>
        )}
      </>
    )
  }
)

// @ts-ignore
Heatmap.Control = Control

export { Heatmap }
