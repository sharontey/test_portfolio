// index.js
import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

(async function() {
  try {
    // Fetch all projects from the JSON file
    const projects = await fetchJSON('./lib/projects.json');

    // Keep only the first 3 projects
    const latestProjects = projects.slice(0, 3);

    // Find the container for latest projects
    const projectsContainer = document.querySelector('.projects');

    const profileStats = document.querySelector('#profile-stats');

    if (!projectsContainer) {
      console.error('❌ .projects container not found on the page.');
      return;
    }

    // Render the first 3 projects
    renderProjects(latestProjects, projectsContainer, 'h2');

    // --- Fetch GitHub profile data ---
    const githubData = await fetchGitHubData('sharontey'); // 


    if (profileStats && githubData) {
        profileStats.innerHTML = `
            <dl>
            <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
            <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
            <dt>Followers:</dt><dd>${githubData.followers}</dd>
            <dt>Following:</dt><dd>${githubData.following}</dd>
            </dl>
        `;
        }

  } catch (error) {
    console.error('Error loading latest projects:', error);
  }
})();
