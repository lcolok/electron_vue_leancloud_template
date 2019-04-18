import Vue from 'vue'
import Router from 'vue-router'
import Home from './vue/Home.vue'
import NotFound from './vue/NotFound.vue'
import lotties from './vue/tools/Lotties.vue'
import Upload from './vue/Upload.vue'

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes: [

    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: '首页入口'
      }
    },
    {
      path: '/u',
      name: 'upload',
      component: Upload,
      meta: {
        title: '七牛上传'
      }
    },
    {
      path: '/mescroll',
      name: 'Mescroll',
      meta: {
        title: 'mescroll测试页'
      },
      component: () => {
        import('./vue/Mescroll.vue');

      }
    },
    {
      path: '/lotties',
      name: 'lotties',
      meta: {
        title: 'lotties'
      },
      component: lotties
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      //路线级别代码分隔
      // this generates a separate chunk (about.[hash].js) for this route
      //这将为该路由生成一个单独的块(大约.[hash].js)
      // which is lazy-loaded when the route is visited.
      //当访问路由时，它会进行懒加载加载。
      component: () => import(/* webpackChunkName: "about" */ './vue/About.vue')
    },
    {
      /* Not Found 路由，必须是最后一个路由 */
      path: '*',
      name: 'NotFound',
      component: NotFound,
      meta: {
        title: '404 Not Found'
      }
    },
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})


export default router