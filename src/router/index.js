import Vue from 'vue';
import Router from '../vue-router';

Vue.use(Router);

const routes = [{
  path: '/',
  component: () => import('@/components/Parent'),
  children: [{
    path: 'child1',
    component: () => import('@/components/Child1'),
  }, {
    path: '/child2',
    component: () => import('@/components/Child2'),
  }]
}]

const router = new Router({
  routes,
});

export default router;
