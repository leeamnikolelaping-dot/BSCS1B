const getCategory = () => {
    const path = window.location.pathname;
    if (path.includes('lab')) return 'uploads_lab';
    if (path.includes('exam')) return 'uploads_exam';
    return 'uploads_quiz'; // Default fallback
};

const CURRENT_STORAGE_KEY = getCategory();

document.addEventListener('DOMContentLoaded', () => {
    displaySavedFiles();
    setupSidepanel(); // Ensure sidebar still works
});

const uploadForm = document.querySelector('.uploadForm');
if (uploadForm) {
    uploadForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const mainFile = document.querySelector('input[type="file"]:not(#proofImage)').files[0];
        const proofImage = document.getElementById('proofImage').files[0];

        if (!mainFile || !proofImage) return alert("Please select both files!");

        // Convert files to Base64
        const fileData = await toBase64(mainFile);
        const proofData = await toBase64(proofImage);

        const newEntry = {
            id: Date.now(),
            title: title,
            fileName: mainFile.name,
            fileContent: fileData,
            proof: proofData,
            date: new Date().toLocaleString()
        };

        // Save specifically to the current category (Lab, Quiz, or Exam)
        const savedData = JSON.parse(localStorage.getItem(CURRENT_STORAGE_KEY) || '[]');
        savedData.push(newEntry);
        localStorage.setItem(CURRENT_STORAGE_KEY, JSON.stringify(savedData));

        alert(`Successfully saved to ${CURRENT_STORAGE_KEY.replace('uploads_', '')}!`);
        uploadForm.reset();
        displaySavedFiles();
    });
}

function displaySavedFiles() {
    const container = document.getElementById('localFileContainer');
    if (!container) return;

    const data = JSON.parse(localStorage.getItem(CURRENT_STORAGE_KEY) || '[]');
    
    if (data.length === 0) {
        const category = CURRENT_STORAGE_KEY.split('_')[1];
        const displayNames = {
            quiz: "quizzes",
            lab: "lab works",
            exam: "exams"
        };
        const finalName = displayNames[category] || category;
        container.innerHTML = `<p>No ${finalName} uploaded yet.</p>`;
        return;
    }

    container.innerHTML = data.map(item => `
        <div class="quiz-card">
            <h3>${item.title}</h3>
            <img src="${item.proof}" alt="Proof" class="proof-preview">
            <p><small>File: ${item.fileName} | Date: ${item.date}</small></p>
            <div class="card-actions">
                <a href="${item.fileContent}" download="${item.fileName}" class="download-link">⬇️ Download File</a>
                <button class="delete-btn" onclick="deleteEntry(${item.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function deleteEntry(id) {
    if (confirm("Delete this entry?")) {
        let data = JSON.parse(localStorage.getItem(CURRENT_STORAGE_KEY) || '[]');
        data = data.filter(item => item.id !== id);
        localStorage.setItem(CURRENT_STORAGE_KEY, JSON.stringify(data));
        displaySavedFiles();
    }
}

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function setupSidepanel() {
    const toggleBtn = document.getElementById('sidebarToggleBtn');
    const sidebar = document.getElementById('mySidebar');
    
    // Safety check: ensure both elements exist on this page
    if (!toggleBtn || !sidebar) return;

    // Listen for a click on the button
    toggleBtn.onclick = function() {
        sidebar.classList.toggle('active');
        this.classList.toggle('active');
    };
}

document.addEventListener('DOMContentLoaded', () => {
    displaySavedFiles(); // Load the correct list (Quiz, Lab, or Exam)
    setupSidepanel();    // Start the sidebar listener
});
