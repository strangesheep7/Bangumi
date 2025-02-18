/*
 * @Author: czy0729
 * @Date: 2022-09-10 07:19:39
 * @Last Modified by:   czy0729
 * @Last Modified time: 2022-09-10 07:19:39
 */
import { _ } from '@stores'

export const memoStyles = _.memoStyles(() => ({
  container: {
    paddingBottom: _.sm
  },
  wrap: {
    paddingHorizontal: _.windSm + 2,
    marginTop: _.md + 8,
    marginBottom: _.xs
  }
}))
