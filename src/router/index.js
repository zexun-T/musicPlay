import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home'
import Search from '../components/Search'
import Play from '../components/Play'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/search',
    name: 'search',
    component: Search,
    children: [
      {
        path: '/play',
        name: 'play',
        component: Play
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
export default router
