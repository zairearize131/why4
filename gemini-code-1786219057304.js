document.addEventListener("DOMContentLoaded", () => {
  
  // --- Pillar 2: System Feedback & Toast Generator ---
  const toastContainer = document.getElementById("toastContainer");

  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    toastContainer.appendChild(toast);
    
    // Haptic feedback if supported on mobile
    if (navigator.vibrate) navigator.vibrate(50);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  // --- Pillar 4: Theme Customization & Local Persistence (Pillar 6) ---
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const htmlRoot = document.documentElement;

  const savedTheme = localStorage.getItem("pulse_theme") || "dark";
  htmlRoot.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = htmlRoot.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    htmlRoot.setAttribute("data-theme", newTheme);
    localStorage.setItem("pulse_theme", newTheme);
    updateThemeIcon(newTheme);
    showToast(`Switched to ${newTheme} mode`);
  });

  function updateThemeIcon(theme) {
    themeToggleBtn.querySelector("i").className = theme === "dark" ? "fa-solid fa-moon" : "fa-solid fa-sun";
  }

  // --- Pillar 4: Search & Auto-complete ---
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const mockDatabase = ["Synthwave Stems #4", "Gaming Vocals - Chapter 1", "HipHop Beat Pack", "Retro Synth Jam"];

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      searchResults.classList.add("hidden");
      return;
    }

    const matches = mockDatabase.filter(item => item.toLowerCase().includes(query));
    if (matches.length > 0) {
      searchResults.innerHTML = matches.map(m => `<div class="search-item">${m}</div>`).join("");
      searchResults.classList.remove("hidden");
    } else {
      searchResults.classList.add("hidden");
    }
  });

  searchResults.addEventListener("click", (e) => {
    if (e.target.classList.contains("search-item")) {
      searchInput.value = e.target.textContent;
      searchResults.classList.add("hidden");
      showToast(`Searching for: ${e.target.textContent}`);
    }
  });

  // --- Pillar 4: Filtering Content ---
  const filterChips = document.querySelectorAll(".filter-chip");
  const feedPosts = document.querySelectorAll(".feed-post");

  filterChips.forEach(chip => {
    chip.addEventListener("click", () => {
      filterChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");

      const selectedGenre = chip.getAttribute("data-genre");
      feedPosts.forEach(post => {
        if (selectedGenre === "all" || post.getAttribute("data-genre") === selectedGenre) {
          post.classList.remove("hidden");
        } else {
          post.classList.add("hidden");
        }
      });
      showToast(`Filtered: ${chip.textContent}`);
    });
  });

  // --- Pillar 5: Social Engagement Actions (Likes & Bookmarks) ---
  const likeBtn = document.querySelector(".action-like");
  const bookmarkBtn = document.querySelector(".action-bookmark");
  let liked = false;
  let bookmarked = false;

  likeBtn.addEventListener("click", () => {
    liked = !liked;
    const icon = likeBtn.querySelector("i");
    icon.className = liked ? "fa-solid fa-heart" : "fa-regular fa-heart";
    icon.style.color = liked ? "var(--danger)" : "";
    showToast(liked ? "Added to Liked Stems" : "Removed Like");
  });

  bookmarkBtn.addEventListener("click", () => {
    bookmarked = !bookmarked;
    const icon = bookmarkBtn.querySelector("i");
    icon.className = bookmarked ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark";
    showToast(bookmarked ? "Saved to your Collection" : "Removed from Saved");
  });

  // --- Pillar 1: File Drag & Drop + Direct Capture ---
  const dropZone = document.getElementById("dropZone");
  const fileInput = document.getElementById("fileInput");
  const fileList = document.getElementById("fileList");

  dropZone.addEventListener("click", () => fileInput.click());

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragover");
  });

  dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragover"));

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragover");
    handleFiles(e.dataTransfer.files);
  });

  fileInput.addEventListener("change", (e) => handleFiles(e.target.files));

  function handleFiles(files) {
    fileList.innerHTML = "";
    Array.from(files).forEach(file => {
      const item = document.createElement("div");
      item.textContent = `📄 ${file.name} (${Math.round(file.size / 1024)} KB)`;
      fileList.appendChild(item);
    });
    showToast(`Loaded ${files.length} file(s)`);
  }

  // Pillar 1: Direct Hardware Capture (Webcam Permissions)
  const captureCamBtn = document.getElementById("captureCamBtn");
  const webcamPreview = document.getElementById("webcamPreview");

  captureCamBtn.addEventListener("click", async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      webcamPreview.srcObject = stream;
      webcamPreview.classList.remove("hidden");
      showToast("Camera & Mic active");
    } catch (err) {
      showToast("Permission denied for Camera/Mic");
    }
  });

  // --- Pillar 3 & 6: Modals & Auth State ---
  const studioModal = document.getElementById("studioModal");
  const authModal = document.getElementById("authModal");
  const dockStudioModal = document.getElementById("dockStudioModal");
  const authModalBtn = document.getElementById("authModalBtn");
  const closeButtons = document.querySelectorAll(".close-modal");

  dockStudioModal.addEventListener("click", () => studioModal.classList.remove("hidden"));
  authModalBtn.addEventListener("click", () => authModal.classList.remove("hidden"));

  closeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      studioModal.classList.add("hidden");
      authModal.classList.add("hidden");
    });
  });

  document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("userEmail").value;
    authModal.classList.add("hidden");
    showToast(`Authenticated as ${email}`);
  });
});