/*
 * @Author: czy0729
 * @Date: 2022-07-11 16:50:05
 * @Last Modified by:   czy0729
 * @Last Modified time: 2022-07-11 16:50:05
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
