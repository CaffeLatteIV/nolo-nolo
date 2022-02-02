<template>
  <div>currently empty</div>
</template>

<script>
import axios from "axios";
import Cookies from "universal-cookie";

export default {
  name: "ActiveOrders",
  data() {
    return {
      loadingInventory: true,
      loadingRentals: true,
      inventory: [],
      activeRentals: [],
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
      .get(rentalsURL + "/getActiveRentals", {
        headers: { Authorization: "Bearer " + accessToken },
      })
      .then((response) => {
        this.loadingRentals = false;
        this.activeRentals = response.data.rentals;
        console.log(this.activeRentals);
      });
  },
};
</script>