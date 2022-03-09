<template>
  <div class="container mt-4 rounded md-01dp">
    <h1 class="p-4 text-center">Crea un nuovo oggetto</h1>
    <div class="w-50 m-auto" id="newItemForm" :key="added">
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
              placeholder="Inserisci un titolo"
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
          placeholder="Inserisci una descrizione"
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
              @change="checkForAdd"
            >
              <option disabled value="">Scegli una categoria</option>
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
          <label for="condition" class="form-label p-2 w-100">
            <select
              name="condition"
              id="condition"
              class="form-select"
              v-model="condition"
            >
              <option disabled value="">Scegli una condizione</option>
              <option value="Ottima">Ottima</option>
              <option value="Buona">Buona</option>
              <option value="Parzialmente danneggiato">
                Parzialmente danneggiato
              </option>
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
      <div class="px-2">
        <button
          type="submit"
          class="bg-site-primary border-0 mb-4 rounded px-4 py-1 w-100"
          @click="create()"
        >
          Crea
        </button>
        <p class="text-center w-100 pb-4 added" v-show="added" :key="added">
          Aggiunto nuovo prodotto!
        </p>
        <p
          class="text-center w-100 pb-4 added text-danger"
          v-show="datiMancanti"
          :key="datiMancanti"
        >
          Dati mancanti!
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "universal-cookie";
import validateAccessToken from "../validateAccessToken.js";

export default {
  name: "NewItem",
  data() {
    return {
      added: false,
      title: "",
      description: "",
      prezzoFeriali: 0,
      prezzoFestivi: 0,
      costoFedeltà: 0,
      guadagnoFedeltà: 0,
      category: "",
      available: true,
      condition: "",
      numInStock: 0,
      image: null,
      datiMancanti: false,
      toggleCategory: false,
    };
  },
  methods: {
    checkForAdd() {
      if (this.category === "Inserisci una nuova categoria") {
        this.toggleCategory = true;
      } else {
        this.toggleCategory = false;
      }
    },
    setDefaultValues() {
      this.available = true;
      this.prezzoFeriali = 0;
      this.prezzoFestivi = 0;
      this.costoFedeltà = 0;
      this.condition = "";
      this.title = "";
      this.category = "";
      this.description = "";
      this.guadagnoFedeltà = 0;
      this.numInStock = 0;
      this.image = null;
    },
    onChangeFileUpload(event) {
      this.image = event.target.files[0];
    },
    async create() {
      await validateAccessToken();

      const cookies = new Cookies();
      const accessToken = cookies.get("accessToken");
      const itemURL =
        process.env.INVENTORY_URL || "https://site202156.tw.cs.unibo.it/v1/inventories";
      const productData = {
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
        fidelityPoints: this.guadagnoFedeltà,
      };
      const formData = new FormData();
      formData.append("file", this.image);
      if (this.image) {
        const { data } = await axios.post(`${itemURL}/image/upload`, formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-type": "multipart/form-data",
          },
        });
        productData["media"] = { img: data.img };
      }
      const response = await axios.post(
        `${itemURL}/add`,
        { item: productData },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-type": "application/json",
          },
          validateStatus: false,
        }
      );

      if (response?.data?.code !== 200) {
        this.added = false;
        this.datiMancanti = true;
      } else {
        this.added = true;
        this.datiMancanti = false;
        this.setDefaultValues();
      }
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
.added {
  color: #92ff51;
}
</style>