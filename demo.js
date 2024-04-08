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

 
    const positionChart = createChart("Position", "Time", "#position-chart", 0, 100);
    const velocityChart = createChart("Velocity", "Time", "#velocity-chart", -50, 50);
    const accelerationChart = createChart("Acceleration", "Time", "#acceleration-chart", -10, 10);

   
    let animationData = [];

  
    function createChart(yAxisLabel, xAxisLabel, containerId, yMin, yMax) {
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };
        const width = 400 - margin.left - margin.right;
        const height = 200 - margin.top - margin.bottom;

        const svg = d3.select(containerId)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height})`);

        svg.append("g")
            .attr("class", "y-axis");

        svg.append("text")
            .attr("class", "x-label")
            .attr("transform", `translate(${width / 2},${height + margin.top + 10})`)
            .style("text-anchor", "middle")
            .text(xAxisLabel);

        svg.append("text")
            .attr("class", "y-label")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(yAxisLabel);

        const y = d3.scaleLinear()
            .domain([yMin, yMax])
            .range([height, 0]);

        svg.select(".y-axis").call(d3.axisLeft(y));

        return { svg, width, height, y };
    }

   
    function updateChart(chart, data) {
        const x = d3.scaleLinear()
            .domain(d3.extent(data, d => d.time))
            .range([0, chart.width]);

        const line = d3.line()
            .x(d => x(d.time))
            .y(d => chart.y(d.value));

        const path = chart.svg.selectAll(".line")
            .data([data]);

        path.enter().append("path")
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .merge(path)
            .attr("d", line);
    }

    // Update charts with initial data
    updateChart(positionChart, [{ time: 0, value: currentPosition }]);
    updateChart(velocityChart, [{ time: 0, value: currentVelocity }]);
    updateChart(accelerationChart, [{ time: 0, value: currentAcceleration }]);

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
        // Push animation data
        animationData.push({ time: timestamp, position: currentPosition, velocity: currentVelocity, acceleration: currentAcceleration });
        if (animationId) {
            animationId = requestAnimationFrame(updatePosition);
            // Update charts with animation data
            updateChart(positionChart, animationData.map(d => ({ time: d.time, value: d.position })));
            updateChart(velocityChart, animationData.map(d => ({ time: d.time, value: d.velocity })));
            updateChart(accelerationChart, animationData.map(d => ({ time: d.time, value: d.acceleration })));
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
        animationData = [];
        // Reset charts
        updateChart(positionChart, [{ time: 0, value: currentPosition }]);
        updateChart(velocityChart, [{ time: 0, value: currentVelocity }]);
        updateChart(accelerationChart, [{ time: 0, value: currentAcceleration }]);
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

    darkModeSwitch.addEventListener('change', () => {
        if (darkModeSwitch.checked) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    });
    velocityInput.addEventListener('input', function () {
        currentVelocity = parseFloat(this.value);
      
        updateChart(velocityChart, [{ time: performance.now(), value: currentVelocity }]);
    });
    
    const toggleChartsBtn = document.getElementById('toggleChartsBtn');
    const chartContainers = document.querySelectorAll('.chart-container');

    toggleChartsBtn.addEventListener('click', function () {
        chartContainers.forEach(container => {
            container.classList.toggle('hidden');
        });
    });
    
});
