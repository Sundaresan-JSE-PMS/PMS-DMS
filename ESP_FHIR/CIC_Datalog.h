void cic_alarm(String &return_data, String &in_data, String &d_id, String &p_id, String &c_id, String &o_id) {
  String Alarm_Name[60] = {
    "Skin Temperature High",
    "Skin Temperature Low",
    "Peri. Temperature High",
    "Peri. Temperature Low",
    "Air Temperature High",
    "Air Temperature Low",
    "Oxygen High",
    "Oxygen Low",
    "Humidity High",
    "Humidity Low",
    "Heater Fail",
    "Water Heater Fail",
    "Fan Fail",
    "Power Fail",
    "Battery Low",
    "Sensor Board Failed",
    "Left Door Open",
    "Right Door Open",
    "Oxygen Valve Fail",
    "Water Probe Fail",
    "Tilt Actuator Fail",
    "Air Filter Fail",
    "Water Reservoir Empty",
    "Check Display Cable",
    "Air Over Temperature",
    "Air Probe Fail",
    "Air Probe Fail",
    "Skin  Probe Fail",
    "Peri. Probe Fail",
    "Humi Sensor Fail",
    "Oxy Sensor1 Fail",
    "Oxy Sensor2 Fail",
    "Sensor Box Displaced",
    "Sensor Box Displaced",
    "BWS OverLoaded",
    "BWS Connection Fail",
    "BWS Sensor Fail",
    "BWS Sensor Fail",
    "BWS Sensor Fail",
    "BWS Sensor Fail",
    "Baby Over Temperature",
    "Sensor Board Failed",
    "Air Probe Fail",
    "Blower speed Low",
    "Blower speed High",
    "Sensor Memory Fail",
    "Control Memory Fail",
    "Sensor Fan Fail",
    "Heater Fail",
    "Water Heater Fail",
    "Temp Probe 4 Fail",
    "Temp Probe 5 Fail",
    "Temp Probe 6 Fail",
    "Skin Temp. Difference",
    "Heater Box Misplaced",
    "Probe Dislocated",
    "Control Board Removed",
    "Manual Mode Alert",
    "Power Down Alert",
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
    if (dlog_arr[i].substring(0, 1) == "H") {
      priority = "high";
      display = "High Priority";
      String temp = dlog_arr[i].substring(1);
      index = temp.toInt();
      Index = String(index);
      name = (Alarm_Name[index]);
    } else if (dlog_arr[i].substring(0, 1) == "L") {
      priority = "low";
      display = "Low Priority";
      String temp = dlog_arr[i].substring(1);
      index = temp.toInt();
      Index = String(index);
      name = (Alarm_Name[index]);
    }
    JsonObject extension_0_coding_obj = extension_0_valueCodeableConcept_coding.createNestedObject();
    JsonArray extension_0_coding_arr = alarm["extension_0_coding"];

    extension_0_coding_obj["system"] = "http://example.com/fhir/alarm-codes";
    extension_0_coding_obj["code"] = Index;
    extension_0_coding_obj["display"] = name;

    extension_0_coding_arr.add(extension_0_coding_obj);

    JsonObject extension_1_coding_obj = extension_1_valueCodeableConcept_coding.createNestedObject();
    JsonArray extension_1_coding_arr = alarm["extension_1_coding"];

    extension_1_coding_obj["system"] = "http://example.com/fhir/alarm-prioritiess";
    extension_1_coding_obj["code"] = priority;
    extension_1_coding_obj["display"] = display;

    extension_1_coding_arr.add(extension_1_coding_obj);
  }
  serializeJson(alarm, return_data);
}

void cic_data(String &return_data, String &in_data, String &d_id, String &p_id, String &c_id, String &o_id) {
  String dlog_arr[50];
  split_str(in_data, dlog_arr, ",");

  DynamicJsonDocument cic_log(4096);

  cic_log["id"] = o_id;
  cic_log["resourceType"] = "Observation";
  cic_log["status"] = "final";
  cic_log["identifier"][0]["value"] = "PMSCIC";
  cic_log["subject"]["reference"] = "Patient/" + p_id;
  cic_log["device"]["reference"] = "Device/" + d_id;
  JsonObject code = cic_log.createNestedObject("code");

  JsonObject code_coding_0 = code["coding"].createNestedObject();
  code_coding_0["system"] = "http://loinc.org";
  code_coding_0["code"] = "85353-1";
  code_coding_0["display"] = "Vital signs, weight, height, head circumference, oximetry, BMI, and BSA panel";
  code["text"] = "Vital signs panel";

  JsonObject category_0_coding_0 = cic_log["category"][0]["coding"].createNestedObject();
  category_0_coding_0["system"] = "http://terminology.hl7.org/CodeSystem/observation-category";
  category_0_coding_0["code"] = "data-log";
  category_0_coding_0["display"] = "Data Log";

  JsonArray component = cic_log.createNestedArray("component");

    if (dlog_arr[0] == "BABY")
   {
  
    JsonObject component_0 = component.createNestedObject();

    JsonObject component_0_code = component_0.createNestedObject("code");

    JsonObject component_0_code_coding_0 = component_0_code["coding"].createNestedObject();
    component_0_code_coding_0["system"] = "http://loinc.org";
    component_0_code_coding_0["code"] = "MMMMMM";
    component_0_code_coding_0["display"] = "MODE";
    component_0_code["text"] = "MODE";

    JsonObject component_0_valueQuantity = component_0.createNestedObject("valueQuantity");
    component_0_valueQuantity["value"] = 1;
    component_0_valueQuantity["unit"] = "AAAAAAA";
    component_0_valueQuantity["system"] = "http://unitsofmeasure.org";
    component_0_valueQuantity["code"] = "AAAAAAAA";

    JsonObject component_1 = component.createNestedObject();

    JsonObject component_1_code = component_1.createNestedObject("code");

    JsonObject component_1_code_coding_0 = component_1_code["coding"].createNestedObject();
    component_1_code_coding_0["system"] = "http://loinc.org";
    component_1_code_coding_0["code"] = "75951-4";
    component_1_code_coding_0["display"] = "Set Skin Temp ";
    component_1_code["text"] = "Set Skin Temp";

    JsonObject component_1_valueQuantity = component_1.createNestedObject("valueQuantity");
    component_1_valueQuantity["value"] = dlog_arr[1].toInt();
    component_1_valueQuantity["unit"] = "%";
    component_1_valueQuantity["system"] = "http://unitsofmeasure.org";
    component_1_valueQuantity["code"] = "%";

  }

  else if (dlog_arr[0] == "PREWARM")
   {
  
    JsonObject component_0 = component.createNestedObject();

    JsonObject component_0_code = component_0.createNestedObject("code");

    JsonObject component_0_code_coding_0 = component_0_code["coding"].createNestedObject();
    component_0_code_coding_0["system"] = "http://loinc.org";
    component_0_code_coding_0["code"] = "MMMMMM";
    component_0_code_coding_0["display"] = "MODE";
    component_0_code["text"] = "MODE";

    JsonObject component_0_valueQuantity = component_0.createNestedObject("valueQuantity");
    component_0_valueQuantity["value"] = 2;
    component_0_valueQuantity["unit"] = "BBBBBB";
    component_0_valueQuantity["system"] = "http://unitsofmeasure.org";
    component_0_valueQuantity["code"] = "BBBBBBB";

    JsonObject component_1 = component.createNestedObject();

    JsonObject component_1_code = component_1.createNestedObject("code");

    JsonObject component_1_code_coding_0 = component_1_code["coding"].createNestedObject();
    component_1_code_coding_0["system"] = "http://loinc.org";
    component_1_code_coding_0["code"] = "75951-4";
    component_1_code_coding_0["display"] = "Set Heater";
    component_1_code["text"] = "Set Heater";

    JsonObject component_1_valueQuantity = component_1.createNestedObject("valueQuantity");
    component_1_valueQuantity["value"] = dlog_arr[1].toInt();
    component_1_valueQuantity["unit"] = "%";
    component_1_valueQuantity["system"] = "http://unitsofmeasure.org";
    component_1_valueQuantity["code"] = "%";
  } 
  else if (dlog_arr[0] == "MANUAL")
   {
   JsonObject component_0 = component.createNestedObject();

    JsonObject component_0_code = component_0.createNestedObject("code");

    JsonObject component_0_code_coding_0 = component_0_code["coding"].createNestedObject();
    component_0_code_coding_0["system"] = "http://loinc.org";
    component_0_code_coding_0["code"] = "MMMMMM";
    component_0_code_coding_0["display"] = "MODE";
    component_0_code["text"] = "MODE";

    JsonObject component_0_valueQuantity = component_0.createNestedObject("valueQuantity");
    component_0_valueQuantity["value"] = 3;
    component_0_valueQuantity["unit"] = "CCCCCCC";
    component_0_valueQuantity["system"] = "http://unitsofmeasure.org";
    component_0_valueQuantity["code"] = "CCCCCCCCC";

    JsonObject component_1 = component.createNestedObject();

    JsonObject component_1_code = component_1.createNestedObject("code");

    JsonObject component_1_code_coding_0 = component_1_code["coding"].createNestedObject();
    component_1_code_coding_0["system"] = "http://loinc.org";
    component_1_code_coding_0["code"] = "75951-4";
    component_1_code_coding_0["display"] = "Set Heater";
    component_1_code["text"] = "Set Heater";

    JsonObject component_1_valueQuantity = component_1.createNestedObject("valueQuantity");
    component_1_valueQuantity["value"] = dlog_arr[1].toInt();
    component_1_valueQuantity["unit"] = "%";
    component_1_valueQuantity["system"] = "http://unitsofmeasure.org";
    component_1_valueQuantity["code"] = "%";
   
   
  }

  JsonObject component_2 = component.createNestedObject();

  JsonObject component_2_code = component_2.createNestedObject("code");

  JsonObject component_2_code_coding_0 = component_2_code["coding"].createNestedObject();
  component_2_code_coding_0["system"] = "http://loinc.org";
  component_2_code_coding_0["code"] = "60839-8";
  component_2_code_coding_0["display"] = "Measured Skin Temp 1";
  component_2_code["text"] = "Measured Skin Temp 1";

  JsonObject component_2_valueQuantity = component_2.createNestedObject("valueQuantity");
  component_2_valueQuantity["value"] = dlog_arr[2].toFloat();
  component_2_valueQuantity["unit"] = "C";
  component_2_valueQuantity["system"] = "http://unitsofmeasure.org";
  component_2_valueQuantity["code"] = "Cel";

  JsonObject component_3 = component.createNestedObject();

  JsonObject component_3_code = component_3.createNestedObject("code");

  JsonObject component_3_code_coding_0 = component_3_code["coding"].createNestedObject();
  component_3_code_coding_0["system"] = "http://loinc.org";
  component_3_code_coding_0["code"] = "75927-4";
  component_3_code_coding_0["display"] = "Heater Level";
  component_3_code["text"] = "Heater Level";

  JsonObject component_3_valueQuantity = component_3.createNestedObject("valueQuantity");
  component_3_valueQuantity["value"] = dlog_arr[5].toInt();
  component_3_valueQuantity["unit"] = "%";
  component_3_valueQuantity["system"] = "http://unitsofmeasure.org";
  component_3_valueQuantity["code"] = "%";

  JsonObject component_4 = component.createNestedObject();

  JsonObject component_4_code = component_4.createNestedObject("code");

  JsonObject component_4_code_coding_0 = component_4_code["coding"].createNestedObject();
  component_4_code_coding_0["system"] = "http://loinc.org";
  component_4_code_coding_0["code"] = "60839-8";
  component_4_code_coding_0["display"] = "Measured Skin Temp 2";
  component_4_code["text"] = "Measured Skin Temp 2";

  JsonObject component_4_valueQuantity = component_4.createNestedObject("valueQuantity");
  component_4_valueQuantity["value"] = dlog_arr[3].toFloat();
  component_4_valueQuantity["unit"] = "C";
  component_4_valueQuantity["system"] = "http://unitsofmeasure.org";
  component_4_valueQuantity["code"] = "Cel";

  JsonObject component_5 = component.createNestedObject();

  JsonObject component_5_code = component_5.createNestedObject("code");

  JsonObject component_5_code_coding_0 = component_5_code["coding"].createNestedObject();
  component_5_code_coding_0["system"] = "http://loinc.org";
  component_5_code_coding_0["code"] = "29463-7";
  component_5_code_coding_0["display"] = "Measure Weigh";
  component_5_code["text"] = "Measure Weigh";

  JsonObject component_5_valueQuantity = component_5.createNestedObject("valueQuantity");
  component_5_valueQuantity["value"] = dlog_arr[4].toInt();
  component_5_valueQuantity["unit"] = "g";
  component_5_valueQuantity["system"] = "http://unitsofmeasure.org";
  component_5_valueQuantity["code"] = "[g]";

 if (dlog_arr[6] != 0 && dlog_arr[7] != 0  && dlog_arr[8] != 0 && dlog_arr[9] != 0 && dlog_arr[10] != 0)
 {
  JsonObject component_6 = component.createNestedObject();

  JsonObject component_6_code = component_6.createNestedObject("code");

  JsonObject component_6_code_coding_0 = component_6_code["coding"].createNestedObject();
  component_6_code_coding_0["system"] = "http://loinc.org";
  component_6_code_coding_0["code"] = "20564-1";
  component_6_code_coding_0["display"] = "SpO2";
  component_6_code["text"] = "SpO2";

  JsonObject component_6_valueQuantity = component_6.createNestedObject("valueQuantity");
  component_6_valueQuantity["value"] = dlog_arr[6].toInt();
  component_6_valueQuantity["unit"] = "%";
  component_6_valueQuantity["system"] = "http://unitsofmeasure.org";
  component_6_valueQuantity["code"] = "%";

  JsonObject component_7 = component.createNestedObject();

  JsonObject component_7_code = component_7.createNestedObject("code");

  JsonObject component_7_code_coding_0 = component_7_code["coding"].createNestedObject();
  component_7_code_coding_0["system"] = "http://loinc.org";
  component_7_code_coding_0["code"] = "8867-4";
  component_7_code_coding_0["display"] = "Pulse Rate";
  component_7_code["text"] = "Pulse Rate";

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
  component_8_code_coding_0["display"] = "PI";
  component_8_code["text"] = "PI";

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
  component_9_code_coding_0["display"] = "PVI";
  component_9_code["text"] = "PVI";

  JsonObject component_9_valueQuantity = component_9.createNestedObject("valueQuantity");
  component_9_valueQuantity["value"] = dlog_arr[9].toInt();
  component_9_valueQuantity["unit"] = "m";
  component_9_valueQuantity["system"] = "http://unitsofmeasure.org";
  component_9_valueQuantity["code"] = "m";

  JsonObject component_10 = component.createNestedObject();

  JsonObject component_10_code = component_10.createNestedObject("code");

  JsonObject component_10_code_coding_0 = component_10_code["coding"].createNestedObject();
  component_10_code_coding_0["system"] = "http://loinc.org";
  component_10_code_coding_0["code"] = "73793-2";
  component_10_code_coding_0["display"] = "SIQ";
  component_10_code["text"] = "SIQ";

  JsonObject component_10_valueQuantity = component_10.createNestedObject("valueQuantity");
  component_10_valueQuantity["value"] = dlog_arr[10].toInt();
  component_10_valueQuantity["unit"] = "m";
  component_10_valueQuantity["system"] = "http://unitsofmeasure.org";
  component_10_valueQuantity["code"] = "m";
 }

  serializeJson(cic_log, return_data);
}
    