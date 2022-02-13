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
              <span class="col-10 m-0 pt-3 text-end">Certifica noleggio:</span>
              <button
                @click="verifyNoleggio(this.activeRentals[n - 1])"
                class="col-1 material-icons pb-3 bg-transparent border-0 text-white"
              >
                <span v-if="this.activeRentals[n - 1].verifiedRent">check_box_outline</span>
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
import validateAccessToken from '../validateAccessToken.js'

const cookies = new Cookies();
const rentalsURL = process.env.RENTALS_URL || "http://localhost:5000/v1/rentals";
const maintenanceURL = process.env.MAINTENACE_URL || "http://localhost:5000/v1/maintenance";
export default {
  name: "ActiveOrders",
  data() {
    return {
      inventory: [],
      activeRentals: [],
      showAll: false,
    };
  },
  async mounted() {
    await validateAccessToken();
    const accessToken = cookies.get("accessToken");
    axios
      .get(rentalsURL + "/all", {
        headers: { Authorization: "Bearer " + accessToken },
      })
      .then((response) => {
        const today = new Date().getTime()
        this.activeRentals = response.data.rentals.filter(
          (rent) =>
            rent.start <= today && rent.end >= today && rent.status === "Noleggiato"
        );
      });
  },
  methods: {
    formatDate(dateInMilli) {
      return dayjs(dateInMilli).format("DD/MM/YYYY");
    },
    async verifyNoleggio(rental){
      await validateAccessToken();
      const accessToken = cookies.get('accessToken')
      rental.verifiedRent= true
      axios.post(maintenanceURL+'/verify/rent/'+rental.id,{}, {headers:{Authorization:'Bearer '+accessToken}})
    },
  },
};
</script>