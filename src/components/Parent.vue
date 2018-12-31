<template>
  <div>
    <h1>App</h1>
    <ul>
      <li><router-link to="/child1">child1 link</router-link></li>
      <li><router-link to="/child2">child2 link</router-link></li>
    </ul>
    <br />
    <router-view />
  </div>
</template>
