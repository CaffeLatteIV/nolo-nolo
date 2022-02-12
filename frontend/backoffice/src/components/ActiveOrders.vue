<template>
  <div v-if="this.activeRentals.length !== 0">
    <button
      @click="showAll = true"
      v-if="!showAll"
      class="p-2 bg-transparent text-white border-0 text-decoration-underline"
    >
      Mostra tutti
    </button>
    <button
      @click="showAll = false"
      v-else
      class="p-2 bg-transparent text-white border-0 text-decoration-underline"
    >
      Riduci
    </button>
    <div v-for="n in this.activeRentals.length" :key="n">
      <div
        v-show="n - 1 < 3 || showAll"
        class="p-2 px-3 border-bottom border-1 border-secondary"
      >
        <div class="row">
          <div class="col-7 p-2">
            <h4 class="m-0 text-wrap text-white">
              {{ this.activeRentals[n - 1].title }}
            </h4>
            <p class="text-white">
              Spesa: {{ this.activeRentals[n - 1].price }}€
            </p>
            <p
              class="text-white"
              v-show="this.activeRentals[n - 1].fidelityPoints > 0"
            >
              Spesa in punti: {{ this.activeRentals[n - 1].fidelityPoints }}€
            </p>
          </div>
          <div class="col-2 p-2 m-0 text-white text-center">
            Da: {{ formatDate(this.activeRentals[n - 1].start) }}&nbsp; A:
            {{ formatDate(this.activeRentals[n - 1].end) }}
          </div>
          <div class="col-3 row pt-2 m-0">
            <div class="row">
              <span class="col-10 m-0 pt-1 text-end">Certifica noleggio:</span>
              <button
                @click="noleggiatoCertificato = !noleggiatoCertificato"
                class="col-1 material-icons bg-transparent border-0 text-white"
              >
                <span v-if="noleggiatoCertificato">check_box_outline</span>
                <span v-else>check_box_outline_blank</span>
              </button>
            </div>
            <div class="row">
              <span class="col-10 m-0 pt-2 text-end"
                >Certifica restituzione:</span
              >
              <button
                @click="restituitoCertificato = !restituitoCertificato"
                class="col-1 material-icons bg-transparent border-0 text-white"
              >
                <span v-if="restituitoCertificato">check_box_outline</span>
                <span v-else>check_box_outline_blank</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button
      @click="showAll = false"
      v-if="showAll === true && activeRentals.length !== 0"
      class="p-2 bg-transparent text-white border-0 text-decoration-underline"
    >
      Riduci
    </button>
  </div>
  <div v-else>
    <p class="p-2 m-0 fs-4">Non ci sono noleggi attivi</p>
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "universal-cookie";
import dayjs from "dayjs";

export default {
  name: "ActiveOrders",
  data() {
    return {
      inventory: [],
      activeRentals: [],
      showAll: false,
      noleggiatoCertificato: false, //da modificare con database changes
      restituitoCertificato: false, //da modificare con database changes
    };
  },
  mounted() {
    this.validateAccessToken();
    const cookies = new Cookies();
    const accessToken = cookies.get("accessToken");

    const rentalsURL =
      process.env.RENTALS_URL || "http://localhost:5000/v1/rentals";

    axios
      .get(rentalsURL + "/all", {
        headers: { Authorization: "Bearer " + accessToken },
      })
      .then((response) => {
        console.log(response.data.rentals);
        const today = new Date().getTime()
        console.log("date ",new Date().getTime())
        this.activeRentals = response.data.rentals.filter(
          (rent) =>
            rent.start <= today && rent.end >= today && rent.status === "Noleggiato"
        );
        console.log("activeRentals ", this.activeRentals);
      });
  },
  methods: {
    formatDate(dateInMilli) {
      return dayjs(dateInMilli).format("DD/MM/YYYY");
    },
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
  },
};
</script>