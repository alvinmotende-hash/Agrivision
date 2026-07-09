import datetime

class SoilTelemetryDB:
    def __init__(self):
        self.current_reading = {
            "moisture": 42.0,
            "ph": 6.4,
            "temperature": 24.5,
            "nitrogen": 28.0,
            "phosphorus": 14.0,
            "potassium": 185.0,
            "last_updated": "Just now (15-minute scheduled interval)"
        }

    def update_telemetry(self, data):
        now = datetime.datetime.now()
        time_str = now.strftime("%I:%M %p")
        self.current_reading = {
            "moisture": float(data.get("moisture", 42)),
            "ph": float(data.get("ph", 6.4)),
            "temperature": float(data.get("temperature", 24.5)),
            "nitrogen": float(data.get("nitrogen", 28)),
            "phosphorus": float(data.get("phosphorus", 14)),
            "potassium": float(data.get("potassium", 185)),
            "last_updated": f"Custom User Entry at {time_str}"
        }
        return self.current_reading


class MarketConnectorDB:
    def __init__(self):
        # Added tracking for price points directly into the data matrix
        self.listings = [
            {"id": 1, "category": "White Maize", "volume": "2.5 Metric Tons", "quality_score": "Grade A9 (96/100)", "proximity": "4.2 km away", "price": "KES 48,500"},
            {"id": 2, "category": "Bulb Onions", "volume": "800 Kilograms", "quality_score": "Grade A8 (89/100)", "proximity": "11.0 km away", "price": "KES 16,200"},
            {"id": 3, "category": "Irish Potatoes", "volume": "1.8 Metric Tons", "quality_score": "Grade B2 (74/100)", "proximity": "14.5 km away", "price": "KES 24,000"}
        ]

    def get_all(self):
        return self.listings


soil_db = SoilTelemetryDB()
market_db = MarketConnectorDB()