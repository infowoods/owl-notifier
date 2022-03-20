import { useState, useEffect } from 'react'
import TabBar from './TabBar'
import PropTypes from 'prop-types'
import styles from './index.module.scss'

function Tabs(props) {
  const {
    className,
    defaultActiveKey,
    activeKey,
    children,
    scroll,
  } = props

  const childType = Object.prototype.toString.call(children)
  const formated = childType.indexOf('Array') > -1 ? children : [children]
  const validChild = formated.filter(child => child?.type?.TabPane)

  const computedActiveTab = key => key ? validChild.findIndex(c => c.key === key) : 0

  const defaultKey = activeKey || defaultActiveKey
  const defaultTab = defaultKey
    ? {
        key: defaultKey,
        index: computedActiveTab(defaultKey)
      }
    : { key: (validChild[0] || {}).key, index: 0 }

  const [activeTab, setActiveTab] = useState(defaultTab)
  const [loadedPanes, setLoadedPanes] = useState([defaultTab.index])

  useEffect(() => {
    if (!activeKey) return
    if (activeKey === activeTab.key) return
    switchTab(activeKey, computedActiveTab(activeKey))
  }, [activeKey])

  const switchTab = (key, index) => {
    !loadedPanes.includes(index) && setLoadedPanes([...loadedPanes, index])
    setActiveTab({ key, index })
  }

  const onTabBarClick = (key, index) => {
    if (activeTab.key === key) return

    switchTab(key, index)
    props.onChange && props.onChange(key)
  }

  const tabClass = () => {
    const result = ['Tabs']
    className && result.push(className)
    return result.join(' ')
  }

  return (
    <div className={tabClass()}>
      <TabBar
        activeTabIndex={activeTab.index}
        tabs={validChild}
        scroll={scroll}
        onChange={onTabBarClick}
        extraContent={props.tabBarExtraContent}
      />

      <div className={styles.panesOuter}>
        <div
          className={styles.panes}
          style={{
            width: validChild.length * 100 + '%',
            transform: `translateX(-${activeTab.index / validChild.length * 100}%)`
          }}
        >
          {
            validChild.map((child, index) => (
              <div
                key={child.key}
                className={ `${styles.pane} ${child.key !== activeTab.key ? styles.paneUnactive : ''}` }
              >
                {loadedPanes.includes(index) ? child : null}
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

Tabs.propTypes = {
  className: PropTypes.string,
  defaultActiveKey: PropTypes.string,
  onChange: PropTypes.func,
  activeKey: PropTypes.string,
  tabBarExtraContent: PropTypes.element
}

export default Tabs
