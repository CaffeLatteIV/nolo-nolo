<template>
  <div class="container mt-4 rounded md-01dp">
    <h1 class="p-4 text-center">Modifica Oggetto</h1>
    <div class="w-50 m-auto" id="newItemForm">
      <div class="row">
        <div class="col">
          <label for="image" class="form-label p-2 w-100">
            <input
              type="file"
              class="form-control"
              accept=" image/jpg, image/png"
              @change="onChangeFileUpload($event)"
            />
            Immagine
          </label>
        </div>
        <div class="col">
          <label for="title" class="form-label p-2 w-100">
            <input
              type="text"
              id="title"
              class="form-control"
              v-model="title"
            />
            Titolo
          </label>
        </div>
      </div>
      <label for="description" class="form-label p-2 w-100">
        <textarea
          rows="3"
          id="description"
          class="form-control"
          v-model="description"
        />
        Descrizione
      </label>
      <div class="row">
        <div class="col">
          <label for="priceWeekDay" class="form-label p-2">
            <input
              type="number"
              class="form-control"
              min="0"
              id="priceWeekDay"
              v-model="prezzoFeriali"
            />
            Prezzo giorni feriali
          </label>
        </div>
        <div class="col">
          <label for="priceWeekEnd" class="form-label p-2">
            <input
              type="number"
              class="form-control"
              min="0"
              id="priceWeekEnd"
              v-model="prezzoFestivi"
            />
            Prezzo giorni festivi
          </label>
        </div>
        <div class="col">
          <label for="pricePoints" class="form-label p-2">
            <input
              type="number"
              class="form-control"
              min="0"
              id="pricePoints"
              v-model="costoFedeltà"
            />
            Costo punti fedeltà
          </label>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <label for="category" class="form-label p-2 w-100">
            <select
              name="category"
              id="category"
              class="form-select"
              v-model="category"
              @change="checkForAdd "
            >
              <option value="Bici">Bici</option>
              <option value="Bici corsa">Bici Corsa</option>
              <option value="Monopattino">Monopattino</option>
              <option value="e-Bike">e-Bike</option>
              <option value="Bici Ibrida">Bici Ibrida</option>
              <option value="Inserisci una nuova categoria">Altro</option>
            </select>
            Categoria
          </label>
        </div>
        <div class="col">
          <label for="fidelityPoints" class="form-label p-2 w-100">
            <input
              type="number"
              class="form-control"
              min="0"
              id="fidelityPoints"
              v-model="guadagnoFedeltà"
            />
            Punti fedeltà guadagnati
          </label>
        </div>
      </div>
      <div class="row" v-show="toggleCategory">
        <div class="col">
          <label for="newCategory" class="col-4 form-label p-2 w-100">
            <input
              type="text"
              id="newCategory"
              v-model="category"
              class="form-control md-12dp border-0"
              @change="log"
            />
            Inserisci categoria custom
          </label>
        </div>
      </div>
      <div class="row">
        <div class="col-1" />
        <div class="col-5 mb-4 ps-2 form-switch">
          <input
            type="checkbox"
            id="flexSwitchCheckChecked"
            class="form-check-input mt-3"
            v-model="available"
          />
          <label for="flexSwitchCheckChecked" class="form-check-label p-2 mt-1">
            Disponibile
          </label>
        </div>
        <div class="col-6 mb-4">
          <label for="manutenzione" class="form-label p-2 w-100">
            <Datepicker
              v-model="manutenzione"
              class="w-100 bg-transparent"
              range
              :minDate="new Date()"
              id="manutenzione"
              :format="format"
            >
            </Datepicker>
            Manutenzione
          </label>
        </div>
      </div>
      <div class="px-2">
        <button
          type="submit"
          class="bg-site-primary border-0 mb-4 rounded py-1 w-100"
          @click="updateChanges"
        >
          Modifica
        </button>
        <p
          class="text-center w-100 pb-4 updated"
          v-show="updated"
          :key="updated"
        >
          Modifiche effettuate con successo!
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import Datepicker from "vue3-date-time-picker";
import "@/assets/css/datepicker.css";
import validateAccessToken from "../validateAccessToken.js";
const MANUTENZIONE_URL = process.env.MAINTENANCE_URL || "http://localhost:5000/v1/maintenance";
export default {
  name: "ModifyItem",
  components: {
    Datepicker,
  },
  data() {
    return {
      manutenzione: null,
      updated: false,
      title: "",
      description: "",
      prezzoFeriali: 0,
      prezzoFestivi: 0,
      costoFedeltà: 0,
      guadagnoFedeltà: 0,
      category: "",
      available: false,
      condition: "",
      numInStock: 0,
      image: null,
      media: { img: null },
      toggleCategory: false,
    };
  },
  async mounted() {
    await validateAccessToken();
    const accessToken = cookies.get("accessToken");
    const itemURL =
      process.env.INVENTORY_URL || "https://site202156.tw.cs.unibo.it/v1/inventories";
    const { data } = await axios.get(
      itemURL + "/products/" + this.$route.params.id,
      {
        headers: { Authorization: "Bearer " + accessToken },
      }
    );
    const product = data.products;
    this.loading = false;
    this.available = product.available;
    this.title = product.title;
    this.description = product.description;
    this.prezzoFeriali = product.price.weekday;
    this.prezzoFestivi = product.price.weekend;
    this.costoFedeltà = product.price.points;
    this.guadagnoFedeltà = product.fidelityPoints;
    this.category = product.category;
    this.condition = product.condition;
    this.numInStock = product.stock;
    this.media = product.media;
  },
  methods: {
    checkForAdd() {
      if (this.category === "Inserisci una nuova categoria") {
        this.toggleCategory = true;
      } else {
        this.toggleCategory = false;
      }
    },
    format(dates) {
      if (dates[0] && dates[1]) {
        return `${dates[0].getDate()}/${
          dates[0].getMonth() + 1
        }/${dates[0].getFullYear()} - ${dates[1].getDate()}/${
          dates[1].getMonth() + 1
        }/${dates[1].getFullYear()}`;
      } else {
        return `${dates[0].getDate()}/${
          dates[0].getMonth() + 1
        }/${dates[0].getFullYear()}`;
      }
    },
    onChangeFileUpload(event) {
      this.image = event.target.files[0];
    },
    updateChanges: async function () {
      await validateAccessToken();
      const accessToken = cookies.get("accessToken");
      const itemURL =
        process.env.INVENTORY_URL || "https://site202156.tw.cs.unibo.it/v1/inventories";
      const productData = {
        id: this.$route.params.id,
        available: this.available,
        price: {
          weekday: this.prezzoFeriali,
          weekend: this.prezzoFestivi,
          points: this.costoFedeltà,
        },
        condition: this.condition,
        category: this.category,
        title: this.title,
        description: this.description,
        stock: this.numInStock,
        fidelityPoints: this.guadagnoFedeltà,
        media: this.media,
      };
      if(this.manutenzione && this.manutenzione[0]){
        const start = new Date(this.manutenzione[0]).getTime()
        let end = 0
        if(this.manutenzione[1]) end = new Date(this.manutenzione[1]).getTime()
        const maintenance = {
          start,
          end,
          productCode: this.$route.params.id,
        }
        axios.post(MANUTENZIONE_URL+'/add',{maintenance},{
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        } )
      }
      const formData = new FormData();
      formData.append("file", this.image);
      if (this.image) {
        const { data } = await axios.post(`${itemURL}/image/upload`, formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-type": "multipart/form-data",
          },
        });
        this.media.img = data.img;
      }

      axios.post(
        `${itemURL}/products/update`,
        { product: productData },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-type": "application/json",
          },
        }
      );
      this.updated = true;
    },
  },
};
</script>

<style scoped>
textarea {
  overflow-y: auto;
  scrollbar-color: grey transparent;
  resize: none;
}
textarea::-webkit-scrollbar {
  background: transparent;
  width: 0.5em;
}
textarea::-webkit-scrollbar-thumb {
  background: grey;
  border-radius: 5em;
}
.updated {
  color: #92ff51;
}
</style>