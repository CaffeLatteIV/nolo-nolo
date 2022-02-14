import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Cookies from 'universal-cookie'
const cookies = new Cookies()


const routes = [
  {
    path: '/admin/',
    name: 'Home',
    component: Home
  },
  {
    path: '/admin/NotFound',
    name: 'Not Found',
    component: ()=> import(/* webpackChunkName: "" */'../views/NotFound.vue')
  },
  {
    path: '/admin/clientList',
    name: 'Client List',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "" */ '../views/ClientList.vue')
  },
  {
    path: '/admin/client/:id',
    name: 'Client Info',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "" */ '../views/ClientInfo.vue'),
    props: true,
  },
  {
    path: '/admin/client/history/:id',
    name: 'Client History',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "" */ '../views/ClientNoleggi.vue'),
    props: true,
  },
  {
    path: '/admin/client/orderFor/:id',
    name: 'Create New Order',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "" */ '../views/NewOrder.vue'),
    props: true,
  },
  {
    path: '/admin/client/modifyBooking/:client/:id',
    name: 'Modify Order',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "" */ '../views/ModifyOrder.vue'),
    props: true,
  },
  {
    path: '/admin/inventory',
    name: 'Inventory',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "" */ '../views/Inventory.vue')
  },
  {
    path: '/admin/newItem',
    name: 'Create New Item',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "" */ '../views/NewItem.vue')
  },
  {
    path: '/admin/item/:id',
    name: 'Modify Item',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "" */ '../views/ModifyItem.vue'),
  },
  {
    path: '/admin/noleggi',
    name: 'Noleggi',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "" */ '../views/Noleggi.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
router.beforeEach((to, from, next)=>{
  const client = cookies.get('client')
  const role = client?.role
  if(to.name === 'Not Found'){
    next()
  }else if( role === 'funzionario' || role === 'manager'){
    next()
  }else{
    next({name:'Not Found'})
  }
})
export default router
