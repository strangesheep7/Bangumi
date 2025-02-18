/*
 * @Author: czy0729
 * @Date: 2019-11-21 23:37:31
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-03-16 06:37:00
 */
import React from 'react'
import { Flex, Text, Iconfont } from '@components'
import { Popover } from '@_'
import { _ } from '@stores'
import { toFixed } from '@utils'
import { obc } from '@utils/decorators'
import { t } from '@utils/fetch'
import { B, M } from '@constants'
import {
  MODEL_TINYGRAIL_ASSETS_TYPE,
  MODEL_TINYGRAIL_CACULATE_TYPE,
  MODEL_TINYGRAIL_CACULATE_TEMPLE_TYPE
} from '@constants/model'

const typeData = MODEL_TINYGRAIL_ASSETS_TYPE.data.map(item => item.label)
const caculateTypeData = MODEL_TINYGRAIL_CACULATE_TYPE.data.map(item => item.label)
const caculateTempleTypeData = MODEL_TINYGRAIL_CACULATE_TEMPLE_TYPE.data.map(
  item => item.label
)

function ToolBar({ style }, { $ }) {
  const styles = memoStyles()
  const { type, caculateType, total = 0, filterItems } = $.state
  const typeLabel = MODEL_TINYGRAIL_ASSETS_TYPE.getLabel(type)
  const caculateTypeLabel = MODEL_TINYGRAIL_CACULATE_TYPE.getLabel(caculateType)
  let totalText
  if (total > B) {
    totalText = `${toFixed(total / B, 1)}亿`
  } else if (total > M) {
    totalText = `${toFixed(total / M, 1)}万`
  } else {
    totalText = toFixed(parseFloat(total || 0), 1)
  }
  return (
    <Flex style={[styles.container, style]}>
      <Flex.Item flex={0.8}>
        <Popover data={typeData} onSelect={title => $.onTypeSelect(title)}>
          <Flex style={styles.item} justify='center'>
            <Text type='warning'>{typeLabel || '范围'}</Text>
            <Text style={_.ml.xs} type='warning' size={12}>
              {$.charaAssets.length}
            </Text>
          </Flex>
        </Popover>
      </Flex.Item>
      <Flex.Item>
        <Popover
          data={$.isTemple ? caculateTempleTypeData : caculateTypeData}
          onSelect={title => $.onCaculateTypeSelect(title)}
        >
          <Flex style={styles.item} justify='center'>
            <Text type='warning'>{caculateTypeLabel || '计算类型'}</Text>
            <Text style={_.ml.xs} type='warning' size={12}>
              {totalText}
            </Text>
          </Flex>
        </Popover>
      </Flex.Item>
      <Flex.Item flex={0.8}>
        <Popover
          data={[
            '重置',
            '隐藏低持仓',
            ...filterItems.map(item => `${item.name} #${item.id}`)
          ]}
          onSelect={title => {
            t('资产分析.选择筛选', {
              title
            })

            if (title === '重置') {
              $.reset()
              return
            }

            if (title === '隐藏低持仓') {
              $.onHideLow()
              return
            }

            const [name, id] = title.split(' #')
            $.onToggleItem({
              id: parseInt(id),
              name
            })
          }}
        >
          <Flex style={styles.item} justify='center'>
            <Iconfont
              style={{
                color: filterItems.length ? _.colorWarning : _.colorTinygrailText
              }}
              name='md-filter-list'
              size={16}
            />
            <Text
              style={_.ml.sm}
              type={filterItems.length ? 'warning' : 'tinygrailText'}
            >
              {filterItems.length || '-'}
            </Text>
          </Flex>
        </Popover>
      </Flex.Item>
    </Flex>
  )
}

export default obc(ToolBar)

const memoStyles = _.memoStyles(() => ({
  container: {
    height: 44 * _.ratio,
    backgroundColor: _.colorTinygrailContainer
  },
  item: {
    paddingVertical: _.md - 4,
    paddingHorizontal: _.md
  },
  touchable: {
    paddingHorizontal: _.lg
  }
}))
