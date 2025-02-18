/*
 * @Author: czy0729
 * @Date: 2022-09-01 14:37:54
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-09-06 18:20:00
 */
import { factory } from '@utils'
import { Navigation } from '@types'
import Store from './store'

const f = factory(Store)

export type StoreType = typeof f

export type Ctx = {
  $: StoreType
  navigation?: Navigation
}

export type TypeType = '' | 'collect' | 'advance'

export type TypeLabel = '热门' | '最新' | '高级'
