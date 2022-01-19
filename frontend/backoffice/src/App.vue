<template>
  <a class="skip-link" href="#main">Passa al contenuto principale</a>
  <Navbar />
  <Searchbar />
  <main id="main">
  </main>
  <Footer />
  <router-view />
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Searchbar from "@/components/Searchbar.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "App",
  components: {
    Navbar,
    Searchbar,
    Footer,
  },
};
</script>

