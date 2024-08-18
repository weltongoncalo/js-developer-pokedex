// Objeto vazio para armazenar funções
const pokeApi = {};

// Função para converter os dados da API 
function convertPokeApiDetailToPokemon(pokeDetail) {
    // Criar novo objeto Pokémon
    const pokemon = new Pokemon();
    pokemon.number = pokeDetail.id; // Número do Pokémon
    pokemon.name = pokeDetail.name; // Nome do Pokémon

    // Armazenar os tipos de pokemons em uma variável
    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
    // Pegar o primeiro tipo da lista
    const [type] = types;

    pokemon.types = types; // Todos os tipos do Pokémon
    pokemon.type = type; // Primeiro tipo do Pokémon

    // Pegar a imagem do Pokémon
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;

    // Pegar outras informações do Pokémon
    pokemon.species = pokeDetail.species.name;
    pokemon.height = pokeDetail.height;
    pokemon.weight = pokeDetail.weight;

    // Pegar as habilidades do Pokémon
    const abilities = pokeDetail.abilities.map((index) => index.ability.name).join(", ");
    pokemon.abilities = abilities;

    // Pegar as estatísticas do Pokémon
    pokemon.hp = pokeDetail.stats.find((element) => element.stat.name === "hp").base_stat;
    pokemon.defense = pokeDetail.stats.find((element) => element.stat.name === "defense").base_stat;
    pokemon.attack = pokeDetail.stats.find((element) => element.stat.name === "attack").base_stat;

    return pokemon;
}

// Função para pegar os detalhes do Pokémon usando a URL
pokeApi.getPokemonDetails = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then((pokemon) => {
            return convertPokeApiDetailToPokemon(pokemon);
        });
};

// Função para pegar uma lista de Pokémons com um limite e um deslocamento
pokeApi.getPokemons = (offset = 0, limit = 5) => {
    // URL da API com os parâmetros de offset e limit
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

    // Fazendo a requisição para a API e retornando a lista de Pokémons
    return fetch(url)
        .then((response) => response.json()) // Convertendo a resposta para JSON
        .then((jsonBody) => jsonBody.results) // Pegando apenas a lista de resultados
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetails)) // Pegando os detalhes de cada Pokémon
        .then((detailRequests) => Promise.all(detailRequests)) // Esperando todas as requisições terminarem
        .then((pokemonsDetails) => pokemonsDetails) // Retornando os detalhes dos Pokémons
        .catch((error) => console.log(error)); // Mostrando erro no console se algo der errado
};


// Função para pegar os detalhes do Pokémon usando o ID
pokeApi.getPokemonDetailsToProfile = (id) => {
    // URL da API com o ID do Pokémon
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;

    // Fazer a requisição para a API e retornar os detalhes do Pokémon
    return fetch(url)
        .then((response) => response.json()) // Convertendo a resposta para JSON
        .then((pokemonDetails) => {
            return convertPokeApiDetailToPokemon(pokemonDetails);
        })
        .catch((error) => console.log(error)); // Mostrando erro no console se algo der errado
};