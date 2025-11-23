document.addEventListener("DOMContentLoaded", function() {
    
    /* --- 1. Loader Logic --- */
    const loader = document.getElementById('loader');
    const header = document.querySelector('header');
    const main = document.querySelector('main');

    // Simulate loading time (e.g. 1.5 seconds)
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            // Trigger entry animations
            header.classList.remove('unloaded');
            main.classList.remove('unloaded');
        }, 500);
    }, 1500);


    /* --- 2. Theme Toggler --- */
    const toggleSwitch = document.querySelector('#theme-toggle');
    const body = document.body;
    
    // Check for saved user preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        body.classList.add(currentTheme);
        if (currentTheme === 'dark-mode') {
            toggleSwitch.checked = true;
        }
    } else {
        // Default to dark mode for hacker aesthetic if no preference
        body.classList.add('dark-mode'); 
        toggleSwitch.checked = true;
    }

    toggleSwitch.addEventListener('change', function(e) {
        if (e.target.checked) {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark-mode');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light-mode');
        }
    });


    /* --- 3. Modal Logic --- */
    const modal = document.getElementById("modal");
    const modalImg = modal.querySelector(".modal-image");
    const modalTitle = modal.querySelector(".modal-title");
    const modalDesc = modal.querySelector(".modal-description");
    const closeBtn = document.querySelector(".modal-close");

    // Function to open modal
    function openModal(title, description, imageSrc) {
        modalTitle.textContent = title;
        modalDesc.textContent = description;
        if(imageSrc) {
            modalImg.src = imageSrc;
            modalImg.style.display = "block";
        } else {
            modalImg.style.display = "none";
        }
        modal.classList.add("visible");
    }

    // Event Listeners for Certifications
    document.querySelectorAll('.certificate-card').forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img').src;
            const title = card.querySelector('.certificate-title').innerText;
            const desc = card.querySelector('img').getAttribute('data-description');
            openModal(title, desc, img);
        });
    });

    // Event Listeners for Projects (optional, if you want them clickable)
    document.querySelectorAll('.project-item img').forEach(img => {
        img.addEventListener('click', (e) => {
            // Stop propagation so it doesn't conflict if the parent is a link
            e.stopPropagation(); 
            const parent = img.closest('.project-item');
            const title = parent.querySelector('h3').innerText;
            const desc = parent.querySelector('p').innerText;
            openModal(title, desc, img.src);
        });
    });

    // Close Modal
    closeBtn.addEventListener("click", () => {
        modal.classList.remove("visible");
    });

    // Close on click outside
    window.addEventListener("click", (e) => {
        if (e.target == modal) {
            modal.classList.remove("visible");
        }
    });
});
