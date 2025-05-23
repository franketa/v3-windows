// ✅ GLOBAL SCOPE
function showStep(stepNumber) {
    const steps = document.querySelectorAll('.step');
    const progressDots = document.querySelectorAll('.progress-dot');
    const progressLines = document.querySelectorAll('.progress-line');

    steps.forEach(step => step.classList.remove('active'));

    const currentStep = document.querySelector(`.step[data-step="${stepNumber}"]`);
    if (currentStep) currentStep.classList.add('active');

    updateProgress(stepNumber);
    updateHeaderBackArrow(stepNumber);
}

function updateProgress(currentStep) {
    const progressDots = document.querySelectorAll('.progress-dot');
    const progressLines = document.querySelectorAll('.progress-line');

    progressDots.forEach((dot, index) => {
        dot.classList.toggle('active', index + 1 <= currentStep);
    });

    progressLines.forEach((line, index) => {
        line.classList.toggle('active', index < currentStep - 1);
    });
}

function updateHeaderBackArrow(currentStep) {
    const headerBackArrow = document.getElementById('header-back-arrow');
    if (headerBackArrow) {
        headerBackArrow.style.display = currentStep > 1 ? 'block' : 'none';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Get all steps
    const steps = document.querySelectorAll('.step');
    const form = document.getElementById('windows-quote-form');
    const progressDots = document.querySelectorAll('.progress-dot');
    const progressLines = document.querySelectorAll('.progress-line');
    const headerBackArrow = document.getElementById('header-back-arrow');
    
    // Add event listener for the header back arrow - ONLY ONE EVENT LISTENER HERE
    if (headerBackArrow) {
        headerBackArrow.addEventListener('click', function() {
            const currentStep = document.querySelector('.step.active');
            if (currentStep) {
                const currentStepNumber = parseInt(currentStep.dataset.step);
                if (currentStepNumber > 1) {
                    showStep(currentStepNumber - 1);
                    
                    // If going back to step 1, show the brand section and benefits on mobile
                    if (currentStepNumber - 1 === 1 && window.innerWidth <= 576) {
                        const brandSection = document.querySelector('.brand-section');
                        const benefits = document.querySelector('.benefits');
                        const heroTitle = document.querySelector('.hero-title');
                        
                        if (brandSection) brandSection.style.display = '';
                        if (benefits) benefits.style.display = '';
                        if (heroTitle) heroTitle.style.display = '';
                    }
                }
            }
        });
    }
    
    // Initialize - show first step
    showStep(1);

    // Hide all error messages initially
    document.querySelectorAll('.form-group-error-message').forEach(error => {
        error.style.display = 'none';
    });

    // Step 1 - ZIP code validation and navigation
    document.getElementById('step1-button').addEventListener('click', function () {
        const zipInput = document.getElementById('zip');
        const zipError = document.getElementById('error-zip');

        // Show loading spinner
        this.querySelector('.btn-spinner').style.display = 'inline-block';

        // Simulate API call to validate ZIP
        setTimeout(() => {
            // Validate ZIP code (5 digits)
            if (zipInput.value.match(/^\d{5}$/)) {
                zipError.style.display = 'none';
                showStep(2);

                // Check if on mobile and hide brand section and benefits
                if (window.innerWidth <= 576) {
                    const brandSection = document.querySelector('.brand-section');
                    const benefits = document.querySelector('.benefits');
                    const heroTitle = document.querySelector('.hero-title');
                    const heroBanner = document.querySelector('.hero-banner');

                    if (brandSection) brandSection.style.display = 'none';
                    if (benefits) benefits.style.display = 'none';
                    if (heroTitle) heroTitle.style.display = 'none';
                    if (heroBanner) heroBanner.classList.add('hero-banner-active');
                }
            } else {
                zipError.style.display = 'block';
            }

            // Hide spinner
            this.querySelector('.btn-spinner').style.display = 'none';
        }, 800);
    });

    // REMOVE ALL BACK BUTTON EVENT LISTENERS
    // Step 2, 3, 4, 5 back buttons are removed

    // Handle window resize to manage visibility of sections on mobile
    window.addEventListener('resize', function () {
        const currentStep = document.querySelector('.step.active');
        if (currentStep && currentStep.dataset.step === '2') {
            const brandSection = document.querySelector('.brand-section');
            const benefits = document.querySelector('.benefits');
            const heroTitle = document.querySelector('.hero-title');

            if (window.innerWidth <= 576) {
                if (brandSection) brandSection.style.display = 'none';
                if (benefits) benefits.style.display = 'none';
                if (heroTitle) heroTitle.style.display = 'none';
            } else {
                if (brandSection) brandSection.style.display = '';
                if (benefits) benefits.style.display = '';
                if (heroTitle) heroTitle.style.display = '';
            }
        }
    });

    // Handle ZIP code input - only allow numbers
    document.getElementById('zip').addEventListener('input', function (e) {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    // Show/hide multiple windows question based on number of windows selection
    const windowsNumberInputs = document.querySelectorAll('input[name="NumberOfWindows"]');
    const multipleWindowsSection = document.querySelector('.step-extra');

    if (multipleWindowsSection) {
        windowsNumberInputs.forEach(input => {
            input.addEventListener('change', function () {
                if (this.value === '1') {
                    multipleWindowsSection.style.display = 'block';
                } else {
                    multipleWindowsSection.style.display = 'none';
                    // Reset multiple windows selection if not needed
                    document.querySelectorAll('input[name="MultipleWindows"]').forEach(radio => {
                        radio.checked = false;
                    });
                }
            });
        });

        // Initially hide the multiple windows question
        multipleWindowsSection.style.display = 'none';
    }

    // Add animation to radio buttons and auto-advance functionality
    const radioButtons = document.querySelectorAll('.radio-button-label');
    radioButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Find the radio input within this label
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;

                // Trigger the change event for the number of windows inputs
                if (radio.name === 'NumberOfWindows') {
                    radio.dispatchEvent(new Event('change'));
                }

                // Auto-advance to next step after selection
                const currentStep = parseInt(this.closest('.step').dataset.step);

                // For step 2 (project scope), advance immediately
                if (radio.name === 'WindowsProjectScope') {
                    setTimeout(() => showStep(currentStep + 1), 500);
                }

                // For step 3 (home ownership), advance immediately
                if (radio.name === 'HomeOwnership') {
                    setTimeout(() => showStep(currentStep + 1), 500);
                }

                // For step 4 (number of windows), advance if not "1" or if "1" and multiple windows is selected
                if (radio.name === 'NumberOfWindows' && radio.value !== '1') {
                    setTimeout(() => showStep(currentStep + 1), 500);
                }

                // For multiple windows question, advance if we're on step 4
                if (radio.name === 'MultipleWindows' && currentStep === 4) {
                    setTimeout(() => showStep(currentStep + 1), 500);
                }
            }
        });
    });

    // Form validation functions
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function validatePhone(phone) {
        const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return re.test(String(phone));
    }

    // Step 4 - Form validation and submission
    document.getElementById('submit-form').addEventListener('click', function (e) {
        e.preventDefault();

        // Get form fields
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const terms = document.getElementById('terms');

        // Reset error messages
        document.querySelectorAll('.form-group-error-message').forEach(error => {
            error.style.display = 'none';
        });

        // Validate fields
        let isValid = true;

        if (!firstName.value.trim()) {
            document.getElementById('error-firstName').style.display = 'block';
            isValid = false;
        }

        if (!lastName.value.trim()) {
            document.getElementById('error-lastName').style.display = 'block';
            isValid = false;
        }

        if (!validateEmail(email.value)) {
            document.getElementById('error-email').style.display = 'block';
            isValid = false;
        }

        if (!validatePhone(phone.value)) {
            document.getElementById('error-phone').style.display = 'block';
            isValid = false;
        }

        if (!terms.checked) {
            document.getElementById('error-terms').style.display = 'block';
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        // Show loading spinner
        this.querySelector('.btn-spinner').style.display = 'inline-block';
        this.disabled = true;

        // Collect all form data
        const formData = {
            zip: document.getElementById('zip').value,
            projectScope: document.querySelector('input[name="WindowsProjectScope"]:checked')?.value,
            homeOwnership: document.querySelector('input[name="HomeOwnership"]:checked')?.value,
            numberOfWindows: document.querySelector('input[name="NumberOfWindows"]:checked')?.value,
            multipleWindows: document.querySelector('input[name="MultipleWindows"]:checked')?.value,
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            phone: phone.value
        };

        // Send data to webhook
        fetch('https://hook.us2.make.com/pdm6g7ey9smyfvob65947fkbh4yr1emb', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (response.ok) {
                    // Redirect to thank you page
                    window.location.href = 'thank-you.html';
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('There was a problem submitting your form. Please try again.');
                this.disabled = false;
                this.querySelector('.btn-spinner').style.display = 'none';
            });
    });

    // Phone number formatting
    document.getElementById('phone').addEventListener('input', function (e) {
        let value = this.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 3) {
                this.value = value;
            } else if (value.length <= 6) {
                this.value = value.slice(0, 3) + '-' + value.slice(3);
            } else {
                this.value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10);
            }
        }
    });
});

// REMOVE ALL CODE OUTSIDE THE DOMContentLoaded EVENT
// This was causing duplicate event listeners