<template>
  <div class="container md-01dp mt-4 p-4 rounded">
    <h1>Creazione Nuovo Ordine</h1>
    <div id="newItemForm">
      <div>
        <label for="inventorySelection"
          >Prodotto:
          <select
            name="inventory"
            id="inventorySelection"
            class="form-select"
            v-model="selectedProduct"
          >
            <option disabled value="">Seleziona il prodotto</option>
            <option v-for="item in inventory" :key="item" :value="item.id">
              {{ item.title }}
            </option>
          </select>
        </label>
      </div>
    </div>
  </div>
</template>

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
      selectedProduct: undefined,
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
