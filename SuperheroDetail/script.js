//Basic query fetched to be edited  according to superhero id 

let heroName = document.querySelector('.hero-name');
let heroImage = document.querySelector('.image');
let description= document.querySelector('.description');
let comics= document.querySelector('.comics>ul');
let events = document.querySelector('.events>ul');
let series = document.querySelector('.series>ul');
let stories = document.querySelector('.stories>ul');


let favbtn = document.querySelector('.fav');


let SuperheroData;


async function heroApiCall(id){




  // preparing hash value  
  let ts =  Number(new Date());        // time stamp
  let key ="b244ae57cfe21982db779954681eadba";
  let password="557b7d3f2c818344637dac5e123d06f8962dd083";
  let hash= CryptoJS.MD5(ts+password+key);


// preparing custom Url
 
  let idKey=`/${id}?ts=${ts}&apikey=b244ae57cfe21982db779954681eadba&hash=${hash}`;
  let url = `https://gateway.marvel.com/v1/public/characters${idKey}`;



// calling api and checking   
  let response = await fetch(url);
  if (!response.ok) {
      console.log("response error");
      throw new Error(`HTTP error! status: ${response.status}`);
      
  }
  //console.log("response ok offset by skipping"+skip);



  // fetching json from url response  
  const jsonData = await response.json();
  const data = await jsonData.data; 
 

  SuperheroData = await data.results[0];



  //creation begins




}


async function displayHeroPage(){
    //ading name title
   heroName.textContent =  SuperheroData.name;
   // adding image
   let imageurl = `${SuperheroData.thumbnail.path}.jpg` ;
   heroImage.style.backgroundImage = `url(${imageurl})`;
   // adding id to favbtn
   favbtn.setAttribute('id',`${SuperheroData.id}`);
   //adding description
   description.textContent = SuperheroData.description ? SuperheroData.description : "Sorry...Description not provided by API" ;

   //adding comics list
   let comicslist = SuperheroData.comics.items;
   comics.innerHTML="";
    
        // iterating all comics and adding
        for(let i=0; i<comicslist.length; i++){
            let list = document.createElement('li');
            list.className="list-group-item";
            list.innerText=comicslist[i].name;   
            comics.appendChild(list);
        }
    

     //adding comics list
   let eventslist = SuperheroData.events.items;
   events.innerHTML="";
    
        // iterating all events and adding
        for(let i=0; i<eventslist.length; i++){
            let list = document.createElement('li');
            list.className="list-group-item";
            list.innerText=eventslist[i].name;   
            events.appendChild(list);
        }


        //adding series list
   let serieslist = SuperheroData.series.items;
   series.innerHTML="";
    
        // iterating all series and adding
        for(let i=0; i<serieslist.length; i++){
            let list = document.createElement('li');
            list.className="list-group-item";
            list.innerText=serieslist[i].name;   
            series.appendChild(list);
        }


        //adding stories list
   let storieslist = SuperheroData.stories.items;
   stories.innerHTML="";
    
        // iterating all stories and adding
        for(let i=0; i<storieslist.length; i++){
            let list = document.createElement('li');
            list.className="list-group-item";
            list.innerText=storieslist[i].name;   
            stories.appendChild(list);
        }
        
        



}



window.onload = async  function() {
    let params = new URLSearchParams(window.location.search);
    let id = params.get('id');
    heroApiCall(id);
    heroApiCall(id).then(()=>{
        displayHeroPage();
    });
}



// this function add characters id to local storage
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


function allInputClick(e){
   
   
    let clicked = e.target;
  
    // favorite button
      if (clicked.classList.contains('fav')) {
          let favId = clicked.id;
          addfav(favId);
          clicked.style.backgroundColor = '#d40303';    
          console.log("fav id ="+favId);
         
        }
    }

//Actual event listener on click
document.addEventListener('click',allInputClick);