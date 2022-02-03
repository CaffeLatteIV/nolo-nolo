<template>
  <div v-for="n in this.bookedRentals.length" :key="n">
    <div
      v-show="n - 1 < 3 || showAll"
      class="p-2 px-3 border-bottom border-1 border-secondary"
    >
      <div class="row">
        <div class="col-7 p-2">
          <h4 class="m-0 text-wrap text-white">
            {{ this.bookedRentals[n - 1].title }}
          </h4>
          <p class="text-white">
            Spesa: {{ this.bookedRentals[n - 1].price }}€
          </p>
          <p
            class="text-white"
            v-show="this.bookedRentals[n - 1].fidelityPoints > 0"
          >
            Spesa in punti: {{ this.bookedRentals[n - 1].fidelityPoints }}€
          </p>
        </div>
        <div class="col-3 p-2 m-0 text-white text-center">
          Da: {{ formatDate(this.bookedRentals[n - 1].start) }}&nbsp; A:
          {{ formatDate(this.bookedRentals[n - 1].end) }}
        </div>
        <div class="col-2 row pt-2">
          <div class="col">
            <span class="material-icons">create</span>
          </div>
          <div class="col">
            <span class="material-icons">delete</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <button
    @click="showAll = true"
    v-if="!showAll"
    class="p-2 bg-transparent text-white border-0 text-decoration-underline"
  >
    Mostra tutti
  </button>
  <button
    @click="showAll = false"
    v-if="showAll"
    class="p-2 bg-transparent text-white border-0 text-decoration-underline"
  >
    Riduci
  </button>
</template>

<script>
import axios from "axios";
import Cookies from "universal-cookie";
import dayjs from "dayjs";

export default {
  name: "BookedOrders",
  data() {
    return {
      loadingInventory: true,
      loadingRentals: true,
      inventory: [],
      bookedRentals: [],
      showAll: false,
    };
  },
  mounted() {
    const cookies = new Cookies();
    const accessToken = cookies.get("accessToken");
    const rentalsURL =
      process.env.RENTALS_URL || "http://localhost:5000/v1/rentals";
    const inventoryURL =
      process.env.INVENTORY_URL || "http://localhost:5000/v1/inventories";
    axios
      .get(inventoryURL + "/products", {
        headers: { Authorization: "Bearer " + accessToken },
      })
      .then((response) => {
        this.loadingInventory = false;
        this.inventory = response.data.products;
      });
    axios
      .get(rentalsURL + "/all", {
        headers: { Authorization: "Bearer " + accessToken },
      })
      .then((response) => {
        this.loadingRentals = false;
        this.bookedRentals = response.data.rentals.filter(
          (rent) => rent.status === "Prenotato"
        );
        console.log("bookedRentals ", this.bookedRentals);
      });
  },
  methods: {
    formatDate(dateInMilli) {
      return dayjs(dateInMilli).format("DD/MM/YYYY");
    },
    getProductInfo() {
      const cookies = new Cookies();
      const accessToken = cookies.get("accessToken");
      const inventoryURL =
        process.env.INVENTORY_URL || "http://localhost:5000/v1/inventories";
      axios
        .get(inventoryURL + "/products", {
          headers: { Authorization: "Bearer " + accessToken },
        })
        .then((response) => {
          this.loadingInventory = false;
          this.inventory = response.data.products;
        });
    },
  },
};
</script>