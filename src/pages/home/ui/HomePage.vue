<template>
  <section class="hero">
    <p class="eyebrow">ЛАБОРАТОРНА РОБОТА №5</p>
    <h1>Vue Router, Repository та JWT</h1>
    <p>
      SPA для керування користувачами DummyJSON: маршрутизація, CRUD,
      авторизація, guards і валідація форм.
    </p>
    <div class="d-flex gap-2">
      <RouterLink class="btn btn-primary" to="/users"
        >Перейти до користувачів</RouterLink
      ><a
        class="btn btn-outline-dark"
        href="https://github.com/Chico123412/vue-lottery-app"
        target="_blank"
        >GitHub</a
      >
    </div>
  </section>
  <section class="features">
    <article>
      <b>Vue 3 + TypeScript</b><span>Composition API та Pinia</span>
    </article>
    <article>
      <b>Vue Router</b><span>Lazy routes, guards, layouts</span>
    </article>
    <article>
      <b>Repository + JWT</b><span>API services та refresh token</span>
    </article>
  </section>
</template>
