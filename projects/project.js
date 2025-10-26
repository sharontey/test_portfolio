// Import functions from global.js
import { fetchJSON, renderProjects } from '../global.js';

(async function() {
  try {
    // Fetch project data from the JSON file
    const projects = await fetchJSON('../lib/projects.json');

    // Select the container where projects will be rendered
    const projectsContainer = document.querySelector('.projects');
    const titleElement = document.querySelector('.projects-title'); 

    // Check if the container exists
    if (!projectsContainer) {
      console.error('Projects container not found in the DOM');
      return;
    }

    // Render the projects, using <h2> for the project title
    renderProjects(projects, projectsContainer, 'h2');

    // Update the projects title with the number of projects
    if (titleElement && Array.isArray(projects)) {
      titleElement.textContent = `${projects.length} Projects`;
    }


  } catch (error) {
    console.error('Error loading projects:', error);
  }
})();

