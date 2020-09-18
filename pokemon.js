const baseURL = "https://pokeapi.co/api/v2/";

const welcome = document.getElementById("welcome");
const pokemonList = document.getElementById("pokemon-list");
const pokedex = document.getElementById("pokedex");
const pokestats = document.getElementById("pokemon-info");
const pokebuy = document.getElementById("pokemon-buy");
const spinner = document.getElementById("spinner");
const form = document.getElementById("form");

const colors = {
  fire: "#FDDFDF",
  grass: "#DEFDE0",
  electric: "#FCF7DE",
  water: "#DEF3FD",
  ground: "#f4e7da",
  rock: "#d5d5d4",
  fairy: "#fceaff",
  poison: "#98d7a5",
  bug: "#f8d5a3",
  dragon: "#97b3e6",
  psychic: "#eaeda1",
  flying: "#F5F5F5",
  fighting: "#E6E0D4",
  normal: "#F5F5F5",
  ice: "#C5FDFD",
};

var selectedPokemon;

const getPokemons = async () => {
  hideAll();
  welcome.style.display = "flex";

  if (localStorage.getItem("pokemons") == null) {
    const promises = [];

    for (let i = 1; i <= 150; i++) {
      promises.push(fetch(`${baseURL}pokemon/${i}`).then((res) => res.json()));
    }

    Promise.all(promises).then((data) => {
      const pokemons = data.map((item) => ({
        _id: item.id,
        name: item.name,
        type: item.types.map((type) => type.type.name).join(", "),
        image: item.sprites["front_default"],
        //image: `https://pokeres.bastionbot.org/images/pokemon/${item.id}.png`,
        height: item.height,
        weight: item.weight,
      }));

      addToPokedex(pokemons);

      localStorage.setItem("pokemons", JSON.stringify(pokemons));

      spinner.style.display = "none";
    });
  } else {
    addToPokedex(JSON.parse(localStorage.getItem("pokemons")));
  }
};

function addToPokedex(pokemons) {
  pokemons.forEach((pokemon) => {
    const pokemonType =
      pokemon.type.substr(0, pokemon.type.indexOf(",")) || pokemon.type;
    const card = `
      <div class="pokemon-card" 
           onclick="openStats(${pokemon._id})" 
           style="background-color: ${colors[pokemonType]}">
        <img class="pokemon-image" src="${pokemon.image}" alt="${pokemon.name}"/>
        <h3 class="pokemon-name">${pokemon.name}</h3>
      <div>
    `;
    pokedex.innerHTML += card;
  });
}

function openWelcome() {
  hideAll();
  welcome.style.display = "flex";
}

function closeWelcome() {
    welcome.style.display = "none";
}

function openPokemonList() {
  hideAll();
  pokemonList.style.display = "flex";
}

function blurPokemonList() {
    pokemonList.style.filter= "blur(2px) brightness(90%)";
}

function unblurPokemonList() {
    pokemonList.style.filter= "none";
}

function closePokemonList() {
  pokemonList.style.display = "none";
}

function openStats(pokemonID) {
  closeForm();

  selectedPokemon = JSON.parse(localStorage.getItem("pokemons"))[pokemonID - 1];

  const pokemonType =
    selectedPokemon.type.substr(0, selectedPokemon.type.indexOf(",")) ||
    selectedPokemon.type;

  const info = `
      <h3 id="pokemon-info-name">${selectedPokemon.name}</h3>
      <div id="pokemon-info-container">
        <div id="pokemon-info-imgcontainer">
          <img id="pokemon-info-image"
               src="${selectedPokemon.image}"
               alt="${selectedPokemon.name}"
          />
        </div>
        <div id="pokemon-info-stats">
          <p id="pokemon-info-height">Visina: ${selectedPokemon.height/10}m</p>
          <p id="pokemon-info-weight">Tezina: ${selectedPokemon.weight/10}kg</p>
          <p id="pokemon-info-type">Tip: ${selectedPokemon.type}</p>
        </div>
      </div>
      <button onclick="openForm()">Poruči</button>
      <button onclick="closeStats()">Zatvori</button>
    `;

  pokestats.innerHTML = info;
  pokestats.style.backgroundColor = colors[pokemonType];
  let h = window.innerHeight / 2;
  pokestats.style.top = h + "px";
  blurPokemonList();
}

function closeStats() {
  pokestats.style.top = "-50%";
  unblurPokemonList();
}

function openForm() {
  closeStats();
  document.getElementById("selected-pokemon-name").innerHTML = selectedPokemon.name;
  pokebuy.style.left = "50%";
  blurPokemonList();
}

function closeForm() {
  pokebuy.style.left = "-50%";
  unblurPokemonList();
}

function randomPokemon() {
  openStats(Math.ceil(Math.random() * 150));
}

function hideAll() {
  closeWelcome();
  closePokemonList();
  closeStats();
  closeForm();
}

openWelcome();
getPokemons();

form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    localStorage.setItem("cart",JSON.stringify({
        ime: e.srcElement[0].value,
        prezime: e.srcElement[1].value,
        adresa: e.srcElement[2].value,
        pokemon: selectedPokemon
    }))
    
    if(localStorage.getItem("cart") != null){
        alert("Proizvod porucen");
        closeForm();
    }
    else{
        alert("Proizvod nije porucen, pokusajte ponovo");
    }
});