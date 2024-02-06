// Get the dark mode toggle and body element
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

// Function to hide the preloader and show dark mode toggle container
function hidePreloader() {
    document.getElementById('preloader').style.display = 'none';
    // Show dark mode toggle after preloader is hidden
    darkModeToggleContainer.classList.remove('hidden');
}

// Event listener for dark mode toggle
darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
});

// Event listener for window load
window.onload = function () {
    setTimeout(hidePreloader, 2500);
};

const darkModeToggleContainer = document.querySelector('.dark-mode-toggle-container');

