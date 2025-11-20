document.addEventListener("DOMContentLoaded", function() {
    const loader = document.getElementById('loader');
    const header = document.querySelector('header');
    const main = document.querySelector('main');
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Modal elements
    const modal = document.getElementById('modal');
    const modalClose = document.querySelector('.modal-close');
    const modalImage = document.querySelector('.modal-image');
    const modalTitle = document.querySelector('.modal-title');
    const modalDescription = document.querySelector('.modal-description');
    const modalTriggers = document.querySelectorAll('.project-item, .certificate-card');

    // --- Theme Switcher ---
    // Apply saved theme on load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
        themeToggle.checked = savedTheme === 'dark-mode';
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // If no saved theme, check system preference
        body.classList.add('dark-mode');
        themeToggle.checked = true;
    }

    // Handle theme toggle change
    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark-mode');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light-mode');
        }
    });

    // --- Loading Animation ---
    setTimeout(() => {
        // Fade out the loader
        loader.style.opacity = '0';
        loader.addEventListener('transitionend', () => {
            loader.style.display = 'none';
        });

        // Reveal the content
        header.classList.remove('unloaded');
        main.classList.remove('unloaded');

    }, 1500); // Adjust delay as needed

    // --- Smooth Scrolling ---
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if(targetElement){
                 // Scroll to the section within the terminal body
                 document.querySelector('.terminal-body').scrollTo({
                    top: targetElement.offsetTop - 20, // Adjust for padding
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Unified Modal Logic ---
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const img = this.querySelector('img');
            const imgSrc = img.src;
            const imgAlt = img.alt;
            let description = '';

            // Check if it's a certificate (has data-description)
            if (img.hasAttribute('data-description')) {
                description = img.getAttribute('data-description');
                modalDescription.style.display = 'block'; // Show description
            } else {
                // It's a project item, get description from its content
                const projectDescElement = this.querySelector('.project-item-content p');
                if (projectDescElement) {
                    description = projectDescElement.textContent;
                    modalDescription.style.display = 'block'; // Show description
                } else {
                    description = '';
                    modalDescription.style.display = 'none'; // Hide if no description
                }
            }

            modalImage.src = imgSrc;
            modalImage.alt = imgAlt;
            modalTitle.textContent = imgAlt;
            modalDescription.textContent = description;
            modal.classList.add('visible');
        });
    });

    modalClose.addEventListener('click', () => {
        modal.classList.remove('visible');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('visible');
        }
    });

});
