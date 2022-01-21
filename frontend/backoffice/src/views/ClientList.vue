<template>
  <div class="container md-01dp mt-4 rounded p-4">
    <!--Title and addClient button-->
    <div class="px-4">
      <h1 class="py-3 m-0">Lista Clienti</h1>
    </div>
    <div class="p-4">
      <ul class="list-group list-group-flush rounded" id="list">
        <!--Cancellare questa lista fatta esclusivamente per demo, sia lista che nomi vanno inseriti con injection-->
        <li
          class="list-group-item md-04dp border-dark"
          v-for="n in 20"
          :key="n"
        >
          <div class="row px-3 text-white">
            <div class="col-4 fs-4 py-3">Biggus Dickus</div>
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
                to="/admin/client"
                exact-path
                class="d-flex justify-content-end py-3 text-decoration-none"
                role="button"
                aria-label="Aggiungi nuovo cliente"
                title="Modifica informazioni dell'utente"
              >
                <span class="material-icons text-white rounded p-1"
                  >create</span
                >
              </router-link>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "ClientList",
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