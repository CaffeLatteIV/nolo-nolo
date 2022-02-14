<template>
  <div class="container md-01dp mt-4 p-4 rounded">
    <h1 class="text-center mb-4">Creazione Nuovo Ordine</h1>
    <div id="newItemForm" class="w-50 m-auto" :key="posted">
      <div class="row">
        <div class="col">
          <label for="inventorySelection" class="form-label p-2 w-100">
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
            Prodotto
          </label>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <label class="form-label p-2 w-100" for="inventorySelection">
            <Datepicker
              v-model="date"
              range
              class="w-100"
            ></Datepicker>
            Seleziona data
          </label>
        </div>
        <div class="col">
          <label for="inputCodiceSconto" class="form-label p-2 w-100">
            <input
              type="text"
              id="inputCodiceSconto"
              class="form-control rounded text-white border-0 w-100 m-0"
              v-model="coupon"
            />
            Inserire codice sconto
          </label>
        </div>
      </div>
      <div class="row p-2 mb-4">
        <div class="col-9">
          <div v-if="selectedProduct === undefined && !hasReceipt">
            Prodotto non ancora selezionato
          </div>
          <div v-else-if="date === null && !hasReceipt">
            Date ancora non selezionate
          </div>
          <div v-show="hasReceipt">Prezzo da pagare: {{ receipt.price }}€</div>
        </div>
      </div>
      <div class="px-2" v-if="!hasReceipt">
        <button
          type="submit"
          class="bg-site-primary border-0 mb-4 rounded px-4 py-1 w-100"
          @click="getReceipt"
        >
          Prendi ricevuta
        </button>
        <p
          class="text-center w-100 pb-4 error"
          v-show="datesUnavailable"
          :key="datesUnavailable"
        >
          Date selezionate non disponibili
        </p>
      </div>
      <div class="px-2" v-else>
        <button
          type="submit"
          class="bg-site-primary border-0 mb-4 rounded px-4 py-1 w-100"
          @click="handleConfirm"
        >
          Crea
        </button>
        <p class="text-center w-100 pb-4 added" v-show="posted" :key="posted">
          Ordine creato con successo!
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "universal-cookie";
import Datepicker from "vue3-date-time-picker";
import "@/assets/css/datepicker.css";
import validateAccessToken from "../validateAccessToken.js";

const cookies = new Cookies();

export default {
  name: "NewOrder",
  components: {
    Datepicker,
  },
  data() {
    return {
      posted: false,
      hasReceipt: false,
      coupon: " ",
      date: null,
      loading: true,
      inventory: [],
      clientCode: this.$route.params.id,
      selectedProduct: undefined,
      receipt: [],
      state: null,
      end: null,
      datesUnavailable: false,
    };
  },
  async mounted() {
    this.getInventory();
  },
  methods: {
    setDefaultValues() {
      this.selectedProduct = undefined;
      this.date = null;
      this.coupon = "";
      this.hasReceipt = false;
    },
    async getInventory() {
      await validateAccessToken();
      const accessToken = cookies.get("accessToken");
      const inventoryURL =
        process.env.INVENTORY_URL || "https://site202156.tw.cs.unibo.it/v1/inventories";
      axios
        .get(inventoryURL + "/products", {
          headers: { Authorization: "Bearer " + accessToken },
        })
        .then((response) => {
          this.loading = false;
          this.inventory = response.data.products;
        });
    },
    async getReceipt() {
      const accessToken = cookies.get("accessToken");
      this.start = new Date(this.date[0]).getTime();
      this.end = new Date(this.date[1]).getTime();
      const rentalBody = {
        start: this.start,
        end: this.end,
        productCode: this.selectedProduct.code,
        clientCode: this.clientCode,
      };
      const rentalURL =
        process.env.RENTAL_URL || "https://site202156.tw.cs.unibo.it/v1/rentals";
      const { data } = await axios.post(rentalURL + "/receipt", rentalBody, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-type": "application/json",
        },
        validateStatus: false,
      });
      if (data.code === 402) {
        this.datesUnavailable = true;
      } else {
        this.receipt = data.receipt;
        this.hasReceipt = true;
      }
    },
    async handleConfirm() {
      await validateAccessToken();
      const accessToken = cookies.get("accessToken");
      const rentalURL =
        process.env.RENTAL_URL || "https://site202156.tw.cs.unibo.it/v1/rentals";
      await axios.post(
        rentalURL + "/add",
        { rentalInfo: this.receipt },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-type": "application/json",
          },
        }
      );
      this.setDefaultValues();
      this.posted = true;
    },
  },
};
</script>

<style scoped>
.added {
  color: #92ff51;
}
.error {
  color: red;
}
</style>