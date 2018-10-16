const pixelmon = require('./lib');

onInit = async () => {
  const names = await pixelmon.getPlayerUUIDsAsync();
  console.log(names);
  const first = Object.keys(names)[0];
  const pokemon = await pixelmon.getPlayerPokemonAsync(first);
  console.log(pokemon);
}

onInit();