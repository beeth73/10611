document.addEventListener('DOMContentLoaded', function() {
    const certificateItems = document.querySelectorAll('.certificate-item'); 
    const sections = document.querySelectorAll('.skills-section, .experience-section'); 
    certificateItems.forEach(item => {
        item.classList.add('certificate-hidden'); 
    sections.forEach(section => { 
        section.classList.add('section-hidden');
    });


    const certificateObserver = new IntersectionObserver(entries => { 
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('certificate-hidden'); 
                entry.target.classList.add('certificate-show'); 
                certificateObserver.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.15 
    });

    const sectionObserver = new IntersectionObserver(entries => { 
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('section-hidden'); 
                entry.target.classList.add('section-show'); 
                sectionObserver.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.15 
    });


    certificateItems.forEach(item => {
        certificateObserver.observe(item); 
    });
    sections.forEach(section => { 
        sectionObserver.observe(section);
    });
});