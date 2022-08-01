const getPokemonUrl = id => `https://pokeapi.co/api/v2/pokemon/${id}`;

const generatePokemonPromises = () => Array(150).fill().map((_, index) =>
    fetch(getPokemonUrl(index + 1)).then(response => response.json()));

const generateHTML = pokemons => pokemons.reduce((accumulator, { name, id, height, weight, abilities, stats, types}) =>  {
    const elementTypes = types.map(typeInfo => typeInfo.type.name);
    const elementAbility = abilities.map(abilityInfo => abilityInfo.ability.name);
    const elementStat = stats.map(statInfo => statInfo.base_stat);
    const calcHeight = height/10 + "m"; 
    const calcWeight = weight/10 + "kg";

    accumulator += `
    <li class="pokemon-info">
            <div class="pokemon-card">
                <span class="img">
                    <h4>#${id}</h4>
                    <img src="https://raw.githubusercontent.com/pokeAPI/sprites/master/sprites/pokemon/${id}.png"">
                </span>
                <span>
                <h4 class="name">${name}</h4>
                </span>
                <h4 class="type ${elementTypes[0]} ${elementTypes[1]}">${elementTypes.join(' • ')}</h4>
                <div>
                <span class="ability">${elementAbility[0]}</span>
                </div>
                <div class="height">${calcHeight}</div>
                <div class="weight">${calcWeight}</div>
            </div>
            <div class="pokemon-physics">
            <table>
            <tr id="hp">                       
                <td><h4>Hp</h4</td>
                <td><h5>${elementStat[0]}</h5></td>
                <td><div class="bar"><span></span></div></td>
            </tr>
            <tr id="attack">  
                <td><h4>Attack</h4</td>
                <td><h5>${elementStat[1]}</h5></td>
                <td><div class="bar"><span></span></div></td>
            </tr>
            <tr id="deffense">  
                <td><h4>Deffense</h4</td>
                <td><h5>${elementStat[2]}</h5></td>
                <td><div class="bar"><span></span></div></td>
            </tr>
            <tr id="special-attack">  
                <td><h4>Special Attack</h4</td>
                <td><h5>${elementStat[3]}</h5></td>
                <td><div class="bar"><span></span></div></td>
            </tr>
            <tr id="special-deffense">  
                <td><h4>Special Defense</h4</td>
                <td><h5>${elementStat[4]}</h5></td>
                <td><div class="bar"><span></span></div></td>
            </tr>
            <tr id="speed">  
                <td><h4>Speed</h4</td>
                <td><h5>${elementStat[5]}</h5></td>
                <td><div class="bar"><span></span></div></td>
            </tr>
            
        </table>
            </div>
            <button class="show-button" name="${id}">Show Details</button>
        </li>
    `

    return accumulator;
}, '');

const insertPokemonStat = pokemonUl => {
    const tableRows = pokemonUl.querySelectorAll('li tr')
    tableRows.forEach(element => {
        const stat = element.querySelector('td h5').textContent;
        const span = element.querySelector('td .bar span');
        if(stat <= 50){
            span.style.width = stat + "px";
            span.style.backgroundColor = "#e15757";
        }
        if(stat > 50 & stat <= 100){
            span.style.width = stat + "px";
            span.style.backgroundColor = "#f59c0e";
        }
        if(stat > 100 & stat <= 150){
            span.style.width = stat + "px";
            span.style.backgroundColor = "#f5c60a";
        }
        if(stat > 150){
            span.style.width = stat + "px";
            span.style.backgroundColor = "#6ca74f";
        }
    });
};

const insertPokemonsIntoPage = pokemons => {
    const ul = document.querySelector('#pokemon-list');
    ul.innerHTML = pokemons;
    return ul;
}

const filter = () => {
    const types = document.querySelectorAll('ul li h4.type');
    const filterBtns = document.querySelectorAll('#side-nav button');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            types.forEach(type => {
                if(!type.className.toLowerCase().includes(btn.className.toLowerCase())){
                    type.parentNode.parentElement.style.display = 'none';
                }else{
                    type.parentNode.parentElement.style.display = 'flex';
                }


                if(btn.className == "all"){
                    type.parentNode.parentElement.style.display = 'flex';
                }
            });
        })
    });
};

const pokemonPromises = generatePokemonPromises();

Promise.all(pokemonPromises)
.then(generateHTML)
.then(insertPokemonsIntoPage)
.then(insertPokemonStat)
.then(filter);
