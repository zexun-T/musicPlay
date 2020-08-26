<template>
  <div id="app">
    <img
      src="https://s1.ax1x.com/2020/08/18/dnU43t.jpg"
      alt=""
      id="wap-img"
      ref="wapImg"
    >

    <transition name="go">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>

  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#wap-img {
  opacity: 0.8;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100vw;
  height: 100%;
  background-size: cover;
  filter: blur(10px);
  z-index: -9999;
  transition: all 1s linear;
}
.go-enter-to {
  opacity: 1;
}
.go-enter {
  opacity: 0;
}
.go-enter-active {
  transition: 1.5s;
}
.go-leave-to {
  opacity: 0;
}
.go-leave {
  opacity: 1;
}
.go-leave-active {
  transition: 1.5s;
}
</style>
