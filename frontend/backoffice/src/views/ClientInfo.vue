<template>
  <div class="container md-01dp mt-4 rounded p-4">
    <h1 class="mb-4 text-center">Informazioni Account</h1>
    <div id="newItemForm" class="w-50 m-auto">
      <div class="row mb-4">
        <div class="col">
          <div>
            <label class="form-label w-100" for="nomeInput"
              ><input
                type="text"
                id="nomeInput"
                class="form-control"
                v-model="clientName"
              />Nome</label
            >
          </div>
        </div>
        <div class="col">
          <div>
            <label class="form-label w-100" for="cognomeInput"
              ><input
                type="text"
                id="cognomeInput"
                class="form-control"
                v-model="clientSurname"
              />Cognome</label
            >
          </div>
        </div>
      </div>

      <!-- address input -->
      <div class="mb-4">
        <label class="form-label w-100" for="addressInput"
          ><input
            type="text"
            id="addressInput"
            class="form-control"
            v-model="clientAddress"
          />Indirizzo</label
        >
      </div>

      <!-- Email input -->
      <div class="mb-4">
        <label class="form-label w-100" for="emailInput"
          ><input
            type="email"
            id="emailInput"
            class="form-control"
            v-model="clientEmail"
          />Email</label
        >
      </div>

      <div class="row">
        <div class="col">
          <div class="mb-4">
            <label for="dateInput" class="form-label w-100">
              <Datepicker
                v-model="clientBirthday"
                class="w-100 bg-transparent"
                id="dateInput"
                :format="format"
              ></Datepicker
              >Data di nascita</label
            >
          </div>
        </div>

        <div class="col">
          <div class="mb-4">
            <label class="form-label w-100" for="phoneNumber"
              ><input
                type="tel"
                id="phoneNumber"
                class="form-control"
                v-model="clientTelephone"
              />Telefono</label
            >
          </div>
        </div>
      </div>

      <div class="d-md-flex justify-content-start align-items-center mb-4 pb-2">
        <fieldset>
          <legend class="mb-0 me-4 fs-5">Genere:</legend>
          <div class="form-check form-check-inline mb-0 me-4">
            <input
              class="form-check-input"
              type="radio"
              name="inlineRadioOptions"
              id="femaleGender"
              :checked="clientGender === 'Femmina'"
              v-model="clientGender"
            />
            <label class="form-check-label" for="femaleGender">Femmina</label>
          </div>

          <div class="form-check form-check-inline mb-0 me-4">
            <input
              class="form-check-input"
              type="radio"
              name="inlineRadioOptions"
              id="maleGender"
              :checked="clientGender === 'Maschio'"
              v-model="clientGender"
            />
            <label class="form-check-label" for="maleGender">Maschio</label>
          </div>

          <div class="form-check form-check-inline mb-0">
            <input
              class="form-check-input"
              type="radio"
              name="inlineRadioOptions"
              id="otherGender"
              :checked="clientGender === 'Non specificato'"
              v-model="clientGender"
            />
            <label class="form-check-label" for="otherGender">Altro</label>
          </div>
        </fieldset>
      </div>

      <!-- Submit button -->
      <button
        type="submit"
        class="btn btn-primary mb-4 text-black"
        @click="updateChanges"
      >
        Conferma modifiche
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "universal-cookie";
import dayjs from "dayjs";
import Datepicker from "vue3-date-time-picker";
import "@/assets/css/datepicker.css";
import validateAccessToken from "../validateAccessToken.js";

const cookies = new Cookies();

export default {
  name: "Client Info",
  components: {
    Datepicker,
  },
  data() {
    return {
      clientName: "",
      clientSurname: "",
      clientAddress: "",
      clientEmail: "",
      clientBirthday: "",
      clientTelephone: "",
      clientGender: "",
      loading: true,
    };
  },
  async mounted() {
    await validateAccessToken();
    const accessToken = cookies.get("accessToken");
    const clientURL =
      process.env.CLIENT_URL || "http://localhost:5000/v1/clients";
    axios
      .get(clientURL + "/lookup/" + this.$route.params.id, {
        headers: { Authorization: "Bearer " + accessToken },
      })
      .then((response) => {
        const user = response.data.user;
        this.loading = false;
        this.clientName = user.name;
        this.clientSurname = user.surname;
        this.clientEmail = user.email;
        this.clientAddress = user.address;
        this.clientBirthday = dayjs(user.birthDate).format("YYYY-MM-DD");
        this.clientTelephone = user.phoneNumber;
        this.clientGender = user.gender;
      });
  },
  methods: {
    format(date){
      return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
      
    },
    updateChanges: function () {
      const accessToken = cookies.get("accessToken");
      const brthDateNumber = new Date(this.clientBirthday).getTime();
      const clientURL =
        process.env.CLIENT_URL || "http://localhost:5000/v1/clients";
      const clientData = {
        id: this.$route.params.id,
        name: this.clientName,
        surname: this.clientSurname,
        phoneNumber: this.clientTelephone,
        birthDate: brthDateNumber,
        email: this.clientEmail,
        gender: this.clientGender,
        address: this.clientAddress,
      };
      axios.post(
        `${clientURL}/update/personalInfo`,
        { client: clientData },
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
input {
  background: #383838;
  border: none;
  color: white;
}
.input:focus {
  background: #383838;
  border: none;
  color: white;
}
form {
  margin: auto;
  max-width: 50%;
}
button.btn {
  width: 100%;
  background: #4bb5f6;
  border: none;
}
</style>