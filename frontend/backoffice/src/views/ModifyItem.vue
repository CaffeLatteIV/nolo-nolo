<template>
  <div class="container mt-4 rounded md-01dp">
    <h1 class="p-4 text-center">Modifica Oggetto</h1>
    mettere default value dappertutto
    <form class="w-50 m-auto" id="newItemForm">
      <div class="row">
        <div class="col">
          <label for="image" class="form-label p-2 w-100">
            <input type="file" class="form-control" id="image" name="image" accept="image/png, image/jpg"/>
            Immagine
          </label>
        </div>
        <div class="col">
          <label for="title" class="form-label p-2 w-100">
            <input type="text" id="title" class="form-control" />
            Titolo
          </label>
        </div>
      </div>
      <label for="description" class="form-label p-2 w-100">
        <textarea rows="3" id="description" class="form-control" />
        Descrizione
      </label>

      <div class="row">
        <div class="col">
          <label for="priceWeekDay" class="form-label p-2">
            <input type="number" class="form-control" min="0" id="priceWeekDay" />
            Prezzo giorni feriali
          </label>
        </div>
        <div class="col">
          <label for="priceWeekEnd" class="form-label p-2">
            <input type="number" class="form-control" min="0" id="priceWeekEnd" />
            Prezzo giorni festivi
          </label>
        </div>
        <div class="col">
          <label for="pricePoints" class="form-label p-2">
            <input type="number" class="form-control" min="0" id="pricePoints" />
            Costo punti fedeltà
          </label>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <label for="category" class="form-label p-2 w-100">
            <select name="category" id="category" class="form-select">
              <option value="bici">Bici</option>
              <option value="corsa">Bici Corsa</option>
              <option value="monopattino">Monopattino</option>
              <option value="e-bike">e-Bike</option>
              <option value="ibrida">Bici Ibrida</option>
            </select>
            Categoria
          </label>
        </div>
        <div class="col">
          <label for="fidelityPoints" class="form-label p-2 w-100">
            <input type="number" class="form-control" min="0" id="fidelityPoints" />
            Punti fedeltà guadagnati
          </label>
        </div>
      </div>
      <button type="submit" class="bg-site-primary border-0 mb-4 rounded px-4 py-1 w-100">Modifica</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "ModifyItem",
};
</script>
