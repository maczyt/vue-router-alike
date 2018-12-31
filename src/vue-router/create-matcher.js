import pathRegexp from 'path-to-regexp';

export default function createMatcher(routes, router) {
  router;
  // record
  /**
   * fullpath
   * hash
   * matched 匹配到的components，遍历替换<router-view />
   * meta
   * params
   * path
   * query
   */
  const {
    pathList,
    pathMap
  } = createRouteMap(routes);

  /**
   * 获取当前path匹配到的路由
   * @param {*} raw location path
   * @param {*} currentRoute
   * @param {*} redirectedFrom
   */
  function match(raw, currentRoute, redirectedFrom) {
    pathList;
    pathMap;
    // 不使用route的name来处理，使用path来处理
    const location = Object.assign({}, raw);
    // console.log()
    location.path = location.pathname;
    location.params = {};
    for (const path of pathList) {
      const record = pathMap.get(path);
      if (matchRoute(record.regex, location.path)) {
        return _createRoute(record, location, redirectedFrom);
      }
    }
    // no match
    return _createRoute(null, location);
  }

  /**
   * path匹配哪个record对象
   * @param {*} regex
   * @param {*} path
   * @param {*} params
   */
  function matchRoute(regex, path) {
    const m = path.match(regex);
    if (!Boolean(m)) {
      return false;
    }
    return true;
  }

  function _createRoute(record, location, redirectedFrom) {
    if (record && record.redirect) {
      // return ;
    }
    const search = location.search.replace(/^\?/, '').split('&');
    const query = search.reduce((memo, item) => {
      const key = item.split('=')[0];
      const value = item.split('=')[1];
      if (Boolean(key)) {
        return { ...memo,
          key: value
        };
      }
      return memo;
    }, {});
    const route = {
      meta: (record && record.meta) || {},
      path: location.path || '/',
      hash: location.hash || '',
      query,
      params: {},
      fullpath: location.path || '/',
      matched: record ? formatMatch(record) : [], // 非常重要的属性
    };
    if (redirectedFrom) {
      // 钩子函数中，from
    }
    // 冻结，防止修改
    return Object.freeze(route);
  }

  /**
   * 如果有parent，把parent拍进数组
   * @param {*} record
   */
  function formatMatch(record) {
    const res = [];
    while (record) {
      res.unshift(record);
      record = record.parent;
    }
    return res;
  }

  return {
    match,
    // addRoutes
  }
}

// 不支持addRoutes方法
function createRouteMap(routes) {
  const pathList = []; // 使用数组，便于遍历
  const pathMap = new Map(); // 使用hash，便于读取
  const nameMap = new Map(); // 每个路由config设置name
  // 所以可以通过name来获取，不过我觉得可能会有同名情况, 还是推迟path来获取，这里就不会支持，仅当route对象的一个属性

  nameMap;

  routes.forEach(route => {
    routeToRecord(pathList, pathMap, route);
  });

  return {
    pathList,
    pathMap,
  }
}

/**
 * route对象 -> record对象
 * @param {*} pathList
 * @param {*} pathMap
 * @param {*} route 当前路由对象
 * @param {*} parent
 * @param {*} matchAs
 */
function routeToRecord(pathList, pathMap, route, parent, matchAs) {
  const {
    path
  } = route;
  const normalizedPath = normalizePath(path, parent);
  const record = {
    path: normalizedPath,
    regex: compileRouteRegex(normalizedPath),
    components: route.components || {
      default: route.component
    },
    parent,
    matchAs, // 感觉用不上, alias ?
    redirect: route.redirect,
    meta: route.meta || {},
    // props 用的比较少
    // beforeEnter
  };

  // 处理子路由, 类似于vue.js处理指令元素一样
  // 深度优先遍历, 递归调用
  if (route.children) {
    route.children.forEach(child => {
      const childMatchAs = matchAs ? `${matchAs}/${child.path}` : undefined;
      routeToRecord(pathList, pathMap, child, record, childMatchAs);
    });
  }
  // 说明前面定义了，后面再定义相同的，后面的不会生效
  if (!pathMap.has(record.path)) {
    pathList.push(record.path);
    pathMap.set(record.path, record);
  }
}

/**
 * 得到完整的path(以'/'开头的path)
 * @param {} path
 * @param {*} parent
 */
function normalizePath(path, parent) {
  /* /hello/ -> /hello */
  path = path.replace(/\/$/, '');

  if (path.startsWith('/')) {
    // 直接作为完整的path, 定义子路由时候，就不需要再拼接父路由的path了
    return path;
  }
  if (!Boolean(parent)) {
    // 没有父路由，说明是顶级路由
    return Boolean(path) ? path : '/';
  }
  return `${parent.path}/${path}`.replace(/\/\//g, '/');
}

/**
 * 正则匹配path - 使用path-to-regexp
 * @param {*} path
 */
function compileRouteRegex(path) {
  const regexp = pathRegexp(path, []);
  return regexp;
}
