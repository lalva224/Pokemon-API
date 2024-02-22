//create a rand num for first API call
let rand_num = Math.ceil((Math.random()*100)) % 21
if(rand_num==0){rand_num=1}

//part of refresh logic

const refresh = ()=>{
    window.location.reload()
}
const fetchData = async()=>{

    //initial pokemon. get the desired data as a dictionary
    const pokemon= await fetchHelper(`https://pokeapi.co/api/v2/pokemon/${rand_num}`)
    //store dictionary data
    let ability_names = pokemon["ability_names"]
    let sprite = pokemon["sprite"]
    let types = pokemon["type"]
    let inital_pokemon_name = pokemon["name"]
    //create initial element from this data
    createElement(ability_names,types,inital_pokemon_name,sprite,true);
    //get each related pokemon
   let  related_pokemon =await get_related_pokemon(inital_pokemon_name,types)

   //api call just get 5 of the related pokemon
   for(let i =0; i<5;i++){
       const similar_pokemon = await  fetchHelper(`https://pokeapi.co/api/v2/pokemon/${related_pokemon[i]}`,false)
       let ability_names = similar_pokemon["ability_names"]
       let sprite = similar_pokemon["sprite"]
       let types = similar_pokemon["type"]
       let pokemon_name = similar_pokemon["name"]

       //create their elements too
       createElement(ability_names,types,pokemon_name,sprite,false);
   }


}

const fetchHelper = async(URL)=>{
    try{
        const response = await fetch(URL)
        const data = await response.json();
        let data_list = create_data(data)
        return data_list

    }
    catch(error){
        console.log(error)
    }
}

// const fetchHelper = async(URL,is_initial)=>{
//     //check for refresh -> if complete is false and clicked then refresh.


//     try{
//         const response = await fetch(URL)
//         const data = await response.json();
//         let data_list = create_data(data)
//         let ability_names = data_list["ability_names"]
//         let  type = data_list["type"]

//         let name = data_list["name"]
//         let sprite = data_list["sprite"]
//         createElement(ability_names,type,name,sprite,is_initial);


//         //return types 
       
//          pokemon ={
//             "name" : name,
//             "type" : type
//         }
//         return pokemon

//     }
//     catch(error){
//         console.log(error)
//     }
// }
const get_related_pokemon = async(inital_pokemon_name,types)=>{
    //once we get pokemon names, we can perform API calls on each one's details page to see if its the same type.
    let  pokemon_names =await get_all_pokemon_names()
    let related_pokemon = []
    let target_types = types.split(',');
    console.log(target_types)
    for(let pokemon_name of pokemon_names){
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon_name}`)
        const data = await response.json()
        let types = data.types
        let type_names = types.map(type=>type.type.name)
        let name = data.name
        console.log(type_names)
        if(type_names.some(type=>target_types.includes(type)) && name!=inital_pokemon_name){
            related_pokemon.push(pokemon_name)
           
        }
        

    
}
        return related_pokemon
}
const get_all_pokemon_names = async()=>{
    //all we need is name and type. With name we can perform more API searches through fetchHelper. With type we can check the type.
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/")
    const data = await response.json();
    let names = data.results.map(pokemon=>pokemon.name)
    return names
}

// const get_type_related_pokemon = (all_pokemon,target_types) =>{
//     //object.values to work with values of hashmap
//     //target types is currently a string, make it an array
//     let types = target_types.split(',')
//     let related_pokemon = Object.values(all_pokemon).filter((pokemon)=>{
//         types.some(type=>pokemon["types"].includes(type))
//     })
//     return related_pokemon
// }
const create_data = (data)=>{
    let abilities = data.abilities;
    let ability_names = abilities.map(ability=>ability.ability.name);
    ability_names = ability_names.toString();
    
    let types = data.types;
    //stringify this to make it much easier
    let type_names = types.map(type=>type.type.name)
    type_names = type_names.toString()

    let name = data.name;
    let sprite = data.sprites.front_default;
    let data_list = {
        "ability_names": ability_names,
        "type" : type_names,
        "name": name,
        "sprite": sprite
        
    }
    return data_list;
}

const createElement = (abiliies,type,name,sprite,is_initial) =>{
    // create the nodes. Start by finding super div and creating a div under it for the pokemon
    
    const super_parent = document.getElementById("data")
    const intial_node = document.getElementById("intial_node")
    const following_nodes = document.getElementById("following_nodes")
    //intial node goes in 1 div the others go in same div. Check if is_intial, if so add everything to intial node. if not then to follwoing nodes


    let name_node = document.createElement("p")
    let type_node = document.createElement("p")
    let abiltiy_node = document.createElement("p")
    let sprite_node = document.createElement("img")
    let header = document.createElement("h4")
    
    //stringify the array objects
    //type may be a number or an array check for that
 

    
    //set the contents
    name_node.textContent = "Name: "+ name
    sprite_node.setAttribute('src',sprite)
    type_node.textContent = "Type: " + type
    abiltiy_node.textContent = "Abilities: "+ abiliies

    // append to intial node if not then to following node
    let all_nodes = [name_node,sprite_node,type_node,abiltiy_node]
    if(is_initial){
        header.textContent = "Pokemon of similar types:"
        all_nodes.push(header)
        appendNodes(intial_node,all_nodes);

    }
    else{
        appendNodes(following_nodes,all_nodes);
    }

}
const appendNodes = (container,nodes) =>{
    nodes.forEach(node=> container.appendChild(node));
}



