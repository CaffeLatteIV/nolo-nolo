<template>sono vuoto</template>

<script>
import axios from "axios";
import Cookies from "universal-cookie";

export default {
  name: "NewOrder",
  data() {
    return {
      loading: true,
      inventory: [],
      clientCode: this.$route.params.id,
    };
  },
  async mounted() {
    this.getInventory();
  },
  methods: {
    getInventory() {
      const cookies = new Cookies();
      const accessToken = cookies.get("accessToken");
      const inventoryURL =
        process.env.INVENTORY_URL || "http://localhost:5000/v1/inventories";
      axios
        .get(inventoryURL + "/products", {
          headers: { Authorization: "Bearer " + accessToken },
        })
        .then((response) => {
          this.loading = false;
          this.inventory = response.data.products;
          console.log(this.inventory);
        });
    },
  },
};
</script>
