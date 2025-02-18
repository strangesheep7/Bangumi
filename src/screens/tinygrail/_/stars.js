/*
 * @Author: czy0729
 * @Date: 2021-03-07 20:26:34
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-05-03 19:56:38
 */
import React from 'react'
import { Iconfont } from '@components'
import { _ } from '@stores'
import { ob } from '@utils/decorators'

function Stars({ value, size }) {
  if (!value) return null

  const style = {
    lineHeight: _.fontSize(12).lineHeight
  }
  const sun = parseInt(value / 25)
  const moon = parseInt((value - sun * 25) / 5)
  const star = value - sun * 25 - moon * 5
  return (
    <>
      {!!sun &&
        new Array(sun)
          .fill('')
          .map((item, index) => (
            <Iconfont
              key={index}
              style={style}
              name='ios-sunny'
              size={size}
              color='#ffc107'
            />
          ))}
      {!!moon &&
        new Array(moon)
          .fill('')
          .map((item, index) => (
            <Iconfont
              key={index}
              style={style}
              name='ios-moon'
              size={size}
              color='#ffc107'
            />
          ))}
      {!!star &&
        new Array(star)
          .fill('')
          .map((item, index) => (
            <Iconfont
              key={index}
              style={style}
              name='ios-star'
              size={size}
              color='#ffc107'
            />
          ))}
    </>
  )
}

export default ob(Stars, {
  size: 11
})
