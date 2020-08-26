<template>
<div id="warpper">
  <transition name='left'>
    <router-view></router-view>
  </transition>
  <i class="el-icon-s-home" @click="goHome"></i>
  <div class="search-bar" v-if='showSearchBar'>
    <el-input placeholder="请搜索音乐" v-model="musicKey" id="searchInp" ref='searchInp' @keyup.native.enter="searchMusic">
      <el-button slot="suffix" id="searchBtn" icon="el-icon-search" @click="searchMusic"></el-button>
    </el-input>
  </div>
  <i id="loadingIcon" v-loading="loading"></i>
  <ul v-show="showList" ref='showList' class="songsList" v-loading="listLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
    <li v-for="(item, i) in musicList" :key="i" ref="searchList" @click="play(item.id,$event,item)">
      <a href="javascript:void(0)">
        <i class="el-icon-video-play" id="playIcon" ref="playIcon"></i>
        <div id="songinfo">
          <div class="songName">{{item.name}}</div>
          <div class="artist" v-if="item.artists.length===1">{{item.artists[0].name}} - 《{{item.album.name}}》</div>
          <div class="artist" v-if="item.artists.length===2">{{item.artists[0].name}}/{{item.artists[1].name}} - 《{{item.album.name}}》</div>
        </div>
        <el-tooltip effect="light" content="添加到播放列表" placement="top">
          <i class="el-icon-plus" id="addIcon" visible-arrow="false" @click.stop="addSong(item)"></i>
        </el-tooltip>
        <span class="duration">{{item.duration|dateFormat}}</span>
      </a>
    </li>
    <div id='loadMore-wap'><span href="javascript:void(0)" id='loadMore' @click="load" v-if="loadMorebtn">{{loadMoreTip}}</span></div>
  </ul>
  <div :class="play_box">
    <i class="el-icon-arrow-down" @click="play_box='play_box hidden_box'"></i>
    <i class="el-icon-arrow-up" @click="play_box='play_box'"></i>
    <div class="topTipbox" @mouseleave="isshowTipBox = false" @mouseenter.stop="isshowTipBox = true" @click="goPlayPage">
      <a href="javascript:void(0)" v-show="isshowTipBox">
        <i class='el-icon-d-arrow-left'></i>
      </a>
    </div>
    <div class="play_btns">
      <el-tooltip effect="dark" :content="tipContent" placement="top">
        <a href="javascript:void(0)" hidefocus="true" class="icn-order" @click.stop="selectMode" ref="modeBtn"></a>
      </el-tooltip>
      <a href="javascript:void(0)" hidefocus="true" class="prv" @click="prvPlay"></a>
      <a href="javascript:void(0)" class="img_box" ref="imgBox">
        <img :src="albumPic" ref="albumImg" alt />
      </a>
      <a href="javascript:void(0)" hidefocus="true" class="nxt" @click="nxtPlay"></a>
      <el-tooltip effect="dark" content="播放列表" placement="top">
        <a href="javascript:void(0)" hidefocus="true" class="icn-list" @click="playListCard=!playListCard"></a>
      </el-tooltip>
    </div>
  </div>
  <el-card class="box-card" v-show="playListCard" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
    <div slot="header" class="clearfix">
      <span>播放列表</span>
      <i class="el-icon-arrow-down" @click="playListCard=false"></i>
    </div>
    <div id="list-head">
      <span class="list-song-name">歌曲名</span>
      <span class="list-singer-name">歌手</span>
      <span class="list-delete">删除</span>
    </div>
    <ul id="list-info">
      <li v-for="(item, i) in playList" :key="i" :data-id="item.id" ref="listData" @click="listPlay(item.id,$event)">
        <span class="list-song-name">{{item.name}}</span>
        <span class="list-singer-name" v-if="item.artists.length===1">{{item.artists[0].name}}</span>
        <span class="list-singer-name" v-if="item.artists.length===2">{{item.artists[0].name}}/{{item.artists[1].name}}</span>
        <span class="list-delete delete-btn" @click.stop="listDelete(item.id)">X</span>
      </li>
    </ul>
  </el-card>
</div>
</template>

<script>
import {
  mapState
} from 'vuex'
export default {
  data() {
    return {
      tipContent: '顺序播放',
      loadMoreTip: '加载更多...',
      playMode: 'order',
      play_box: 'play_box',
      musicKey: '',
      musicList: [],
      musicListId: [],
      // 专辑id
      albumId: null,
      // 播放列表
      playList: [],
      // 播放列表的id
      playListId: [],
      activeDom: null,
      playing: false,
      // 当前播放的歌曲id
      showSearchBar: true,
      isshowTipBox: false,
      loading: false,
      listLoading: false,
      playListCard: false,
      loadMorebtn: false,
      loadParams: {
        limit: 5,
        offset: 21
      }
    }
  },
  computed: {
    ...mapState(['pid', 'albumPic', 'audio', 'playStatus', 'showList', 'gopage'])
  },
  mounted() {
    this.$refs.searchInp.focus()
    if (this.$route.query.musicKey) {
      this.musicKey = this.$route.query.musicKey
      this.searchMusic()
    }
  },
  watch: {
    // 监听路由参数变化
    $route() {
      if (this.$route.query.musicKey && this.$route.query.musicKey !== this.musicKey) {
        this.musicKey = this.$route.query.musicKey
        this.searchMusic()
      }
    }
  },
  beforeRouteleave(to, from, next) {
    next()
  },
  methods: {
    async load() {
      var that = this
      this.loadMoreTip = '正在加载...'
      const {
        data: res
      } = await this.$http.get(`/search?keywords=${this.musicKey}`, {
        params: this.loadParams
      })
      res.result.songs.forEach(function (item) {
        that.musicList.push(item)
      })
      this.musicListId = []
      this.musicList.forEach(function (item) {
        that.musicListId.push(item.id)
      })
      this.loadMoreTip = '加载更多...'
      this.loadParams.offset += 5
    },
    async searchMusic() {
      this.$router.push({
        path: `/search?musicKey=${this.musicKey}`
      })
      var that = this
      this.$refs.showList.classList.remove('active')
      this.$store.commit('changeListStatus', false)
      this.loading = true
      const {
        data: res
      } = await this.$http.get(`/search?keywords=${this.musicKey}`, {
        params: {
          limit: 20
        }
      })
      if (res.code === 200) {
        this.$store.commit('changeListStatus', true)
        this.loading = false
        this.musicList = res.result.songs
        this.musicListId = [] // 搜索列表的id集合
        this.musicList.forEach(function (item) {
          that.musicListId.push(item.id)
        })
        this.$nextTick(function () {
          this.loadMorebtn = true
          var i = this.musicListId.indexOf(this.pid)
          this.$refs.searchList.forEach(function (item) {
            item.classList = ''
          })
          if (i !== -1) {
            this.$refs.searchList[i].classList.add('playing')
            this.$refs.playIcon[i].classList = 'el-icon-video-pause'
          }
        })
      } else {
        this.$message('查询不存在，请重试')
      }
    },
    async play(id, e, songItem) {
      // // 1、第一次播放，没有activeDom,将通过axios获取歌曲播放
      // // 2、用pid判断，如果点击的是同一首歌，则暂停，改变playIcon，再次点击则播放，再改变playIcon
      // // 3、如果点击的不是同一首歌，则pid 不等于id ，一恢复之前的Icon，二重新获取歌曲
      this.$refs.searchList.forEach(function (item) {
        item.classList = ''
      })
      this.$refs.playIcon.forEach(function (item) {
        item.classList = 'el-icon-video-play'
      })
      this.activeDom = e.currentTarget // 将当前点击对象赋值
      this.activeDom.classList = 'playing' // 修改播放对象的状态
      var playIcon = this.activeDom.firstElementChild.firstElementChild
      this.audio.pause()
      if (this.pid === id) {
        if (this.playStatus === 'playing') {
          this.audio.pause()
          playIcon.classList = 'el-icon-video-play'
          this.$store.commit('changePlayStatus', 'paused')
        } else {
          playIcon.classList = 'el-icon-video-pause'
          this.audio.play()
          this.$store.commit('changePlayStatus', 'playing')
        }
      } else {
        this.audio.pause()
        playIcon.classList = 'el-icon-video-pause'
        this.listLoading = true
        const {
          data: res
        } = await this.$http.get(`/song/url?id=${id}`)
        this.$store.commit('changePid', id)
        this.albumId = res.data[0].id
        if (!res.data[0].url) {
          this.$message('该歌曲无法播放')
          this.listLoading = false
        } else {
          this.$store.commit('changeAudio', res.data[0].url)
          this.audio.load()
          this.audio.play()
          this.listLoading = false
          this.$store.commit('changePlayStatus', 'playing')
          // 监听播放事件
          this.audioEvent()
          this.addSong(songItem)
        }
      }
    },
    audioEvent() {
      var that = this
      this.audio.addEventListener('play', async function () {
        // 获取专辑图片
        const {
          data: res
        } = await that.$http.get(`/song/detail?ids=${that.albumId}`)
        var picUrl = res.songs[0].al.picUrl
        var musicname = res.songs[0].name
        that.$store.commit('changeAlbumPic', picUrl)
        that.$store.commit('getMusicName', musicname)
        that.$store.commit('getMusicDuration')
        const {
          data: result
        } = await that.$http.get(`/lyric?id=${that.pid}`)
        that.$store.commit('getMusicLyric', result.lrc.lyric)
        that.$nextTick(function () {
          that.$refs.imgBox.style.animationPlayState = 'running'
        })
      })
      this.audio.addEventListener('pause', function () {
        that.$nextTick(function () {
          that.$refs.imgBox.style.animationPlayState = 'paused'
        })
      })
      this.audio.addEventListener('ended', function () {
        console.log(that.playMode)
        if (that.playMode === 'order') {
          that.nxtPlay()
        }
        if (that.playMode === 'loop') {
          that.audio.load()
          that.audio.pause()
          that.audio.play()
        }
        if (that.playMode === 'shuffle') {
          that.shufflePlay()
        }
      })
      this.audio.addEventListener('timeupdate', function () {
        var curtime = that.audio.currentTime * 1000
        that.$store.commit('getMusicCurTime', curtime)
      })
    },
    shufflePlay() {
      var len = this.playListId.length
      var n = Math.floor(Math.random() * len)
      if (this.pid !== this.playListId[n]) {
        this.listPlay(this.playListId[n])
      } else {
        this.shufflePlay()
      }
    },
    addSong(item) {
      var i = this.playListId.indexOf(item.id)
      this.$store.commit('getMusicDuration', item.duration)
      if (i === -1) {
        this.$message({
          message: '已添加',
          type: 'success',
          duration: 1000
        })
        this.playList.push(item)
        this.playListId.push(item.id)
      } else {
        this.$message({
          message: '列表中已存在该歌曲',
          duration: 1000
        })
      }
      this.$nextTick(function () {
        var i = this.playListId.indexOf(this.pid)
        this.$refs.listData.forEach(function (item) {
          item.classList = ''
        })
        if (i !== -1) {
          this.$refs.listData[i].classList.add('activeSong')
        }
      })
    },
    async listPlay(id, e) {
      if (this.pid === id) {
        if (this.playStatus === 'playing') {
          this.audio.pause()
          this.$store.commit('changePlayStatus', 'paused')
        } else {
          this.audio.play()
          this.$store.commit('changePlayStatus', 'playing')
        }
      } else {
        this.$store.commit('changePid', id)
        this.$nextTick(function () {
          var i = this.playListId.indexOf(this.pid)
          var j = this.musicListId.indexOf(this.pid)
          if (this.$refs.listData) {
            this.$refs.listData.forEach(function (item) {
              item.classList = ''
            })
            this.$refs.searchList.forEach(function (item) {
              item.classList = ''
            })
            this.$refs.playIcon.forEach(function (item) {
              item.classList = 'el-icon-video-play'
            })
            if (i !== -1) {
              this.$refs.listData[i].classList.add('activeSong')
            }
            if (j !== -1) {
              if (this.$refs.searchList[j]) {
                this.$refs.searchList[j].classList.add('playing')
                this.$refs.playIcon[j].classList = 'el-icon-video-pause'
              }
            }
          }
        })
        this.listLoading = true
        const {
          data: res
        } = await this.$http.get(`/song/url?id=${id}`)
        this.albumId = res.data[0].id
        if (!res.data[0].url) {
          this.$message('该歌曲无法播放')
          this.listLoading = false
        } else {
          this.audio.pause()
          this.$store.commit('changeAudio', res.data[0].url)
          this.audioEvent()
          this.audio.load()
          this.audio.play()
          this.listLoading = false
          this.$store.commit('changePlayStatus', 'playing')
        }
      }
    },
    nxtPlay() {
      var i = this.playListId.indexOf(this.pid)
      if (this.playMode === 'shuffle') {
        this.shufflePlay()
        return
      }
      if (i !== -1) {
        i++
        if (i < this.playListId.length) {
          this.listPlay(this.playListId[i])
        } else {
          this.listPlay(this.playListId[0])
        }
      }
    },
    prvPlay() {
      var i = this.playListId.indexOf(this.pid)
      if (i !== -1) {
        i--
        if (i >= 0) {
          this.listPlay(this.playListId[i])
        }
      }
    },
    listDelete(id) {
      var i = this.playListId.indexOf(id)
      if (i !== -1) {
        this.playListId.splice(i, 1)
        this.playList.splice(i, 1)
        if (id === this.pid) {
          if (i < this.playListId.length) {
            this.listPlay(this.playListId[i])
          } else {
            this.listPlay(this.playListId[0])
          }
        }
      }
    },
    selectMode() {
      if (this.playMode === 'order') {
        this.playMode = 'loop'
        this.tipContent = '循环播放'
        this.$refs.modeBtn.classList = 'icn-loop'
        return
      }
      if (this.playMode === 'loop') {
        this.playMode = 'shuffle'
        this.tipContent = '随机播放'
        this.$refs.modeBtn.classList = 'icn-shuffle'
        return
      }
      if (this.playMode === 'shuffle') {
        this.playMode = 'order'
        this.tipContent = '顺序播放'
        this.$refs.modeBtn.classList = 'icn-order'
      }
    },
    goHome() {
      this.$router.push('/home')
    },
    goPlayPage() {
      if (this.gopage === 'play') {
        this.$router.push(this.gopage)
        this.$refs.showList.classList.add('active')
        this.$store.commit('changeGoPageRoute', 'search')
      } else {
        this.$router.back()
        this.$store.commit('changeGoPageRoute', 'play')
        this.$refs.showList.classList.remove('active')
      }
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  font-size: 2.5vh;
}

.el-icon-s-home {
  position: absolute;
  top: 1vh;
  font-size: 5vh;
  color: #fff;
  cursor: pointer;
}

.search-bar {
  position: absolute;
  width: 30vw;
  left: 6vh;
  top: 1vh;
}

#searchInp {
  height: 6vh;
  color: black;
  border-radius: 3vh;
  background: transparent;
  border: 1px solid black;
}

#searchBtn {
  color: black;
  height: 6vh;
  border: 0;
  display: inline-block;
  background: transparent;
}

#searchBtn i {
  margin: 0;
}

#loadingIcon {
  color: #1296db;
  position: absolute;
  left: 45%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.songsList {
  position: absolute;
  top: 8vh;
  transition: all 1s linear;
}

.songsList.active {
  transform: translateX(-100%);
}

.songsList li {
  box-sizing: border-box;
  list-style: none;
  width: 100vw;
  height: 10vh;
}

.songsList li:hover {
  background-color: rgba(255, 255, 255, 0.39);
}

.songsList li a {
  position: absolute;
  text-decoration: none;
  color: black;
  height: 10vh;
  width: 100%;
}

.songsList .el-loading-spinner {
  position: fixed;
  top: 50vh;
}

#loadMore-wap {
  position: relative;
  left: 50%;
  top: 3vh;
  transform: translateX(-50%);
  height: 20vh;
  width: 30vw;
  text-align: center;
}

#loadMore {
  cursor: pointer;
  color: #fff;
  font-size: 3vh;
}

#loadMore:hover {
  color: black;
}

#playIcon {
  margin-left: 4vw;
  margin-right: 2vw;
}

#playIcon::before {
  font-size: 4vh;
  line-height: 10vh;
}

#songinfo {
  display: inline-block;
  position: absolute;
  width: 40vw;
  height: 8vh;
  left: 14vw;
  top: 2vh;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#songinfo .songName {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 2.5vh;
}

#songinfo .artist {
  position: relative;
  top: 1vh;
  font-size: 1.7vh;
  color: #1296db;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#addIcon {
  position: absolute;
  left: 65%;
  top: 4vh;
  height: 16px;
}

.duration {
  position: absolute;
  left: 85%;
  line-height: 10vh;
}

.playing {
  box-sizing: border-box;
  border: 2px solid rgba(38, 39, 41, 0.493);
  border-radius: 5vh;
  background-color: rgba(255, 255, 255, 0.473);
}

.play_box {
  position: fixed;
  width: 100%;
  height: 10vh;
  background-color: #ffffff5c;
  bottom: 0;
  z-index: 999;
  transition: transform 1.5s linear;
}

.play_box.hidden_box {
  transform: translateY(10vh);
}

.play_box.hidden_box .el-icon-arrow-down {
  display: none;
}

.play_box.hidden_box .el-icon-arrow-up {
  display: block;
  position: absolute;
  left: 0;
  top: -4vh;
  font-size: 5vh;
  cursor: pointer;
  opacity: 0.6;
}

.play_box .el-icon-arrow-down {
  position: absolute;
  left: 0;
  top: -4vh;
  font-size: 5vh;
  cursor: pointer;
  opacity: 0.6;
  color: red;
  transition: color 2s linear;
}

.play_box .el-icon-arrow-up {
  display: none;
}

.play_box .el-icon-arrow-down:hover {
  opacity: 1;
  color: black;
}

.play_btns {
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 100%;
}

.play_btns a {
  width: 3.5vh;
  height: 3.5vh;
  position: relative;
  top: 3.5vh;
}

.play_btns .img_box {
  position: relative;
  height: 10vh;
  width: 10vh;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 0.5vh;
  transform: translate(0, -60%);
  background-color: #fff;
  box-shadow: 0 0 10px #ddd;
  -webkit-animation: Rotate 10s linear infinite paused;
  animation: Rotate 10s linear infinite paused;
}

.play_box .topTipbox {
  cursor: pointer;
  position: absolute;
  left: 50%;
  top: 3.5vh;
  transform: translate(-50%, -60%);
  height: 10vh;
  width: 10vh;
  z-index: 999;
  border-radius: 50%;
}

.play_box .topTipbox:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

.play_box .topTipbox .el-icon-d-arrow-left {
  line-height: 10vh;
  color: #fff;
  font-size: 5vh;
  animation: tip 0.8s alternate linear infinite;
}

@keyframes tip {
  0% {
    transform: translate(65%);
  }

  100% {
    transform: translateX(35%)
  }
}

.play_btns .img_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.play_btns .icn-order {
  background-image: url("https://s1.ax1x.com/2020/08/19/dQq7CT.png");
  background-size: cover;
}

.play_btns .icn-loop {
  background-image: url("https://s1.ax1x.com/2020/08/19/dQOR7n.png");
  background-size: cover;
}

.play_btns .icn-shuffle {
  background-image: url("https://s1.ax1x.com/2020/08/19/dQqo5V.png");
  background-size: cover;
}

.play_btns .prv {
  background-image: url("https://s1.ax1x.com/2020/08/19/dQYknK.png");
  background-size: cover;
}

.play_btns .nxt {
  background-image: url("https://s1.ax1x.com/2020/08/19/dQYC11.png");
  background-size: cover;
}

.play_btns .icn-list {
  background-image: url("https://s1.ax1x.com/2020/08/23/dwyX8K.png");
  background-size: cover;
  background-position-x: -0.8vh;
}

@keyframes Rotate {
  0% {
    transform: translate(0, -60%) rotate(0deg);
  }

  100% {
    transform: translate(0, -60%) rotate(360deg);
  }
}

.box-card {
  width: 70vw;
  height: 60vh;
  position: fixed;
  bottom: 10vh;
  right: 0;
}

.el-card {
  background-color: #be9a9a93 !important;
}

.el-card__header {
  padding: 2vh 10% !important;
}

.el-card__body {
  padding: 0 !important;
}

.clearfix span {
  font-size: 2.2vh;
  color: black;
}

.clearfix .el-icon-arrow-down {
  position: absolute;
  right: 10%;
  font-size: 4vh;
  cursor: pointer;
  color: black;
  opacity: 1;
  transition: color 2s linear;
}

.clearfix .el-icon-arrow-down:hover {
  opacity: 1;
  color: black;
}

#list-head {
  width: 100%;
  height: 4vh;
  background-color: rgb(238, 230, 230);
  font-size: 2.2vh;
  line-height: 4vh;
  color: rgb(131, 120, 120);
}

#list-info li {
  line-height: 4vh;
  height: 4vh;
  font-size: 2.2vh;
  width: 100%;
  user-select: none;
  cursor: pointer;
}

#list-info .activeSong {
  box-sizing: border-box;
  background-color: rgba(138, 128, 128, 0.644);
  color: #fff;
  border-left: 2px solid #0b547c;
}

#list-info li:hover {
  background-color: #ccc;
}

.list-song-name {
  display: inline-block;
  margin-left: 8%;
  width: 45%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-singer-name {
  display: inline-block;
  margin-left: 5%;
  width: 25%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-delete {
  display: inline-block;
  width: 15%;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.delete-btn {
  opacity: 0.5;
  transition: opacity 1s linear;
}

.delete-btn:hover {
  color: red;
  opacity: 1;
}

.left-enter-to {
  transform: translateX(0);
}

.left-enter {
  transform: translateX(100%);
}

.left-enter-active {
  transition: 2s;
}

.left-leave-to {
  transform: translateY(100%);
}

.left-leave {
  transform: translateY(0);
}

.left-leave-active {
  transition: 2s;
}

::-webkit-scrollbar {
  width: 0 !important;
}

::-webkit-scrollbar {
  width: 5px !important;
  height: 5px;
}

::-webkit-scrollbar-track {
  background-color: #ccc;
}

/* 滚动条的滑轨背景颜色 */

::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 2.5px;
}

/* 滑块颜色 */
</style>
