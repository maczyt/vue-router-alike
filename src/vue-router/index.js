import * as history from 'history';
import install from './install';
import createMatcher from './create-matcher';

class Router {
  constructor(options) {
    const {
      // 路由模式
      mode = 'hash',
        // 基路径
        // base = '/',
        // // 激活class类名
        // linkActiveClass = 'router-link-active',
        // // routes config
        // routes = [],
    } = options;

    // Router实例属性
    this.app = null; // 配置了router的Vue根实例
    this.mode = mode;

    // 私有属性
    this._options = options;
    if (mode === 'hash') {
      this._history = history.createHashHistory();
    } else if (mode === 'history') {
      this._history = history.createBrowserHistory();
    }
  }

  init(vm) {
    const {
      routes
    } = this._options;
    this.app = vm;
    // 处理routes
    // 一个path对应一个路由record
    this._matcher = createMatcher(routes, this);

    // 初始化
    const location = this._history.location;
    const match = this._matcher.match(location);
    this.app._route = match;
    this.unlisten = this._history.listen((location) => {
      const match = this._matcher.match(location);
      this.app._route = match;
    });
  }

  // Router实例方法
  /* hooks start */
  beforeEach() {
    //
    this
  }

  afterEach() {
    this
  }
  /* hooks end */

  push(location) {
    this._history.push(location)
  }

  replace(location) {
    this._history.replace(location);
  }

  go(n) {
    this._history.go(n);
  }

  back() {
    this._history.goBack();
  }

  forward() {
    this._history.goForward();
  }
}

Router.install = install;

export default Router;
