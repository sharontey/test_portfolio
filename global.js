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

// Asynchronous function to fetch JSON data from a given URL
export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);

    // Check if the response is OK (status in the range 200-299)
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    // Log the response for debugging (optional)
    console.log(response);

    // Parse the response JSON into a usable JavaScript object/array
    const data = await response.json();

    // Return the parsed data
    return data;

  } catch (error) {
    // Catch and log any errors during fetch or parsing
    console.error('Error fetching or parsing JSON data:', error);
  }
}


/**
 * Dynamically renders project data into a container element.
 * @param {Array} projects - Array of project objects with keys: title, image, description
 * @param {HTMLElement} containerElement - The DOM element to append project articles to
 * @param {string} headingLevel - Optional heading level tag (default 'h2')
 */
export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  // Validate container element
  if (!containerElement || !(containerElement instanceof HTMLElement)) {
    console.error('Invalid container element provided.');
    return;
  }

  // Validate projects parameter
  if (!Array.isArray(projects) || projects.length === 0) {
    containerElement.innerHTML = '<p>No projects to display at the moment.</p>';
    return;
  }

  // Validate heading level (only allow h1–h6)
  const validHeadings = ['h1','h2','h3','h4','h5','h6'];
  if (!validHeadings.includes(headingLevel)) {
    console.warn(`Invalid heading level "${headingLevel}" provided. Defaulting to h2.`);
    headingLevel = 'h2';
  }

  // Clear existing content
  containerElement.innerHTML = '';

  // Loop through each project and create an article element
  projects.forEach(project => {
    const article = document.createElement('article');

    // Handle missing properties gracefully
    const title = project.title || 'Untitled Project';
    const image = project.image || 'placeholder.jpg'; // fallback image
    const description = project.description || 'No description available.';
    const year = project.year || 'Year not specified';

    // Set the innerHTML with dynamic heading level
    article.innerHTML = `
      <${headingLevel}>${title}</${headingLevel}>
      <img src="${image}" alt="${title}">
      <div class="project-info">
        <p>${description}</p>
        <p class="project-year">${year}</p>
      </div>
    `;

    // Append the article to the container
    containerElement.appendChild(article);
  });
}

export async function fetchGitHubData(sharontey) {
  return fetchJSON(`https://api.github.com/users/${sharontey}`);
}

