<template>
  <a class="skip-link" href="#main">Passa al contenuto principale</a>
  <Navbar />
  <main id="main">
    <router-view
      
    />
  </main>
  <Footer />
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "App",
  components: {
    Navbar,
    Footer,
  },
};
</script>
