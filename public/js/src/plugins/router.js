import Vue from 'vue'
import Router from 'vue-router'
import routeCheck from '@/middleware/routeCheck';

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '*',
            redirect: '/not-found'
        }, {
            path: '/not-found',
            name: 'not-found',
            meta: {
                layout: 'Blank'
            },
            component: () => import(/* webpackChunkName: 'not-found' */ '@/views/not-found')
        }, {
            path: '/index.html',
            name: 'home',
            meta: {
                layout: 'Default'
            },
            component: () => import(/* webpackChunkName: 'home' */ '@/views/home')
        }
    ]
})

router.beforeEach(routeCheck)
export default router