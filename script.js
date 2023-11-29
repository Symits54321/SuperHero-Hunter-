                   
// basic classes fetched from html to be edited by javascript

let mainPage = document.querySelector('#main');
let favList = document.querySelector('.fav-List');
let searchInput = document.querySelector('.search-input');
let apiProgress = document.querySelector('#api-progress');





let globalCharacters=[];  // array to store full characters object array (JSON)


let favCharacters;   // variable for favcharacter to be stored



//current page (not neede if fixed  value)---(you can change the limit but limit<100)
let offset = 0;  //  value of characters to be skipped   
let limit=30;  //limit of characters to be loaded 
let total;     // total result send bt api





//api function manages fetching the json from api url for 1st homepage

async function api(){
  
  // preparing hash value  
    let ts =  Number(new Date());        // time stamp
    let key ="b244ae57cfe21982db779954681eadba";
    let password="557b7d3f2c818344637dac5e123d06f8962dd083";
    let hash= CryptoJS.MD5(ts+password+key);


  // preparing Url
    let addtoquery=`limit=${limit}&offset=${offset}&`;
    let queryKey=`?${addtoquery}ts=${ts}&apikey=b244ae57cfe21982db779954681eadba&hash=${hash}`;
    let url = `https://gateway.marvel.com/v1/public/characters${queryKey}`;


 
  // calling api and checking   
    let response = await fetch(url);
    if (!response.ok) {
        console.log("response error");
        throw new Error(`HTTP error! status: ${response.status}`);
        
    }
    console.log("response first homepage ok");



    // fetching json from url response  
    const jsonData = await response.json();
    const marveldata=jsonData.data;
       
    // consoling limit 
    console.log(`limit(The requested result limit)=${marveldata.limit}`);
    console.log(`total(The total number of resources available given the current filter set.)=${marveldata.total}`);
    console.log(`count(The total number of results returned by this call.,)=${marveldata.count}`);
    console.log(`offset(The total number of results skipped by this call.,)=${marveldata.offset}`);
   
    total=marveldata.total;
    limit=marveldata.limit;



     const characters=marveldata.results;
     displayHompage(characters);
     //globalCharacters=characters;

  




   
  
}


// fulljson api manages storing of full characters (1563) from api calls
async function fulljsonfetch(skip){

 let loadedval = Math.floor(skip/15);

 console.log("api fetched = "+loadedval+"%");
 apiProgress.textContent =`Loading ${loadedval}%`;

 if (loadedval === 100) {
  setTimeout(() => {
    apiProgress.textContent = "";
  }, 1500);
}
  
  // preparing hash value  
  let ts =  Number(new Date());        // time stamp
  let key ="b244ae57cfe21982db779954681eadba";
  let password="557b7d3f2c818344637dac5e123d06f8962dd083";
  let hash= CryptoJS.MD5(ts+password+key);


// preparing custom Url
  let addtoquery=`limit=100&offset=${skip}&`;
  let queryKey=`?${addtoquery}ts=${ts}&apikey=b244ae57cfe21982db779954681eadba&hash=${hash}`;
  let url = `https://gateway.marvel.com/v1/public/characters${queryKey}`;



// calling api and checking   
  let response = await fetch(url);
  if (!response.ok) {
      console.log("response error");
      throw new Error(`HTTP error! status: ${response.status}`);
      
  }
  //console.log("response ok offset by skipping"+skip);



  // fetching json from url response  
  const jsonData = await response.json();
  const marveldata = await jsonData.data; 
 

  
   const characters = await marveldata.results;

   let compressedCharacters= await characters.map(obj =>({

       id:obj.id,
       name:obj.name,
       thumbnail:obj.thumbnail

   })

   );
  
  //appending to globalCharacters
   globalCharacters=[...globalCharacters,...compressedCharacters];
   
 

}



// displayHomepage manages display of  top 20  characters  in homepage from input array in its parenthesis
async function displayHompage(characters){

              console.log(`total characters = ${characters.length}`);
let length;

if(characters.length<30){
  length=characters.length;
}else{
  length=30;
}

 // refreshing mainpage
 mainPage.innerHTML=``;

  for(let i=0; i<length; i++){    // showing the top 20 suggestion

    let card = document.createElement('div');
    card.setAttribute('class', 'card my-4 mx-auto');
    //card.setAttribute('style', 'width: 12rem;');

    let imageUrl = JSON.stringify(characters[i].thumbnail.path +'.jpg');
    let id=characters[i].id;
    let name=characters[i].name;
    let desc=characters[i].description;

    card.setAttribute('id', id);

    card.innerHTML = `

    <img src=${imageUrl} class="card-img-top" alt="...">
    <div class="card-body" id="${id}" >
      <h5 class="card-title mt-auto " style="color:white;">${name}</h5>
      <p class="card-text"></p>
      <a   class="btn btn-danger fav" id="${id}">Add favourite</a>
    </div>
    
    `;

    mainPage.appendChild(card);

  }
    


}



// call api is like director which tells to (store api/ call api) according to the data present in local storage

async function callapi(){

   let apiStorer = JSON.parse(localStorage.getItem("herosupers"));
   console.log("This is your apistorer =");

   if(apiStorer){
      console.log("saved file run");
      globalCharacters = apiStorer;
      displayHompage(globalCharacters); 

   }else{ 

       alert("As you are opening Superhero website for first time..Click ok and  see the progress at top right of the page and wait to use until it gets 100%..");

         api(); // adds top 63 elements and calls displayHomepage

          // adding full file of json (Since limit cannot exceed 100)
          // so we have to call by for loop 
         await (async () => {
            
          
            for (let i = 0; i < 16; i++) {
              await fulljsonfetch(100 * i); // adding arrays to global characters
              if (i === 15) {
                console.log("full api fetch successfull");
                alert("Loading succesful...Now you can use the app anytime easily without lag");
              }
            }
          })().then(() => {
            // set in local storage
            // console.log(globalCharacters);
          
            // let StringfiedGlobalCharacters = JSON.stringify(globalCharacters);
            localStorage.setItem("herosupers", JSON.stringify(globalCharacters));
          });

         
     
   }


}
callapi();   // calls api saves Marvel characters in array form




// this function manages displaying favorate items (from local storage) in fav list
async function displayfavList(){


  
 
  // fetching fav data
   let favStorage = JSON.parse(localStorage.getItem("favhero")) || [];
 
  // cleaning favList
    favList.innerHTML = '';


  // filtering fav and adding html
  for (let itemId of favStorage) {

      //make a new favchracter json
    
      let item = globalCharacters.filter(x => x.id==itemId);
      //console.log(item[0]);

      let imageUrl = (item[0].thumbnail.path +'.jpg');
      let id=item[0].id;
      let name=item[0].name;

      let list = document.createElement('LI');
      list.setAttribute('id',id);
      list.setAttribute('class','favlist');
      list.innerHTML = `


      <div class="image" style=" background-image: url(${imageUrl});
      "></div>
      <a class="dropdown-item favlist" id="${id}"><span>${name} </span></a>
      <div class="delete ms-auto" id="${id}"></div>
      `;
     
      favList.appendChild(list);
  }
}





// this function deletes character id from local storage
async function deletefav(characterId){

  // Fetch the favorite characters present in local storage in an array form
       let storageFetched = localStorage.getItem("favhero");

  // If favorites is empty then add new array or else parse the array 
         let storage = storageFetched ? JSON.parse(storageFetched) : [];

  // Remove the character from storage
        storage = storage.filter(id => id !== characterId);

  // stringify storage
      let  strstorage=JSON.stringify(storage);

  // Update local storage  
        localStorage.setItem("favhero", strstorage);
}



// this function add character id to local storage
async function addfav(characterId){ 

  // Fetched the favorate character present in local storage in an array form
         let storageFetched = localStorage.getItem("favhero");

 // If favorates is empty then add new array or else parse the array 
         let storage = storageFetched ? JSON.parse(storageFetched) : [];

 // Add new meal in storage
          if(!storage.includes(characterId)){
                      storage.push(characterId);
          }else{
            alert("already added in fav list");
          }

 // Update local storage  
         localStorage.setItem("favhero",JSON.stringify(storage));

}


// filterSearchResult filter out the array whose each object name value matches the text string
async function filterSearchResult(array,text){

  let filteredArray = await array.filter(hero => hero.name.substring(0,text.length).toLowerCase() === text.toLowerCase());

  return filteredArray;
}

//give search suggestion

async function giveSuggestion(text){

 
  let filterHeros = await filterSearchResult(globalCharacters,text);

  await displayHompage(filterHeros);



}

//

//--*_*_*_****____-- Event listener managing area----------


function allInputClick(e){
   
   
  let clicked = e.target;

          // --- Add favorite button
            if (clicked.classList.contains('fav')) {
                let favId = clicked.id;
                addfav(favId);
                clicked.style.backgroundColor = '#d40303';    
                console.log("fav id ="+favId);
                displayfavList();
              }
          
              if (clicked.classList.contains('myFavbtn')) {
                displayfavList();
                
              }
          

      

        // --- Delete button
        
        if (clicked.classList.contains('delete')) {
            //fetched the id to be removed
            let removeId =  clicked.id;
            console.log("remove btn clicked");
            //then delete 
            deletefav(removeId).then(                 
                //then refresh
                displayfavList()
                );
        }
      
        
        // --- Superherodetailpage Open 
        if  ((clicked.classList.contains('card') || clicked.parentNode.classList.contains('card') || clicked.parentNode.classList.contains('card-body') || clicked.parentNode.classList.contains('favlist')) && !clicked.classList.contains('fav') && !clicked.classList.contains('delete') ){ 

          console.log("Superhero Clicked");
        
            // if(clicked.classList.contains('fav-list-removebtn')){
            //     return;
            // }
            // open SuperHero.html page
              ( async ()=> {
                if(searchInput){
                searchInput.value="";
                }


                // Replace 'yourURL' with the URL you want to open in a new tab
                const urlToOpen = `./SuperheroDetail/superhero.html?id=${clicked.id}`;
                // Open the URL in a new tab
                window.open(urlToOpen, '_blank');

           
                //let params = new URLSearchParams(window.location.search);
              
                console.log("refered");

              })();
          
            
        }
    
 
  console.log("You clicked class = "+clicked.classList);
  console.log("You clicked class parent = "+clicked.parentNode.classList);
}


//Actual event listener on click
document.addEventListener('click',allInputClick);


//search input event keyup listener
if(searchInput){
  searchInput.addEventListener('keyup', async (e) => {
  
      let inputText = e.target.value;
  
      if(inputText){
            giveSuggestion(inputText);
            console.log("you typed"+inputText);
      }
      
      else{
          displayHompage(globalCharacters);
      }
     
  });

}
  

// initial display of whatever stored in local storage to displayfavlist
  displayfavList();