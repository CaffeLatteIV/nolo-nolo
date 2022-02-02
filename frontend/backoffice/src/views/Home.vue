<template>
  <div class="container md-01dp mt-4 rounded">
    <h1 class="p-2 text-center pt-4">Homepage Admin</h1>
    <div class="p-4">
      <p>Benvenuto nel portale per Admin di NoloNolo.</p>
      <p>
        Da questa pagina potrai gestire tutto ciò che riguarda il backoffice,
        dalla gestione dei dati degli utenti, a quella dell'inventario, fino ai
        noleggi.
      </p>
    </div>
    <div class="row p-4">
      <div class="col p-2">
        <div class="md-04dp rounded p-2 h-100">
          <h3 class="p-2 pb-0 text-center">Gestione Anagrafica Clienti</h3>
          <div class="p-2">
            <img
              src="../assets/images/users.jpg"
              alt="Clienti"
              class="w-100 rounded"
            />
            <div class="pt-4">
              Questo portale è il cuore della collaborazione tra i nostri
              clienti e il personale.
              <br>
              <a class="text-white" href="/admin/clientList">Visita il portale</a>
            </div>
          </div>
        </div>
      </div>
      <div class="col p-2">
        <div class="md-04dp rounded p-2 h-100">
          <h3 class="p-2 pb-0 text-center">Gestione Inventario</h3>
          <div class="p-2">
            <img
              src="../assets/images/inventory.jpg"
              alt="Inventario"
              class="w-100 rounded"
            />
            <div class="pt-4">
              Le bici sono la nostra passione. Qui potrai gestire tutto ciò che le riguarda.
              <br>
              <a class="text-white" href="/admin/inventory">Visita il portale</a>
            </div>
          </div>
        </div>
      </div>
      <div class="col p-2">
        <div class="md-04dp rounded p-2 h-100">
          <h3 class="p-2 pb-0 text-center">Gestione Noleggi</h3>
          <div class="p-2">
            <img
              src="../assets/images/rentals.jpg"
              alt="Noleggio"
              class="w-100 rounded"
            />
            <div class="pt-4">
              Qui potrai trovare tutti gli strumenti per la gestione dell'andamento del negozio.
              <br>
              <a class="text-white" href="/admin/noleggi">Visita il portale</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
};
</script>
