<template>
  <div class="container md-01dp mt-4 rounded p-4">
    <h1 class="mb-4 text-center">Informazioni Account</h1>
    <span class="text-danger"
      >MATTIA i valori che sono messi non sono placeholder, devi passarli tu
      nell'attributo value dei tag input (per il radio input è l'attributo
      checked) perchè così puoi sia vedere i valori che modificarli. Fa così
      anche instagram direi. Quantomeno ho preso ispirazione da loro. Ricordati
      di cancellare questo messaggio quando hai finito.</span
    >
    <form>
      <div class="row mb-4">
        <div class="col">
          <div>
            <input
              type="text"
              id="nomeInput"
              class="form-control"
              value="John"
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
              value="Doe"
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
          value="via Arcobaleno 38"
        />
        <label class="form-label ps-2" for="addressInput">Indirizzo</label>
      </div>

      <!-- Email input -->
      <div class="mb-4">
        <input
          type="email"
          id="emailInput"
          class="form-control"
          value="johndoe@example.com"
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
              value="1946-06-02"
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
              value="3335719046"
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
              value="option1"
            />
            <label class="form-check-label" for="femaleGender">Femmina</label>
          </div>

          <div class="form-check form-check-inline mb-0 me-4">
            <input
              class="form-check-input"
              type="radio"
              name="inlineRadioOptions"
              id="maleGender"
              value="option2"
              checked
            />
            <label class="form-check-label" for="maleGender">Maschio</label>
          </div>

          <div class="form-check form-check-inline mb-0">
            <input
              class="form-check-input"
              type="radio"
              name="inlineRadioOptions"
              id="otherGender"
              value="option3"
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
export default {
  name: "AddClient",
};
</script>

<style scoped>
input {
  background: #383838;
  color: white;
  border: none;
}
input:focus {
  background: #383838;
  border: none;
  outline: none !important;
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
  filter: invert(1);
}
</style>