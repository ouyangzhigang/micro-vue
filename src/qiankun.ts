import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import type { QiankunProps } from 'vite-plugin-qiankun/dist/helper'

export declare type QiankunLifeCycle = {
  // 子应用启动时触发
  bootstrap: () => void | Promise<void>

  // 子应用挂载到主应用时触发
  mount: (props?: QiankunProps) => void | Promise<void>

  // 子应用离开主应用时触发
  unmount: (props?: QiankunProps) => void | Promise<void>

  // 子应用更新时触发
  update: (props?: QiankunProps) => void | Promise<void>
}

let instance: any

export function storeTest(props: any) {
  // eslint-disable-next-line no-unused-expressions
  props.onGlobalStateChange &&
    props.onGlobalStateChange(
      (value: any, prev: any) =>
        console.log(`[onGlobalStateChange - ${props?.name}]:`, value, prev),
      true
    )
  // eslint-disable-next-line no-unused-expressions
  props.setGlobalState &&
    props.setGlobalState({
      ignore: props.name,
      user: {
        name: props.name
      }
    })
}

export const initQianKun = (render: any) => {
  // eslint-disable-next-line no-unused-expressions, no-underscore-dangle
  qiankunWindow.__POWERED_BY_QIANKUN__
    ? renderWithQiankun({
        bootstrap() {
          console.log('subapp bootstrap')
        },
        async mount(props) {
          storeTest(props)
          console.log('subapp mount', props)
          console.log(
            'subapp qiankunWindow.__POWERED_BY_QIANKUN__ : ',
            // eslint-disable-next-line no-underscore-dangle
            qiankunWindow.__POWERED_BY_QIANKUN__
          )

          instance = render(props?.container)

          instance.config.globalProperties.$onGlobalStateChange = props?.onGlobalStateChange
          instance.config.globalProperties.$setGlobalState = props?.setGlobalState
          instance.config.globalProperties.$report = props?.Report
          instance.config.globalProperties.$getGlobalState = props?.getGlobalState

          try {
            // eslint-disable-next-line no-unsafe-optional-chaining
            const { initial, start } = props?.getGlobalState('rtds')
            !initial &&
              props?.Report.image({
                systemName: 'rtds',
                startTime: start,
                endTime: Date.now()
              })
            props?.setGlobalState({
              rtds: { initial: true, start: 0 }
            })
          } catch (err) {
            console.log('rtds report err => ', err)
          }
        },
        unmount(props) {
          console.log('subapp unmount', props, instance)
          instance?.unmount()
          // instance?.$destroy();
          // instance.$el.innerHTML = "";
          // eslint-disable-next-line no-underscore-dangle
          instance._container.innerHTML = ''
          instance = null
        },
        update(props) {
          console.log('subapp update', props)
        }
      } as QiankunLifeCycle)
    : render(null)
}
