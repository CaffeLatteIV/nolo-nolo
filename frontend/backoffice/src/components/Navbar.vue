<template>
  <nav class="navbar navbar-expand md-04dp">
    <div class="container-fluid">
      <router-link
        to="/admin/"
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
            <a class="nav-link text-white" href="http://site202156.tw.cs.unibo.it/"
              >Store</a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link text-white" href="/admin/clientList">Clienti</a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-white" href="/admin/inventory"
              >Inventario</a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link text-white" href="/admin/noleggi">Noleggi</a>
          </li>
          <li v-show="isManager" className="nav-item dropdown">
            <a
              href="#"
              className="nav-link dropdown-toggle text-white"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Statistiche
            </a>
            <ul
              className="dropdown-menu rounded m-0 border-0 md-base p-0"
              aria-labelledby="navbarDropdown"
            >
              <li className="p-2 nav-item md-12dp rounded-top">
                <a
                  className="nav-link text-white"
                  href="https://site202156.tw.cs.unibo.it/frontend/dashboard/HTML/clientStats.html"
                  >Clienti
                </a>
              </li>
              <li className="p-2 nav-item md-12dp rounded-bottom">
                <a
                  className="nav-link text-white"
                  href="https://site202156.tw.cs.unibo.it/frontend/dashboard/HTML/index.html"
                  >Oggetti
                </a>
              </li>
            </ul>
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
                  href="http://site202156.tw.cs.unibo.it/"
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
import Cookies from "universal-cookie";

export default {
  name: "Navbar",
  data() {
    return {
      isManager: false,
    };
  },
  mounted() {
    const cookies = new Cookies();
    const client = cookies.get("client");
    if (client?.role === "manager") {
      this.isManager = true;
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
