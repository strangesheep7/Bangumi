/*
 * @Author: czy0729
 * @Date: 2020-09-28 18:30:52
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-08-27 18:23:54
 */
import React from 'react'
import { ActivityIndicator, Animated, Text, View, TouchableOpacity } from 'react-native'
import Icon, { IconNames } from '@ant-design/react-native/lib/icon'
import { WithTheme, WithThemeStyles } from '@ant-design/react-native/lib/style'
import ToastStyles, { ToastStyle } from '@ant-design/react-native/lib/toast/style/index'
import { getThemeStoreAsync } from '@utils/async'

export interface ToastProps extends WithThemeStyles<ToastStyle> {
  content: string
  duration?: number
  onClose?: () => void
  mask?: boolean
  type?: string
  onAnimationEnd?: () => void
}

export default class ToastContainer extends React.Component<ToastProps, any> {
  static defaultProps = {
    duration: 3,
    mask: true,
    onClose() {}
  }

  anim: Animated.CompositeAnimation | null

  constructor(props: ToastProps) {
    super(props)
    this.state = {
      fadeAnim: new Animated.Value(0)
    }
  }

  componentDidMount() {
    const { onClose, onAnimationEnd } = this.props
    const duration = this.props.duration as number
    const timing = Animated.timing
    if (this.anim) {
      this.anim = null
    }
    const animArr = [
      timing(this.state.fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.delay(duration * 1000)
    ]
    if (duration > 0) {
      animArr.push(
        timing(this.state.fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        })
      )
    }
    this.anim = Animated.sequence(animArr)
    this.anim.start(() => {
      if (duration > 0) {
        this.anim = null
        if (onClose) {
          onClose()
        }
        if (onAnimationEnd) {
          onAnimationEnd()
        }
      }
    })
  }

  componentWillUnmount() {
    if (this.anim) {
      this.anim.stop()
      this.anim = null
    }
  }

  render() {
    const { type = '', content, mask, onAnimationEnd } = this.props
    return (
      <WithTheme styles={this.props.styles} themeStyles={ToastStyles}>
        {styles => {
          const iconType: {
            [key: string]: IconNames
          } = {
            success: 'check-circle',
            fail: 'close-circle',
            offline: 'frown'
          }

          let iconDom: React.ReactElement<any> | null = null
          if (type === 'loading') {
            iconDom = (
              <ActivityIndicator
                animating
                style={styles.centering}
                color='white'
                size='large'
              />
            )
          } else if (type === 'info') {
            iconDom = null
          } else {
            iconDom = (
              <Icon
                style={styles.image}
                name={iconType[type]}
                color='white'
                size={36}
              />
            )
          }

          const themeStore = getThemeStoreAsync()
          return (
            <View
              style={styles.container}
              pointerEvents={mask ? undefined : 'box-none'}
            >
              <TouchableOpacity
                style={styles.innerContainer}
                activeOpacity={1}
                onPress={onAnimationEnd}
              >
                <Animated.View
                  style={{
                    opacity: this.state.fadeAnim
                  }}
                >
                  <View
                    style={[
                      styles.innerWrap,
                      iconDom ? styles.iconToast : styles.textToast,
                      themeStore.deepDark && {
                        backgroundColor: themeStore._colorDarkModeLevel2
                      },
                      themeStore.deepDark &&
                        type === 'loading' && {
                          backgroundColor: themeStore._colorDarkModeLevel1
                        }
                    ]}
                  >
                    {iconDom}
                    <Text
                      style={[themeStore.fontStyle, styles.content]}
                      textBreakStrategy='simple'
                      numberOfLines={0}
                    >
                      {content}
                    </Text>
                  </View>
                </Animated.View>
              </TouchableOpacity>
            </View>
          )
        }}
      </WithTheme>
    )
  }
}
