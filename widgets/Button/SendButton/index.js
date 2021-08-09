import { Component } from 'react'
import Button from 'widget/Button'
import { withTranslation } from 'i18n'

const SEND_INTERVAL = 60
const MAX_SEND_INTERVAL = 300
const COUNTS = 3

class SendButton extends Component {
  state = {
    disabled: false,
    interval: SEND_INTERVAL,
    firstSend: true,
    loading: false,
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  buttonText = () => {
    const { t } = this.props
    const { disabled, interval, firstSend } = this.state
    if (firstSend) {
      return t('send_code')
    }
    if (!firstSend && !disabled) {
      return t('resend')
    }
    if (disabled) {
      return `${t('resend')}(${interval}s)`
    }
    return t('send_code')
  }

  getEmailCodeSuccess = () => {
    this.setState({
      disabled: true,
      firstSend: false,
    })
    this.interval = setInterval(() => {
      const { failedCount } = this.props
      this.setState((preState) => {
        if (preState.interval === 0) {
          clearInterval(this.interval)
          return {
            disabled: false,
            interval: failedCount && failedCount >= COUNTS ? MAX_SEND_INTERVAL : SEND_INTERVAL,
          }
        }
        return {
          interval: preState.interval - 1,
        }
      })
    }, 1000)
  }

  getEmailCodeFinally = () => {
    this.setState({ loading: false })
  }

  sendCode = async (e) => {
    e.preventDefault()
    if(this.props.onClickCallback){
      const isVerified = await this.props.onClickCallback()
      if(!isVerified) return
    }
    this.setState(() => {
      const { failedCount = 0 } = this.props
      let nextInterval = SEND_INTERVAL
      if (failedCount >= COUNTS) {
        nextInterval = MAX_SEND_INTERVAL
      }
      return {
        interval: nextInterval
      }
    }, () => {
      const { getVerifyCode } = this.props
      getVerifyCode({
        success: this.getEmailCodeSuccess,
        final: this.getEmailCodeFinally,
      })
    })
  }

  render() {
    const { disabled } = this.state
    return (
      <Button
        className={this.props.className}
        type="text"
        disabled={disabled}
        onClick={this.sendCode}
        id="sendbutton"
      >
        {this.buttonText()}
      </Button>
    )
  }
}

export default withTranslation('login')(SendButton)
