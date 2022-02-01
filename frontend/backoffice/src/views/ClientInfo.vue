<template>
  <div class="container md-01dp mt-4 rounded p-4">
    <h1 class="mb-4 text-center">Informazioni Account</h1>
    <form class="w-50 m-auto">
      <div class="row mb-4">
        <div class="col">
          <div>
            <input
              type="text"
              id="nomeInput"
              class="form-control"
              v-model="clientName"
            />
            <label class="form-label ps-2" for="nomeInput">Nome</label>
          </div>
        </div>
        <div class="col">
          <div>
            <input
              type="text"
              id="cognomeInput"
              class="form-control"
              v-model="clientSurname"
            />
            <label class="form-label ps-2" for="cognomeInput">Cognome</label>
          </div>
        </div>
      </div>

      <!-- address input -->
      <div class="mb-4">
        <input
          type="text"
          id="addressInput"
          class="form-control"
          v-model="clientAddress"
        />
        <label class="form-label ps-2" for="addressInput">Indirizzo</label>
      </div>

      <!-- Email input -->
      <div class="mb-4">
        <input
          type="email"
          id="emailInput"
          class="form-control"
          v-model="clientEmail"
        />
        <label class="form-label ps-2" for="emailInput">Email</label>
      </div>

      <div class="row">
        <div class="col">
          <div class="mb-4">
            <input
              type="date"
              class="form-control"
              id="dateInput"
              v-model="clientBirthday"
            />
            <label for="dateInput" class="form-label ps-2"
              >Data di nascita</label
            >
          </div>
        </div>

        <div class="col">
          <div class="mb-4">
            <input
              type="tel"
              id="phoneNumber"
              class="form-control"
              v-model="clientTelephone"
            />
            <label class="form-label ps-2" for="phoneNumber">Telefono</label>
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
      <button type="submit" class="btn btn-primary mb-4 text-black">
        Conferma modifiche
      </button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "universal-cookie";
import dayjs from 'dayjs'

export default {
  name: "Client Info",
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
    }
  },
  mounted() {
    const cookies = new Cookies();
    const accessToken = cookies.get("accessToken");
    console.log(accessToken);
    console.log(cookies.get("client"));
    const clientURL =
      process.env.CLIENT_URL || "http://localhost:5000/v1/clients";
    axios
      .get(clientURL + "/lookup/" + this.$route.params.id, {
        headers: { Authorization: "Bearer " + accessToken },
      })
      .then((response) => {
        const user = response.data.user
        console.log(user)
        this.loading = false;
        this.clientName = user.name;
        this.clientSurname = user.surname;
        this.clientEmail = user.email;
        this.clientAddress = user.address;
        this.clientBirthday = dayjs(user.birthDate).format('YYYY-MM-DD');
        this.clientTelephone = user.phoneNumber;
        this.clientGender = user.gender;
        console.log('bday' + this.clientBirthday)
        console.log('gender' + this.clientGender)
      });
    console.log('id: ' + this.$route.params.id)
  },
};
</script>

<style scoped>
input{
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
::-webkit-calendar-picker-indicator {
  filter: invert(1); /* Rende il simbolo del calendario bianco su sfondo nero */
}
</style>