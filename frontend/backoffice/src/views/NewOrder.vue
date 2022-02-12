<template>
  <div class="container md-01dp mt-4 p-4 rounded">
    <h1 class="mb-4">Creazione Nuovo Ordine</h1>
    <div id="newItemForm" class="w-50 m-auto">
      <div class="row">
        <div class="col">
          <label for="inventorySelection"
            >Prodotto:
            <select
              name="inventory"
              id="inventorySelection"
              class="form-select"
              v-model="selectedProduct"
            >
              <option disabled value="">Seleziona il prodotto</option>
              <option
                v-for="item in inventory"
                :key="item"
                :value="(product = { code: item.id, title: item.title })"
              >
                {{ item.title }}
              </option>
            </select>
          </label>
        </div>
      </div>
      <div class="col">
        <label for="inventorySelection"
          >Seleziona data:
          <Datepicker v-model="date" range></Datepicker>
        </label>
      </div>
    </div>
    {{ selectedProduct }}
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "universal-cookie";
import Datepicker from "vue3-date-time-picker";
import "vue3-date-time-picker/dist/main.css";

export default {
  name: "NewOrder",
  components: {
    Datepicker,
  },
  data() {
    return {
      date: null,
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
    handleConfirm() {},
  },
};
</script>
