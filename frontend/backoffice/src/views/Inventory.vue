<template>
  <div class="container md-01dp mt-4 rounded p-4">
    <!--Title and addClient button-->
    <div class="px-4 row">
      <div class="col-11">
        <h1 class="py-3 m-0">Inventario</h1>
      </div>
      <div class="col-1 row">
        
        <router-link
          to="/admin/NewItem"
          exact-path
          class="col d-flex justify-content-end py-3 text-decoration-none"
          role="button"
          aria-label="Aggiungi nuovo oggetto"
          title="Aggiungi nuovo oggetto"
        >
          <span class="material-icons text-white rounded fs-1 pt-2"
            >add_box</span
          >
        </router-link>
      </div>
    </div>
    <div class="p-4">
      <ul class="list-group list-group-flush rounded" id="list">
        <li
          class="list-group-item md-04dp border-dark"
          v-for="item in this.inventory"
          :key="item"
        >
          <div class="row px-3 text-white text-decoration-none">
            <div class="col-4 fs-4 py-3">
              {{ item ? item.title : "Nome oggetto mancante" }}
            </div>
            <div class="col-6 py-3 d-flex flex-row-reverse">
              <div v-show="item.hasActiveOrders" class="px-2 pt-2">
                <div class="tag-one rounded px-1 text-black">
                  Prenotazione attiva
                </div>
              </div>
              <div v-show="item.hasBookedOrders" class="p-2">
                <div class="tag-two rounded px-1 text-black">
                  Noleggio in corso
                </div>
              </div>
            </div>
            <div class="col-2 row">
              <router-link
                :to="{ path: '/admin/item/' + item.id }"
                exact-path
                class="col d-flex justify-content-end py-3 text-decoration-none"
                role="button"
                aria-label="Modifica"
                title="Modifica"
              >
                <span class="material-icons text-white rounded p-1"
                  >create</span
                >
              </router-link>
              <button
                class="
                  col
                  d-flex
                  justify-content-end
                  py-3
                  material-icons
                  bg-transparent
                  border-0
                  text-white
                "
                @click="deleteItem(item.id)"
                aria-label="Cancella Oggetto"
                title="Cancella oggetto"
              >
                <span class="material-icons p-1">delete</span>
              </button>
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
import validateAccessToken from "../validateAccessToken.js";

const cookies = new Cookies();

export default {
  name: "Inventory",
  data() {
    return {
      loading: true,
      inventory: [],
      toggleCategory: false,
      addHasSucceded: false,
    };
  },
  mounted() {
    this.getInventory();
  },
  methods: {
    async addCategory(){
      this.addHasSucceded = false
      
      // API request
      this.addHasSucceded = true
    },
    async getInventory() {
      await validateAccessToken();
      const accessToken = cookies.get("accessToken");
      const inventoryURL =
      process.env.INVENTORY_URL || "https://site202156.tw.cs.unibo.it/v1/inventories";
      axios
        .get(inventoryURL + "/products/all", {
          headers: { Authorization: "Bearer " + accessToken },
        })
        .then(async (response) => {
          this.loading = false;
          response.data.products.forEach(async (product) => {
            const { data } = await axios.get(
              inventoryURL + "/status/" + product.id,
              {
                headers: { Authorization: "Bearer " + accessToken },
              }
            );
            const { status } = data;
            product.hasBookedOrders = status?.hasBookedOrders || false;
            product.hasActiveOrders = status?.hasActiveOrders || false;
            this.inventory.push(product);
          });
        });
    },
    async deleteItem(id) {
      await validateAccessToken();
      const accessToken = cookies.get("accessToken");
      const inventoryURL =
        process.env.INVENTORY_URL || "https://site202156.tw.cs.unibo.it/v1/inventories";
      await axios.delete(inventoryURL + "/delete/" + id, {
        headers: { Authorization: "Bearer " + accessToken },
      });
      this.inventory = this.inventory.filter((item) => item.id !== id);
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