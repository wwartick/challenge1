var apiUrl= "https://api.jikan.moe/v4/anime?q=&sfw";
var result = [];


function searchAnime(event){

    fetch(apiUrl).then(function(response){
       
     if(response.ok){
        response.json().then(function(data){

            for(var i in data)
            result.push([i,data[i]]);

            var random = Math.floor(Math.random() * result[1][1].length)
            var randomUrl = result[1][1][random].url;

       
            window.open(randomUrl, '_blank').focus();
            /*window.location = (randomUrl); */
            console.log(randomUrl);

        });
     }
     else{
        alert("There was a problem with your request");
     }
    });
}



function pageLoaded(){
    const form=document.getElementById('random-button');
    form.addEventListener('click', searchAnime);
   
}
 window.addEventListener("load", pageLoaded);