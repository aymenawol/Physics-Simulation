document.addEventListener("DOMContentLoaded", function () {

    const ball = document.querySelector('.ball');
    const positionSlider = document.getElementById('position-slider');
    const velocitySlider = document.getElementById('velocity-slider');
    const accelerationSlider = document.getElementById('acceleration-slider');
    const positionInput = document.getElementById('position-input');
    const velocityInput = document.getElementById('velocity-input');
    const accelerationInput = document.getElementById('acceleration-input');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const resetBtn = document.getElementById('resetBtn');
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    const container = document.querySelector('.container');
    let currentPosition = 50;
    let currentVelocity = 0;
    let currentAcceleration = 0;
    let lastTimestamp;
    let animationId;
                

    function updatePosition(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const deltaTime = (timestamp - lastTimestamp) / 1000; 
    currentPosition += currentVelocity * deltaTime; 
    currentVelocity += currentAcceleration * deltaTime; 
    if (currentVelocity > 50) currentVelocity = 50; 
    if (currentVelocity < -50) currentVelocity = -50; 
    if (currentPosition < 0) currentPosition = 0;
    if (currentPosition > 100) currentPosition = 100;
    ball.style.left = `${currentPosition}%`;
    positionInput.value = Math.round(currentPosition); 
    positionSlider.value = Math.round(currentPosition); 
    velocityInput.value = currentVelocity.toFixed(2); 
    velocitySlider.value = currentVelocity.toFixed(2);
    accelerationInput.value = currentAcceleration.toFixed(2); 
    accelerationSlider.value = currentAcceleration.toFixed(2); 
    lastTimestamp = timestamp;
    if (animationId) {
        animationId = requestAnimationFrame(updatePosition);
    }
}

    

    function startAnimation() {
        animationId = requestAnimationFrame(updatePosition);
    }

    function stopAnimation() {
        cancelAnimationFrame(animationId);
        lastTimestamp = null;
    }

    function resetAnimation() {
        cancelAnimationFrame(animationId);
        lastTimestamp = null;
        currentPosition = 50;
        currentVelocity = 0;
        currentAcceleration = 0;
        positionSlider.value = currentPosition;
        velocitySlider.value = currentVelocity;
        accelerationSlider.value = currentAcceleration;
        ball.style.left = `${currentPosition}%`;
        positionInput.value = currentPosition;
        velocityInput.value = currentVelocity;
        accelerationInput.value = currentAcceleration;
    }

    positionInput.addEventListener('input', function () {
        currentPosition = parseFloat(this.value);
        ball.style.left = `${currentPosition}%`;
    });

    velocityInput.addEventListener('input', function () {
        currentVelocity = parseFloat(this.value);
    });

    accelerationInput.addEventListener('input', function () {
        currentAcceleration = parseFloat(this.value);
    });

    positionSlider.addEventListener('input', function () {
        currentPosition = parseFloat(this.value);
        ball.style.left = `${currentPosition}%`;
        positionInput.value = currentPosition;
    });

    velocitySlider.addEventListener('input', function () {
        currentVelocity = parseFloat(this.value);
        velocityInput.value = currentVelocity;
    });

    accelerationSlider.addEventListener('input', function () {
        currentAcceleration = parseFloat(this.value);
        accelerationInput.value = currentAcceleration;
    });

    startBtn.addEventListener('click', startAnimation);
    stopBtn.addEventListener('click', stopAnimation);
    resetBtn.addEventListener('click', resetAnimation);

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

        darkModeSwitch.addEventListener('change', () => {
                if (darkModeSwitch.checked) {
                    document.body.classList.add('dark-mode');
                } else {
                    document.body.classList.remove('dark-mode');
                }
            });
