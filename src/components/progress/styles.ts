/*
 * @Author: czy0729
 * @Date: 2022-05-02 15:00:09
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-05-02 17:06:30
 */
import { _ } from '@stores'

export const memoStyles = _.memoStyles(() => ({
  progress: {
    position: 'absolute',
    zIndex: 1000,
    right: _.wind,
    bottom: _.lg,
    paddingTop: _.sm,
    paddingHorizontal: _.sm + 4,
    paddingBottom: _.sm + 6,
    backgroundColor: _.select('#ffffff', _._colorDarkModeLevel2),
    elevation: _.select(16, 0),
    borderRadius: _.radiusSm,
    overflow: 'hidden'
  },
  bar: {
    position: 'absolute',
    zIndex: 1001,
    right: 0,
    bottom: 0,
    left: 0
  },
  barActive: {
    height: 6,
    backgroundColor: 'rgb(0, 173, 146)',
    borderRadius: _.radiusSm,
    overflow: 'hidden'
  }
}))
