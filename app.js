function hideAll() {
  document.querySelectorAll('.section-content, .sub-section-content, .detail-section').forEach(el => {
    el.classList.remove('active'); el.style.display = 'none';
  });
  const uploadNotice = document.getElementById('uploadNotice'); if (uploadNotice) uploadNotice.style.display = 'none';
  const updates = document.getElementById('updates'); if (updates) updates.style.display = 'none';
}
function toggleMain(id) {
  hideAll();
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('active');

  if (id === 'Home') {
    el.style.display = 'flex';
    const updates = document.getElementById('updates');
    if (updates) { updates.style.display = 'flex'; updates.classList.add('active'); }
    const uploadNotice = document.getElementById('uploadNotice');
    if (uploadNotice) uploadNotice.style.display = 'none';
    return;
  }

  if (id === 'Upload') {
    el.style.display = 'block';
    const uploadNotice = document.getElementById('uploadNotice');
    if (uploadNotice) uploadNotice.style.display = 'block';
    const loginEl = document.querySelector('#Upload #adminLogin');
    const formEl = document.querySelector('#Upload #uploadForm');
    const isAdmin = sessionStorage.getItem('isAdmin') === '1';
    if (loginEl) loginEl.style.display = isAdmin ? 'none' : 'block';
    if (formEl) formEl.style.display = isAdmin ? 'block' : 'none';
    return;
  }

  // New: initialize resources view when user opens "Resources"
  if (id === 'resources') {
    el.style.display = 'block';
    const uploadNotice = document.getElementById('uploadNotice');
    if (uploadNotice) uploadNotice.style.display = 'none';

    // Ensure hint is visible and reset results/search state
    const hintEl = document.querySelector('.resources-side-full .hint');
    const resultsList = document.getElementById('resourceResults');
    const noResults = document.getElementById('no-results');
    const searchInput = document.getElementById('searchBox');
    const domainSelect = document.getElementById('domainSelectPapers');

    if (hintEl) hintEl.style.display = 'block';
    if (resultsList) resultsList.innerHTML = '<p class="placeholder">Select a domain to view available papers</p>';
    if (noResults) { noResults.style.display = 'none'; noResults.classList.add('hidden'); }
    if (searchInput) { searchInput.value = ''; searchInput.disabled = true; }
    if (domainSelect) domainSelect.value = ''; // keep domain unselected on entry

    return;
  }

  el.style.display = 'block';
  const uploadNotice = document.getElementById('uploadNotice');
  if (uploadNotice) uploadNotice.style.display = 'none';
}
function validateAdmin(event){event.preventDefault();const adminId=document.getElementById('adminId')?.value||'';const password=document.getElementById('adminPassword')?.value||'';if(adminId==='admin'&&password==='admin123'){sessionStorage.setItem('isAdmin','1');document.querySelector('#Upload #adminLogin').style.display='none';document.querySelector('#Upload #uploadForm').style.display='block';alert('Admin verified. You can upload now.');}else alert('Invalid credentials. Only admin can upload files.');}
function adminLogout(){sessionStorage.removeItem('isAdmin');document.querySelector('#Upload #adminLogin').style.display='block';document.querySelector('#Upload #uploadForm').style.display='none';alert('Logged out.');}
async function handleUpload(event) {
    event.preventDefault();
    if (sessionStorage.getItem('isAdmin') !== '1') {
        alert('Only admin can upload files.');
        return;
    }

    const formData = {
        title: document.getElementById('resType').value,
        domain: document.getElementById('domainSelect').value,
        branch: document.getElementById('branchSelect').value,
        year: new Date().getFullYear().toString(),
        category: 'mid', // or get from a select
        link: 'https://drive.google.com/your-file-link' // replace with actual upload logic
    };

    try {
        const response = await fetch('http://localhost:5000/api/papers/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) throw new Error('Upload failed');
        
        alert('Paper uploaded successfully!');
        document.getElementById('resourceUploadForm').reset();
    } catch (error) {
        console.error('Upload error:', error);
        alert('Failed to upload paper. Please try again.');
    }
}
function quickSearch(searchTerm) {
  const list = document.getElementById('papersList');
  const items = list.getElementsByTagName('li');
  
  // No search term - show everything
  if (!searchTerm) {
    for (let item of items) {
      item.style.display = '';
    }
    return;
  }

  searchTerm = searchTerm.toLowerCase();
  
  // Filter items
  for (let item of items) {
    const text = item.textContent.toLowerCase();
    if (text.includes(searchTerm)) {
      item.style.display = '';
      // Highlight matching text (optional)
      const regex = new RegExp(`(${searchTerm})`, 'gi');
      item.innerHTML = item.textContent.replace(
        regex, 
        '<span style="background-color:#fff3cd;padding:0 2px;border-radius:2px;">$1</span>'
      );
    } else {
      item.style.display = 'none';
    }
  }
}
// function quickSearch() {
//     const searchBox = document.getElementById('searchBox');
//     const papers = document.querySelectorAll('.paper-item');
    
//     if (!searchBox || !papers.length) return;

//     searchBox.addEventListener('keyup', () => {
//         const query = searchBox.value.toLowerCase();
        
//         papers.forEach(paper => {
//             const text = paper.textContent.toLowerCase();
//             // Show/hide based on search match
//             paper.style.display = text.includes(query) ? 'block' : 'none';
//         });
//     });
// }

// 🔍 Search Filter Logic
document.addEventListener("DOMContentLoaded", () => {
  const searchBox = document.getElementById("searchBox");
  const resources = document.querySelectorAll(".resource");

  searchBox.addEventListener("keyup", () => {
    const query = searchBox.value.toLowerCase();
    resources.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(query) ? "block" : "none";
    });
  });
});



let papers = []; // Store papers data

function showPapers(domain) {
    const resultsList = document.getElementById('resourceResults');
    const searchInput = document.getElementById('searchBox');
    const noResults = document.getElementById('no-results');
    
    // Reset search and hide no-results
    searchInput.value = '';
    noResults.style.display = 'none';
    
    if (!domain) {
        resultsList.innerHTML = '<p class="placeholder">Select a domain to view available papers </p>';
        searchInput.disabled = true;
        return;
    }

    // Simulated paper data
    const papers = domain === "B.Tech" ? [
        { title: "DBMS Mid Term 2022", year: "2022", link: "#" },
        { title: "Operating Systems Final 2023", year: "2023", link: "#" },
        { title: "Data Structures Lab 2021", year: "2021", link: "#" }
    ] : domain === "Diploma" ? [
        { title: "Diploma Mathematics 2020", year: "2020", link: "#" },
        { title: "Physics Lab Manual 2021", year: "2021", link: "#" }
    ] : [];

    if (papers.length === 0) {
        resultsList.innerHTML = '<p class="placeholder">No papers found for this domain</p>';
        searchInput.disabled = true;
        return;
    }

    resultsList.innerHTML = papers.map(paper => `
        <div class="paper-item" data-title="${paper.title}" data-year="${paper.year}">
            <div class="paper-title">${paper.title}</div>
            <div class="paper-meta">${paper.year}</div>
        </div>
    `).join('');

    // Enable search after loading papers
    searchInput.disabled = false;
}

function quickSearch() {
    const searchInput = document.getElementById('searchBox');
    const resultsList = document.getElementById('resourceResults');
    const noResults = document.getElementById('no-results');
    const papers = resultsList.getElementsByClassName('paper-item');
    const query = searchInput.value.toLowerCase().trim();

    let foundMatch = false;

    Array.from(papers).forEach(paper => {
        const title = paper.getAttribute('data-title').toLowerCase();
        const year = paper.getAttribute('data-year').toLowerCase();
        const matches = title.includes(query) || year.includes(query);

        paper.style.display = matches ? 'block' : 'none';
        
        if (matches) {
            foundMatch = true;
            if (query) {
                paper.querySelector('.paper-title').innerHTML = 
                    paper.getAttribute('data-title').replace(
                        new RegExp(query, 'gi'),
                        match => `<span class="highlight">${match}</span>`
                    );
            } else {
                paper.querySelector('.paper-title').textContent = 
                    paper.getAttribute('data-title');
            }
        }
    });

    noResults.style.display = query && !foundMatch ? 'block' : 'none';
}

// Add event listener for search input
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchBox');
    if (searchInput) {
        searchInput.addEventListener('input', quickSearch);
    }
});

function openPaper(url, title) {
    if (!url) {
        alert('Paper URL not available');
        return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
}

window.addEventListener('DOMContentLoaded',()=>{if(document.getElementById('Home'))toggleMain('Home');const adminForm=document.getElementById('adminForm');if(adminForm)adminForm.onsubmit=validateAdmin;const resourceUploadForm=document.getElementById('resourceUploadForm');if(resourceUploadForm)resourceUploadForm.onsubmit=handleUpload;});
