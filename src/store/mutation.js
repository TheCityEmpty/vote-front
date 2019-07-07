// import { set_SideStatus } from './mutation-types'
export default {
  // [set_SideStatus] (state, { status }) {
  //   state.sideStatus = status
  // }
  setActiveInfo (state, info) {
    state.activeInfo = info
  },
  setGloblLoading (state, status) {
    state.globlLoading = status
  }
}
