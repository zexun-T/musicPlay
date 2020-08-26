import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    pid: null,
    audio: new Audio(),
    albumPic: 'https://s1.ax1x.com/2020/08/18/dnU43t.jpg',
    playStatus: '',
    musicDuration: '',
    musicCurTime: '',
    MusicLyric: '',
    musicName: '',
    showList: true,
    gopage: 'play'
  },
  mutations: {
    changeGoPageRoute(state, address) {
      state.gopage = address
    },
    changePid(state, id) {
      state.pid = id
    },
    changeAlbumPic(state, url) {
      state.albumPic = url
    },
    changeAudio(state, url) {
      state.audio = new Audio(url)
    },
    changePlayStatus(state, status) {
      state.playStatus = status
    },
    changeListStatus(state, bool) {
      state.showList = bool
    },
    getMusicDuration(state) {
      state.musicDuration = state.audio.duration * 1000
    },
    getMusicCurTime(state, time) {
      state.musicCurTime = time
    },
    getMusicLyric(state, lyric) {
      var reg = /\[[^[\]]*\]/g
      var lyr = lyric.replace(reg, '')
      state.MusicLyric = lyr
    },
    getMusicName(state, musicname) {
      state.musicName = musicname
    }
  },
  actions: {
  },
  getters: {
    timeRate (state) {
      return (state.musicCurTime / state.musicDuration) * 100
    },
    musicLyric (state) {
    }
  },
  modules: {
  }
})
