<template>
  <component @click="onClick" :is="tag" :href="'/sss'">
    <slot />
  </component>
</template>

<script>
export default {
  name: "router-link",
  props: {
    to: {
      type: String,
      required: true
    },
    tag: {
      type: String,
      default: "a"
    }
  },
  methods: {
    onClick(event) {
      event.preventDefault();
      this.$router.push(this.to);
    }
  }
};
</script>
