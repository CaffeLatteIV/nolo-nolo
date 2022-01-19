<template>
  <div class="container-fluid w-100 pb-3 md-04dp">
    <form class="d-flex">
      <input
        class="form-control me-1 bg-transparent text-white"
        type="search"
        placeholder="Cerca.."
        aria-label="Cerca"
      />
      <button class="btn text-black bg-site-primary" type="submit">
        Cerca
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: "Searchbar",
};
</script>