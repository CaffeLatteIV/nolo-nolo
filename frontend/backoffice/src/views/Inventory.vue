<template>
  <div class="container md-01dp mt-4 rounded p-4">
    <!--Title and addClient button-->
    <div class="px-4 row">
      <div class="col-11">
        <h1 class="py-3 m-0">Inventario</h1>
      </div>
      <div class="col-1">
        <router-link
          to="/admin/NewItem"
          exact-path
          class="d-flex justify-content-end py-3 text-decoration-none"
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
        <!--Cancellare questa lista fatta esclusivamente per demo, sia lista che nomi vanno inseriti con injection-->
        <li
          class="list-group-item md-04dp border-dark"
          v-for="n in this.inventory.length"
          :key="n"
        >
          <a
            href="http://127.0.0.1:3000/product"
            class="text-white text-decoration-none"
          >
            <div class="row px-3">
              <div class="col-4 fs-4 py-3">
                {{
                  this.inventory[n - 1]
                    ? this.inventory[n - 1].title
                    : "Nome oggetto mancante"
                }}
              </div>
              <div class="col-7 py-3 d-flex flex-row-reverse">
                <div v-show="1 === 1" class="px-2 pt-2">
                  <div class="tag-one rounded px-1 text-black">
                    Prenotazione attiva
                  </div>
                </div>
                <div v-show="2 === 2" class="p-2">
                  <div class="tag-two rounded px-1 text-black">
                    Noleggio in corso
                  </div>
                </div>
              </div>
              <div class="col-1">
                <router-link
                  :to="{path: '/admin/item/' + this.inventory[n-1].id}"
                  exact-path
                  class="d-flex justify-content-end py-3 text-decoration-none"
                  role="button"
                  aria-label="Modifica"
                  title="Modifica"
                >
                  <span class="material-icons text-white rounded p-1"
                    >create</span
                  >
                </router-link>
              </div>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "universal-cookie";

export default {
  name: "Inventory",
  data() {
    return {
      loading: true,
      inventory: [],
    };
  },
  mounted() {
    const cookies = new Cookies();
    const accessToken = cookies.get("accessToken");
    const inventoryURL =
      process.env.INVENTORY_URL || "http://localhost:8000/v1/inventories";
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