// define the pages for the navigation bar
let pages = [
    {title:"Home", url:""},
    {title:"Game", url:"Game/"},
    {title:"Data", url:"Data/"},
    {title:"Settings", url:"Settings/"},
];

// boolean value indicating whether on home page
const AT_HOME_PAGE = document.documentElement.classList.contains("home");

// create navigation bar
let nav = document.createElement("nav");
document.body.prepend(nav);

// creates each webpage
for(let p of pages)
{
   let title = p.title;
   let url = p.url;

   let a = document.createElement("a");

   // adjusts the url if we are not on the home page
   if (!AT_HOME_PAGE && !url.startsWith("http"))
   {
        url = "../" + url + "index.html";
        console.log("Creating elements not on home page", url);
   }

   else if( AT_HOME_PAGE)
   {
      url = "./" +  url + "index.html";
      console.log("Creating elements on home page", url);
   }

   a.href = url;
   a.textContent = title;

   // checks which page user is currently at
   if (a.host === location.host && a.pathname === location.pathname)
   {
        a.classList.add("current"); // marks the current page user is on
   }
   nav.append(a); // adds page to navbar
}