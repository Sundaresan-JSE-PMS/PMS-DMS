

void cic_data (String &return_data, String &in_data, String &d_id, String &p_id, String &c_id, String &o_id) {
  String dlog_arr[20];
  split_str(in_data, dlog_arr, ",");
  
  DynamicJsonDocument cic_log(4096);
  cic_log["id"] = o_id;
  cic_log["resourceType"] = "Observation";
  cic_log["status"] = "final";
  cic_log["identifier"][0]["value"] = "PMSCIC";
  cic_log["subject"]["reference"] = "Patient/" + p_id;

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

  JsonObject component_0 = component.createNestedObject();

  JsonObject component_0_code = component_0.createNestedObject("code");

  JsonObject component_0_code_coding_0 = component_0_code["coding"].createNestedObject();
  component_0_code_coding_0["system"] = "http://loinic.org";
  component_0_code_coding_0["code"] = "75951-4";
  component_0_code_coding_0["display"] = "Set Skin Temp";
  component_0_code["text"] = "Set Skin Temp";

  JsonObject component_0_valueQuantity = component_0.createNestedObject("valueQuantity");
  component_0_valueQuantity["value"] = dlog_arr[2].toFloat();
  component_0_valueQuantity["unit"] = "C";
  component_0_valueQuantity["system"] = "http://unitsofmeasure.org";
  component_0_valueQuantity["code"] = "Cel";

  JsonObject component_1 = component.createNestedObject();

  JsonObject component_1_code = component_1.createNestedObject("code");

  JsonObject component_1_code_coding_0 = component_1_code["coding"].createNestedObject();
  component_1_code_coding_0["system"] = "http://loinic.org";
  component_1_code_coding_0["code"] = "60839-8";
  component_1_code_coding_0["display"] = "Measured Skin Temp 1";
  component_1_code["text"] = "Measured Skin Temp 1";

  JsonObject component_1_valueQuantity = component_1.createNestedObject("valueQuantity");
  component_1_valueQuantity["value"] = dlog_arr[3].toFloat();
  component_1_valueQuantity["unit"] = "C";
  component_1_valueQuantity["system"] = "http://unitsofmeasure.org";
  component_1_valueQuantity["code"] = "Cel";

  JsonObject component_2 = component.createNestedObject();

  JsonObject component_2_code = component_2.createNestedObject("code");

  JsonObject component_2_code_coding_0 = component_2_code["coding"].createNestedObject();
  component_2_code_coding_0["system"] = "http://loinic.org";
  component_2_code_coding_0["code"] = "60839-8";
  component_2_code_coding_0["display"] = "Measured Skin Temp 2";
  component_2_code["text"] = "Measured Skin Temp 2";

  JsonObject component_2_valueQuantity = component_2.createNestedObject("valueQuantity");
  component_2_valueQuantity["value"] = dlog_arr[4].toFloat();
  component_2_valueQuantity["unit"] = "C";
  component_2_valueQuantity["system"] = "http://unitsofmeasure.org";
  component_2_valueQuantity["code"] = "Cel";

  JsonObject component_3 = component.createNestedObject();

  JsonObject component_3_code = component_3.createNestedObject("code");

  JsonObject component_3_code_coding_0 = component_3_code["coding"].createNestedObject();
  component_3_code_coding_0["system"] = "http://loinic.org";
  component_3_code_coding_0["code"] = "29463-7";
  component_3_code_coding_0["display"] = "Body Weight";
  component_3_code["text"] = "Body Weight";

  JsonObject component_3_valueQuantity = component_3.createNestedObject("valueQuantity");
  component_3_valueQuantity["value"] = dlog_arr[5].toInt();
  component_3_valueQuantity["unit"] = "g";
  component_3_valueQuantity["system"] = "http://unitsofmeasure.org";
  component_3_valueQuantity["code"] = "[g]";

  JsonObject component_4 = component.createNestedObject();

  JsonObject component_4_code = component_4.createNestedObject("code");

  JsonObject component_4_code_coding_0 = component_4_code["coding"].createNestedObject();
  component_4_code_coding_0["system"] = "http://loinic.org";
  component_4_code_coding_0["code"] = "75927-4";
  component_4_code_coding_0["display"] = "Heater Power";
  component_4_code["text"] = "Heater Power";

  JsonObject component_4_valueQuantity = component_4.createNestedObject("valueQuantity");
  component_4_valueQuantity["value"] = dlog_arr[6].toInt();
  component_4_valueQuantity["unit"] = "%";
  component_4_valueQuantity["system"] = "http://unitsofmeasure.org";
  component_4_valueQuantity["code"] = "%";

  JsonObject component_5 = component.createNestedObject();

  JsonObject component_5_code = component_5.createNestedObject("code");

  JsonObject component_5_code_coding_0 = component_5_code["coding"].createNestedObject();
  component_5_code_coding_0["system"] = "http://loinic.org";
  component_5_code_coding_0["code"] = "20564-1";
  component_5_code_coding_0["display"] = "SpO2";
  component_5_code["text"] = "SpO2";

  JsonObject component_5_valueQuantity = component_5.createNestedObject("valueQuantity");
  component_5_valueQuantity["value"] = dlog_arr[7].toInt();
  component_5_valueQuantity["unit"] = "%";
  component_5_valueQuantity["system"] = "http://unitsofmeasure.org";
  component_5_valueQuantity["code"] = "%";

  JsonObject component_6 = component.createNestedObject();

  JsonObject component_6_code = component_6.createNestedObject("code");

  JsonObject component_6_code_coding_0 = component_6_code["coding"].createNestedObject();
  component_6_code_coding_0["system"] = "http://loinic.org";
  component_6_code_coding_0["code"] = "8867-4";
  component_6_code_coding_0["display"] = "Pulse Rate";
  component_6_code["text"] = "Pulse Rate";

  JsonObject component_6_valueQuantity = component_6.createNestedObject("valueQuantity");
  component_6_valueQuantity["value"] = dlog_arr[8].toInt();
  component_6_valueQuantity["unit"] = "%";
  component_6_valueQuantity["system"] = "http://unitsofmeasure.org";
  component_6_valueQuantity["code"] = "%";

  JsonObject component_7 = component.createNestedObject();

  JsonObject component_7_code = component_7.createNestedObject("code");

  JsonObject component_7_code_coding_0 = component_7_code["coding"].createNestedObject();
  component_7_code_coding_0["system"] = "http://loinic.org";
  component_7_code_coding_0["code"] = "73794-0";
  component_7_code_coding_0["display"] = "PI";
  component_7_code["text"] = "PI";

  JsonObject component_7_valueQuantity = component_7.createNestedObject("valueQuantity");
  component_7_valueQuantity["value"] = dlog_arr[9].toInt();
  component_7_valueQuantity["unit"] = "%";
  component_7_valueQuantity["system"] = "http://unitsofmeasure.org";
  component_7_valueQuantity["code"] = "%";

  JsonObject component_8 = component.createNestedObject();

  JsonObject component_8_code = component_8.createNestedObject("code");

  JsonObject component_8_code_coding_0 = component_8_code["coding"].createNestedObject();
  component_8_code_coding_0["system"] = "http://loinic.org";
  component_8_code_coding_0["code"] = "73793-2";
  component_8_code_coding_0["display"] = "SIQ";
  component_8_code["text"] = "SIQ";

  JsonObject component_8_valueQuantity = component_8.createNestedObject("valueQuantity");
  component_8_valueQuantity["value"] = dlog_arr[10].toInt();
  component_8_valueQuantity["unit"] = "%";
  component_8_valueQuantity["system"] = "http://unitsofmeasure.org";
  component_8_valueQuantity["code"] = "%";
  
  serializeJson(cic_log, return_data);


}
