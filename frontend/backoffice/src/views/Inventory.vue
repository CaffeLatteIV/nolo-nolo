<template>
  <div class="container md-01dp mt-4 rounded p-4">
    <!--Title and addClient button-->
    <div class="px-4 row">
      <div class="col-11">
        <h1 class="py-3 m-0">Inventario</h1>
      </div>
      <div class="col-1">
        <router-link
          to="#"
          exact-path
          class="d-flex justify-content-end py-3 text-decoration-none"
          role="button"
          aria-label="Aggiungi nuovo oggetto"
          title="Aggiungi nuovo oggetto"
        >
          <span class="material-icons text-white rounded fs-1 pt-2">add_box</span>
        </router-link>
      </div>
    </div>
    <div class="p-4">
      <ul class="list-group list-group-flush rounded" id="list">
        <!--Cancellare questa lista fatta esclusivamente per demo, sia lista che nomi vanno inseriti con injection-->
        <li
          class="list-group-item md-04dp border-dark"
          v-for="n in 20"
          :key="n"
        >
          <a href="http://127.0.0.1:3000/product" class="text-white text-decoration-none">
            <div class="row px-3">
              <div class="col-4 fs-4 py-3">Bici Ripetuta</div>
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
export default {
  name: "Inventory",
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