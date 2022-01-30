<template>
  <div class="container-fluid w-100 pb-3 md-04dp">
    <form class="d-flex">
      <input
        class="form-control me-1 ps-3 p-1 text-white"
        id="searchbar"
        type="search"
        placeholder="Cerca.."
        aria-label="Cerca"
      />
      <button class="btn text-black bg-site-primary p-0" type="submit">
        <span class="material-icons pt-1 px-2">search</span>
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: "Searchbar",
};
</script>