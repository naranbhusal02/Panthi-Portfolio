// Project Detail Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Animate sections on scroll
    const projectSections = document.querySelectorAll('.project-section, .process-step, .feature-item, .result-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });
    
    // Add fade-in class for CSS animation
    projectSections.forEach(section => {
        section.classList.add('animate-on-scroll');
        observer.observe(section);
    });
    
    // Image zoom on click for process images
    const processImages = document.querySelectorAll('.process-image img');
    
    processImages.forEach(image => {
        image.addEventListener('click', () => {
            // Create lightbox
            const lightbox = document.createElement('div');
            lightbox.classList.add('lightbox');
            
            // Create image container
            const imgContainer = document.createElement('div');
            imgContainer.classList.add('lightbox-img-container');
            
            // Create image element
            const img = document.createElement('img');
            img.src = image.src;
            img.alt = image.alt;
            
            // Create close button
            const closeBtn = document.createElement('button');
            closeBtn.classList.add('lightbox-close');
            closeBtn.innerHTML = '&times;';
            closeBtn.addEventListener('click', () => {
                document.body.removeChild(lightbox);
                document.body.classList.remove('no-scroll');
            });
            
            // Append elements
            imgContainer.appendChild(img);
            lightbox.appendChild(imgContainer);
            lightbox.appendChild(closeBtn);
            
            // Add lightbox to body
            document.body.appendChild(lightbox);
            document.body.classList.add('no-scroll');
            
            // Close lightbox when clicking outside the image
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    document.body.removeChild(lightbox);
                    document.body.classList.remove('no-scroll');
                }
            });
        });
    });
    
    // Add lightbox styles
    const style = document.createElement('style');
    style.textContent = `
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            cursor: pointer;
        }
        
        .lightbox-img-container {
            max-width: 90%;
            max-height: 90%;
        }
        
        .lightbox img {
            max-width: 100%;
            max-height: 90vh;
            object-fit: contain;
            cursor: default;
        }
        
        .lightbox-close {
            position: absolute;
            top: 20px;
            right: 20px;
            background: none;
            border: none;
            color: white;
            font-size: 2rem;
            cursor: pointer;
        }
        
        .no-scroll {
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
});