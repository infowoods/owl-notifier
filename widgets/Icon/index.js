import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.module.scss'

class Icon extends React.Component {
  static propTypes = {
    type: PropTypes.string,
    className: PropTypes.string
  }

  render() {
    const { type, className = '', ...others } = this.props

    return (
      <i className={`${styles.icon} ${className}`} {...others}>
        <svg className={styles.svg} aria-hidden="true">
          <use xlinkHref={`#${type}`} />
        </svg>
      </i>
    )
  }
}

// function Icon(props) {
//   const { type, className } = props

//   return(
//     <i className={`icon ${className}`} >
//       <svg className="svg" aria-hidden="true">
//         <use xlinkHref={`#${type}`} />
//       </svg>
//     </i>
//   )
// }

export default Icon