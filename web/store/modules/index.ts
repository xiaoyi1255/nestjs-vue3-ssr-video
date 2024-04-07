import { videoList } from '@/mock/videos'

const indexStore = {
  namespaced: true,
  state: {
    data: {},
    videoList: [...videoList],
  },
  mutations: {
    setData(state, payload) {
      state.data = payload.data
    }
  },
  actions: {
    initialData({ commit }, { payload }) {
      commit('setData', payload)
    }
  }
}

export {
  indexStore
}
