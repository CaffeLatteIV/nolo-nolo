<template>
  <nav class="navbar navbar-expand md-04dp">
    <div class="container-fluid">
      <router-link
        to="/"
        class="navbar-brand text-white"
        title="Menù principale"
      >
        <h2>NOLONOLO</h2>
      </router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarText"
        aria-controls="navbarText"
        aria-expanded="false"
        aria-label="Apri pannello di navigazione"
      >
        <span class="navbar-toggler-icon" />
      </button>
      <div class="collapse navbar-collapse" id="navbarText">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <a class="nav-link text-white" href="http://127.0.0.1:3000/">Store</a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-white" href="/admin/clientList">Clienti</a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-white" href="/admin/inventory">Inventario</a>
          </li>
        </ul>
      </div>
      <div class="collapse navbar-collapse" id="navbarText">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item dropstart">
            <a
              href="#"
              class="nav-link dropstart-toggle"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              title="Account"
            >
              <span class="material-icons text-white">person</span>
            </a>
            <ul
              class="dropdown-menu rounded m-0 border-0 md-base p-0"
              aria-labelledby="navbarDropdown"
            >
              <li class="p-2 rounded md-24dp">
                <a
                  class="dropdown-item md-error rounded text-white"
                  id="logout"
                  href="http://127.0.0.1:3000/"
                  >Esci</a
                >
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
