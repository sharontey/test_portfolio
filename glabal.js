console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// let navlinks = $$('nav a');

// let currentLink = navLinks.find(
//   (a) => a.host === location.host && a.pathname === location.pathname,
// );

// if (currentLink) {
//   // or if (currentLink !== undefined)
//   currentLink?.classList.add('current');
// }



let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'contact/', title: 'Contact' },
  { url: 'resume/', title: 'Resume' },
  { url: 'https://github.com/sharontey', title: 'GitHub', external: true },
];


const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"                  // Local server
  : "/test_portfolio/";         // GitHub Pages repo name


let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;
  
  // Adjust URL with BASE_PATH for relative links
  if (!url.startsWith('http')) {
    url = BASE_PATH + url;
  }
  
  let a = document.createElement('a');
  a.href = url;
  a.textContent = p.title;
  
  // Add external link attributes
  if (p.external) {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }
  nav.append(a);
}

// Highlight current page
let currentLink = $$('nav a').find(
  (a) => a.host === location.host && a.pathname === location.pathname
);

currentLink?.classList.add('current');



// Function to set the color scheme
function setColorScheme(colorScheme) {
  document.documentElement.style.setProperty('color-scheme', colorScheme);
  
  // Update the select element to match
  const select = document.querySelector('.color-scheme select');
  if (select) {
    select.value = colorScheme;
  }
  
  // Save to localStorage
  localStorage.colorScheme = colorScheme;
}

// Create and insert the color scheme switcher
document.body.insertAdjacentHTML(
  'afterbegin',
  `
  <label class="color-scheme">
    Theme:
    <select>
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
  `
);

// Get reference to the select element
const select = document.querySelector('.color-scheme select');

// Add event listener for when user changes the theme
select.addEventListener('input', function(event) {
  setColorScheme(event.target.value);
});

// Check if user has a saved preference and apply it
if ("colorScheme" in localStorage) {
  setColorScheme(localStorage.colorScheme);
}

