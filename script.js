function showStep(stepNumber) {
    const steps = document.querySelectorAll('.step');

    steps.forEach(step => step.classList.remove('active'));

    const currentStep = document.querySelector(`.step[data-step="${stepNumber}"]`);
    if (currentStep) currentStep.classList.add('active');

    // Reset step 4 visibility when showing it
    if (stepNumber === 4) {
        resetStep4Visibility();
    }

    updateProgress(stepNumber);
    updateHeaderBackArrow(stepNumber);
}

function resetStep4Visibility() {
    const multipleWindowsSection = document.querySelector('.step-extra');
    const mainWindowsRadioGroup = document.querySelector('#step4 .step-fields.radio-group');
    const selectedWindowsOption = document.querySelector('input[name="NumberOfWindows"]:checked');

    if (multipleWindowsSection && mainWindowsRadioGroup) {
        if (selectedWindowsOption && selectedWindowsOption.value === '1') {
            // If "1 window" is already selected, hide main group and show step-extra
            mainWindowsRadioGroup.style.display = 'none';
            multipleWindowsSection.style.display = 'block';
        } else {
            // Otherwise, show main group and hide step-extra
            mainWindowsRadioGroup.style.display = 'flex';
            multipleWindowsSection.style.display = 'none';
        }
    }
}

function updateProgress(currentStep) {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    const percentage = (currentStep / 5) * 100;
    
    if (progressFill) {
        progressFill.style.width = percentage + '%';
    }
    
    if (progressText) {
        progressText.textContent = percentage + '% Complete';
    }
}

function updateHeaderBackArrow(currentStep) {
    const headerBackArrow = document.getElementById('header-back-arrow');
    if (headerBackArrow) {
        headerBackArrow.style.display = currentStep > 1 ? 'block' : 'none';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const steps = document.querySelectorAll('.step');
    const form = document.getElementById('windows-quote-form');
    const headerBackArrow = document.getElementById('header-back-arrow');
    
    if (headerBackArrow) {
        headerBackArrow.addEventListener('click', function() {
            const currentStep = document.querySelector('.step.active');
            if (currentStep) {
                const currentStepNumber = parseInt(currentStep.dataset.step);
                if (currentStepNumber > 1) {
                    showStep(currentStepNumber - 1);
                }
            }
        });
    }
    
    showStep(1);

    document.querySelectorAll('.form-group-error-message').forEach(error => {
        error.style.display = 'none';
    });

    document.getElementById('step1-button').addEventListener('click', function () {
        const zipInput = document.getElementById('zip');
        const zipError = document.getElementById('error-zip');

        document.activeElement.blur();
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    
        this.querySelector('.btn-spinner').style.display = 'inline-block';
    
        setTimeout(() => {
            if (zipInput.value.match(/^\d{5}$/)) {
                zipError.style.display = 'none';
                showStep(2);
    
                if (window.innerWidth <= 576) {
                    const heroBanner = document.querySelector('.hero-banner');
                    
                    if (heroBanner) heroBanner.classList.add('hero-banner-active');
                }
            } else {
                zipError.style.display = 'block';
            }
    
            this.querySelector('.btn-spinner').style.display = 'none';
        }, 800);
    });

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

    document.getElementById('zip').addEventListener('input', function (e) {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    const windowsNumberInputs = document.querySelectorAll('input[name="NumberOfWindows"]');
    const multipleWindowsSection = document.querySelector('.step-extra');
    const mainWindowsRadioGroup = document.querySelector('#step4 .step-fields.radio-group');

    if (multipleWindowsSection && mainWindowsRadioGroup) {
        windowsNumberInputs.forEach(input => {
            input.addEventListener('change', function () {
                if (this.value === '1') {
                    // Hide the main radio group and show the step-extra
                    mainWindowsRadioGroup.style.display = 'none';
                    multipleWindowsSection.style.display = 'block';
                } else {
                    // Show the main radio group and hide the step-extra
                    mainWindowsRadioGroup.style.display = 'flex';
                    multipleWindowsSection.style.display = 'none';
                    document.querySelectorAll('input[name="MultipleWindows"]').forEach(radio => {
                        radio.checked = false;
                    });
                }
            });
        });

        // Initially hide the step-extra
        multipleWindowsSection.style.display = 'none';
    }

    const radioButtons = document.querySelectorAll('.radio-button-label');
    radioButtons.forEach(button => {
        button.addEventListener('click', function () {
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;

                if (radio.name === 'NumberOfWindows') {
                    radio.dispatchEvent(new Event('change'));
                }

                const currentStep = parseInt(this.closest('.step').dataset.step);

                if (radio.name === 'WindowsProjectScope') {
                    setTimeout(() => showStep(currentStep + 1), 500);
                }

                if (radio.name === 'HomeOwnership') {
                    setTimeout(() => showStep(currentStep + 1), 500);
                }

                if (radio.name === 'NumberOfWindows' && radio.value !== '1') {
                    setTimeout(() => showStep(currentStep + 1), 500);
                }

                if (radio.name === 'MultipleWindows' && currentStep === 4) {
                    setTimeout(() => showStep(currentStep + 1), 500);
                }
            }
        });
    });

    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function validatePhone(phone) {
        const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return re.test(String(phone));
    }

    document.getElementById('submit-form').addEventListener('click', function (e) {
        e.preventDefault();

        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const terms = document.getElementById('terms');

        document.querySelectorAll('.form-group-error-message').forEach(error => {
            error.style.display = 'none';
        });

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

        if (!isValid) {
            return;
        }

        this.querySelector('.btn-spinner').style.display = 'inline-block';
        this.disabled = true;

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

        fetch('https://hook.us2.make.com/pdm6g7ey9smyfvob65947fkbh4yr1emb', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (response.ok) {
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
