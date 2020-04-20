const customHTML = new HTMLRewriter()
    .on('title', { element: e => e.setInnerContent(getRandomPlugin[0]) })
    .on('h1#title', { element: e => e.prepend("This is") })
    .on('p#description', { element: e => e.setInnerContent("Let's Fight Corona Virus") })
    .on('a#url', { 
     
      element: e => {
       
        e.setInnerContent(`${getRandomPlugin[1]}`)
        .setAttribute("href", getRandomPlugin[2]) 
      }
    });




addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})




const parseCookies = (request)=> {
  //parses the cookie information and returns an object with all the cookies parsed
  var cookies = {};
  if(request.headers.cookie){
    request.headers.cookie.split(';').forEach(cookie=> {
      var parts = cookie.match(/(.*?)=(.*)$/)
      cookies[ parts[1].trim() ] = (parts[2] || '').trim();
    });
  }
  
  return cookies;
};

/**
 * Rewrite the webpage and return to user
 * @param {Request} request
 */
async function handleRequest(request) {
  //fetches the data from the specified url
  let variants = (await fetch(apiUrl)
                  .then(res => res.json()))["variants"];  
  //search for stored URL in cookies
  let variantUrl = parseCookies(request)['defaultRedirect'];
  
  //if no URL was found in the cookies genereate random URL
  if (!variantUrl) {
    variantId= Math.floor(variants.length * Math.random()); 
    variantUrl = variants[variantId];
  }
  else{
    variantId = Number(variantUrl[variantUrl.length-1]);
  }
  getRandomPlugin = plugins[variantId];
   
  //Customize the webpage
  let customPage= await fetch(variantUrl).then(res => customHTML.transform(res));  // fetch the variant webpage and rewrite it
  customPage.headers.append("Set-Cookie", `defaultRedirect=${variantUrl}`);  // set cookie on client side
  return customPage
}

const apiUrl = "https://cfw-takehome.developers.workers.dev/api/variants";
const plugins ={
  0 : ["Shlok's Resume","My Resume","https://drive.google.com/open?id=1dEi8JE7WSamC2-bHh40ebKNhDWDjc_kj"],
  1: ["Shlok's Project", "My Project", "https://react-face-reader.herokuapp.com/"]
}
let getRandomPlugin;
