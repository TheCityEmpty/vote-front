/**
 * @desc 对使用多的iview 的方法进行二次封装
 * @description 使用render 函数重新定义了弹出框
 */
export const _iviewConfirm = (Vue, callback, text = '请确认执行此操作?') => {
  return Vue.$Modal.confirm({
    onOk: () => {
      callback && callback()
    },
    render: (h) => {
      return h('div', {
        style: {
          display: 'flex',
          overflow: 'hidden'
        }
      },
      [
        h('i', {
          'class': {
            modalTu: true
          }
        }),
        h('span', {
          'class': { modalConfirmStyle: true }
        }, text)
      ])
    }
  })
}
