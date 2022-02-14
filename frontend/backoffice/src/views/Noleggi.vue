<template>
  <div class="container md-01dp mt-4 p-4 rounded">
    <h1 class="mb-4 ps-2">Gestione Noleggi</h1>
    <div class="p-2">
      <h4 class="p-2">Noleggi Attivi</h4>
      <div class="md-04dp rounded p-2">
        <ActiveOrders />
      </div>
    </div>
    <div class="p-2">
      <h4 class="p-2">Prenotazioni</h4>
      <div class="md-04dp rounded p-2">
        <BookedOrders />
      </div>
    </div>
    <div class="p-2">
      <h4 class="p-2">Noleggi Passati</h4>
      <div class="md-04dp rounded p-2">
        <ClosedOrders />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import ActiveOrders from "@/components/ActiveOrders";
import BookedOrders from "@/components/BookedOrders";
import ClosedOrders from "@/components/ClosedOrders";

export default {
  name: "Noleggi",
  components: {
    ActiveOrders,
    BookedOrders,
    ClosedOrders,
  },
};
</script>
