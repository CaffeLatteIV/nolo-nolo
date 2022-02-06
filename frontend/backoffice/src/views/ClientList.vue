<template>
  <div class="container md-01dp mt-4 rounded p-4">
    <!--Title and addClient button-->
    <div class="px-4">
      <h1 class="py-3 m-0">Lista Clienti</h1>
    </div>
    <div class="p-4">
      <ul class="list-group list-group-flush rounded" id="list" v-if="!loading">
        <li
          class="list-group-item md-04dp border-dark"
          v-for="n in this.clientList.length"
          :key="n"
        >
          <div class="row px-3 text-white">
            <div class="col-4 fs-4 py-3">
              {{
                this.clientList[n - 1]
                  ? this.clientList[n - 1].name +
                    " " +
                    this.clientList[n - 1].surname
                  : "Nome mancante"
              }}
            </div>
            <div class="col-7 py-3 d-flex flex-row-reverse">
              <div v-if="checkForBookings(n - 1)" class="px-2 pt-2">
                <div class="tag-one rounded px-1 text-black">
                  Prenotazione attiva
                </div>
              </div>
              <div v-show="2 === 2" class="p-2">
                <div class="tag-two rounded px-1 text-black">
                  Noleggio in corso
                </div>
              </div>
            </div>
            <div class="col-1">
              <router-link
                :to="{ path: '/admin/client/' + this.clientList[n - 1].id }"
                exact-path
                class="d-flex justify-content-end py-3 text-decoration-none"
                role="button"
                aria-label="Aggiungi nuovo cliente"
                title="Modifica informazioni dell'utente"
              >
                <span class="material-icons text-white rounded p-1"
                  >create</span
                >
              </router-link>
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
      loading: true,
      clientList: [],
      clientNumber: 0,
      rentalsAll: [],
    };
  },
  mounted() {
    const cookies = new Cookies();
    const accessToken = cookies.get("accessToken");
    console.log(accessToken);
    console.log(cookies.get("client"));
    const rentalsURL =
      process.env.RENTALS_URL || "http://localhost:5000/v1/rentals";
    const clientURL =
      process.env.CLIENT_URL || "http://localhost:5000/v1/clients";
    axios
      .get(clientURL + "/lookup", {
        headers: { Authorization: "Bearer " + accessToken },
      })
      .then((response) => {
        this.loading = false;
        this.clientList = response.data.clients;
      });
    axios
      .get(rentalsURL + "/all", {
        headers: { Authorization: "Bearer " + accessToken },
      })
      .then((response) => {
        this.loading = false;
        this.rentalsAll = response.data.rentals;
        console.log("rentals", this.rentalsAll[0]);
        console.log("client", this.clientList);
      });
  },
  methods: {
    async validateAccessToken() {
      const cookies = new Cookies();
      const accessToken = cookies.get("accessToken");
      const URL = process.env.TOKEN_URL || "http://localhost:5000/v1/token";
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
    async checkForBookings(n) {
      // Behaviour: ciclare per tutti i rentals, controllare se c'è un clientCode che corrisponde all'id
      await this.validateAccessToken();
      console.log(n);
      const cookies = new Cookies();
      const accessToken = cookies.get("accessToken");
      const id = this.clientList[n].id;
      const rentalsURL =
        process.env.RENTALS_URL || "http://localhost:5000/v1/rentals";
      axios
        .get(rentalsURL + "/clients/" + id, {
          headers: { Authorization: "Bearer " + accessToken },
        })
        .then((response) => {
          console.log(response.data.rentals)
          if (
            response.data.rentals.filter((rent) => rent.clientCode === id)
              .length === 0
          ) {
            return false;
          } else {
            return true;
          }
        });
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
</style>