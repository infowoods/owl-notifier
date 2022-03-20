import { useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { useForm, Controller } from 'react-hook-form'
import Button from '../../../widgets/Button'
import Tabs from '../../../widgets/Tabs'
import Icon from '../../../widgets/Icon'
import BottomSheet from '../../../widgets/BottomSheet'
import styles from './index.module.scss'
import { parseScript, getSamples, creatAmo } from '../../../services/api/amo'
import Editor from 'react-simple-code-editor'
import hljs from 'highlight.js/lib/core'
import 'highlight.js/styles/atom-one-light.css'
import python from 'highlight.js/lib/languages/python'
hljs.registerLanguage('python', python)

const TabPane = Tabs.TabPane

function Add(props) {
  const { t } = useTranslation('common')
  const [ samples, setSamples ] = useState([])
  const [ code, setCode ] = useState('')
  const [ info, setInfo ] = useState({})
  const [ submitData, setSubmitData ] = useState({})
  const [ show, setShow ] = useState(false)
  const { control, handleSubmit, formState: { errors } } = useForm()

  useEffect(() => {
    const getSamp = async() => {
      const data = await getSamples()
      data && setSamples(data)
    }

    getSamp()
  }, [])

  const handleChange = (e) => {
    setScript(e.target.value)
  }

  const handleParse = async() => {
    const data = await parseScript({ code: code })
    if (data) {
      setSubmitData(data)
      setInfo(data?.settings)
      setShow(true)
    }
  }

  const renderParseValue = (val) => {
    if (typeof val === 'boolean') {
      if (val) return '是'
      return '否'
    }
    return val
  }

  const handleConfirm = async() => {
    const data = await creatAmo(JSON.stringify(submitData))
  }

  return (
    <div className={styles.add}>
      <div className={styles.modify}>
        <Button
          type="floating"
          size="medium"
          className={styles.editBtn}
          // onClick={() => setEdit(false)}
        >
          <Icon type="parse" /> 解析脚本
        </Button>
        <Button
          type="floating"
          size="medium"
          className={styles.saveBtn}
          // onClick={handleSubmit(onSubmit)}
        >
          <Icon type="upload" /> 直接添加
        </Button>
      </div>

      <Tabs defaultActiveKey="manual">
        <TabPane key="sample" tab="选择示例脚本">
          {
            samples && samples.map((item, idx) => (
              <div key={idx} className={styles.card}>
                <div>
                  <p>{item.title}</p>
                  <p>描述：{item.description}</p>
                  <p>作者：{item.author}</p>
                </div>
                <Button
                  type="primary"
                  size="medium"
                >
                  添加
                </Button>
              </div>
            ))
          }
        </TabPane>

        <TabPane key="manual" tab="手动填写脚本">
          <form
            className={styles.form}
            onSubmit={handleSubmit(handleParse)}
          >
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <Editor
                  {...field}
                  ref={null}
                  value={code}
                  onValueChange={(code) => setCode(code)}
                  highlight={(code) => {
                    const hCode = hljs.highlight(code, { language: 'python' }).value
                    return hCode
                  }}
                  padding={14}
                  textareaClassName={styles.editor}
                  preClassName={styles.pre}
                  style={{
                    fontFamily: 'Monaco',
                    fontSize: 13,
                  }}
                />
              )}
              rules={{
                required: '不能为空',
              }}
            />
            <p>{ errors?.code?.message }</p>
            <input type="submit" />
          </form>
        </TabPane>
      </Tabs>

      <BottomSheet
        t={t}
        show={show}
        withConfirm
        confirmTitle="解析结果"
        confirmText="添加阿莫"
        onCancel={() => setShow(false)}
        onConfirm={() => handleConfirm()}
      >
        <div className={styles.info}>
          <div>
            <h2>基本信息</h2>
            <p className={styles.parse}>标题：<span>{info?.profile?.title}</span></p>
            <p className={styles.parse}>描述：<span>{info?.profile?.description}</span></p>
          </div>
          <div>
            <h2>执行参数</h2>
            {
              info?.arguments && Object.entries(info?.arguments)?.map(([key, val]) => (
                <p key={key} className={styles.parse}>
                  {val.label}： <span>{renderParseValue(val.value)}</span>
                </p>
              ))
            }
          </div>
          <p className={styles.note}>* 添加后可修改「阿莫」的基本信息和执行参数</p>
        </div>
      </BottomSheet>
    </div>
  )
}

export default Add