/*
 * @Author: czy0729
 * @Date: 2022-06-17 00:08:21
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-06-17 00:09:25
 */
import { _ } from '@stores'
import { IMG_WIDTH } from './ds'

export const memoStyles = _.memoStyles(() => ({
  container: {
    paddingLeft: _.wind,
    backgroundColor: _.colorPlain
  },
  imgContainer: {
    width: IMG_WIDTH
  },
  wrap: {
    paddingVertical: _.md,
    paddingRight: _.wind
  },
  touch: {
    paddingLeft: _.xs,
    marginLeft: -_.xs,
    borderRadius: _.radiusSm,
    overflow: 'hidden'
  },
  touchActor: {
    marginTop: _.md,
    borderRadius: _.radiusSm,
    overflow: 'hidden'
  }
}))
