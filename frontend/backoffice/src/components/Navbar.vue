<template>
  <nav class="navbar navbar-expand md-04dp">
    <div class="container-fluid">
      <router-link
        v-if="authorized"
        to="/admin/"
        class="navbar-brand text-white"
        title="Menù principale"
      >
        <h2>NOLONOLO</h2>
      </router-link>
      <a
        v-else
        href="https://site202156.tw.cs.unibo.it/"
        class="navbar-brand text-white"
        title="Menù principale"
        >
        <h2>NOLONOLO</h2>
      </a>
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
      <div class="collapse navbar-collapse" id="navbarText" v-if="authorized">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <a class="nav-link text-white" href="https://site202156.tw.cs.unibo.it/"
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
                  href="https://site202156.tw.cs.unibo.it/dashboard/clienti"
                  >Clienti
                </a>
              </li>
              <li className="p-2 nav-item md-12dp rounded-bottom">
                <a
                  className="nav-link text-white"
                  href="https://site202156.tw.cs.unibo.it/dashboard/oggetti"
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
                <button
                  class="dropdown-item md-error rounded text-white"
                  id="logout"
                  @click="logout"
                  >Esci</button>
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
const cookies = new Cookies();

export default {
  name: "Navbar",
  data() {
    return {
      isManager: false,
      authorized:true,
    };
  },
  mounted() {
    const client = cookies.get("client");
    const role = client?.role
    if(!role){
      this.authorized=false;

    }else if (role && role === "manager") {
      this.authorized=true;
      this.isManager = true;
    }
  },
  methods: {
    logout(){
      cookies.remove('client',{path:'/'})
      cookies.remove('refreshToken',{path:'/'})
      cookies.remove('accessToken',{path:'/'})
      window.location.href="https://site202156.tw.cs.unibo.it/"
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
