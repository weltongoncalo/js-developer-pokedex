// Selecionando os elementos do HTML pelo ID
const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");
const profileContent = document.getElementById("profileContent");

// Pegando os parâmetros da URL para ver se tem um ID de Pokémon
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// Definindo variáveis para controlar a quantidade de Pokémons
const maxRecords = 151; // Número máximo de Pokémons
const limit = 10; // Quantos Pokémons carregar por vez
let offset = 0; // Começar do Pokémon 0

// Se houver um ID na URL, então pegue o perfil do Pokémon
if (id) {
    getProfilePokemon(id);
  }

// Função para pegar os detalhes de um Pokémon específico
function getProfilePokemon(id) {
    pokeApi.getPokemonDetailsToProfile(id)
      .then((pokemon) => {
        // Criando o HTML com os detalhes do Pokémon
        const newHtml = `
        <section class="pokemon ${pokemon.type}">
            <h1 class="name">${pokemon.name}</h1>
            <ol class="types">
                ${pokemon.types.map((type) => `<li class="type ${type}"> ${type}</li>`).join("")}
            </ol>
            <div class="img">
                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </section>
        <section class="details">
            <div class="menu">
                <div class="menu_option" onclick="showItems('about')">About</div>
                <div class="menu_option" onclick="showItems('base_stats')">Base Stats</div>
            </div>
            <div class="menu_items" id="about">
                <ol>
                    <li id="species">Species: ${pokemon.species}</li>
                    <li id="height">Height: ${pokemon.height}</li>
                    <li id="weight">Weight: ${pokemon.weight}</li>
                    <li id="abilities">Abilities: ${pokemon.abilities}</li>
                </ol>
            </div>
            <div class="menu_items" id="base_stats">
                <ol>
                    <li id="hp">HP: ${pokemon.hp}</li>
                    <li id="attack">Attack: ${pokemon.attack}</li>
                    <li id="defense">Defense: ${pokemon.defense}</li>
                </ol>
            </div>
        </section>
        `;
        // Colocando o HTML no elemento profileContent
        if(profileContent){
          profileContent.innerHTML = newHtml;
        }
      })
      .catch((error) => console.log(error)); // Mostrando erro no console se algo der errado
  }

// Função para redirecionar para a página de perfil do Pokémon
function redirectToProfile(id) {
    const detailsUrl = `profile.html?id=${id}`;
    window.location.href = detailsUrl;
  }

  // Função para mostrar os detalhes do Pokémon de acordo com o menu clicado
function showItems(category) {
    let menuItems = document.querySelectorAll(".menu_items");
    menuItems.forEach((item) => {
      item.classList.remove("active");
    });
    document.getElementById(category).classList.add("active");
  }

  // Função para carregar mais Pokémons na lista
function loadMoreItems(offset, limit) {
    pokeApi.getPokemons(offset, limit)
      .then((pokemons = []) => {
        const newHtml = pokemons.map((pokemon) => {
          return `<li class="pokemon ${pokemon.type}" onclick="redirectToProfile(${pokemon.number})">
                    <span class="number">#${pokemon.number}</span>
                    <span class="name">${pokemon.name}</span>
                    <div class="detail">
                        <ol class="types">
                            ${pokemon.types.map((type) => `<li class="type ${type}"> ${type}</li>`).join("")}
                        </ol>
                        <img src="${pokemon.photo}" alt="${pokemon.name}">
                    </div>
                </li>`;
        }).join("");
        if (pokemonList) {
          pokemonList.innerHTML += newHtml;
        }
      })
      .catch((erro) => console.log(erro)); // Mostrando erro no console se algo der errado
  }

// Carregando os primeiros Pokémons na tela
loadMoreItems(offset, limit);

// Adicionando evento de clique ao botão "Carregar Mais"
if (loadMoreButton) {
    loadMoreButton.addEventListener("click", () => {
      offset += limit; // Aumentando o offset pelo limite
      const qtdRecordsWithNextPage = offset + limit;
      if (qtdRecordsWithNextPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadMoreItems(offset, newLimit);
        loadMoreButton.parentElement.removeChild(loadMoreButton); // Removendo o botão se não houver mais Pokémons para carregar
      } else {
        loadMoreItems(offset, limit); // Carregando mais Pokémons
      }
    });
  }