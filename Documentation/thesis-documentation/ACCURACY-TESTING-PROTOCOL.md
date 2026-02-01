# NILM System - Accuracy Testing Protocol

**Purpose**: Measure system accuracy in appliance identification and power measurement  
**Target**: NILM hardware and software system  
**Duration**: 2-4 weeks of controlled testing

---

## Testing Objectives

1. Measure appliance identification accuracy
2. Measure power measurement accuracy
3. Measure energy calculation accuracy
4. Identify system limitations
5. Compare with actual measurements

---

## Test Setup

### Equipment Required

1. **NILM Device** (ESP32 with sensors)
2. **Calibrated Power Meter** (for comparison)
3. **Test Appliances**:
   - Refrigerator
   - Air Conditioner
   - Television
   - Electric Fan
   - Light Bulb (LED and Incandescent)
   - Water Heater
   - Washing Machine
   - Microwave
   - Other common appliances

4. **Test Environment**:
   - Controlled residential setting
   - Stable electrical supply (220V, 60Hz)
   - Stable internet connection
   - Standard Philippine electrical setup

---

## Test Procedure

### Phase 1: Sensor Calibration

**Objective**: Ensure sensors are properly calibrated

**Steps**:
1. Connect calibrated power meter to test circuit
2. Connect NILM device to same circuit
3. Apply known loads (100W, 500W, 1000W, 2000W)
4. Record NILM readings vs. calibrated meter readings
5. Calculate calibration factors if needed
6. Adjust sensor calibration if error > 2%

**Expected Results**:
- Voltage measurement: ±1% accuracy
- Current measurement: ±2% accuracy
- Power calculation: ±2% accuracy

---

### Phase 2: Power Measurement Accuracy

**Objective**: Verify power measurement accuracy

**Test Scenarios**:

#### Test 2.1: Single Appliance - Known Load
1. Connect single appliance to circuit
2. Measure actual power using calibrated meter
3. Record NILM power reading
4. Compare readings
5. Calculate error percentage
6. Repeat for 10 different power levels

**Data to Record**:
- Appliance type
- Actual power (W) from calibrated meter
- NILM measured power (W)
- Error (W)
- Error percentage (%)

**Acceptance Criteria**: Average error < 2%

---

#### Test 2.2: Multiple Appliances - Aggregate Load
1. Connect multiple appliances simultaneously
2. Measure total actual power
3. Record NILM total power reading
4. Compare aggregate readings
5. Repeat with different appliance combinations

**Data to Record**:
- Appliances connected
- Total actual power (W)
- NILM total power (W)
- Error (W)
- Error percentage (%)

**Acceptance Criteria**: Average error < 3%

---

### Phase 3: Appliance Identification Accuracy

**Objective**: Measure accuracy of appliance ON/OFF detection

**Test Scenarios**:

#### Test 3.1: Single Appliance State Changes
1. Select test appliance
2. Turn appliance ON
3. Record NILM identification (ON/OFF)
4. Turn appliance OFF
5. Record NILM identification (ON/OFF)
6. Repeat 20 times for each appliance
7. Calculate accuracy

**Data to Record**:
- Appliance type
- Actual state (ON/OFF)
- NILM detected state (ON/OFF)
- Correct/Incorrect
- Timestamp

**Accuracy Calculation**:
- Accuracy = (Correct Identifications / Total Tests) × 100%

**Acceptance Criteria**: Accuracy > 90%

---

#### Test 3.2: Multiple Appliances - Simultaneous Operation
1. Connect multiple appliances
2. Turn appliances ON/OFF in various combinations
3. Record NILM identification for each appliance
4. Compare with actual states
5. Repeat 50 different combinations

**Data to Record**:
- Appliance combination
- Actual states (ON/OFF for each)
- NILM detected states
- Correct/Incorrect for each appliance
- Overall accuracy

**Acceptance Criteria**: Overall accuracy > 85%

---

#### Test 3.3: Appliance Type Classification
1. Test each appliance type
2. Record NILM classification
3. Compare with actual appliance type
4. Calculate classification accuracy

**Data to Record**:
- Actual appliance type
- NILM classified type
- Correct/Incorrect
- Confidence level (if available)

**Acceptance Criteria**: Classification accuracy > 80%

---

### Phase 4: Energy Calculation Accuracy

**Objective**: Verify energy (kWh) calculation accuracy

**Test Procedure**:
1. Connect known load (e.g., 1000W appliance)
2. Run for known duration (e.g., 1 hour)
3. Calculate expected energy: 1000W × 1 hour = 1 kWh
4. Record NILM calculated energy
5. Compare with expected energy
6. Repeat for different loads and durations

**Data to Record**:
- Load power (W)
- Duration (hours)
- Expected energy (kWh)
- NILM calculated energy (kWh)
- Error (kWh)
- Error percentage (%)

**Acceptance Criteria**: Average error < 5%

---

### Phase 5: Real-World Scenario Testing

**Objective**: Test system in realistic usage scenarios

**Test Scenarios**:

#### Scenario 1: Typical Day
- Simulate typical household usage
- Morning: Lights, fan, refrigerator
- Afternoon: AC, TV, refrigerator
- Evening: Lights, TV, AC, water heater
- Night: Lights, fan, refrigerator
- Record all appliance states and consumption
- Compare with NILM detection

#### Scenario 2: Peak Consumption
- Turn on all high-consumption appliances
- AC, water heater, washing machine simultaneously
- Record aggregate consumption
- Verify NILM can handle peak loads

#### Scenario 3: Low Consumption
- Only essential appliances (refrigerator, minimal lighting)
- Record low consumption periods
- Verify NILM accuracy at low power levels

#### Scenario 4: Variable Loads
- Test appliances with variable consumption (inverter AC, washing machine cycles)
- Record consumption variations
- Verify NILM can track variable loads

---

## Data Collection Forms

### Form 1: Power Measurement Test

| Test # | Appliance | Actual Power (W) | NILM Power (W) | Error (W) | Error (%) | Notes |
|--------|-----------|------------------|----------------|-----------|-----------|-------|
| 1      |           |                  |                |           |           |       |
| 2      |           |                  |                |           |           |       |
| ...    |           |                  |                |           |           |       |

---

### Form 2: Appliance Identification Test

| Test # | Appliance | Actual State | NILM State | Correct? | Timestamp | Notes |
|--------|-----------|--------------|------------|----------|-----------|-------|
| 1      |           |              |            |          |           |       |
| 2      |           |              |            |          |           |       |
| ...    |           |              |            |          |           |       |

**Accuracy Summary**:
- Total Tests: _______
- Correct: _______
- Incorrect: _______
- Accuracy: _______%

---

### Form 3: Energy Calculation Test

| Test # | Load (W) | Duration (hrs) | Expected (kWh) | NILM (kWh) | Error (kWh) | Error (%) |
|--------|----------|-----------------|----------------|------------|------------|-----------|
| 1      |          |                 |                |            |            |           |
| 2      |          |                 |                |            |            |           |
| ...    |          |                 |                |            |            |           |

---

## Test Results Analysis

### Accuracy Metrics

1. **Power Measurement Accuracy**
   - Average Error: _______%
   - Maximum Error: _______%
   - Standard Deviation: _______
   - Meets Target (> 98% accuracy): [ ] Yes [ ] No

2. **Appliance Identification Accuracy**
   - Overall Accuracy: _______%
   - By Appliance Type:
     - Refrigerator: _______%
     - AC: _______%
     - TV: _______%
     - Fan: _______%
     - Lights: _______%
     - Other: _______%
   - Meets Target (> 90% accuracy): [ ] Yes [ ] No

3. **Energy Calculation Accuracy**
   - Average Error: _______%
   - Maximum Error: _______%
   - Meets Target (> 95% accuracy): [ ] Yes [ ] No

---

## Limitations and Challenges

### Identified Limitations

1. **Appliance Identification**:
   - Appliances with similar power consumption: _______
   - Variable-load appliances: _______
   - Simultaneous operation challenges: _______

2. **Measurement Accuracy**:
   - Low power levels (< 50W): _______
   - High power levels (> 2000W): _______
   - Power factor variations: _______

3. **System Performance**:
   - Response time issues: _______
   - Data transmission delays: _______
   - Error recovery: _______

---

## Recommendations

Based on test results:

1. **For Improvement**:
   - _________________________________________________________________
   - _________________________________________________________________
   - _________________________________________________________________

2. **For Deployment**:
   - _________________________________________________________________
   - _________________________________________________________________
   - _________________________________________________________________

---

## Test Report Template

**NILM System Accuracy Test Report**

**Test Period**: _______________ to _______________

**Test Location**: _______________

**Test Conducted By**: _______________

### Executive Summary
- Overall system accuracy: _______%
- Power measurement accuracy: _______%
- Appliance identification accuracy: _______%
- Energy calculation accuracy: _______%

### Detailed Results
[Include all test data and analysis]

### Conclusions
- System meets accuracy requirements: [ ] Yes [ ] No
- Ready for deployment: [ ] Yes [ ] No
- Recommendations: _________________________________________________________________

---

**Test Completed By**: _______________ **Date**: _______________

**Reviewed By**: _______________ **Date**: _______________

