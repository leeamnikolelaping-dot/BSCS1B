// 1. Create the reusable function
function handleFormSubmission(formId, typeName) {
    const form = document.getElementById(formId);
    
    // Safety check: only run if the form actually exists on the current page
    if (!form) return;

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Get values (these IDs should be the same in both forms)
        const title = form.querySelector('input[type="text"]').value;
        const status = document.getElementById('statusMessage');

        console.log(`Submitting ${typeName}:`, title);

        // Success message
        if (status) {
            status.innerHTML = `<p style="color: green;">Success! Your ${typeName} "${title}" has been submitted.</p>`;
        }

        this.reset();
    });
}

// 2. Initialize the logic for both (one will run depending on which page you are on)
handleFormSubmission('labForm', 'Lab');
handleFormSubmission('quizForm', 'Quiz');
handleFormSubmission('examForm', 'Exam');

// Function for handling the sidepanel interaction
function setupSidepanel() {
    const toggleBtn = document.getElementById('sidebarToggleBtn');
    const sidebar = document.getElementById('mySidebar');
    
    // Safety check: ensure both elements exist on this page
    if (!toggleBtn || !sidebar) return;

    // Listen for a click on the button
    toggleBtn.addEventListener('click', function() {
        // 'this' refers to the toggle button that was clicked
        // Toggling the 'active' class on both triggers the CSS transition
        sidebar.classList.toggle('active');
        this.classList.toggle('active');
    });
}

// Call the function when the script runs
setupSidepanel();