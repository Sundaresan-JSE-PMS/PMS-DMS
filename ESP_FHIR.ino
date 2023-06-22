#include <ArduinoJson.h>
#include <SPIFFS.h>
#include "FS.h"
#include "EEPROM.h"
#include "HTML.h"
#include <WebServer.h>
WebServer server(80);
#include "Additions.h"
#include <WiFi.h>
#include <WiFiClient.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include "time.h"
#include <ESP32Time.h>
#include <base64.h>
ESP32Time rtc;
#define LED 2
#define FORMAT_SPIFFS_IF_FAILED true
File root;

#define wifissid "realme"
#define pw "sundaresan"

#define static_ssid_pw 1

WiFiClientSecure client;

String fhir_creds = "fhiruser:change-password";
String macd = WiFi.macAddress();
char ssid[30];
char pass[30];
String p_time, in_data, postData, s, p, h, d, l;
unsigned long previousMillis = 0;
unsigned long interval = 30000;
int count = 0;
const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 19800;
const int daylightOffset_sec = 0;
String split_arr[100];
String output;
//Resource IDs Temp
String device_resource_id = "dummy";
String patient_resource_id = "dummy";
String observation_resource_id = "dummy";
String communication_resource_id = "dummy";




void wipeEEPROM() {
  for (int i = 0; i < 300; i++) {
    EEPROM.writeByte(i, 0);
  }
  EEPROM.commit();
}

void new_user_c(String* patient_deets) {
  DynamicJsonDocument nuc(400);

  nuc["resourceType"] = "Patient";

  JsonObject extension_0 = nuc["extension"].createNestedObject();
  extension_0["url"] = "http://hl7.org/fhir/StructureDefinition/patient-mothersMaidenName";
  extension_0["valueString"] = patient_deets[1];

  JsonObject identifier = nuc["identifier"].createNestedObject();
  identifier["system"] = "urn:ietf:rfc:3986";
  identifier["value"] = patient_deets[0];


  HTTPClient http;
  http.begin("http://13.127.51.218:9444/fhir-server/api/v4/Patient");
  http.addHeader("Authorization", String("Basic " + base64::encode(fhir_creds)));
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Accept", "*/*");
  http.addHeader("Accept-Encoding", "gzip, deflate, br");
  http.addHeader("Connection", "keep-alive");
  serializeJson(nuc, output);
  Serial.println(output);
  http.addHeader("Content-Length", String(output.length()));
  int httpCode = http.POST(output);
  Serial.println(httpCode);
  http.end();
  http.begin("http://13.127.51.218:9444/fhir-server/api/v4/Patient?identifier=" + patient_deets[0]);
  http.addHeader("Authorization", String("Basic " + base64::encode(fhir_creds)));
  httpCode = http.GET();
  nuc.clear();
  deserializeJson(nuc, http.getString());
  // patient_resource_id = nuc["entry"][0]["resource"]["id"];

  //Write patient_resource_id to flash

  http.end();

  DynamicJsonDocument doc(2000);

  doc["resourceType"] = "Device";
  doc["status"] = "active";
  doc["id"] = device_resource_id;
  doc["manufacturer"] = "Phoenix Medical Systems Pvt. Ltd";

  JsonObject identifier_0 = doc["identifier"].createNestedObject();
  identifier_0["system"] = "urn:ietf:rfc:3986";
  identifier_0["value"] = macd;
  doc["patient"]["reference"] = "Patient/" + patient_resource_id;
  serializeJson(doc, output);

  // HTTPClient http;
  http.begin("http://13.127.51.218:9444/fhir-server/api/v4/Device");
  http.addHeader("Authorization", String("Basic " + base64::encode(fhir_creds)));
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Accept", "*/*");
  http.addHeader("Accept-Encoding", "gzip, deflate, br");
  http.addHeader("Connection", "keep-alive");
  Serial.println(output);
  http.addHeader("Content-Length", String(output.length()));
  httpCode = http.PUT(output);
  Serial.println(httpCode);
  http.end();
}

void new_obs_c(String dev) {

  DynamicJsonDocument doc(2000);

  doc["resourceType"] = "Observation";
  doc["status"] = "final";

  JsonArray identifier = doc.createNestedArray("identifier");
  identifier[0]["value"] = "CIC";
  identifier[1]["value"] = "Data Log";
  doc["device"]["reference"] = "Device/" + device_resource_id;
  doc["subject"]["reference"] = "Patient/" + patient_resource_id;

  JsonObject code = doc.createNestedObject("code");

  JsonObject code_coding_0 = code["coding"].createNestedObject();
  code_coding_0["system"] = "http://loinc.org";
  code_coding_0["code"] = "85353-1";
  code_coding_0["display"] = "Vital signs, weight, height, head circumference, oximetry, BMI, and BSA panel";
  code["text"] = "Vital signs panel";

  JsonObject category_0_coding_0 = doc["category"][0]["coding"].createNestedObject();
  category_0_coding_0["system"] = "http://terminology.hl7.org/CodeSystem/observation-category";
  category_0_coding_0["code"] = "data-log";
  category_0_coding_0["display"] = "Data Log";
  output = "";
  serializeJson(doc, output);

  HTTPClient http;
  http.begin("http://13.127.51.218:9444/fhir-server/api/v4/Observation");
  http.addHeader("Authorization", String("Basic " + base64::encode(fhir_creds)));
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Accept", "*/*");
  http.addHeader("Accept-Encoding", "gzip, deflate, br");
  http.addHeader("Connection", "keep-alive");
  Serial.println(output);
  http.addHeader("Content-Length", String(output.length()));
  int httpCode = http.POST(output);
  Serial.println(httpCode);
  http.end();
  doc.clear();
  http.begin("http://13.127.51.218:9444/fhir-server/api/v4/Observation?patient=" + patient_resource_id);
  http.addHeader("Authorization", String("Basic " + base64::encode(fhir_creds)));
  httpCode = http.GET();
  deserializeJson(doc, http.getString());
  // observation_resource_id = doc["entry"][0]["resource"]["id"];

  //Write observation_resource_id to flash

  http.end();
}

void new_com_c(String dev) {

  DynamicJsonDocument doc(2000);

  doc["resourceType"] = "Communication";
  doc["status"] = "completed";
  doc["sender"]["reference"] = "Device/" + device_resource_id;
  doc["sent"] = "2023-06-12T15:09:10-08:00";
  doc["payload"][0]["contentReference"]["display"] = "Alarm details";
  output = "";
  serializeJson(doc, output);

  HTTPClient http;
  http.begin("http://13.127.51.218:9444/fhir-server/api/v4/Communication");
  http.addHeader("Authorization", String("Basic " + base64::encode(fhir_creds)));
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Accept", "*/*");
  http.addHeader("Accept-Encoding", "gzip, deflate, br");
  http.addHeader("Connection", "keep-alive");
  Serial.println(output);
  http.addHeader("Content-Length", String(output.length()));
  int httpCode = http.POST(output);
  Serial.println(httpCode);
  http.end();
  http.begin("http://13.127.51.218:9444/fhir-server/api/v4/Communication?_sort=-sent&_count=1&sender=" + device_resource_id);
  http.addHeader("Authorization", String("Basic " + base64::encode(fhir_creds)));
  httpCode = http.GET();
  doc.clear();
  deserializeJson(doc, http.getString());
  // communication_resource_id = doc["entry"][0]["resource"]["id"];

  //Write observation_resource_id to flash

  http.end();
}


void device_reg() {
  DynamicJsonDocument device_reg(2000);
  device_reg["resourceType"] = "Device";
  device_reg["status"] = "active";
  device_reg["manufacturer"] = "Phoenix Medical Systems Pvt. Ltd";

  JsonArray identifier = device_reg.createNestedArray("identifier");

  JsonObject identifier_0 = identifier.createNestedObject();
  identifier_0["system"] = "urn:ietf:rfc:3986";
  identifier_0["value"] = macd;

  JsonObject identifier_1 = identifier.createNestedObject();
  identifier_1["system"] = "urn:ietf:rfc:3986";
  identifier_1["value"] = "Comprehensive Infant Care Centre";
  Serial.println("dummy");
  HTTPClient http;
  http.begin("http://13.127.51.218:9444/fhir-server/api/v4/Device");
  http.addHeader("Authorization", String("Basic " + base64::encode(fhir_creds)));
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Accept", "*/*");
  http.addHeader("Accept-Encoding", "gzip, deflate, br");
  http.addHeader("Connection", "keep-alive");
  serializeJson(device_reg, output);
  Serial.println(output);
  http.addHeader("Content-Length", String(output.length()));
  int httpCode = http.POST(output);
  // String payload = http.getString();
  Serial.println(httpCode);
  // Serial.println(payload);
  http.end();
  http.begin("http://13.127.51.218:9444/fhir-server/api/v4/Device?identifier=" + macd);
  http.addHeader("Authorization", String("Basic " + base64::encode(fhir_creds)));
  httpCode = http.GET();
  device_reg.clear();
  // Serial.print(http.getString());
  deserializeJson(device_reg, http.getString());
  // device_resource_id = device_reg["entry"][0]["resource"]["id"];
  // Save device resource_id to flash and some way to set device_reg_check to 0
  http.end();
  EEPROM.writeByte(0x01, 0x01);
  EEPROM.commit();
}



void setup() {
  pinMode(LED, OUTPUT);
  pinMode(0, INPUT_PULLUP);  //for resetting WiFi creds
  digitalWrite(0, HIGH);
  Serial.begin(115200);
  EEPROM.begin(300);
  Serial.println(WiFi.macAddress());

  // #if (static_ssid_pw)
  WiFi.mode(WIFI_STA);
  WiFi.begin(wifissid, pw);
  Serial.print("\nConnecting to WiFi ..");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(1000);
  }
  // #else
  //   if (!CheckWIFICreds()) {
  //     Serial.println("No WIFI credentials stored in memory. Loading form...");
  //     digitalWrite(2, HIGH);
  //     while (loadWIFICredsForm())
  //       ;
  //   } else {
  //     s = EEPROM.readString(100);
  //     p = EEPROM.readString(150);
  //     s.toCharArray(ssid, 30);
  //     p.toCharArray(pass, 30);
  //     WiFi.mode(WIFI_STA);
  //     WiFi.begin(ssid, pass);
  //     Serial.print("\nConnecting to WiFi ..");
  //     while (WiFi.status() != WL_CONNECTED) {
  //       Serial.print('.');
  //       delay(1000);
  //       count = count + 1;
  //       if (count > 30) {
  //         WiFi.disconnect();
  //         wipeEEPROM();
  //         Serial.println("Check Password and Try Again");
  //         loadWIFICredsForm();
  //         count = 0;
  //       }
  //     }
  //     Serial.println("Succesfully Connected");
  //     Serial.println("Hospital Deets:");
  //     h = EEPROM.readString(200);
  //     l = EEPROM.readString(250);
  //     Serial.println(h);
  //     Serial.println(l);
  //   }
  // #endif
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  struct tm timeinfo;
  if (getLocalTime(&timeinfo)) {
    rtc.setTimeStruct(timeinfo);
  }


  uint8_t device_reg_check = EEPROM.readByte(0x01);
  if (device_reg_check != 0x01) {
    device_reg();
  }
  else{
    Serial.println("Skipping Device Reg");
  }
}

void loop() {
  if (digitalRead(0) == LOW) {
    Serial.println("Wiping WiFi credentials from memory...");
    wipeEEPROM();
    digitalWrite(2, HIGH);
    while (loadWIFICredsForm());
    digitalWrite(2, LOW);
  }

  unsigned long currentMillis = millis();
  // if WiFi is down, try reconnecting every CHECK_WIFI_TIME seconds
  if ((WiFi.status() != WL_CONNECTED) && (currentMillis - previousMillis >= interval)) {
    Serial.print(millis());
    Serial.println("Reconnecting to WiFi...");
    WiFi.disconnect();
    WiFi.reconnect();
    previousMillis = currentMillis;
  }


  if (Serial.available() > 0) {
    String in_data = Serial.readStringUntil('\n');
    split_str(in_data, split_arr, "|");
    if (split_arr[0] == "CIC") {
      if (split_arr[1] == "NUC") {
        String p_deets[2];
        split_str(split_arr[2], p_deets, ",");  //{"yo", "yo"};
        new_user_c(p_deets);
        new_obs_c(split_arr[0]);
        new_com_c(split_arr[0]);
      }
    }
  }
}