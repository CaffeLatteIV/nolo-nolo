<template>
  <div class="container mt-4 rounded md-01dp">
    <h1 class="p-4 text-center">Modifica Oggetto</h1>
    <form class="w-50 m-auto" id="newItemForm">
      <div class="row">
        <div class="col">
          <label for="image" class="form-label p-2 w-100">
            <input
              type="file"
              class="form-control"
              id="file"
              name="file"
              accept="image/png, image/jpg"
              ref="file"
              @change="onChangeFileUpload"
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
            >
              <option value="Bici">Bici</option>
              <option value="Bici corsa">Bici Corsa</option>
              <option value="Monopattino">Monopattino</option>
              <option value="e-Bike">e-Bike</option>
              <option value="Bici Ibrida">Bici Ibrida</option>
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
      <button
        type="submit"
        class="bg-site-primary border-0 mb-4 rounded px-4 py-1 w-100"
        @click="updateChanges"
      >
        Modifica
      </button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "universal-cookie";

export default {
  name: "ModifyItem",
  data() {
    return {
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
    };
  },
  mounted() {
    const cookies = new Cookies();
    const accessToken = cookies.get("accessToken");
    const itemURL =
      process.env.INVENTORY_URL || "http://localhost:5000/v1/inventories";
    axios
      .get(itemURL + "/products/" + this.$route.params.id, {
        headers: { Authorization: "Bearer " + accessToken },
      })
      .then((response) => {
        {
          const product = response.data.products;
          console.log(product);
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
        }
      });
  },
  methods: {
    onChangeFileUpload() {
      this.image = this.$refs.file.files[0];
    },
    updateChanges: function () {
      const cookies = new Cookies();
      const accessToken = cookies.get("accessToken");
      const itemURL =
        process.env.INVENTORY_URL || "http://localhost:5000/v1/inventories";
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
        // media: {
        //   img: this.image,
        // },
      };
      const formData = new FormData();
      formData.append("image", this.image);
      axios.post(`${itemURL}/image/upload`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-type": "multipart/form-data",
        },
      });
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
</style>