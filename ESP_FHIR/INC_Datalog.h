void inc_data(String &return_data, String &in_data, String &d_id, String &p_id, String &c_id, String &o_id) {
  String dlog_arr[500];
  split_str(in_data, dlog_arr, ",");

  DynamicJsonDocument inc_log(4096);

  inc_log["id"] = o_id;
  inc_log["resourceType"] = "Observation";
  inc_log["status"] = "final";
  inc_log["identifier"][0]["value"] = "PMSinc";
  inc_log["subject"]["reference"] = "Patient/" + p_id;

  JsonObject code = inc_log.createNestedObject("code");

  JsonObject code_coding_0 = code["coding"].createNestedObject();
  code_coding_0["system"] = "http://loinc.org";
  code_coding_0["code"] = "85353-1";
  code_coding_0["display"] = "Vital signs, weight, height, head circumference, oximetry, BMI, and BSA panel";
  code["text"] = "Vital signs panel";

  JsonObject category_0_coding_0 = inc_log["category"][0]["coding"].createNestedObject();
  category_0_coding_0["system"] = "http://terminology.hl7.org/CodeSystem/observation-category";
  category_0_coding_0["code"] = "data-log";
  category_0_coding_0["display"] = "Data Log";

  JsonArray component = inc_log.createNestedArray("component");

  if (dlog_arr[1] == "BAB") {

    JsonObject component_0 = component.createNestedObject();

    JsonObject component_0_code = component_0.createNestedObject("code");

    JsonObject component_0_code_coding_0 = component_0_code["coding"].createNestedObject();
    component_0_code_coding_0["system"] = "http://loinc.org";
    component_0_code_coding_0["code"] = "M";
    component_0_code_coding_0["display"] = "MODE";
    component_0_code["text"] = "MODE";

    JsonObject component_0_valueQuantity = component_0.createNestedObject("valueQuantity");
    component_0_valueQuantity["value"] = 1;
    component_0_valueQuantity["unit"] = "A";
    component_0_valueQuantity["system"] = "http://unitsofmeasure.org";
    component_0_valueQuantity["code"] = "BABY";

    JsonObject component_1 = component.createNestedObject();

    JsonObject component_1_code = component_1.createNestedObject("code");

    JsonObject component_1_code_coding_0 = component_1_code["coding"].createNestedObject();
    component_1_code_coding_0["system"] = "http://loinc.org";
    component_1_code_coding_0["code"] = "60839-8";
    component_1_code_coding_0["display"] = "Set Skin Temp";
    component_1_code["text"] = "Set Skin Temp";

    JsonObject component_1_valueQuantity = component_1.createNestedObject("valueQuantity");
    component_1_valueQuantity["value"] = dlog_arr[3].toFloat();
    component_1_valueQuantity["unit"] = "C";
    component_1_valueQuantity["system"] = "http://unitsofmeasure.org";
    component_1_valueQuantity["code"] = "Cel";

    JsonObject component_2 = component.createNestedObject();

    JsonObject component_2_code = component_2.createNestedObject("code");

    JsonObject component_2_code_coding_0 = component_2_code["coding"].createNestedObject();
    component_2_code_coding_0["system"] = "http://loinc.org";
    component_2_code_coding_0["code"] = "60839-8";
    component_2_code_coding_0["display"] = "Measured Skin Temp 1";
    component_2_code["text"] = "Measured Skin Temp 1";

    JsonObject component_2_valueQuantity = component_2.createNestedObject("valueQuantity");
    component_2_valueQuantity["value"] = dlog_arr[4].toFloat();
    component_2_valueQuantity["unit"] = "C";
    component_2_valueQuantity["system"] = "http://unitsofmeasure.org";
    component_2_valueQuantity["code"] = "Cel";

    JsonObject component_4 = component.createNestedObject();

    JsonObject component_4_code = component_4.createNestedObject("code");

    JsonObject component_4_code_coding_0 = component_4_code["coding"].createNestedObject();
    component_4_code_coding_0["system"] = "http://loinc.org";
    component_4_code_coding_0["code"] = "75951-4";
    component_4_code_coding_0["display"] = "Measure Air temp ";
    component_4_code["text"] = "Measure Air temp";

    JsonObject component_4_valueQuantity = component_4.createNestedObject("valueQuantity");
    component_4_valueQuantity["value"] = dlog_arr[2].toInt();
    component_4_valueQuantity["unit"] = "C";
    component_4_valueQuantity["system"] = "http://unitsofmeasure.org";
    component_4_valueQuantity["code"] = "Cel";

  }

  else if (dlog_arr[1] == "AIR") {

    JsonObject component_0 = component.createNestedObject();

    JsonObject component_0_code = component_0.createNestedObject("code");

    JsonObject component_0_code_coding_0 = component_0_code["coding"].createNestedObject();
    component_0_code_coding_0["system"] = "http://loinc.org";
    component_0_code_coding_0["code"] = "M";
    component_0_code_coding_0["display"] = "MODE";
    component_0_code["text"] = "MODE";

    JsonObject component_0_valueQuantity = component_0.createNestedObject("valueQuantity");
    component_0_valueQuantity["value"] = 2;
    component_0_valueQuantity["unit"] = "B";
    component_0_valueQuantity["system"] = "http://unitsofmeasure.org";
    component_0_valueQuantity["code"] = "AIR";

    JsonObject component_1 = component.createNestedObject();

    JsonObject component_1_code = component_1.createNestedObject("code");

    JsonObject component_1_code_coding_0 = component_1_code["coding"].createNestedObject();
    component_1_code_coding_0["system"] = "http://loinc.org";
    component_1_code_coding_0["code"] = "75951-4";
    component_1_code_coding_0["display"] = "Set Air Temp";
    component_1_code["text"] = "Set Air Temp";

    JsonObject component_1_valueQuantity = component_1.createNestedObject("valueQuantity");
    component_1_valueQuantity["value"] = dlog_arr[2].toInt();
    component_1_valueQuantity["unit"] = "C";
    component_1_valueQuantity["system"] = "http://unitsofmeasure.org";
    component_1_valueQuantity["code"] = "Cel";

    JsonObject component_2 = component.createNestedObject();

    JsonObject component_2_code = component_2.createNestedObject("code");

    JsonObject component_2_code_coding_0 = component_2_code["coding"].createNestedObject();
    component_2_code_coding_0["system"] = "http://loinc.org";
    component_2_code_coding_0["code"] = "60839-8";
    component_2_code_coding_0["display"] = "Measure Air temp";
    component_2_code["text"] = "Measure Air temp";

    JsonObject component_2_valueQuantity = component_2.createNestedObject("valueQuantity");
    component_2_valueQuantity["value"] = dlog_arr[3].toFloat();
    component_2_valueQuantity["unit"] = "C";
    component_2_valueQuantity["system"] = "http://unitsofmeasure.org";
    component_2_valueQuantity["code"] = "Cel";

    JsonObject component_4 = component.createNestedObject();

    JsonObject component_4_code = component_4.createNestedObject("code");

    JsonObject component_4_code_coding_0 = component_4_code["coding"].createNestedObject();
    component_4_code_coding_0["system"] = "http://loinc.org";
    component_4_code_coding_0["code"] = "60839-8";
    component_4_code_coding_0["display"] = "Measured Skin Temp 1";
    component_4_code["text"] = "Measured Skin Temp 1";

    JsonObject component_4_valueQuantity = component_4.createNestedObject("valueQuantity");
    component_4_valueQuantity["value"] = dlog_arr[4].toFloat();
    component_4_valueQuantity["unit"] = "C";
    component_4_valueQuantity["system"] = "http://unitsofmeasure.org";
    component_4_valueQuantity["code"] = "Cel";
  }


  JsonObject component_3 = component.createNestedObject();

  JsonObject component_3_code = component_3.createNestedObject("code");

  JsonObject component_3_code_coding_0 = component_3_code["coding"].createNestedObject();
  component_3_code_coding_0["system"] = "http://loinc.org";
  component_3_code_coding_0["code"] = "75927-4";
  component_3_code_coding_0["display"] = "Heater Level";
  component_3_code["text"] = "Heater Level";

  JsonObject component_3_valueQuantity = component_3.createNestedObject("valueQuantity");
  component_3_valueQuantity["value"] = dlog_arr[10].toInt();
  component_3_valueQuantity["unit"] = "%";
  component_3_valueQuantity["system"] = "http://unitsofmeasure.org";
  component_3_valueQuantity["code"] = "%";

  JsonObject component_5 = component.createNestedObject();

  JsonObject component_5_code = component_5.createNestedObject("code");

  JsonObject component_5_code_coding_0 = component_5_code["coding"].createNestedObject();
  component_5_code_coding_0["system"] = "http://loinc.org";
  component_5_code_coding_0["code"] = "29463-7";
  component_5_code_coding_0["display"] = "Measured Skin Temp 2";
  component_5_code["text"] = "Measured Skin Temp 2";

  JsonObject component_5_valueQuantity = component_5.createNestedObject("valueQuantity");
  component_5_valueQuantity["value"] = dlog_arr[5].toInt();
  component_5_valueQuantity["unit"] = "C";
  component_5_valueQuantity["system"] = "http://unitsofmeasure.org";
  component_5_valueQuantity["code"] = "Cel";

  JsonObject component_6 = component.createNestedObject();

  JsonObject component_6_code = component_6.createNestedObject("code");

  JsonObject component_6_code_coding_0 = component_6_code["coding"].createNestedObject();
  component_6_code_coding_0["system"] = "http://loinc.org";
  component_6_code_coding_0["code"] = "20564-1";
  component_6_code_coding_0["display"] = "Measure Weigh";
  component_6_code["text"] = "Measure Weigh";

  JsonObject component_6_valueQuantity = component_6.createNestedObject("valueQuantity");
  component_6_valueQuantity["value"] = dlog_arr[6].toInt();
  component_6_valueQuantity["unit"] = "g";
  component_6_valueQuantity["system"] = "http://unitsofmeasure.org";
  component_6_valueQuantity["code"] = "[g]";

  JsonObject component_7 = component.createNestedObject();

  JsonObject component_7_code = component_7.createNestedObject("code");

  JsonObject component_7_code_coding_0 = component_7_code["coding"].createNestedObject();
  component_7_code_coding_0["system"] = "http://loinc.org";
  component_7_code_coding_0["code"] = "8867-4";
  component_7_code_coding_0["display"] = "Humidity set";
  component_7_code["text"] = "Humidity set";

  JsonObject component_7_valueQuantity = component_7.createNestedObject("valueQuantity");
  component_7_valueQuantity["value"] = dlog_arr[7].toInt();
  component_7_valueQuantity["unit"] = "%";
  component_7_valueQuantity["system"] = "http://unitsofmeasure.org";
  component_7_valueQuantity["code"] = "%";

  JsonObject component_8 = component.createNestedObject();

  JsonObject component_8_code = component_8.createNestedObject("code");

  JsonObject component_8_code_coding_0 = component_8_code["coding"].createNestedObject();
  component_8_code_coding_0["system"] = "http://loinc.org";
  component_8_code_coding_0["code"] = "73794-0";
  component_8_code_coding_0["display"] = "Measure Humidity";
  component_8_code["text"] = "Measure Humidity";

  JsonObject component_8_valueQuantity = component_8.createNestedObject("valueQuantity");
  component_8_valueQuantity["value"] = dlog_arr[8].toInt();
  component_8_valueQuantity["unit"] = "%";
  component_8_valueQuantity["system"] = "http://unitsofmeasure.org";
  component_8_valueQuantity["code"] = "%";

  JsonObject component_9 = component.createNestedObject();

  JsonObject component_9_code = component_9.createNestedObject("code");

  JsonObject component_9_code_coding_0 = component_9_code["coding"].createNestedObject();
  component_9_code_coding_0["system"] = "http://loinc.org";
  component_9_code_coding_0["code"] = "XXXXXXX";
  component_9_code_coding_0["display"] = "BLDC RPM";
  component_9_code["text"] = "BLDC RPM";

  JsonObject component_9_valueQuantity = component_9.createNestedObject("valueQuantity");
  component_9_valueQuantity["value"] = dlog_arr[9].toInt();
  component_9_valueQuantity["unit"] = "RPM";
  component_9_valueQuantity["system"] = "http://unitsofmeasure.org";
  component_9_valueQuantity["code"] = "RPM";

  JsonObject component_10 = component.createNestedObject();

  JsonObject component_10_code = component_10.createNestedObject("code");

  JsonObject component_10_code_coding_0 = component_10_code["coding"].createNestedObject();
  component_10_code_coding_0["system"] = "http://loinc.org";
  component_10_code_coding_0["code"] = "73793-2";
  component_10_code_coding_0["display"] = "Air Heater Temp";
  component_10_code["text"] = "Air Heater Temp";

  JsonObject component_10_valueQuantity = component_10.createNestedObject("valueQuantity");
  component_10_valueQuantity["value"] = dlog_arr[11].toInt();
  component_10_valueQuantity["unit"] = "C";
  component_10_valueQuantity["system"] = "http://unitsofmeasure.org";
  component_10_valueQuantity["code"] = "Cel";

  JsonObject component_11 = component.createNestedObject();

  JsonObject component_11_code = component_11.createNestedObject("code");

  JsonObject component_11_code_coding_0 = component_11_code["coding"].createNestedObject();
  component_11_code_coding_0["system"] = "http://loinc.org";
  component_11_code_coding_0["code"] = "73793-2";
  component_11_code_coding_0["display"] = "Humidity Heater Temp";
  component_11_code["text"] = "Humidity Heater Temp";

  JsonObject component_11_valueQuantity = component_11.createNestedObject("valueQuantity");
  component_11_valueQuantity["value"] = dlog_arr[12].toInt();
  component_11_valueQuantity["unit"] = "C";
  component_11_valueQuantity["system"] = "http://unitsofmeasure.org";
  component_11_valueQuantity["code"] = "Cel";

  JsonObject component_12 = component.createNestedObject();

  JsonObject component_12_code = component_12.createNestedObject("code");

  JsonObject component_12_code_coding_0 = component_12_code["coding"].createNestedObject();
  component_12_code_coding_0["system"] = "http://loinc.org";
  component_12_code_coding_0["code"] = "73793-2";
  component_12_code_coding_0["display"] = "Humidity Heater Power";
  component_12_code["text"] = "Humidity Heater Power";

  JsonObject component_12_valueQuantity = component_12.createNestedObject("valueQuantity");
  component_12_valueQuantity["value"] = dlog_arr[13].toInt();
  component_12_valueQuantity["unit"] = "%";
  component_12_valueQuantity["system"] = "http://unitsofmeasure.org";
  component_12_valueQuantity["code"] = "%";

  JsonObject component_13 = component.createNestedObject();

  JsonObject component_13_code = component_13.createNestedObject("code");

  JsonObject component_13_code_coding_0 = component_13_code["coding"].createNestedObject();
  component_13_code_coding_0["system"] = "http://loinc.org";
  component_13_code_coding_0["code"] = "73793-2";
  component_13_code_coding_0["display"] = "Heater Integrator";
  component_13_code["text"] = "Heater Integrator";

  JsonObject component_13_valueQuantity = component_13.createNestedObject("valueQuantity");
  component_13_valueQuantity["value"] = dlog_arr[14].toInt();
  component_13_valueQuantity["unit"] = "%";
  component_13_valueQuantity["system"] = "http://unitsofmeasure.org";
  component_13_valueQuantity["code"] = "%";

  JsonObject component_14 = component.createNestedObject();

  JsonObject component_14_code = component_14.createNestedObject("code");

  JsonObject component_14_code_coding_0 = component_14_code["coding"].createNestedObject();
  component_14_code_coding_0["system"] = "http://loinc.org";
  component_14_code_coding_0["code"] = "73793-2";
  component_14_code_coding_0["display"] = "Heater Proportional";
  component_14_code["text"] = "Heater Proportional";

  JsonObject component_14_valueQuantity = component_14.createNestedObject("valueQuantity");
  component_14_valueQuantity["value"] = dlog_arr[15].toInt();
  component_14_valueQuantity["unit"] = "%";
  component_14_valueQuantity["system"] = "http://unitsofmeasure.org";
  component_14_valueQuantity["code"] = "%";

  JsonObject component_15 = component.createNestedObject();

  JsonObject component_15_code = component_15.createNestedObject("code");

  JsonObject component_15_code_coding_0 = component_15_code["coding"].createNestedObject();
  component_15_code_coding_0["system"] = "http://loinc.org";
  component_15_code_coding_0["code"] = "73793-2";
  component_15_code_coding_0["display"] = "Heater Derivative";
  component_15_code["text"] = "Heater Derivative";

  JsonObject component_15_valueQuantity = component_15.createNestedObject("valueQuantity");
  component_15_valueQuantity["value"] = dlog_arr[16].toInt();
  component_15_valueQuantity["unit"] = "%";
  component_15_valueQuantity["system"] = "http://unitsofmeasure.org";
  component_15_valueQuantity["code"] = "%";

  JsonObject component_16 = component.createNestedObject();

  JsonObject component_16_code = component_16.createNestedObject("code");

  JsonObject component_16_code_coding_0 = component_16_code["coding"].createNestedObject();
  component_16_code_coding_0["system"] = "http://loinc.org";
  component_16_code_coding_0["code"] = "73793-2";
  component_16_code_coding_0["display"] = "Humidity Temp";
  component_16_code["text"] = "Humidity Temp";

  JsonObject component_16_valueQuantity = component_16.createNestedObject("valueQuantity");
  component_16_valueQuantity["value"] = dlog_arr[17].toInt();
  component_16_valueQuantity["unit"] = "C";
  component_16_valueQuantity["system"] = "http://unitsofmeasure.org";
  component_16_valueQuantity["code"] = "Cel";

  // JsonObject component_17 = component.createNestedObject();

  // JsonObject component_17_code = component_17.createNestedObject("code");

  // JsonObject component_17_code_coding_0 = component_17_code["coding"].createNestedObject();
  // component_17_code_coding_0["system"] = "http://loinc.org";
  // component_17_code_coding_0["code"] = "73793-2";
  // component_17_code_coding_0["display"] = "check";
  // component_17_code["text"] = "check";

  // JsonObject component_17_valueQuantity = component_17.createNestedObject("valueQuantity");
  // component_17_valueQuantity["value"] = dlog_arr[18].toInt();
  // component_17_valueQuantity["unit"] = "xxx";
  // component_17_valueQuantity["system"] = "http://unitsofmeasure.org";
  // component_17_valueQuantity["code"] = "xxx";

  if (dlog_arr[18] != "0" && dlog_arr[19] != "0" && dlog_arr[20] != "0" && dlog_arr[21] != "0" && dlog_arr[22] != "0") {
    
    JsonObject component_17 = component.createNestedObject();

    JsonObject component_17_code = component_17.createNestedObject("code");

    JsonObject component_17_code_coding_0 = component_17_code["coding"].createNestedObject();
    component_17_code_coding_0["system"] = "http://loinc.org";
    component_17_code_coding_0["code"] = "20564-1";
    component_17_code_coding_0["display"] = "SpO2";
    component_17_code["text"] = "SpO2";

    JsonObject component_17_valueQuantity = component_17.createNestedObject("valueQuantity");
    component_17_valueQuantity["value"] = dlog_arr[18].toInt();
    component_17_valueQuantity["unit"] = "%";
    component_17_valueQuantity["system"] = "http://unitsofmeasure.org";
    component_17_valueQuantity["code"] = "%";

    JsonObject component_18 = component.createNestedObject();

    JsonObject component_18_code = component_18.createNestedObject("code");

    JsonObject component_18_code_coding_0 = component_18_code["coding"].createNestedObject();
    component_18_code_coding_0["system"] = "http://loinc.org";
    component_18_code_coding_0["code"] = "8867-4";
    component_18_code_coding_0["display"] = "Pulse Rate";
    component_18_code["text"] = "Pulse Rate";

    JsonObject component_18_valueQuantity = component_18.createNestedObject("valueQuantity");
    component_18_valueQuantity["value"] = dlog_arr[19].toInt();
    component_18_valueQuantity["unit"] = "%";
    component_18_valueQuantity["system"] = "http://unitsofmeasure.org";
    component_18_valueQuantity["code"] = "%";

    JsonObject component_19 = component.createNestedObject();

    JsonObject component_19_code = component_19.createNestedObject("code");

    JsonObject component_19_code_coding_0 = component_19_code["coding"].createNestedObject();
    component_19_code_coding_0["system"] = "http://loinc.org";
    component_19_code_coding_0["code"] = "73794-0";
    component_19_code_coding_0["display"] = "PI";
    component_19_code["text"] = "PI";

    JsonObject component_19_valueQuantity = component_19.createNestedObject("valueQuantity");
    component_19_valueQuantity["value"] = dlog_arr[20].toInt();
    component_19_valueQuantity["unit"] = "%";
    component_19_valueQuantity["system"] = "http://unitsofmeasure.org";
    component_19_valueQuantity["code"] = "%";

    JsonObject component_20 = component.createNestedObject();

    JsonObject component_20_code = component_20.createNestedObject("code");

    JsonObject component_20_code_coding_0 = component_20_code["coding"].createNestedObject();
    component_20_code_coding_0["system"] = "http://loinc.org";
    component_20_code_coding_0["code"] = "XXXXXXX";
    component_20_code_coding_0["display"] = "PVI";
    component_20_code["text"] = "PVI";

    JsonObject component_20_valueQuantity = component_20.createNestedObject("valueQuantity");
    component_20_valueQuantity["value"] = dlog_arr[21].toInt();
    component_20_valueQuantity["unit"] = "m";
    component_20_valueQuantity["system"] = "http://unitsofmeasure.org";
    component_20_valueQuantity["code"] = "m";

    JsonObject component_21 = component.createNestedObject();

    JsonObject component_21_code = component_21.createNestedObject("code");

    JsonObject component_21_code_coding_0 = component_21_code["coding"].createNestedObject();
    component_21_code_coding_0["system"] = "http://loinc.org";
    component_21_code_coding_0["code"] = "73793-2";
    component_21_code_coding_0["display"] = "SIQ";
    component_21_code["text"] = "SIQ";

    JsonObject component_21_valueQuantity = component_21.createNestedObject("valueQuantity");
    component_21_valueQuantity["value"] = dlog_arr[22].toInt();
    component_21_valueQuantity["unit"] = "m";
    component_21_valueQuantity["system"] = "http://unitsofmeasure.org";
    component_21_valueQuantity["code"] = "m";
  }

  serializeJson(inc_log, return_data);
}


void inc_alarm(String &return_data, String &in_data, String &d_id, String &p_id, String &c_id, String &o_id) {
  const int total_alarms = 60;
  const int additional_element_size = 50;

  const char *Alarm_Data[total_alarms][2] = {
    { "Skin1 Temperature High", "Medium Priority" },  // 0
    { "Skin1 Temperature Low", "Medium Priority" },   // 1
    { "Skin2 Temperature High", "Medium Priority" },  // 2
    { "Skin2 Temperature Low", "Medium Priority" },   // 3
    { "Air Temperature High", "Medium Priority" },    // 4
    { "Air Temperature Low", "Medium Priority" },     // 5
    { "Oxygen High", "Medium Priority" },             // 6
    { "Oxygen Low", "Medium Priority" },              // 7
    { "Humidity High", "Medium Priority" },           // 8
    { "Humidity Low", "Medium Priority" },            // 9
    { "Air Heater Fail", "High Priority" },           // 10
    { "Water Heater Fail", "High Priority" },         // 11
    { "Blower Fail", "High Priority" },               // 12
    { "Power Fail", "High Priority" },                // 13
    { "Battery Low", "High Priority" },               // 14
    { "Sensor Board Failed", "High Priority" },       // 15
    { "Left Door Open", "Medium Priority" },          // 16
    { "Right Door Open", "Medium Priority" },         // 17
    { "Oxygen Valve Fail", "High Priority" },         // 18
    { "Water Probe Fail", "High Priority" },          // 19
    { "Tilt Actuator Fail", "Low Priority" },         // 20
    { "Air Filter Fail", "High Priority" },           // 21
    { "Fill The Water Tank", "Medium Priority" },     // 22
    { "Check Display Cable", "Medium Priority" },     // 23
    { "Air Over Temperature", "High Priority" },      // 24
    { "Air Probe1 Fail", "High Priority" },           // 25
    { "Air Probe2 Fail", "High Priority" },           // 26
    { "Skin Probe1 Fail", "Medium Priority" },        // 27
    { "Skin Probe2 Fail", "Medium Priority" },        // 28
    { "Humidity Sensor Fail", "Medium Priority" },    // 29
    { "Oxygen Sensor1 Fail", "Medium Priority" },     // 30
    { "Oxygen Sensor2 Fail", "Medium Priority" },     // 31
    { "Sensor Box Displaced", "Medium Priority" },    // 32
    { "Sensor Box Displaced", "Medium Priority" },    // 33
    { "BWS OverLoad", "Low Priority" },               // 34
    { "BWS Connection Fail", "Low Priority" },        // 35
    { "BWS Sensor Fail", "Low Priority" },            // 36
    { "BWS Sensor Fail", "Low Priority" },            // 37
    { "BWS Sensor Fail", "Low Priority" },            // 38
    { "BWS Sensor Fail", "Low Priority" },            // 39
    { "Baby Over Temperature", "High Priority" },     // 40
    { "Sensor Comm Failed", "High Priority" },        // 41
    { "Air Probe Fail", "High Priority" },            // 42
    { "Blower speed Low", "Medium Priority" },        // 43
    { "Blower Control Fail", "High Priority" },       // 44
    { "Sensor Memory Fail", "Low Priority" },         // 45
    { "Control Memory Fail", "Low Priority" },        // 46
    { "Sensor Fan Fail", "High Priority" },           // 47
    { "Check Probe-Baby cold", "Medium Priority" },   // 48
    { "Water Heater Dry", "High Priority" },          // 49 rtd alm  //Water heater hot to changed into water heater dry 28062023
    { "Control Board Removed", "High Priority" },     // 50 //This message will be displayed from a separate group of flags
  };

  int index = 0;
  String Index;
  String priority;
  String display;
  String name;
  String dlog_arr[20];
  int count = split_str(in_data, dlog_arr, ":");

  DynamicJsonDocument alarm(4000);
  alarm["status"] = "completed";
  alarm["resourceType"] = "Communication";
  alarm["id"] = c_id;
  // alarm["sent"] = "";

  JsonObject category_0 = alarm["category"].createNestedObject();

  JsonObject category_0_coding_0 = category_0["coding"].createNestedObject();
  category_0_coding_0["system"] = "http://acme.org/messagetypes";
  category_0_coding_0["code"] = "Alert";
  category_0["text"] = "Alert";
  alarm["subject"]["reference"] = "Patient/" + p_id;
  alarm["sender"]["reference"] = "Device/" + d_id;
  alarm["payload"][0]["contentReference"]["display"] = "Alarm details";

  JsonArray extension = alarm.createNestedArray("extension");

  JsonObject extension_0 = extension.createNestedObject();
  extension_0["url"] = "http://example.com/fhir/extensions#alarmType";
  JsonArray extension_0_valueCodeableConcept_coding = extension_0["valueCodeableConcept"].createNestedArray("coding");

  JsonObject extension_1 = extension.createNestedObject();
  extension_1["url"] = "http://example.com/fhir/extensions#alarmPriority";
  JsonArray extension_1_valueCodeableConcept_coding = extension_1["valueCodeableConcept"].createNestedArray("coding");


  for (int i = 0; i < count; i++) {
    String temp = dlog_arr[i].substring(1);
    index = temp.toInt();
    Index = String(index);
    name = Alarm_Data[index][0];

    JsonObject extension_0_coding_obj = extension_0_valueCodeableConcept_coding.createNestedObject();
    JsonArray extension_0_coding_arr = alarm["extension_0_coding"];

    extension_0_coding_obj["system"] = "http://example.com/fhir/alarm-codes";
    extension_0_coding_obj["code"] = Index;
    extension_0_coding_obj["display"] = name;

    extension_0_coding_arr.add(extension_0_coding_obj);

    JsonObject extension_1_coding_obj = extension_1_valueCodeableConcept_coding.createNestedObject();
    JsonArray extension_1_coding_arr = alarm["extension_1_coding"];

    extension_1_coding_obj["system"] = "http://example.com/fhir/alarm-prioritiess";
    extension_1_coding_obj["code"] = Alarm_Data[index][1];
    ;
    extension_1_coding_obj["display"] = Alarm_Data[index][1];
    ;

    extension_1_coding_arr.add(extension_1_coding_obj);
  }
  serializeJson(alarm, return_data);
}