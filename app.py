from flask import Flask, render_template, request, jsonify, redirect, url_for
from models import soil_db, market_db

app = Flask(__name__)

@app.route('/')
@app.route('/index.html')
def dashboard():
    return render_template('index.html')


@app.route('/soil.html', methods=['GET', 'POST'])
def soil_doctor():
    if request.method == 'POST':
        form_data = {
            "moisture": request.form.get("moisture"),
            "ph": request.form.get("ph"),
            "temperature": request.form.get("temperature"),
            "nitrogen": request.form.get("nitrogen"),
            "phosphorus": request.form.get("phosphorus"),
            "potassium": request.form.get("potassium")
        }
        soil_db.update_telemetry(form_data)
        return redirect(url_for('soil_doctor'))

    reading = soil_db.current_reading
    alerts = []
    
    if reading["nitrogen"] < 30:
        alerts.append({"metric": "Nitrogen (N)", "direction": "LOW", "cause": "Macronutrient Nitrogen deficiency detected.", "remedy": "Top-dress using Calcium Ammonium Nitrate (CAN) or urea inputs."})
    if reading["phosphorus"] < 15:
        alerts.append({"metric": "Phosphorus (P)", "direction": "LOW", "cause": "Macronutrient Phosphorus deficiency detected.", "remedy": "Incorporate Monoammonium Phosphate (MAP) or Triple Superphosphate (TSP) fertilizers."})
    if reading["moisture"] < 40:
        alerts.append({"metric": "Soil Moisture", "direction": "LOW", "cause": "Soil moisture levels are dropping, causing crop dehydration risk.", "remedy": "Initiate drip irrigation valve loops immediately."})
    elif reading["moisture"] > 60:
        alerts.append({"metric": "Soil Moisture", "direction": "HIGH", "cause": "Soil moisture is excessive, risking root suffocation.", "remedy": "Suspend automatic irrigation logs and review plot drainage channels."})

    return render_template('soil.html', telemetry=reading, alerts=alerts)


@app.route('/crop.html')
def crop_nurse():
    return render_template('crop.html')


@app.route('/api/diagnose', methods=['POST'])
def diagnose_crop():
    return jsonify({
        "status": "success",
        "pathogen": "Maize Lethal Necrosis Disease (MLND)",
        "confidence": "94.2%",
        "velocity": "0.42 seconds (Server Core Inference Engine Run)",
        "remedies": [
            "Immediately quarantine infected plants to prevent vectors (thrips/aphids) from spreading the virus.",
            "Implement strict crop rotation patterns for the upcoming consecutive planting seasons.",
            "Report vector concentrations via the community notification matrix."
        ]
    })


@app.route('/market.html')
def market_connector():
    listings = market_db.get_all()
    return render_template('market.html', listings=listings)


@app.route('/api/mpesa-push', methods=['POST'])
def mpesa_push():
    phone_number = request.form.get('phone_number')
    amount = request.form.get('amount', 'KES 48,500')
    
    if not phone_number or len(phone_number) < 10:
        return jsonify({"status": "error", "message": "Invalid Safaricom mobile phone number format."}), 400
        
    return jsonify({
        "status": "success", 
        "message": f"SUCCESS: STK Push notification initiated to phone {phone_number}. Enter your M-Pesa PIN on your device to lock {amount} into secure AgriVision escrow."
    })


if __name__ == '__main__':
    app.run(debug=True, port=5000)