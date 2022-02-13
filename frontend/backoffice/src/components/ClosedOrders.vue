<template>
  <div v-if="this.closedRentals.length !== 0">
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
    <div v-for="n in this.closedRentals.length" :key="n">
      <div
        v-show="n - 1 < 3 || showAll"
        class="p-2 px-3 border-bottom border-1 border-secondary"
      >
        <div class="row">
          <div class="col-7 p-2">
            <div class="d-flex">
              <h4 class="m-0 text-wrap text-white pe-2">
                {{ this.closedRentals[n - 1].title }}
              </h4>
              <div
                class="rounded bg-site-primary px-2 text-black"
                v-show="this.closedRentals[n - 1].status === 'Pagato'"
              >
                Pagato
              </div>
            </div>
            <p class="text-white">
              Spesa: {{ this.closedRentals[n - 1].price }}€
            </p>
            <p
              class="text-white"
              v-show="this.closedRentals[n - 1].fidelityPoints > 0"
            >
              Spesa in punti: {{ this.closedRentals[n - 1].fidelityPoints }}€
            </p>
          </div>
          <div class="col-2 p-2 m-0 text-white text-center">
            Da: {{ formatDate(this.closedRentals[n - 1].start) }}&nbsp; A:
            {{ formatDate(this.closedRentals[n - 1].end) }}
          </div>
          <div class="col-3 row pt-2 m-0">
            <div class="row">
              <span class="col-10 m-0 pt-3 text-end"
                >Certifica restituzione:</span
              >
              <button
                @click="verifyRestituzione(this.closedRentals[n - 1])"
                class="col-1 material-icons pb-3 bg-transparent border-0 text-white"
              >
                <span v-if="this.closedRentals[n - 1].verifiedReturn">check_box_outline</span>
                <span v-else>check_box_outline_blank</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button
      @click="showAll = false"
      v-if="showAll === true && closedRentals.length !== 0"
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

const cookies = new Cookies();
const rentalsURL = process.env.RENTALS_URL || "http://localhost:5000/v1/rentals";
const maintenanceURL = process.env.MAINTENACE_URL || "http://localhost:5000/v1/maintenance";

export default {
  name: "ClosedOrders",
  data() {
    return {
      loadingInventory: true,
      loadingRentals: true,
      inventory: [],
      closedRentals: [],
      showAll: false,
      noleggiatoCertificato: false, //da modificare con database changes
      restituitoCertificato: false, //da modificare con database changes
    };
  },
  async mounted() {
    await this.validateAccessToken();
    const accessToken = cookies.get("accessToken");
    axios
      .get(rentalsURL + "/all", {
        headers: { Authorization: "Bearer " + accessToken },
      })
      .then((response) => {
        this.loadingRentals = false;
        this.closedRentals = response.data.rentals.filter(
          (rent) => rent.end < new Date().getTime()
        );
      });
  },
  methods: {
    async verifyRestituzione(rent){
      await this.validateAccessToken();
      const accessToken = cookies.get('accessToken')
      console.log(accessToken)
      const {data} = await axios.post(maintenanceURL+'/verify/return/'+rent.id,{}, {headers:{Authorization:'Bearer '+accessToken}})
      console.log(data.verifiedReturn)
      if (data.verifiedReturn){
        rent.verifiedReturn = true
      }
    },
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