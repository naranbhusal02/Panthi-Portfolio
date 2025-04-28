// DOM Elements
const themeToggle = document.getElementById("themeToggle")
const body = document.body
const hamburger = document.querySelector(".hamburger")
const navLinks = document.querySelector(".nav-links")
const navItems = document.querySelectorAll(".nav-links a")
const sections = document.querySelectorAll("section")
const animatedElements = document.querySelectorAll(".project-card, .achievement-card, .timeline-item, .design-item")
const filterButtons = document.querySelectorAll(".filter-btn")
const projectCards = document.querySelectorAll(".project-card")
const designSlides = document.querySelectorAll(".carousel-slide")
const toggleProjectsBtn = document.getElementById("toggleProjects")
const hiddenProjects = document.querySelectorAll(".hidden-project")

// Carousel Elements
const carouselTrack = document.querySelector(".carousel-track")
const carouselSlides = document.querySelectorAll(".carousel-slide")
const prevButton = document.querySelector(".carousel-button.prev")
const nextButton = document.querySelector(".carousel-button.next")
const dotsContainer = document.querySelector(".carousel-dots")

// Check for saved theme preference or use preferred color scheme
const savedTheme = localStorage.getItem("theme")
if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
  body.classList.add("dark-theme")
}

// Theme Toggle with Animation
themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-theme")
  localStorage.setItem("theme", body.classList.contains("dark-theme") ? "dark" : "light")

  // Add animation class
  themeToggle.classList.add("theme-toggle-animate")

  // Remove animation class after animation completes
  setTimeout(() => {
    themeToggle.classList.remove("theme-toggle-animate")
  }, 500)
})

// Mobile Navigation
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active")
  navLinks.classList.toggle("active")
})

// Close mobile menu when clicking on a nav item
navItems.forEach((item) => {
  item.addEventListener("click", () => {
    hamburger.classList.remove("active")
    navLinks.classList.remove("active")
  })
})

// Highlight active section in navigation
function highlightNavigation() {
  const scrollPosition = window.scrollY

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100
    const sectionHeight = section.offsetHeight
    const sectionId = section.getAttribute("id")

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navItems.forEach((item) => {
        item.classList.remove("active")
        if (item.getAttribute("href") === `#${sectionId}`) {
          item.classList.add("active")
        }
      })
    }
  })
}

// Scroll Animation using Intersection Observer
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in")
      }
    })
  },
  { threshold: 0.1 },
)

// Add fade-in class for CSS animation
animatedElements.forEach((element) => {
  element.classList.add("animate-on-scroll")
  observer.observe(element)
})

// Add CSS for scroll animations
const style = document.createElement("style")
style.textContent = `
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.fade-in {
  opacity: 1;
  transform: translateY(0);
}

.theme-toggle-animate {
  animation: pulse-toggle 0.5s ease;
}

@keyframes pulse-toggle {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
`
document.head.appendChild(style)

// Project Filtering
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Get filter group and value
    const filterGroup = button.parentElement.getAttribute("data-filter-group")
    const filterValue = button.getAttribute("data-filter")

    // Update active button
    const groupButtons = button.parentElement.querySelectorAll(".filter-btn")
    groupButtons.forEach((btn) => btn.classList.remove("active"))
    button.classList.add("active")

    // Filter items based on group
    if (filterGroup === "web") {
      filterProjects(filterValue)
    } else if (filterGroup === "design") {
      filterDesigns(filterValue)
    }
  })
})

// Filter web development projects
function filterProjects(category) {
  projectCards.forEach((card) => {
    const projectCategory = card.getAttribute("data-category")

    if (category === "all" || projectCategory === category) {
      if (
        !card.classList.contains("hidden-project") ||
        (card.classList.contains("hidden-project") && toggleProjectsBtn.classList.contains("active"))
      ) {
        card.classList.remove("hidden")
        setTimeout(() => {
          card.style.display = "block"
        }, 400)
      }
    } else {
      card.classList.add("hidden")
      setTimeout(() => {
        card.style.display = "none"
      }, 400)
    }
  })
}

// Filter graphic design items
function filterDesigns(category) {
  const designItems = document.querySelectorAll(".design-item")
  let hasVisibleItems = false

  designItems.forEach((item) => {
    const designCategory = item.getAttribute("data-category")

    if (category === "all" || designCategory === category) {
      item.style.display = "block"
      hasVisibleItems = true
    } else {
      item.style.display = "none"
    }
  })

  // Reset carousel to first slide
  if (hasVisibleItems) {
    goToSlide(0)
    updateDots(0)
  }

  // Check if any slide is empty (all items filtered out)
  const slides = document.querySelectorAll(".carousel-slide")
  slides.forEach((slide) => {
    const visibleItems = slide.querySelectorAll('.design-item[style="display: block;"]')
    if (visibleItems.length === 0) {
      slide.style.display = "none"
    } else {
      slide.style.display = "block"
    }
  })

  // Update gallery images for lightbox
  updateGalleryImages()

  // Reinitialize infinite carousel after filtering
  setupInfiniteCarousel()
}

// Toggle Projects (See More / See Less)
toggleProjectsBtn.addEventListener("click", () => {
  toggleProjectsBtn.classList.toggle("active")
  const toggleText = toggleProjectsBtn.querySelector(".toggle-text")

  if (toggleProjectsBtn.classList.contains("active")) {
    toggleText.textContent = "See Less"
    hiddenProjects.forEach((project) => {
      // Only show projects that match the current filter
      const activeFilter = document.querySelector('.filter-buttons[data-filter-group="web"] .filter-btn.active')
      const filterValue = activeFilter.getAttribute("data-filter")
      const projectCategory = project.getAttribute("data-category")

      if (filterValue === "all" || projectCategory === filterValue) {
        project.style.display = "block"
        setTimeout(() => {
          project.classList.add("show")
        }, 10)
      }
    })
  } else {
    toggleText.textContent = "See More"
    hiddenProjects.forEach((project) => {
      project.classList.remove("show")
      setTimeout(() => {
        project.style.display = "none"
      }, 400)
    })
  }
})

// Carousel Functionality with Infinite Scrolling
let currentSlide = 0
const slideWidth = 100 // percentage
let totalSlides = 0
let clonedSlides = false

// Setup infinite carousel
function setupInfiniteCarousel() {
  // Get visible slides
  const visibleSlides = Array.from(carouselSlides).filter((slide) => slide.style.display !== "none")
  totalSlides = visibleSlides.length

  if (totalSlides <= 1) return // No need for infinite scrolling with only one slide

  // Check if we're on mobile
  const isMobile = window.innerWidth <= 768
  console.log("Setting up carousel for:", isMobile ? "mobile" : "desktop")

  // Remove any previously cloned slides
  const clones = carouselTrack.querySelectorAll(".carousel-slide-clone")
  clones.forEach((clone) => clone.remove())

  // For mobile, we'll handle each design item as a "slide"
  if (isMobile) {
    // Restructure the carousel for mobile view
    restructureForMobile()

    // Debug visibility after restructuring
    setTimeout(debugCarouselVisibility, 500)
  } else {
    // Clone first and last slides for desktop
    if (totalSlides > 1 && !clonedSlides) {
      // Clone first slide and add to end
      const firstSlideClone = visibleSlides[0].cloneNode(true)
      firstSlideClone.classList.add("carousel-slide-clone")
      carouselTrack.appendChild(firstSlideClone)

      // Clone last slide and add to beginning
      const lastSlideClone = visibleSlides[visibleSlides.length - 1].cloneNode(true)
      lastSlideClone.classList.add("carousel-slide-clone")
      carouselTrack.insertBefore(lastSlideClone, carouselTrack.firstChild)

      clonedSlides = true

      // Initialize position to the first real slide (not the clone)
      goToSlide(1, false)
      currentSlide = 1
    }
  }

  // Add event listeners to cloned items for lightbox
  const clonedItems = document.querySelectorAll(".carousel-slide-clone .design-item")
  clonedItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      // Find the corresponding original item
      const originalItems = document.querySelectorAll(".design-item:not(.carousel-slide-clone .design-item)")
      const visibleOriginalItems = Array.from(originalItems).filter((item) => item.style.display !== "none")

      // Calculate the correct index for the lightbox
      const lightboxIndex = index % visibleOriginalItems.length
      openLightbox(lightboxIndex)
    })
  })

  // Ensure all design items are visible
  document.querySelectorAll(".design-item").forEach((item) => {
    item.style.display = "block"
    item.style.visibility = "visible"
    item.style.opacity = "1"
  })
}

// Add a new function to restructure the carousel for mobile view
function restructureForMobile() {
  // Get all visible design items
  const visibleItems = Array.from(
    document.querySelectorAll(".design-item:not(.carousel-slide-clone .design-item)"),
  ).filter((item) => item.style.display !== "none")

  if (visibleItems.length <= 1) return

  // Clear existing slides
  carouselTrack.innerHTML = ""

  // Create a slide for each design item
  visibleItems.forEach((item) => {
    const slide = document.createElement("div")
    slide.className = "carousel-slide"
    slide.style.display = "block" // Ensure slide is visible

    const grid = document.createElement("div")
    grid.className = "carousel-grid"

    // Clone the item to avoid removing it from its original location
    const itemClone = item.cloneNode(true)
    itemClone.style.display = "block" // Ensure item is visible
    itemClone.style.visibility = "visible" // Ensure visibility
    itemClone.style.opacity = "1" // Ensure opacity

    grid.appendChild(itemClone)
    slide.appendChild(grid)
    carouselTrack.appendChild(slide)
  })

  // Clone first and last items for infinite scrolling
  const firstSlideClone = carouselTrack.firstChild.cloneNode(true)
  firstSlideClone.classList.add("carousel-slide-clone")
  carouselTrack.appendChild(firstSlideClone)

  const lastSlideClone = carouselTrack.children[carouselTrack.children.length - 2].cloneNode(true)
  lastSlideClone.classList.add("carousel-slide-clone")
  carouselTrack.insertBefore(lastSlideClone, carouselTrack.firstChild)

  clonedSlides = true
  totalSlides = visibleItems.length

  // Initialize position
  goToSlide(1, false)
  currentSlide = 1

  // Recreate dots
  createDots()

  // Add lightbox functionality to the new items
  document.querySelectorAll(".carousel-slide:not(.carousel-slide-clone) .design-item").forEach((item, index) => {
    item.addEventListener("click", () => {
      openLightbox(index)
    })
  })

  // Force a reflow to ensure visibility
  carouselTrack.offsetHeight
}

// Create carousel dots
function createDots() {
  // Clear existing dots
  dotsContainer.innerHTML = ""

  // Create dots for visible slides only (excluding clones)
  const visibleSlides = Array.from(carouselSlides).filter(
    (slide) => slide.style.display !== "none" && !slide.classList.contains("carousel-slide-clone"),
  )

  visibleSlides.forEach((_, index) => {
    const dot = document.createElement("div")
    dot.classList.add("carousel-dot")
    if (index === 0) dot.classList.add("active")
    dot.addEventListener("click", () => {
      // Account for the cloned slide at the beginning
      goToSlide(index + 1)
      updateDots(index)
    })
    dotsContainer.appendChild(dot)
  })
}

// Update active dot
function updateDots(index) {
  const dots = document.querySelectorAll(".carousel-dot")
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index)
  })
}

// Go to specific slide with infinite scrolling support
function goToSlide(index, animate = true) {
  if (!animate) {
    carouselTrack.classList.add("no-transition")
  }

  carouselTrack.style.transform = `translateX(-${index * slideWidth}%)`
  currentSlide = index

  if (!animate) {
    // Force reflow
    carouselTrack.offsetHeight
    carouselTrack.classList.remove("no-transition")
  }

  // Update dots (accounting for cloned slides)
  if (clonedSlides) {
    let realIndex = index - 1
    if (realIndex < 0) realIndex = totalSlides - 1
    if (realIndex >= totalSlides) realIndex = 0
    updateDots(realIndex)
  } else {
    updateDots(index)
  }
}

// Handle infinite scrolling transitions
function handleInfiniteTransition() {
  // If we're at the cloned last slide (position 0), jump to the real last slide
  if (currentSlide === 0) {
    setTimeout(() => {
      goToSlide(totalSlides, false)
    }, 300)
  }

  // If we're at the cloned first slide (position totalSlides+1), jump to the real first slide
  if (currentSlide === totalSlides + 1) {
    setTimeout(() => {
      goToSlide(1, false)
    }, 300)
  }
}

// Next slide with infinite scrolling
function nextSlide() {
  if (totalSlides <= 1) return

  goToSlide(currentSlide + 1)
  handleInfiniteTransition()
}

// Previous slide with infinite scrolling
function prevSlide() {
  if (totalSlides <= 1) return

  goToSlide(currentSlide - 1)
  handleInfiniteTransition()
}

// Event listeners for carousel
nextButton.addEventListener("click", nextSlide)
prevButton.addEventListener("click", prevSlide)

// Listen for transition end to handle infinite scrolling
carouselTrack.addEventListener("transitionend", handleInfiniteTransition)

// Auto-advance carousel
let carouselInterval

function startCarouselInterval() {
  carouselInterval = setInterval(nextSlide, 5000)
}

function stopCarouselInterval() {
  clearInterval(carouselInterval)
}

// Pause carousel on hover
const carouselContainer = document.querySelector(".carousel-container")
carouselContainer.addEventListener("mouseenter", stopCarouselInterval)
carouselContainer.addEventListener("mouseleave", startCarouselInterval)

// Event Listeners
window.addEventListener("scroll", highlightNavigation)
window.addEventListener("load", highlightNavigation)

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()

    const targetId = this.getAttribute("href")
    const targetElement = document.querySelector(targetId)

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 70,
        behavior: "smooth",
      })
    }
  })
})

// Add subtle movement to the rotating shape on mouse move
const heroSection = document.querySelector(".hero-section")
const rotatingShape = document.querySelector(".rotating-circle")

window.addEventListener("mousemove", (e) => {
  if (!rotatingShape) return

  const x = e.clientX / window.innerWidth
  const y = e.clientY / window.innerHeight

  // Subtle tilt effect
  const tiltX = (y - 0.5) * 10
  const tiltY = (x - 0.5) * -10

  rotatingShape.style.transform = `rotate(${tiltX}deg) rotateY(${tiltY}deg)`
})

// Lightbox functionality
const lightbox = document.getElementById("lightbox")
const lightboxImage = document.querySelector(".lightbox-image")
const lightboxCaption = document.querySelector(".lightbox-caption")
const lightboxClose = document.querySelector(".lightbox-close")
const lightboxPrev = document.querySelector(".lightbox-nav.prev")
const lightboxNext = document.querySelector(".lightbox-nav.next")
const designItems = document.querySelectorAll(".design-item")

let currentImageIndex = 0
let galleryImages = []

// Collect all design items for the lightbox
function updateGalleryImages() {
  galleryImages = []
  // Only include non-cloned items that are visible
  const visibleItems = Array.from(
    document.querySelectorAll(".design-item:not(.carousel-slide-clone .design-item)"),
  ).filter((item) => item.style.display !== "none")

  visibleItems.forEach((item) => {
    const img = item.querySelector("img")
    const caption = item.querySelector(".design-overlay h3")?.textContent
    const description = item.querySelector(".design-overlay p")?.textContent

    galleryImages.push({
      src: img.src,
      alt: img.alt,
      caption: caption,
      description: description,
    })
  })
}

// Open lightbox with specific image
function openLightbox(index) {
  updateGalleryImages()

  if (galleryImages.length === 0) return

  currentImageIndex = index
  const image = galleryImages[currentImageIndex]

  lightboxImage.src = image.src
  lightboxImage.alt = image.alt
  lightboxCaption.textContent = `${image.caption} - ${image.description}`

  lightbox.classList.add("active")
  document.body.style.overflow = "hidden" // Prevent scrolling
}

// Close lightbox
function closeLightbox() {
  lightbox.classList.remove("active")
  document.body.style.overflow = "" // Restore scrolling
}

// Navigate to previous image
function prevImage() {
  currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length
  const image = galleryImages[currentImageIndex]

  lightboxImage.src = image.src
  lightboxImage.alt = image.alt
  lightboxCaption.textContent = `${image.caption} - ${image.description}`
}

// Navigate to next image
function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % galleryImages.length
  const image = galleryImages[currentImageIndex]

  lightboxImage.src = image.src
  lightboxImage.alt = image.alt
  lightboxCaption.textContent = `${image.caption} - ${image.description}`
}

// Add event listeners for lightbox
designItems.forEach((item, index) => {
  // Skip cloned items
  if (item.closest(".carousel-slide-clone")) return

  item.addEventListener("click", () => {
    // Get the index among visible items
    const visibleItems = Array.from(
      document.querySelectorAll(".design-item:not(.carousel-slide-clone .design-item)"),
    ).filter((item) => item.style.display !== "none")
    const visibleIndex = visibleItems.indexOf(item)
    openLightbox(visibleIndex)
  })
})

lightboxClose.addEventListener("click", closeLightbox)
lightboxPrev.addEventListener("click", prevImage)
lightboxNext.addEventListener("click", nextImage)

// Close lightbox when clicking outside the image
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    closeLightbox()
  }
})

// Keyboard navigation for lightbox
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("active")) return

  if (e.key === "Escape") {
    closeLightbox()
  } else if (e.key === "ArrowLeft") {
    prevImage()
  } else if (e.key === "ArrowRight") {
    nextImage()
  }
})

// Update gallery images when filtering
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Wait for the filter to apply
    setTimeout(() => {
      updateGalleryImages()
      setupInfiniteCarousel()
    }, 500)
  })
})

// Touch swipe functionality for carousel
let touchStartX = 0
let touchEndX = 0

carouselContainer.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.changedTouches[0].screenX
  },
  false,
)

carouselContainer.addEventListener(
  "touchend",
  (e) => {
    touchEndX = e.changedTouches[0].screenX
    handleSwipe()
  },
  false,
)

function handleSwipe() {
  const swipeThreshold = 50 // Minimum distance to register as a swipe

  if (touchEndX < touchStartX - swipeThreshold) {
    // Swipe left, go to next slide
    nextSlide()
  }

  if (touchEndX > touchStartX + swipeThreshold) {
    // Swipe right, go to previous slide
    prevSlide()
  }
}

// Add a check for mobile in the window resize event handler
window.addEventListener("resize", () => {
  // Reinitialize carousel on resize to handle layout changes
  setupInfiniteCarousel()

  // Reset to first slide when switching between mobile and desktop
  goToSlide(1, false)
  currentSlide = 1

  // Debug visibility after resize
  setTimeout(debugCarouselVisibility, 500)
})

// Add a debug function to check visibility issues
function debugCarouselVisibility() {
  console.log("Debugging carousel visibility...")

  const isMobile = window.innerWidth <= 768
  console.log("Is mobile view:", isMobile)

  const carouselContainer = document.querySelector(".carousel-container")
  console.log("Carousel container:", carouselContainer)
  console.log("Carousel container style:", window.getComputedStyle(carouselContainer))

  const carouselTrack = document.querySelector(".carousel-track")
  console.log("Carousel track:", carouselTrack)
  console.log("Carousel track style:", window.getComputedStyle(carouselTrack))

  const slides = document.querySelectorAll(".carousel-slide")
  console.log("Number of slides:", slides.length)

  const designItems = document.querySelectorAll(".design-item")
  console.log("Number of design items:", designItems.length)
  designItems.forEach((item, i) => {
    console.log(`Design item ${i} display:`, window.getComputedStyle(item).display)
    console.log(`Design item ${i} visibility:`, window.getComputedStyle(item).visibility)
    console.log(`Design item ${i} opacity:`, window.getComputedStyle(item).opacity)
  })
}

// Modify the DOMContentLoaded event to ensure visibility
document.addEventListener("DOMContentLoaded", () => {
  // Make sure all design items are visible initially
  document.querySelectorAll(".design-item").forEach((item) => {
    item.style.display = "block"
    item.style.visibility = "visible"
    item.style.opacity = "1"
  })

  // Setup infinite carousel
  setupInfiniteCarousel()

  // Initialize carousel dots
  createDots()

  // Start auto-advance
  startCarouselInterval()

  // Add a class to body when page is loaded
  setTimeout(() => {
    document.body.classList.add("loaded")

    // Debug visibility after page load
    debugCarouselVisibility()
  }, 300)
})
