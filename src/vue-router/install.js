import RouterLink from './components/link';
import RouterView from './components/view';

let Vue;

/**
 * Vue插件开发 - install
 * Vue.use() 使用的使用会执行
 * @param {*} _Vue
 */
export default function install(_Vue) {
  // 避免执行多次Vue.use
  if (Vue && Vue === _Vue) {
    return;
  }
  Vue = _Vue;
  applyMixin(Vue);

  Object.defineProperty(Vue.prototype, '$router', {
    get() {
      return this._routerRoot._router;
    }
  });
  Object.defineProperty(Vue.prototype, '$route', {
    get() {
      return this._routerRoot._route;
    }
  });
  Vue.component('RouterView', RouterView);
  Vue.component('RouterLink', RouterLink);
}

function applyMixin(Vue) {
  Vue.mixin({
    beforeCreate() {
      const options = this.$options;
      if (options.router) {
        this._routerRoot = this;
        this._router = options.router;
        Vue.util.defineReactive(this, '_route', {});
        // 回填app
        this._router.init(this);
        // const router = this._router;
        // router.app = this;
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
      }
    },
    destroyed() {
      const options = this.$options;
      // 根实例
      if (options.router) {
        this.$router.unlisten();
      }
    },
  });
}
