#include <ArduinoJson.h>
#include <SPIFFS.h>
#include "FS.h"  //needed?
#include "EEPROM.h"
#include "HTML.h"
#include <WebServer.h>
#include <esp_heap_caps.h>
WebServer server(80);
#include "Additions.h"
#include <WiFi.h>
#include <WiFiClient.h> //needed?
#include <WiFiClientSecure.h> //needed?
#include <HTTPClient.h>
#include "time.h" //needed?
#include <ESP32Time.h>
#include <base64.h>
#include "CIC_Datalog.h"
#include"INC_Datalog.h"
ESP32Time rtc;

#define LED 2 //needed?
#define FORMAT_SPIFFS_IF_FAILED true
// File root; //needed?
#define wifissid "mm"
#define pw "manutd13"
#define static_ssid_pw 1

WiFiClientSecure client; //needed?
String fhir_creds = "fhiruser:change-password";
String macd = WiFi.macAddress();
char ssid[30];
char pass[30];
String p_time, in_data, postData, s, p, h, d, l;
unsigned long previousMillis = 0;
unsigned long interval = 30000;
const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 19800;
const int daylightOffset_sec = 0;
String split_arr[20];
String p_deets[10];
  
int httpCode;
String output;
String device_resource_id;
String patient_resource_id;
String observation_resource_id;
String communication_resource_id;
String Mother_name="NOONE";

#define httpPOST 1
#define httpGET 2
#define httpPUT 3


//clearing EEPROM
void wipeEEPROM() {
  for (int i = 0; i < 300; i++) {
    EEPROM.writeByte(i, 0);
  }
  EEPROM.commit();
  deleteFile(SPIFFS, "/config.json");
}

//declaring HTTP_Send methods
int http_send(String url, uint8_t method, String& data) {
  int return_code;
  HTTPClient http;
  http.begin(url);
  switch (method) {
    case httpPOST:
      http.addHeader("Authorization", String("Basic " + base64::encode(fhir_creds)));
      http.addHeader("Content-Type", "application/json");
      http.addHeader("Accept", "*/*");
      http.addHeader("Accept-Encoding", "gzip, deflate, br");
      http.addHeader("Connection", "keep-alive");
      http.addHeader("Content-Length", String(data.length()));
      return_code = http.POST(data);

      break;
    case httpGET:
      http.addHeader("Authorization", String("Basic " + base64::encode(fhir_creds)));
      return_code = http.GET();
      data = http.getString();
      break;
    case httpPUT:
      http.addHeader("Authorization", String("Basic " + base64::encode(fhir_creds)));
      http.addHeader("Content-Type", "application/json");
      http.addHeader("Accept", "*/*");
      http.addHeader("Accept-Encoding", "gzip, deflate, br");
      http.addHeader("Connection", "keep-alive");
      http.addHeader("Content-Length", String(data.length()));
      return_code = http.PUT(data);
      break;
    default: Serial.println("Invalid method");
  }
  http.end();
  return return_code;
}

// function to register new user
void new_user_c(String* patient_deets) {
  DynamicJsonDocument nuc(4000);
  nuc["resourceType"] = "Patient";

  JsonObject extension_0 = nuc["extension"].createNestedObject();
  extension_0["url"] = "http://hl7.org/fhir/StructureDefinition/patient-mothersMaidenName";
  extension_0["valueString"] = patient_deets[1];

  JsonObject identifier = nuc["identifier"].createNestedObject();
  identifier["system"] = "urn:ietf:rfc:3986";
  identifier["value"] = patient_deets[0];

  serializeJson(nuc, output);
  Serial.println(output);
  httpCode = http_send("http://13.126.5.10:9444/fhir-server/api/v4/Patient", httpPOST, output);
  Serial.println(httpCode);

  String payload;
  patient_deets[0].replace(" ","%20");
  httpCode = http_send("http://13.126.5.10:9444/fhir-server/api/v4/Patient?identifier=" + patient_deets[0], httpGET, payload);
  Serial.println(httpCode);
  nuc.clear();

  DeserializationError error = deserializeJson(nuc, payload);
  if (error) {
    Serial.println("New User Creation:");
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    return;
  }
  patient_resource_id = "";
  const char* temp = nuc["entry"][0]["resource"]["id"];
  patient_resource_id = String(temp);
  Serial.println(patient_resource_id);
  nuc.clear();

  nuc["resourceType"] = "Device";
  nuc["status"] = "active";
  nuc["id"] = device_resource_id;
  nuc["manufacturer"] = "Phoenix Medical Systems Pvt. Ltd";

  JsonObject identifier_0 = nuc["identifier"].createNestedObject();
  identifier_0["system"] = "urn:ietf:rfc:3986";
  identifier_0["value"] = macd;
  nuc["patient"]["reference"] = "Patient/" + patient_resource_id;
  output = "";
  serializeJson(nuc, output);

  // HTTPClient http;
  httpCode = http_send("http://13.126.5.10:9444/fhir-server/api/v4/Device/" + device_resource_id, httpPUT, output);
  Serial.println(httpCode);
  nuc.clear();
}

void new_obs_c(String dev) {

  DynamicJsonDocument noc(4000);

  noc["resourceType"] = "Observation";
  noc["status"] = "final";

  JsonArray identifier = noc.createNestedArray("identifier");
  identifier[0]["value"] = "CIC";
  identifier[1]["value"] = "Data Log";
  noc["device"]["reference"] = "Device/" + device_resource_id;
  noc["subject"]["reference"] = "Patient/" + patient_resource_id;

  JsonObject code = noc.createNestedObject("code");

  JsonObject code_coding_0 = code["coding"].createNestedObject();
  code_coding_0["system"] = "http://loinc.org";
  code_coding_0["code"] = "85353-1";
  code_coding_0["display"] = "Vital signs, weight, height, head circumference, oximetry, BMI, and BSA panel";
  code["text"] = "Vital signs panel";

  JsonObject category_0_coding_0 = noc["category"][0]["coding"].createNestedObject();
  category_0_coding_0["system"] = "http://terminology.hl7.org/CodeSystem/observation-category";
  category_0_coding_0["code"] = "data-log";
  category_0_coding_0["display"] = "Data Log";
  output = "";
  serializeJson(noc, output);

  httpCode = http_send("http://13.126.5.10:9444/fhir-server/api/v4/Observation", httpPOST, output);
  Serial.println(httpCode);
  noc.clear();
  output = "";
  httpCode = http_send("http://13.126.5.10:9444/fhir-server/api/v4/Observation?patient=" + patient_resource_id, httpGET, output);
  Serial.println(httpCode);

  DeserializationError error = deserializeJson(noc, output);
  if (error) {
    Serial.println("New Observation Creating:");
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    return;
  }
  observation_resource_id = "";
  const char* temp = noc["entry"][0]["resource"]["id"];
  observation_resource_id = String(temp);
  Serial.println(observation_resource_id);
  noc.clear();
}

void new_com_c(String dev) {
  HTTPClient http;
  DynamicJsonDocument doc(4000);

  doc["resourceType"] = "Communication";
  doc["status"] = "completed";
  doc["sender"]["reference"] = "Device/" + device_resource_id;
  doc["sent"] = "2023-06-12T15:09:10-08:00";
  doc["payload"][0]["contentReference"]["display"] = "Alarm details";
  output = "";
  serializeJson(doc, output);

  httpCode = http_send("http://13.126.5.10:9444/fhir-server/api/v4/Communication", httpPOST, output);
  Serial.println(httpCode);

  output = "";
  httpCode = http_send("http://13.126.5.10:9444/fhir-server/api/v4/Communication?_sort=-sent&_count=1&sender=" + device_resource_id, httpGET, output);
  Serial.println(httpCode);
  doc.clear();

  DeserializationError error = deserializeJson(doc, output);
  if (error) {
    Serial.println("New Communication Creating:");
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    return;
  }

  communication_resource_id = "";
  const char* temp = doc["entry"][0]["resource"]["id"];
  communication_resource_id = String(temp);
  http.end();
  doc.clear();
}

void inc_new_user_c(String Mother_name) {
  DynamicJsonDocument nuc(4000);
  nuc["resourceType"] = "Patient";

  JsonObject extension_0 = nuc["extension"].createNestedObject();
  extension_0["url"] = "http://hl7.org/fhir/StructureDefinition/patient-mothersMaidenName";
  extension_0["valueString"] = Mother_name;

  JsonObject identifier = nuc["identifier"].createNestedObject();
  identifier["system"] = "urn:ietf:rfc:3986";
  identifier["value"] = "PATIENT_ID"; //change

  serializeJson(nuc, output);
  Serial.println(output);
  httpCode = http_send("http://13.126.5.10:9444/fhir-server/api/v4/Patient", httpPOST, output);
  Serial.println(httpCode);

  String payload;
  httpCode = http_send("http://13.126.5.10:9444/fhir-server/api/v4/Patient?identifier=" + Mother_name, httpGET, payload); //change
  Serial.println(httpCode);
  nuc.clear();

  DeserializationError error = deserializeJson(nuc, payload);
  if (error) {
    Serial.println("New User Creation:");
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    return;
  }
  patient_resource_id = "";
  const char* temp = nuc["entry"][0]["resource"]["id"];
  patient_resource_id = String(temp);
  Serial.println(patient_resource_id);
  nuc.clear();

  nuc["resourceType"] = "Device";
  nuc["status"] = "active";
  nuc["id"] = device_resource_id;
  nuc["manufacturer"] = "Phoenix Medical Systems Pvt. Ltd";

  JsonObject identifier_0 = nuc["identifier"].createNestedObject();
  identifier_0["system"] = "urn:ietf:rfc:3986";
  identifier_0["value"] = macd;
  nuc["patient"]["reference"] = "Patient/" + patient_resource_id;
  output = "";
  serializeJson(nuc, output);

  // HTTPClient http;
  httpCode = http_send("http://13.126.5.10:9444/fhir-server/api/v4/Device/" + device_resource_id, httpPUT, output);
  Serial.println(httpCode);
  nuc.clear();
}

void inc_new_obs_c(String DEVICCE ) {

  DynamicJsonDocument noc(4000);

  noc["resourceType"] = "Observation";
  noc["status"] = "final";

  JsonArray identifier = noc.createNestedArray("identifier");
  identifier[0]["value"] = "INC";
  identifier[1]["value"] = "Data Log";
  noc["device"]["reference"] = "Device/" + device_resource_id;
  noc["subject"]["reference"] = "Patient/" + patient_resource_id;

  JsonObject code = noc.createNestedObject("code");

  JsonObject code_coding_0 = code["coding"].createNestedObject();
  code_coding_0["system"] = "http://loinc.org";
  code_coding_0["code"] = "85353-1";
  code_coding_0["display"] = "Vital signs, weight, height, head circumference, oximetry, BMI, and BSA panel";
  code["text"] = "Vital signs panel";

  JsonObject category_0_coding_0 = noc["category"][0]["coding"].createNestedObject();
  category_0_coding_0["system"] = "http://terminology.hl7.org/CodeSystem/observation-category";
  category_0_coding_0["code"] = "data-log";
  category_0_coding_0["display"] = "Data Log";
  output = "";
  serializeJson(noc, output);

  httpCode = http_send("http://13.126.5.10:9444/fhir-server/api/v4/Observation", httpPOST, output);
  Serial.println(httpCode);
  noc.clear();
  output = "";
  httpCode = http_send("http://13.126.5.10:9444/fhir-server/api/v4/Observation?patient=" + patient_resource_id, httpGET, output);
  Serial.println(httpCode);

  DeserializationError error = deserializeJson(noc, output);
  if (error) {
    Serial.println("New Observation Creating:");
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    return;
  }
  observation_resource_id = "";
  const char* temp = noc["entry"][0]["resource"]["id"];
  observation_resource_id = String(temp);
  Serial.println(observation_resource_id);
  noc.clear();
}

void inc_new_com_c(String DEVICCE) {
  HTTPClient http;
  DynamicJsonDocument doc(4000);

  doc["resourceType"] = "Communication";
  doc["status"] = "completed";
  doc["sender"]["reference"] = "Device/" + device_resource_id;
  doc["sent"] = "2023-06-12T15:09:10-08:00";
  doc["payload"][0]["contentReference"]["display"] = "Alarm details";
  output = "";
  serializeJson(doc, output);

  httpCode = http_send("http://13.126.5.10:9444/fhir-server/api/v4/Communication", httpPOST, output);
  Serial.println(httpCode);

  output = "";
  httpCode = http_send("http://13.126.5.10:9444/fhir-server/api/v4/Communication?_sort=-sent&_count=1&sender=" + device_resource_id, httpGET, output);
  Serial.println(httpCode);
  doc.clear();

  DeserializationError error = deserializeJson(doc, output);
  if (error) {
    Serial.println("New Communication Creating:");
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    return;
  }

  communication_resource_id = "";
  const char* temp = doc["entry"][0]["resource"]["id"];
  communication_resource_id = String(temp);
  http.end();
  doc.clear();
}


void device_reg() {
  DynamicJsonDocument device_reg(4000);
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

  output = "";
  serializeJson(device_reg, output);
  httpCode = http_send("http://13.126.5.10:9444/fhir-server/api/v4/Device", httpPOST, output);
  Serial.println(httpCode);
  device_reg.clear();

  output = "";
  httpCode = http_send("http://13.126.5.10:9444/fhir-server/api/v4/Device?identifier=" + macd, httpGET, output);
  Serial.println(httpCode);
  Serial.println(output);
  DeserializationError error = deserializeJson(device_reg, output);
  if (error) {
    Serial.println("Device Reg:");
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    return;
  }
  device_resource_id = "";
  const char* temp = device_reg["entry"][0]["resource"]["id"];
  device_resource_id = String(temp);

  writeFile(SPIFFS, "/config.json", "{\"device\":\"" + device_resource_id + "\",\"patient\":\"" + patient_resource_id + "\",\"communication\":\"" + communication_resource_id + "\",\"observation\":\"" + observation_resource_id +"\",\"m_name\":\"" + Mother_name + "\"}");

  EEPROM.writeByte(0x01, 0x01);
  EEPROM.commit();
  device_reg.clear();
}

void setup() {
  pinMode(LED, OUTPUT); //needed?
  pinMode(0, INPUT_PULLUP);  //for resetting WiFi creds
  digitalWrite(0, HIGH);
  Serial.begin(9600);
  EEPROM.begin(300);
  Serial.println(WiFi.macAddress());
  if (digitalRead(0) == LOW) {
    Serial.println("Wiping WiFi credentials from memory...");
    wipeEEPROM();
    digitalWrite(2, HIGH);
    // while (loadWIFICredsForm());
    //    digitalWrite(2, LOW);
  }
  // #if (static_ssid_pw)
  WiFi.mode(WIFI_STA);
  WiFi.begin(wifissid, pw);
  Serial.print("\nConnecting to WiFi ..");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(1000);
  }

  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  struct tm timeinfo;
  if (getLocalTime(&timeinfo)) {
    rtc.setTimeStruct(timeinfo);
  }
  if (!SPIFFS.begin(FORMAT_SPIFFS_IF_FAILED)) {
    Serial.println("SPIFFS Mount Failed");
    return;
  }
    size_t freeHeapSize = heap_caps_get_free_size(MALLOC_CAP_DEFAULT);
  Serial.print("Free Heap Size: ");
  Serial.println(freeHeapSize);

  uint8_t device_reg_check = EEPROM.readByte(0x01);
  if (device_reg_check != 0x01) {
    device_reg();
  } else {
    Serial.println("Skipping Device Reg");
    //    String temp = readFile(SPIFFS, "/config.json");
    DynamicJsonDocument dev_data(4000);

    File input = SPIFFS.open("/config.json");

    DeserializationError error = deserializeJson(dev_data, input);
    input.close();
    if (error) {
      Serial.println("Skipping Device Reg:");
      Serial.print(F("deserializeJson() failed: "));
      Serial.println(error.f_str());
      return;
    }
    const char* buffer;
    buffer = dev_data["device"];
    device_resource_id = String(buffer);
    buffer = dev_data["patient"];
    patient_resource_id = String(buffer);
    buffer = dev_data["communication"];
    communication_resource_id = String(buffer);
    buffer = dev_data["observation"];
    observation_resource_id = String(buffer);
    buffer = dev_data["m_name"];
    Mother_name = String(buffer);

    Serial.println(device_resource_id);
    Serial.println(patient_resource_id);
    Serial.println(communication_resource_id);
    Serial.println(observation_resource_id);
    Serial.println(Mother_name);
    dev_data.clear();
  size_t freeHeapSize = heap_caps_get_free_size(MALLOC_CAP_DEFAULT);
  Serial.print("Free Heap Size: ");
  Serial.println(freeHeapSize);

  }
}

void loop() {
  if (digitalRead(0) == LOW) {
    Serial.println("Wiping WiFi credentials from memory...");
    wipeEEPROM();
    digitalWrite(2, HIGH);
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
    size_t freeHeapSize = heap_caps_get_free_size(MALLOC_CAP_DEFAULT);
  Serial.print("Free Heap Size: ");
  Serial.println(freeHeapSize);
    String in_data = Serial.readStringUntil('\n');
    split_str(in_data, split_arr, "|");
    if (split_arr[0] == "CIC")
    {    //CIC Device
      if (split_arr[1] == "NUC") {  //New User Creating
                                    //        CIC|NUC|INCU,Jessy
        split_str(split_arr[2], p_deets, ",");
        new_user_c(p_deets);
        new_obs_c(split_arr[0]);
        new_com_c(split_arr[0]);
        writeFile(SPIFFS, "/config.json", "{\"device\":\"" + device_resource_id + "\",\"patient\":\"" + patient_resource_id + "\",\"communication\":\"" + communication_resource_id + "\",\"observation\":\"" + observation_resource_id + "\"}");
      }

      if (split_arr[1] == "DATALOG") {  //New User Creating
        // CIC|DATALOG|MANUAL,010,42.0,25.0,0000,009,001,004,003,000,0|01:28:/35
        // CIC|DATALOG|BABY,010,42.0,25.0,0000,009,001,004,003,000,0|H01:L28:H35
        output = "";
        cic_data(output, split_arr[2], device_resource_id, patient_resource_id, communication_resource_id, observation_resource_id);
        Serial.println(output);
        httpCode = http_send("http://13.126.5.10:9444/fhir-server/api/v4/Observation/" + observation_resource_id, httpPUT, output);
        Serial.println(httpCode);
        output = "";
        cic_alarm(output, split_arr[3], device_resource_id, patient_resource_id, communication_resource_id, observation_resource_id);
        Serial.println(output);
        httpCode = http_send("http://13.126.5.10:9444/fhir-server/api/v4/Communication/" + communication_resource_id, httpPUT, output);
        Serial.println(httpCode);
      }
    }
    ///INC 
    else
    {
        size_t freeHeapSize = heap_caps_get_free_size(MALLOC_CAP_DEFAULT);
  Serial.print("Free Heap Size: ");
  Serial.println(freeHeapSize);
        split_str(in_data, split_arr, ","); 
        String M_name = split_arr[24];
        if (Mother_name =="NOONE"){
          Serial.println("waiting for datalog");
        // inc_new_user_c(Mother_name);
        // inc_new_obs_c("INC");
        // inc_new_com_c("INC");
        // writeFile(SPIFFS, "/config.json", "{\"device\":\"" + device_resource_id + "\",\"patient\":\"" + patient_resource_id + "\",\"communication\":\"" + communication_resource_id + "\",\"observation\":\"" + observation_resource_id +"\",\"m_name\":\"" + M_name + "\"}");
        }
        else if (Mother_name!=M_name)
        {
        Mother_name=M_name;
        inc_new_user_c(Mother_name);
        inc_new_obs_c("INC");
        inc_new_com_c("INC");
        writeFile(SPIFFS, "/config.json", "{\"device\":\"" + device_resource_id + "\",\"patient\":\"" + patient_resource_id + "\",\"communication\":\"" + communication_resource_id + "\",\"observation\":\"" + observation_resource_id +"\",\"m_name\":\"" + Mother_name + "\"}");
        }
        else
       {
        output = "";
        inc_data(output,split_arr[1], device_resource_id, patient_resource_id, communication_resource_id, observation_resource_id);
        Serial.println(output);
        httpCode = http_send("http://13.126.5.10:9444/fhir-server/api/v4/Observation/" + observation_resource_id, httpPUT, output);
        Serial.println(httpCode);

        output = "";
        inc_alarm(output,split_arr[23], device_resource_id, patient_resource_id, communication_resource_id, observation_resource_id);
        Serial.println(output);
        httpCode = http_send("http://13.126.5.10:9444/fhir-server/api/v4/Communication/" + communication_resource_id, httpPUT, output);
        Serial.println(httpCode);
       }
    }
    
  }
}
