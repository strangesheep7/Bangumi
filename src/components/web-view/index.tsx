/*
 * @Author: czy0729
 * @Date: 2019-04-13 10:38:19
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-09-02 17:28:26
 */
import React from 'react'
import RNWebView from '@components/@/web-view'
import { KeyboardSpacer } from '../keyboard-spacer'

export const WebView = class WebViewComponent extends React.Component<any> {
  ref
  stopLoading = Function.prototype
  reload = Function.prototype
  goBack = Function.prototype

  render() {
    const { uri, ...other } = this.props as any
    if (!uri) return null

    return (
      <>
        <RNWebView
          ref={ref => {
            if (ref) {
              this.stopLoading = ref.stopLoading
              this.reload = ref.reload
              this.goBack = ref.goBack
            }
          }}
          useWebKit
          thirdPartyCookiesEnabled={false}
          source={{ uri }}
          {...other}
        />
        <KeyboardSpacer />
      </>
    )
  }
}
