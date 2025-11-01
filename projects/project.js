// Import functions from global.js
import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// Fetch project data
let projects = await fetchJSON('../lib/projects.json');

// Search query variable
let query = '';
// Selected year variable (null means no year filter)
let selectedYear = null;

// Color scale (defined once for consistency)
let colors = d3.scaleOrdinal(d3.schemeTableau10);

// Helper function to apply both filters
function getFilteredProjects() {
  let filtered = projects;
  
  // Apply search filter
  if (query) {
    filtered = filtered.filter((project) => {
      let values = Object.values(project).join('\n').toLowerCase();
      return values.includes(query.toLowerCase());
    });
  }
  
  // Apply year filter
  if (selectedYear !== null) {
    filtered = filtered.filter((project) => project.year === selectedYear);
  }
  
  return filtered;
}

// Refactor all plotting into one function
function renderPieChart(projectsGiven) {
  // Re-calculate rolled data
  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );
  
  // Re-calculate data
  let newData = newRolledData.map(([year, count]) => {
    return { value: count, label: year };
  });
  
  // Re-calculate slice generator, arc data, arc, etc.
  let newSliceGenerator = d3.pie().value((d) => d.value);
  let newArcData = newSliceGenerator(newData);
  
  let newArcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(50);
  
  // Clear up paths and legends
  let svg = d3.select('#projects-pie-plot');
  svg.selectAll('path').remove();
  
  let legend = d3.select('.legend');
  legend.selectAll('li').remove();
  
  // Update paths
  svg
    .attr('viewBox', '-60 -60 120 120')
    .selectAll('path')
    .data(newArcData)
    .enter()
    .append('path')
    .attr('d', newArcGenerator)
    .attr('fill', (d, i) => colors(i))
    .attr('stroke', (d) => d.data.label === selectedYear ? '#000' : 'none')
    .attr('stroke-width', (d) => d.data.label === selectedYear ? 2 : 0)
    .style('cursor', 'pointer')
    .on('click', function(event, d) {
      // Toggle year selection
      if (selectedYear === d.data.label) {
        selectedYear = null; // Deselect if clicking same year
      } else {
        selectedYear = d.data.label; // Select new year
      }
      
      // Re-render with combined filters
      updateView();
    });
  
  // Update legends
  newData.forEach((d, idx) => {
    legend
      .append('li')
      .attr('class', 'legend-item')
      .attr('style', `--color:${colors(idx)}`)
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}

// Function to update the entire view
function updateView() {
  const filteredProjects = getFilteredProjects();
  const projectsContainer = document.querySelector('.projects');
  const titleElement = document.querySelector('.projects-title');
  
  // Render filtered projects
  renderProjects(filteredProjects, projectsContainer, 'h2');
  
  // Update title with filtered count
  if (titleElement) {
    titleElement.textContent = `${filteredProjects.length} Projects`;
  }
  
  // Re-render pie chart with filtered data
  renderPieChart(filteredProjects);
}

// Initial render on page load
(async function() {
  try {
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

    // Call renderPieChart on page load
    renderPieChart(projects);

  } catch (error) {
    console.error('Error loading projects:', error);
  }
})();

// Search functionality
let searchInput = document.querySelector('.searchBar');

if (searchInput) {
  searchInput.addEventListener('input', (event) => {
    // Update query value
    query = event.target.value;
    
    // Update view with combined filters
    updateView();
  });
}
