import Request from '@/common/request'
// import { sync } from '@ouyangzhigang/utils'

const requester = new Request()

requester.sethandleError((message) => {
  console.log('service error', message)
})

// requester.sethandleSuccess(() => {

// })

export default requester
