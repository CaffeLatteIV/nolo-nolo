<template>
  <div class="container md-01dp mt-4 p-4 rounded">
    <h1 class="mb-4 ps-2">Gestione Noleggi Di {{this.$route.params.id}}</h1>
    <div class="p-2">
      <h4 class="p-2">Noleggi Attivi</h4>
      <div class="md-04dp rounded p-2">
        <ClientActiveOrders :id="this.$route.params.id" />
      </div>
    </div>
    <div class="p-2">
      <h4 class="p-2">Prenotazioni</h4>
      <div class="md-04dp rounded p-2">
        <ClientBookedOrders :id="this.$route.params.id" />
      </div>
    </div>
    <div class="p-2">
      <h4 class="p-2">Noleggi Passati</h4>
      <div class="md-04dp rounded p-2">
        <ClientClosedOrders :id="this.$route.params.id" />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import ClientActiveOrders from "@/components/ClientActiveOrders";
import ClientBookedOrders from "@/components/ClientBookedOrders";
import ClientClosedOrders from "@/components/ClientClosedOrders";

export default {
  name: "Noleggi",
  components: {
    ClientActiveOrders,
    ClientBookedOrders,
    ClientClosedOrders,
  },
};
</script>
