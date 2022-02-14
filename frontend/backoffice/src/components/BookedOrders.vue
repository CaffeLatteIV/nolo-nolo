<template>
  <div v-if="this.bookedRentals.length !== 0">
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
              Spesa in punti: {{ this.bookedRentals[n - 1].fidelityPoints }}
            </p>
          </div>
          <div class="col-3 p-2 m-0 text-white text-center">
            Da: {{ formatDate(this.bookedRentals[n - 1].start) }}&nbsp; A:
            {{ formatDate(this.bookedRentals[n - 1].end) }}
          </div>
          <div class="col-2 row pt-2">
            <router-link
              :to="{
                path:
                  '/admin/client/modifyBooking/' +
                  this.bookedRentals[n - 1].clientCode +
                  '/' +
                  this.bookedRentals[n - 1].id,
              }"
              exact-path
              class="col text-decoration-none"
              role="button"
              aria-label="Modifica ordine"
              title="Modifica ordine"
            >
              <span class="material-icons text-white">create</span>
            </router-link>
            <div class="col">
              <button
                class="col-1 material-icons bg-transparent border-0 text-white"
                @click="deleteBooking(this.bookedRentals[n - 1].id)"
                aria-label="Cancella Prenotazione"
                title="Cancella prenotazione"
              >
                <span class="material-icons">delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button
      @click="showAll = false"
      v-if="showAll === true && bookedRentals.length !== 0"
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
import validateAccessToken from "../validateAccessToken.js";

const cookies = new Cookies();

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
    this.getBookedRentals();
  },
  methods: {
    formatDate(dateInMilli) {
      return dayjs(dateInMilli).format("DD/MM/YYYY");
    },
    async getBookedRentals() {
      await validateAccessToken();
      const accessToken = cookies.get("accessToken");
      const rentalsURL =
        process.env.RENTALS_URL || "https://site202156.tw.cs.unibo.it/v1/rentals";
      const inventoryURL =
        process.env.INVENTORY_URL || "https://site202156.tw.cs.unibo.it/v1/inventories";
      axios
        .get(inventoryURL + "/products/all", {
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
          this.bookedRentals = response.data.rentals
            .filter((rent) => rent.start > new Date().getTime())
            .sort((a, b) => a.start - b.start);
        });
    },
    async deleteBooking(id) {
      await validateAccessToken();
      const accessToken = cookies.get("accessToken");
      const rentalURL =
        process.env.RENTALS_URL || "https://site202156.tw.cs.unibo.it/v1/rentals";
      axios
        .post(
          rentalURL + "/delete/" + id,
          {},
          {
            headers: { Authorization: "Bearer " + accessToken },
          }
        )
        .then((response) => {
          if (response.data.code !== 500 && response.data.code !== 404) {
            this.getBookedRentals();
          }
        });
    },
  },
};
</script>