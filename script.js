document.addEventListener("DOMContentLoaded", () => {
    // Target metrics configurations
    const metricConfig = {
        moisture: { min: 40, max: 60, unit: "%", label: "Soil Moisture" },
        ph: { min: 6.0, max: 7.0, unit: " pH", label: "Soil pH" },
        temperature: { min: 20, max: 28, unit: "°C", label: "Temperature" },
        nitrogen: { min: 30, max: 50, unit: " mg/kg", label: "Nitrogen (N)" },
        phosphorus: { min: 15, max: 30, unit: " mg/kg", label: "Phosphorus (P)" },
        potassium: { min: 150, max: 250, unit: " mg/kg", label: "Potassium (K)" }
    };

    const form = document.getElementById("telemetry-input-form");

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            let alertsGenerated = [];

            // Loop through each configured metric to update the table
            Object.keys(metricConfig).forEach(key => {
                const inputElement = document.getElementById(`input-${key}`);
                if (!inputElement) return;

                const value = parseFloat(inputElement.value);
                const config = metricConfig[key];
                
                const valueCell = document.getElementById(`val-${key}`);
                const statusCell = document.getElementById(`status-${key}`);

                if (!isNaN(value) && valueCell && statusCell) {
                    valueCell.innerHTML = `${value}${config.unit}`;

                    // Evaluate optimal thresholds
                    if (value >= config.min && value <= config.max) {
                        statusCell.innerHTML = `<span class="status-indicator status-good"></span> Optimal`;
                    } else {
                        statusCell.innerHTML = `<span class="status-indicator status-warning"></span> Alert`;
                        
                        // Determine if it's too high or too low
                        const direction = value < config.min ? "low" : "high";
                        alertsGenerated.push({ key, direction, value, config });
                    }
                }
            });

            // Update timestamp label
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            document.getElementById("update-timestamp").innerText = `Last updated: Custom User Entry at ${timeString}`;
            
            // Re-render UI components based on compiled logs
            updateAlertUI(alertsGenerated);
        });
    }

    // Function to rewrite the alert cards with contextual diagnostics
    function updateAlertUI(alerts) {
        const alertCard = document.getElementById("alert-card");
        const insightsCard = document.getElementById("insights-card");
        
        if (!alertCard || !insightsCard) return;

        let alertSectionHTML = `<h3>Precision Agriculture Alerts</h3>`;
        let insightSectionHTML = `<h3>Actionable Insights</h3>`;
        
        if (alerts.length === 0) {
            // Perfect case logic loop
            alertSectionHTML += `
                <div style="background-color: #e8f5e9; padding: 1rem; border-left: 4px solid var(--success-color, #2ecc71); border-radius: 4px;">
                    <h4 style="color: #27ae60; margin-bottom: 0.3rem;">✅ All Systems Optimal</h4>
                    <p style="font-size: 0.9rem;">Sensor readings show well-balanced baseline configurations across all monitored variables.</p>
                </div>`;
            insightSectionHTML += `<p style="font-size: 0.95rem; margin-bottom: 1rem;">No diagnostic corrections needed. Maintain normal irrigation schedules and current crop rotation plans.</p>`;
        } else {
            // Build granular alert strings depending on metrics checked
            alerts.forEach(item => {
                let textCause = "";
                let textFix = "";

                // Core agricultural routing tables
                if (item.key === "moisture") {
                    textCause = item.direction === "low" ? "Soil moisture levels are dropping, causing crop dehydration risk." : "Soil moisture is excessive, risking root suffocation and waterlogging.";
                    textFix = item.direction === "low" ? "Initiate drip irrigation valve loops immediately." : "Suspend automatic irrigation logs and review plot drainage channels.";
                } else if (item.key === "ph") {
                    textCause = item.direction === "low" ? "Soil acidity is high (low pH), binding up essential nutrients." : "Soil alkalinity is elevated (high pH), micro-element availability is restricted.";
                    textFix = item.direction === "low" ? "Apply agricultural lime (calcium carbonate) to raise target pH safely." : "Incorporate organic matter, elemental sulfur compounds, or ammonium-based fertilizer solutions.";
                } else if (item.key === "temperature") {
                    textCause = item.direction === "low" ? "Soil temperatures are below optimal metabolic baselines." : "Thermal thresholds surpassed, spiking root-zone transpiration stress rates.";
                    textFix = item.direction === "low" ? "Consider plastic-sheet mulching options to preserve ground warmth." : "Deploy temporary shade netting frameworks or apply reflective straw mulch layers.";
                } else {
                    // Macronutrients (N, P, K)
                    textCause = item.direction === "low" ? `Macronutrient ${item.config.label} deficiency detected (${item.value}${item.config.unit}).` : `Critical concentration spike of ${item.config.label} observed.`;
                    
                    if (item.key === "nitrogen") {
                        textFix = item.direction === "low" ? "Top-dress using Calcium Ammonium Nitrate (CAN) or urea inputs." : "Leach excess salts with deep irrigation or cultivate nitrogen-feeding cover crops.";
                    } else if (item.key === "phosphorus") {
                        textFix = item.direction === "low" ? "Incorporate Monoammonium Phosphate (MAP) or Triple Superphosphate (TSP) fertilizers." : "Avoid subsequent phosphate formulations; add structural compost to stabilize fixation indexes.";
                    } else if (item.key === "potassium") {
                        textFix = item.direction === "low" ? "Apply Muriate of Potash (MOP) to preserve cell turgor pressures." : "Divert direct applications; balance out with calcium-magnesium variants to optimize ionic absorption.";
                    }
                }

                alertSectionHTML += `
                    <div style="background-color: #fffde7; padding: 1rem; border-left: 4px solid var(--accent-color, #e67e22); border-radius: 4px; margin-bottom: 1rem;">
                        <h4 style="color: #d35400; margin-bottom: 0.3rem;">⚠️ ${item.config.label}: ${item.direction.toUpperCase()}</h4>
                        <p style="font-size: 0.9rem; margin-bottom: 0.2rem;"><strong>Cause:</strong> ${textCause}</p>
                        <p style="font-size: 0.9rem;"><strong>Remedy:</strong> ${textFix}</p>
                    </div>`;
            });

            insightSectionHTML += `
                <p style="font-size: 0.95rem; margin-bottom: 1rem;">
                    The dashboard has computed <strong>${alerts.length} required field intervention steps</strong> to maintain peak biological yield baselines. Ensure targeted applications occur within the next 48-hour farming window.
                </p>`;
        }

        insightSectionHTML += `<button class="btn btn-accent" style="width: 100%;">Push Recommendations via SMS/USSD</button>`;

        // Render directly inside clear target slots
        alertCard.innerHTML = alertSectionHTML;
        insightsCard.innerHTML = insightSectionHTML;
    }
});