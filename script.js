document.addEventListener("DOMContentLoaded", () => {
    
    // 1. DYNAMIC NAV CONTEXT STATE MODIFIER
    const navbar = document.getElementById("main-navbar");
    
    const handleNavbarStyleChange = () => {
        // CHECK: Freeze to high-contrast scrolled state if browsing standalone subpages
        if (window.location.pathname.includes("products.html") || window.location.pathname.includes("contact.html")) {
            if (navbar) {
                navbar.classList.remove("navbar-initial");
                navbar.classList.add("navbar-scrolled");
            }
            return; 
        }

        if (navbar) {
            if (window.scrollY > 40) {
                navbar.classList.remove("navbar-initial");
                navbar.classList.add("navbar-scrolled");
            } else {
                navbar.classList.remove("navbar-scrolled");
                navbar.classList.add("navbar-initial");
            }
        }
    };

    handleNavbarStyleChange();
    window.addEventListener("scroll", handleNavbarStyleChange);


    // 2. SCROLL REVEAL OBSERVER
    const animTargets = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right");
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("reveal-active");
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { root: null, threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    animTargets.forEach(target => scrollObserver.observe(target));


    // 3. MOBILE DROPDOWN (UPDATED TO AUTO-CLOSE)
    const menuToggle = document.getElementById("mobile-menu-toggle");
    const mobileDropdown = document.getElementById("mobile-dropdown");
    if (menuToggle && mobileDropdown) {
        menuToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            mobileDropdown.classList.toggle("hidden");
            setTimeout(() => mobileDropdown.classList.toggle("show-menu"), 10);
        });

        // AUTO-CLOSE on link click
        mobileDropdown.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileDropdown.classList.add('hidden');
                mobileDropdown.classList.remove('show-menu');
            });
        });
    }


    // 4. HERO CAROUSEL
    const carouselContainer = document.getElementById("hero-carousel-container");
    const images = [
        "pics/hero1.png",
        "pics/heromain.png",
        "pics/SandMain.jpeg",
        "pics/Sanddmain.jpeg",
    ];
    
    let currentIndex = 0;
    
    function changeBackgroundImage() {
        if (carouselContainer) {
            carouselContainer.style.backgroundImage = `url('${images[currentIndex]}')`;
            currentIndex = (currentIndex + 1) % images.length;
        }
    }
    
    if (carouselContainer && images.length > 0) {
        changeBackgroundImage();
        setInterval(changeBackgroundImage, 5000);
    }

    // 5. SMOOTH SCROLL
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", function(e) {
            const targetId = this.getAttribute("href");
            if (targetId === "#") return;
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                e.preventDefault();
                window.scrollTo({
                    top: targetSection.getBoundingClientRect().top + window.scrollY - 80,
                    behavior: "smooth"
                });
            }
        });
    });


    // 6. MODAL SYSTEM (UPDATED FOR RELIABILITY)
    const quoteModal = document.getElementById("quote-modal");
    const closeQuoteBtn = document.getElementById("close-modal-btn");

    // This loop checks for the buttons on ANY page. 
    const buttonIds = ["nav-quote-button", "mobile-quote-trigger"];
    buttonIds.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                if(quoteModal) {
                    quoteModal.classList.add("modal-active");
                    document.body.style.overflow = "hidden";
                }
            });
        }
    });

    if (closeQuoteBtn && quoteModal) {
        closeQuoteBtn.addEventListener("click", () => {
            quoteModal.classList.remove("modal-active");
            document.body.style.overflow = "";
        });
        quoteModal.addEventListener("click", (e) => {
            if (e.target === quoteModal) {
                quoteModal.classList.remove("modal-active");
                document.body.style.overflow = "";
            }
        });
    }

    // 8. ACTIVE NAVBAR HIGHLIGHTER
    const navLinks = document.querySelectorAll('#nav-links a');
    const currentPath = window.location.pathname.split('/').pop();
    const currentHash = window.location.hash;

    // A. Highlight the correct link when the page first loads
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        // Checks if the link matches the exact path/hash or is the default home page
        if (linkHref === currentPath || 
            linkHref === currentPath + currentHash || 
            (currentPath === "" && linkHref === "index.html#home") || 
            (currentPath === "index.html" && linkHref === "index.html#home")) {
            
            link.classList.add('active-link');
        }
    });

    // B. Change the highlight instantly when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // 1. Remove the red highlight from all links
            navLinks.forEach(l => l.classList.remove('active-link'));
            
            // 2. Add the red highlight ONLY to the link that was just clicked
            this.classList.add('active-link');
        });
    });
});

// 7. PRODUCT FILTER
function filterProducts(category) {
    const cards = document.querySelectorAll('.product-card');
    const buttons = document.querySelectorAll('.filter-btn');

    // Update active button color
    buttons.forEach(btn => {
        if (btn.getAttribute('onclick').includes(category)) {
            btn.classList.add('bg-brandRed', 'text-white');
            btn.classList.remove('bg-slate-100', 'text-slate-600');
        } else {
            btn.classList.remove('bg-brandRed', 'text-white');
            btn.classList.add('bg-slate-100', 'text-slate-600');
        }
    });

    // Filter cards
    cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
            setTimeout(() => { card.classList.remove('opacity-0', 'translate-y-4'); card.classList.add('opacity-100', 'translate-y-0'); }, 20);
        } else {
            card.classList.remove('opacity-100', 'translate-y-0');
            card.classList.add('opacity-0', 'translate-y-4');
            setTimeout(() => { card.style.display = 'none'; }, 200);
        }
    });
}

// 9. WHATSAPP SUBMIT FUNCTION
window.sendToWhatsApp = () => {
    // Get values from the form inputs
    const name = document.getElementById('wa-name').value;
    const email = document.getElementById('wa-email').value;
    const phone = document.getElementById('wa-phone').value;
    const product = document.getElementById('wa-product').value;

    // Check if essential fields are filled
    if(!name || !phone) {
        alert("Please fill in your Name and Contact Numbers before sending to WhatsApp.");
        return;
    }

    // Format the message
    const message = `*New Quote Request from Website*\n\n*Name:* ${name}\n*Email:* ${email}\n*Phone:* ${phone}\n*Interested In:* ${product}`;
    
    // Encode for the URL
    const encodedMessage = encodeURIComponent(message);
    
    // Your WhatsApp Number from the Contact Page (Bahrain country code +973)
    const whatsappNumber = "97333457950"; 
    
    // Open WhatsApp
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
};

// 10. CONTACT PAGE WHATSAPP SUBMIT FUNCTION
window.sendContactToWhatsApp = () => {
    // Get values from the contact page form inputs
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const phone = document.getElementById('contact-phone').value;
    const product = document.getElementById('contact-product').value;

    // Check if essential fields are filled
    if(!name || !phone) {
        alert("Please fill in your Name and Contact Number before sending to WhatsApp.");
        return;
    }

    // Format the message
    const message = `*New Inquiry from Contact Page*\n\n*Name:* ${name}\n*Email:* ${email}\n*Phone:* ${phone}\n*Interested In:* ${product}`;
    
    // Encode for the URL
    const encodedMessage = encodeURIComponent(message);
    
    // Your WhatsApp Number (+973 3345 7950)
    const whatsappNumber = "97333457950"; 
    
    // Open WhatsApp
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
};