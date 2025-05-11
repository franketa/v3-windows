document.addEventListener('DOMContentLoaded', function() {
    // Get all steps
    const steps = document.querySelectorAll('.step');
    const form = document.getElementById('windows-quote-form');
    const progressDots = document.querySelectorAll('.progress-dot');
    const progressLines = document.querySelectorAll('.progress-line');
    
    // Initialize - show first step
    showStep(1);
    
    // Hide all error messages initially
    document.querySelectorAll('.form-group-error-message').forEach(error => {
        error.style.display = 'none';
    });
    
    // Step 1 - ZIP code validation and navigation
    document.getElementById('step1-button').addEventListener('click', function() {
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
            } else {
                zipError.style.display = 'block';
            }
            
            // Hide spinner
            this.querySelector('.btn-spinner').style.display = 'none';
        }, 800);
    });
    
    // Step 2 - Project scope selection and navigation
    document.getElementById('step2-button').addEventListener('click', function() {
        const projectScope = document.querySelector('input[name="WindowsProjectScope"]:checked');
        
        // Show loading spinner
        this.querySelector('.btn-spinner').style.display = 'inline-block';
        
        setTimeout(() => {
            if (projectScope) {
                showStep(3);
            } else {
                alert('Please select the nature of your windows project.');
            }
            
            // Hide spinner
            this.querySelector('.btn-spinner').style.display = 'none';
        }, 500);
    });
    
    document.getElementById('step2-back').addEventListener('click', function() {
        showStep(1);
    });
    
    // Step 3 - Number of windows selection and navigation
    document.getElementById('step3-button').addEventListener('click', function() {
        const numberOfWindows = document.querySelector('input[name="NumberOfWindows"]:checked');
        const multipleWindows = document.querySelector('input[name="MultipleWindows"]:checked');
        
        // Show loading spinner
        this.querySelector('.btn-spinner').style.display = 'inline-block';
        
        setTimeout(() => {
            // Check if single window selected and multiple windows question answered
            if (numberOfWindows && (numberOfWindows.value !== '1' || multipleWindows)) {
                showStep(4);
            } else if (numberOfWindows && numberOfWindows.value === '1' && !multipleWindows) {
                alert('Please answer if you would be open to a quote for multiple windows.');
            } else {
                alert('Please select how many windows are involved.');
            }
            
            // Hide spinner
            this.querySelector('.btn-spinner').style.display = 'none';
        }, 500);
    });
    
    document.getElementById('step3-back').addEventListener('click', function() {
        showStep(2);
    });
    
    // Step 4 - Back button
    document.getElementById('step4-back').addEventListener('click', function() {
        showStep(3);
    });
    
    // Function to show a specific step and hide others
    function showStep(stepNumber) {
        // Update steps visibility
        steps.forEach(step => {
            step.classList.remove('active');
        });
        
        const currentStep = document.querySelector(`.step[data-step="${stepNumber}"]`);
        if (currentStep) {
            currentStep.classList.add('active');
        }
        
        // Update progress indicator
        updateProgress(stepNumber);
    }
    
    // Function to update progress indicator
    function updateProgress(currentStep) {
        progressDots.forEach((dot, index) => {
            const step = index + 1;
            if (step <= currentStep) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        progressLines.forEach((line, index) => {
            if (index < currentStep - 1) {
                line.classList.add('active');
            } else {
                line.classList.remove('active');
            }
        });
    }
    
    // Handle ZIP code input - only allow numbers
    document.getElementById('zip').addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
    
    // Show/hide multiple windows question based on number of windows selection
    const windowsNumberInputs = document.querySelectorAll('input[name="NumberOfWindows"]');
    const multipleWindowsSection = document.querySelector('.step-extra');
    
    windowsNumberInputs.forEach(input => {
        input.addEventListener('change', function() {
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
    
    // Add animation to radio buttons
    const radioButtons = document.querySelectorAll('.radio-button-label');
    radioButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Find the radio input within this label
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                
                // Trigger the change event for the number of windows inputs
                if (radio.name === 'NumberOfWindows') {
                    radio.dispatchEvent(new Event('change'));
                }
            }
        });
    });
});