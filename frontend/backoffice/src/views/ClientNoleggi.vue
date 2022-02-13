<template>
  <div class="container md-01dp mt-4 p-4 rounded">
    <h1 class="mb-4 ps-2">Gestione Noleggi Di {{ client.name + "&#32;" + client.surname }}</h1>
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

import axios from "axios";
import Cookies from "universal-cookie";
import validateAccessToken from '../validateAccessToken.js'

export default {
  name: "Noleggi",
  components: {
    ClientActiveOrders,
    ClientBookedOrders,
    ClientClosedOrders,
  },
  data() {
    return {
      client: [],
    };
  },
  mounted() {
    this.getClientName()
  },
  methods: {
    getClientName: async function () {
      await validateAccessToken()
      const cookies = new Cookies();
      const accessToken = cookies.get("accessToken");
      const clientURL =
        process.env.CLIENT_URL || "http://localhost:5000/v1/clients";
      const { data } = await axios.get(
        clientURL + "/lookup/" + this.$route.params.id,
        { headers: { Authorization: "Bearer " + accessToken } }
      );
      this.client = data.user
    },
  },
};
</script>
