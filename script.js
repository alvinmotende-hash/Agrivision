document.addEventListener("DOMContentLoaded", () => {
    // Target metrics configurations: [min_optimal, max_optimal, unit]
    const metricConfig = {
        moisture: { min: 40, max: 60, unit: "%" },
        ph: { min: 6.0, max: 7.0, unit: " pH" },
        temperature: { min: 20, max: 28, unit: "°C" },
        nitrogen: { min: 30, max: 50, unit: " mg/kg" },
        phosphorus: { min: 15, max: 30, unit: " mg/kg" },
        potassium: { min: 150, max: 250, unit: " mg/kg" }
    };

    const form = document.getElementById("telemetry-input-form");

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            // Loop through each configured metric
            Object.keys(metricConfig).forEach(key => {
                const inputElement = document.getElementById(`input-${key}`);
                if (!inputElement) return;

                const value = parseFloat(inputElement.value);
                const config = metricConfig[key];
                
                // DOM elements to update
                const valueCell = document.getElementById(`val-${key}`);
                const statusCell = document.getElementById(`status-${key}`);

                if (!isNaN(value) && valueCell && statusCell) {
                    // Update value display text
                    valueCell.innerHTML = `${value}${config.unit}`;

                    // Evaluate optimal thresholds
                    if (value >= config.min && value <= config.max) {
                        statusCell.innerHTML = `<span class="status-indicator status-good"></span> Optimal`;
                    } else {
                        statusCell.innerHTML = `<span class="status-indicator status-warning"></span> Alert`;
                    }
                }
            });

            // Update timestamp label
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            document.getElementById("update-timestamp").innerText = `Last updated: Custom User Entry at ${timeString}`;
            
            alert("Telemetry table values overridden successfully!");
        });
    }
});