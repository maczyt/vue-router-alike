<template>
  <component v-bind:is="renderComponent"></component>
</template>

<script>
export default {
  name: "router-view",
  data() {
    return {
      routerView: true,
      renderComponent: null
    };
  },
  props: {
    name: {
      type: String,
      default: "default" // 默认渲染components.default
    }
  },
  created() {
    this.handleRender();
  },
  methods: {
    handleRender() {
      let parent = this.$parent;

      // 匹配matched中的第几个，这也就是我们为什么要把父路由存到matched中
      let depth = 0;
      // 从当前组件一直遍历处理到根组件
      while (parent && parent._routerRoot !== parent) {
        if (parent.routerView) {
          depth++;
        }
        parent = parent.$parent;
      }

      try {
        const route = this.$route;
        const match = route.matched[depth];
        const components = match.components;
        const component = components[this.name];
        this.renderComponent = component;
      } catch (e) {
        this.renderComponent = null;
      }
    }
  },
  watch: {
    $route() {
      this.handleRender();
    }
  }
};
</script>
