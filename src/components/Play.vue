<template>
<div id='Play'>
  <i class="el-icon-arrow-down" @click="goSearch"></i>
  <div class='albumPic'>
    <img :src="albumPic" alt="">
  </div>
  <i class="el-icon-video-pause" id='pauseIcon' @click="pausePlay" ref='pauseIcon'></i>
  <div class="pro-bar">
    <div class="cur-time">{{musicCurTime|dateFormat}}</div>
    <a href="javascript:void(0)" class="virtual-bar" @click="changePro($event)"></a>
    <div class="pro-wrapper">
      <div class="pro-buttom"></div>
      <div class="pro-top" ref='proTop'>
        <div class="slider-point"></div>
      </div>
    </div>
    <div class="all-time">{{musicDuration|dateFormat}}</div>
  </div>
  <div class='music-name'>
    {{musicName}}
  </div>
  <pre class='lyric-box'>
  {{MusicLyric}}
  </pre>
</div>
</template>

<script>
import {
  mapState,
  mapGetters
} from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapState(['pid', 'albumPic', 'audio', 'playStatus', 'musicDuration', 'musicCurTime', 'MusicLyric', 'musicName', 'showList']),
    ...mapGetters(['timeRate'])
  },
  mounted() {},
  beforeRouteEnter(to, from, next) {
    window.scrollTo(0, 0)
    next()
  },
  beforeRouteLeave(to, from, next) {
    next()
  },
  watch: {
    timeRate: {
      handler(val) {
        this.$refs.proTop.style.transform = `translateX(${-100 + val}%)`
      }
    }
  },
  methods: {
    pausePlay() {
      if (!this.pid) {
        return
      }
      if (this.playStatus === 'playing') {
        this.audio.pause()
        this.$store.commit('changePlayStatus', 'paused')
        this.$refs.pauseIcon.classList = 'el-icon-video-play'
      } else {
        this.audio.play()
        this.$store.commit('changePlayStatus', 'playing')
        this.$refs.pauseIcon.classList = 'el-icon-video-pause'
      }
    },
    changePro(e) {
      var curTime = (e.offsetX / e.currentTarget.offsetWidth) * this.musicDuration
      this.$store.commit('getMusicCurTime', curTime)
      this.audio.currentTime = this.musicCurTime / 1000
      this.audio.play()
    },
    goSearch() {
      this.$router.back()
      this.$store.commit('changeGoPageRoute', 'play')
      var songsList = document.getElementsByClassName('songsList')[0]
      setTimeout(function () {
        songsList.classList.remove('active')
      }, 100)
    }
  }
}
</script>

<style scoped>
.el-icon-arrow-down {
  cursor: pointer;
  color: black;
  font-size: 5vh;
  position: absolute;
  right: 5vh;
  top: 2vh;
}

.albumPic {
  width: 30vh;
  height: 30vh;
  border: 1px solid black;
  position: relative;
  left: 50%;
  top: 10vh;
  transform: translateX(-50%);
}

.albumPic img {
  width: 100%;
  height: 100%;
}

#pauseIcon {
  position: relative;
  color: black;
  font-size: 10vh;
  left: 50%;
  transform: translateX(-50%);
  top: 10vh;
  cursor: pointer;
}

.pro-bar {
  display: flex;
  position: relative;
  top: 10vh;
  width: 60vw;
  left: 50%;
  transform: translateX(-50%);
}

.pro-bar .cur-time,
.all-time {
  color: #fff;
  width: 7vw;
  height: 5vh;
  line-height: 40px;
  text-align: center;
}

.virtual-bar {
  position: absolute;
  top: 1.5vh;
  left: 7vw;
  z-index: 999;
  width: 46vw;
  height: 2vh;
}

.pro-bar .pro-wrapper {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.pro-wrapper .pro-buttom,
.pro-top {
  position: absolute;
  top: 50%;
  height: 1px;
  width: 100%;
  background-color: #fff;
}

.pro-wrapper .pro-buttom {
  background-color: rgba(255, 255, 255, 0.6);
}

.pro-wrapper .pro-top {
  background-color: #fff;
  transform: translateX(-100%);
  position: relative;
}

.pro-top .slider-point {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 21px;
  height: 21px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.slider-point::before {
  content: "";
  display: block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #fff;
}

.lyric-box {
  width: 100vw;
  position: relative;
  text-align: center;
  left: 50%;
  transform: translateX(-50%);
  top: 20vh;
  padding-bottom: 20vh;
}

.music-name {
  font-size: 5vh;
  font-family: FZShuTi;
  position: relative;
  width: 100vw;
  text-align: center;
  left: 50%;
  top: 15vh;
  transform: translateX(-50%);
}
</style>
