<template>
  <div id='home'>
    <i class="el-icon-right" @click="goSearch"></i>
    <div class='s-bar'>
      <el-input placeholder="开始搜索音乐" id="search-Inp" v-model="musicKey" @keyup.native.enter="search">
        <el-button slot="suffix" icon="el-icon-search" id='search-btn' @click="search"></el-button>
      </el-input>
    </div>
    <div class="theme-select">
      <a href="javascript:void(0)" v-for="(item, i) in imgArr" :key="i" @click="changeBgImg(item)">
        <img :src='item' alt="">
      </a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      musicKey: '',
      imgArr: ['https://s1.ax1x.com/2020/08/18/dnU43t.jpg', 'https://s1.ax1x.com/2020/08/21/dtzZSe.jpg', 'https://s1.ax1x.com/2020/08/21/dNiEfP.jpg', 'https://s1.ax1x.com/2020/08/21/dNiAYt.jpg']
    }
  },
  methods: {
    search() {
      this.$router.push({ path: '/search', query: { musicKey: this.musicKey } })
    },
    changeBgImg(item) {
      var wapImg = document.querySelector('#wap-img')
      wapImg.style.width = 0
      wapImg.style.height = 0
      setTimeout(function() {
        wapImg.src = item
        wapImg.style.width = '100%'
        wapImg.style.height = '100%'
      }, 1000)
    },
    goSearch() {
      this.$router.back()
    }
  }
}
</script>

<style>
.el-icon-right{
  cursor: pointer;
  color: black;
  font-size: 5vh;
  position: absolute;
  right: 5vh;
  top: 2vh;
}
.s-bar{
  position: absolute;
  width: 30vw;
  left: 50%;
  top: 30%;
  transform: translateX(-50%);
}

#search-Inp{
  height: 6vh;
  color: black;
  border-radius: 3vh;
  background: transparent;
  border: 1px solid black;
}
#search-btn{
  color: black;
  position: relative;
  left: -1vw;
  width: 5vw;
  height: 6vh;
  border: 0;
  display: inline-block;
  background: transparent;
}
.theme-select{
  position: absolute;
  display: flex;
  justify-content:space-between;
  width: 70vw;
  height: 30vh;
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translateX(-50%);
}
.theme-select a{
  height: 15vw;
  width: 15vw;
  border: 1px solid black;
}
.theme-select a:active{
  border: 2px solid #1296db;
  box-shadow: 0 0 10px #ddd;
}
.theme-select a img{
  width: 100%;
  height: 100%;
}
</style>
