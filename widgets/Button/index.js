import Icon from '../Icon'
import './index.scss'

function Button(props) {
  const { className, style, children, type, size, disabled, loading, withArrow, prefix, suffix, ...others } = props
  return (
    <button className={`Button ${type} ${size} ${loading ? 'loading' : ''} ${className}`} style={style} disabled={disabled} {...others}>
      { prefix && <div className="prefix">{prefix}</div> }
      {children}
      {
        loading && <Icon type={type === 'primary' ? 'loading' : 'loading-blue'} className="loading_icon"/>
      }
      {
        !loading && withArrow && <Icon type="arrow-line" className="arrow_icon" />
      }
      {
        !loading && !withArrow && suffix && <div className="suffix">{suffix}</div>
      }
    </button>
  )
}

Button.defaultProps = {
  type: 'primary',
  size: 'small',  // small
  loading: false,
  disabled: false,
  withArrow: false,
}

Button.propTypes = {
  type: PropTypes.oneOf(['primary', 'floating', 'secondary', 'text']),
  size: PropTypes.oneOf(['large', 'small']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  withArrow: PropTypes.bool,
  suffix: PropTypes.node,
  prefix: PropTypes.node,
}

export default Button