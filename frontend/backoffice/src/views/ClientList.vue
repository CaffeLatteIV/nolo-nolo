<template>
  <div class="container md-01dp mt-4 rounded p-4">
    <!--Title and addClient button-->
    <div class="px-4">
      <h1 class="py-3 m-0">Lista Clienti</h1>
    </div>
    <div class="p-4">
      <ul
        class="list-group list-group-flush rounded"
        id="list"
        v-if="dataLoaded"
      >
        <li
          class="list-group-item md-04dp border-dark"
          v-for="client in this.clientList"
          :key="client"
        >
          <div class="row px-3 text-white">
            <div class="col-4 fs-4 py-3">
              {{
                client ? client.name + " " + client.surname : "Nome mancante"
              }}
            </div>
            <div class="col-6 py-3 d-flex flex-row-reverse">
              <div v-show="client.hasBookings" class="px-2 pt-2">
                <div class="tag-one rounded px-1 text-black">
                  Prenotazione attiva
                </div>
              </div>
              <div v-show="client.hasActiveOrders" class="p-2">
                <div class="tag-two rounded px-1 text-black">
                  Noleggio in corso
                </div>
              </div>
            </div>
            <div class="col-2 row">
              <router-link
                :to="{ path: '/admin/client/' + client.id }"
                exact-path
                class="col d-flex justify-content-end py-3 text-decoration-none"
                role="button"
                aria-label="Aggiungi nuovo cliente"
                title="Modifica informazioni dell'utente"
              >
                <span class="material-icons text-white rounded p-1"
                  >create</span
                >
              </router-link>
              <router-link
                :to="{ path: '/admin/client/history/' + client.id }"
                exact-path
                class="col d-flex justify-content-end py-3 text-decoration-none"
                role="button"
                aria-label="Vedi ordini"
                title="Vedi ordini"
              >
                <span class="material-icons text-white rounded p-1"
                  >history</span
                >
              </router-link>
              <button
                class="
                  col
                  d-flex
                  justify-content-end
                  py-3
                  material-icons
                  bg-transparent
                  border-0
                "
                title="Rimuovi Cliente"
                type="button"
                :disabled="client.hasBookings || client.hasActiveOrders"
              >
                <span class="material-icons p-1">delete</span>
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "universal-cookie";

export default {
  name: "ClientList",
  data() {
    return {
      dataLoaded: false,
      clientList: [],
    };
  },
  async mounted() {
    const cookies = new Cookies();
    const accessToken = cookies.get("accessToken");
    console.log(accessToken);
    console.log(cookies.get("client"));
    const rentalsURL =
      process.env.RENTALS_URL || "https://site202156.tw.cs.unibo.it/v1/rentals";
    const clientURL =
      process.env.CLIENT_URL || "https://site202156.tw.cs.unibo.it/v1/clients";
    const { data } = await axios.get(clientURL + "/lookup", {
      headers: { Authorization: "Bearer " + accessToken },
    });
    const response = await axios.get(rentalsURL + "/all", {
      headers: { Authorization: "Bearer " + accessToken },
    });
    data.clients.forEach((client) => {
      client.hasActiveOrders = this.checkForActive(
        client.id,
        response.data.rentals
      );
      client.hasBookings = this.checkForBookings(
        client.id,
        response.data.rentals
      );
      this.clientList.push(client);
    });
    this.dataLoaded = true;
  },
  methods: {
    async validateAccessToken() {
      const cookies = new Cookies();
      const accessToken = cookies.get("accessToken");
      const URL = process.env.TOKEN_URL || "https://site202156.tw.cs.unibo.it/v1/token";
      try {
        const { data } = await axios.post(`${URL}/validate`, { accessToken });
        if (data.code !== 200) {
          const refreshToken = cookies.get("refreshToken");
          const res = await axios.post(`${URL}/refresh`, { refreshToken });
          cookies.remove("accessToken", { path: "/" });
          cookies.set("accessToken", res.data.accessToken, {
            path: "/",
            sameSite: "Lax",
          });
        }
      } catch (err) {
        console.log("Refresh Token Error");
      }
    },
    checkForBookings(id, rentalsAll) {
      // Behaviour: ciclare per tutti i rentals, controllare se c'è un clientCode che corrisponde all'id
      return (
        rentalsAll.filter(
          (rent) => rent.clientCode === id && rent.start > new Date().getTime()
        ).length > 0
      );
    },  
    checkForActive(id, rentalsAll) {
      // Behaviour: ciclare per tutti i rentals, controllare se c'è un clientCode che corrisponde all'id
      return (
        rentalsAll.filter(
          (rent) => rent.clientCode === id && rent.start <= new Date().getTime() && rent.end >= new Date().getTime()
        ).length > 0
      );
    },
  },
};
</script>

<style scoped>
.tag-one {
  background: #bb86fc;
}
.tag-two {
  background: #03dac5;
}
.tag-three {
  background: purple;
}
button{
  color:white;
}
button:disabled {
  color:grey;
}
</style>