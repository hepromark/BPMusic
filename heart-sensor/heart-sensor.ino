#include "WiFi.h"

const char* ssid = "Yam9i";
const char* password =  "oceanshrimp";

void setup() {
  Serial.begin(9600);
  WiFi.begin(ssid, password);
  Serial.println("WiFi setup done!");
}

void loop() {
  // Heartbeat-sensor is just a photo-resistor that measures light values
  // As blood pumps through the heart, the light detected will have crest and troughs
  // with the same frequency as the heart-rate. 

  // Heart-rate is usually around 60bpm - 150bpm, so 0.2s - 1s between peaks is a good
}

