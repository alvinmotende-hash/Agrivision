/**
 * AgriVision Application Driver
 * Bridges user interactions directly with the Python Flask Backend
 */

document.addEventListener("DOMContentLoaded", () => {
    // --- 1. HANDLE CROPNURSE DIAGNOSIS SUBMISSIONS ---
    const diagnosticForm = document.getElementById("cropNurseForm");
    const diagnosticResult = document.getElementById("diagnosticResult");

    if (diagnosticForm && diagnosticResult) {
        diagnosticForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            diagnosticResult.innerHTML = `<p style="text-align:center; font-style:italic; color:#7f8c8d; padding: 2rem 0;">⚙️ Running remote neural engine inference execution values serverside...</p>`;
            
            const formData = new FormData(diagnosticForm);
            
            try {
                const response = await fetch('/api/diagnose', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();
                
                if (data.status === "success") {
                    let remedyListHtml = data.remedies.map(r => `<li>${r}</li>`).join('');
                    
                    diagnosticResult.innerHTML = `
                        <div style="background-color: #fff8f8; padding: 1.2rem; border-radius: 6px; border: 1px solid #f5c6cb;">
                            <table style="width:100%; border-collapse: collapse; font-size: 0.95rem; margin-bottom:1rem;">
                                <tr>
                                    <td style="padding: 0.5rem 0; font-weight: bold; color: #555;">Detected Pathogen:</td>
                                    <td style="padding: 0.5rem 0; text-align: right; color: #c0392b; font-weight: bold;">${data.pathogen}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 0.5rem 0; font-weight: bold; color: #555;">Classification Confidence:</td>
                                    <td style="padding: 0.5rem 0; text-align: right; font-weight: bold; color: #27ae60;">${data.confidence}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 0.5rem 0; font-weight: bold; color: #555;">Processing Velocity:</td>
                                    <td style="padding: 0.5rem 0; text-align: right; font-style: italic;">${data.velocity}</td>
                                </tr>
                            </table>
                            <h4 style="color: #c0392b; margin-bottom: 0.5rem;">Immediate Mitigation Standard:</h4>
                            <ul style="padding-left: 1.2rem; font-size: 0.9rem; line-height: 1.7; color:#2c3e50;">
                                ${remedyListHtml}
                            </ul>
                        </div>
                    `;
                }
            } catch (error) {
                diagnosticResult.innerHTML = `<p style="color:red; text-align:center;">Error connecting to processing server cluster nodes.</p>`;
            }
        });
    }

    // --- 2. HANDLE MARKET CONNECTOR ESCROW INTERFACE ---
    const mpesaForm = document.getElementById("mpesaEscrowForm");
    const escrowFeedback = document.getElementById("escrowFeedback");

    if (mpesaForm && escrowFeedback) {
        mpesaForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            escrowFeedback.className = ""; 
            escrowFeedback.style.display = "block";
            escrowFeedback.innerHTML = "🔗 Connecting to Safaricom Daraja API gateway channels...";
            escrowFeedback.style.padding = "0.75rem";
            escrowFeedback.style.backgroundColor = "#e8f5e9";
            escrowFeedback.style.color = "#27ae60";
            escrowFeedback.style.borderRadius = "4px";
            escrowFeedback.style.marginTop = "1rem";
            escrowFeedback.style.fontSize = "0.85rem";

            const formData = new FormData(mpesaForm);
            
            try {
                const response = await fetch('/api/mpesa-push', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();
                
                if (data.status === "success") {
                    escrowFeedback.style.backgroundColor = "#e8f5e9";
                    escrowFeedback.style.color = "#27ae60";
                    escrowFeedback.innerHTML = `✅ ${data.message}`;
                } else {
                    escrowFeedback.style.backgroundColor = "#fde8e8";
                    escrowFeedback.style.color = "#e74c3c";
                    escrowFeedback.innerHTML = `❌ ${data.message}`;
                }
            } catch (error) {
                escrowFeedback.style.backgroundColor = "#fde8e8";
                escrowFeedback.style.color = "#e74c3c";
                escrowFeedback.innerHTML = "❌ System communication loss during payment loop execution.";
            }
        });
    }

    // --- 3. DYNAMICALLY INTERCONNECT BATCH SELECTION TO CHECKOUT CARD ---
    const secureBatchBtns = document.querySelectorAll(".secure-batch-btn");
    const escrowAmountInput = document.getElementById("escrowAmount");

    if (secureBatchBtns.length > 0 && escrowAmountInput) {
        secureBatchBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const targetPrice = btn.getAttribute("data-price");
                const targetCrop = btn.getAttribute("data-crop");
                
                // Dynamically update form text entry metrics
                escrowAmountInput.value = targetPrice;
                
                // Provide context feedback below checkout form
                if (escrowFeedback) {
                    escrowFeedback.style.display = "block";
                    escrowFeedback.style.backgroundColor = "#eaf2f8";
                    escrowFeedback.style.color = "#2980b9";
                    escrowFeedback.style.padding = "0.75rem";
                    escrowFeedback.style.borderRadius = "4px";
                    escrowFeedback.style.marginTop = "1rem";
                    escrowFeedback.style.fontSize = "0.85rem";
                    escrowFeedback.innerHTML = `🛒 Selected <strong>${targetCrop}</strong>. Total price updated to <strong>${targetPrice}</strong>. Ready to check out.`;
                }
            });
        });
    }
});