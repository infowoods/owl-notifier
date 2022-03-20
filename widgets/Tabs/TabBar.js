import { memo, useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styles from './index.module.scss'

const Layout = ({ extraContent, children }) => {
  const className = extraContent ? styles.tabBarExtra : ''

  return (
    <div className={className}>
      {
        extraContent ? <div className={styles.tabBarOuter}>{children}</div> : children
      }
      {extraContent}
    </div>
  )
}

const TabBar = (props) => {
  const {
    activeTabIndex,
    tabs,
    onChange,
    extraContent,
    scroll
  } = props

  const [translateX, setTranslateX] = useState(0)
  const tabBarsRef = useRef([])
  const tabsRef = useRef(null)

  const touchTab = (index) => {
    const wrapWidth = document.body.offsetWidth
    const totalWidth = [...tabsRef.current.childNodes].reduce((prev, curr) => prev + curr.offsetWidth, 2)
    const surplusWidth = totalWidth - wrapWidth

    if (surplusWidth > 0) {
      const currWidth = tabsRef.current.childNodes[index].offsetWidth
      const centerMarginLeft = parseInt((wrapWidth - currWidth) / 2)
      const bodyMarginLeft = parseInt([...tabsRef.current.childNodes].slice(0, index).reduce((prev, curr) => prev + curr.offsetWidth, 0) + translateX)
      let shouldTranslateX = parseInt(translateX) - (bodyMarginLeft - centerMarginLeft)

      if (shouldTranslateX > 0) {
        shouldTranslateX = 0
      } else if (shouldTranslateX < -surplusWidth) {
        shouldTranslateX = -surplusWidth
      }

      setTranslateX(shouldTranslateX)
    }
  }

  useEffect(() => {
    if (tabsRef.current && scroll) {
      const totalWidth = [...tabsRef.current.childNodes].reduce((prev, curr) => prev + curr.offsetWidth, 2)
      tabsRef.current.style.width = `${totalWidth}px`
    }
  }, [])

  const measureTabBar = node => {
    if (node !== null) {
      const [, index] = node.id.split('-')
      tabBarsRef.current[index] = node
    }
  }

  const indicatorLeft = tabBarsRef.current
    .slice(0, activeTabIndex)
    .reduce((pre, cur) => pre + cur.clientWidth, 0)

  return (
    <Layout extraContent={extraContent}>
      <div className={styles.tabBar} ref={tabsRef} style={{ 'transform': `translateX(${translateX}px)` }}>
        {
          tabs.map((child, index) => (
            <span
              key={index}
              id={`${child.key}-${index}`}
              className={ `${styles.bar} ${index === activeTabIndex ? styles.active : ''}` }
              style={{ pointerEvents: child.props.disable ? 'none' : 'auto' }}
              ref={measureTabBar}
              onClick={() => {
                if (!child.props.disable) {
                  onChange(child.key, index)
                  if (!scroll) return
                  touchTab(index)
                }
              }}
            >
              {child.props.tab}
            </span>
          ))
        }
      </div>

      <div
        className={styles.indicator}
        style={{
          width: tabBarsRef.current[activeTabIndex]
            ? tabBarsRef.current[activeTabIndex].offsetWidth : 0,
          transform: `translateX(${indicatorLeft + translateX}px)`
        }}
      />
    </Layout>
  )
}

TabBar.propTypes = {
  activeTabIndex: PropTypes.number,
  tabs: PropTypes.node,
  onChange: PropTypes.func,
  extraContent: PropTypes.element
}

TabBar.defaultProps = {
  extraContent: null
}

export default memo(TabBar)
