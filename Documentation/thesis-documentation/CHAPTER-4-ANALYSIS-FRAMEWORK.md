# CHAPTER 4: ANALYSIS AND INTERPRETATION

## Introduction

This chapter presents the analysis and interpretation of data collected during the system development, testing, and evaluation phases. The analysis covers system functionality, performance metrics, user acceptance, accuracy measurements, and overall system effectiveness.

---

## System Development Results

### 4.1 Hardware Development

#### 4.1.1 NILM Device Prototype
**Description**: Development of the hardware prototype using ESP32 microcontroller

**Results**:
- Successfully integrated voltage and current sensors
- Implemented WiFi connectivity for data transmission
- Achieved stable sensor readings with ±2% accuracy
- Device successfully transmits data every 5 seconds
- Power consumption: < 5W (device itself)

**Challenges Encountered**:
- Initial sensor calibration required multiple iterations
- WiFi connection stability in some locations
- Power supply considerations for continuous operation

**Solutions Implemented**:
- Automated sensor calibration routine
- WiFi reconnection logic with retry mechanism
- Power supply optimization

---

### 4.2 Software Development

#### 4.2.1 Mobile Application Development
**Description**: React Native + Expo mobile application

**Results**:
- Successfully developed cross-platform app (iOS and Android)
- Implemented all core features:
  - User authentication (Firebase Auth)
  - Real-time energy monitoring dashboard
  - Device and appliance management
  - Historical consumption reports
  - Charts and visualizations
  - Alert and notification system
  - PDF report export

**Technical Metrics**:
- App size: ~25 MB
- Initial load time: < 3 seconds
- Screen navigation: < 1 second
- Real-time update latency: 1-2 seconds

**User Interface**:
- 5 main screens implemented
- 15+ reusable components created
- Material Design principles applied
- Responsive layouts for various screen sizes

#### 4.2.2 Backend Development (Cloud Functions)
**Description**: Firebase Cloud Functions for data processing

**Results**:
- Successfully deployed 5 cloud functions:
  - `submitReading`: IoT data endpoint
  - `generateDailySummary`: Daily consumption aggregation
  - `generateWeeklySummary`: Weekly consumption aggregation
  - `generateMonthlySummary`: Monthly consumption aggregation
  - `checkAlerts`: Alert rule evaluation

**Performance Metrics**:
- Average function execution time: 200-500ms
- Success rate: > 99%
- Error handling: Comprehensive error logging

#### 4.2.3 Database Implementation
**Description**: Firebase Firestore database

**Results**:
- 11 collections created
- Security rules implemented
- Indexes configured for optimal performance
- Data structure supports all required features

**Database Metrics**:
- Average read latency: < 100ms
- Average write latency: < 200ms
- Storage efficiency: Optimized for time-series data

---

## System Testing Results

### 4.3 Functional Testing

#### 4.3.1 Feature Completeness
**Test Results**: All functional requirements tested and verified

| Feature | Status | Notes |
|---------|--------|-------|
| User Authentication | ✅ Pass | Firebase Auth working correctly |
| Real-time Monitoring | ✅ Pass | Updates every 5 seconds |
| Appliance Identification | ✅ Pass | ON/OFF detection working |
| Historical Data | ✅ Pass | Daily/weekly/monthly reports |
| Cost Estimation | ✅ Pass | Accurate calculation |
| Alerts | ✅ Pass | Threshold-based alerts working |
| PDF Export | ✅ Pass | Reports generated successfully |
| Multi-user Support | ✅ Pass | Tenant/Landlord roles working |

**Overall Functional Completeness**: 100% (8/8 features)

#### 4.3.2 Integration Testing
**Test Results**: All system components integrated successfully

**Hardware-Software Integration**:
- ESP32 → Cloud Function: ✅ Success rate 99.2%
- Data transmission: ✅ Average latency 1.5 seconds
- Error recovery: ✅ Automatic reconnection working

**Mobile App-Cloud Integration**:
- Real-time data sync: ✅ Working correctly
- Authentication: ✅ Secure and reliable
- Data retrieval: ✅ Fast and accurate

---

## System Performance Evaluation

### 4.4 Performance Metrics

#### 4.4.1 Response Time
**Measurement**: Time from user action to system response

| Operation | Target | Actual | Status |
|-----------|--------|--------|--------|
| App Launch | < 3s | 2.1s | ✅ Pass |
| Login | < 2s | 1.3s | ✅ Pass |
| Dashboard Load | < 2s | 1.5s | ✅ Pass |
| Real-time Update | < 2s | 1.2s | ✅ Pass |
| Report Generation | < 5s | 3.8s | ✅ Pass |
| PDF Export | < 10s | 7.2s | ✅ Pass |

**Analysis**: All operations meet or exceed performance targets.

#### 4.4.2 System Reliability
**Measurement**: Uptime and error rates

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| System Uptime | > 95% | 97.3% | ✅ Pass |
| Data Transmission Success | > 98% | 99.2% | ✅ Pass |
| Error Rate | < 2% | 0.8% | ✅ Pass |
| Recovery Time | < 30s | 15s | ✅ Pass |

**Analysis**: System demonstrates high reliability with minimal downtime.

#### 4.4.3 Resource Utilization
**Measurement**: Cloud resource usage

| Resource | Usage | Free Tier Limit | Status |
|----------|-------|-----------------|--------|
| Firestore Reads | 35K/day | 50K/day | ✅ Within limit |
| Firestore Writes | 18K/day | 20K/day | ✅ Within limit |
| Cloud Functions | 5K/day | 2M/month | ✅ Within limit |
| Storage | 500 MB | 1 GB | ✅ Within limit |

**Analysis**: System operates efficiently within free tier limits.

---

## Accuracy Evaluation

### 4.5 Appliance Identification Accuracy

#### 4.5.1 Test Methodology
- **Test Duration**: 2 weeks
- **Test Appliances**: 10 common household appliances
- **Test Scenarios**: 100 appliance state changes (ON/OFF)
- **Comparison**: Manual observation vs. system detection

#### 4.5.2 Results

| Appliance Type | Total Tests | Correct | Incorrect | Accuracy |
|----------------|-------------|---------|-----------|----------|
| Refrigerator | 20 | 19 | 1 | 95% |
| Air Conditioner | 20 | 18 | 2 | 90% |
| Television | 15 | 15 | 0 | 100% |
| Electric Fan | 15 | 14 | 1 | 93% |
| Light Bulb | 10 | 10 | 0 | 100% |
| Water Heater | 10 | 9 | 1 | 90% |
| Washing Machine | 5 | 4 | 1 | 80% |
| Microwave | 5 | 5 | 0 | 100% |
| **Overall** | **100** | **94** | **6** | **94%** |

**Analysis**: 
- Overall accuracy: 94% (exceeds 90% target)
- High accuracy for simple ON/OFF appliances (lights, TV)
- Lower accuracy for variable-load appliances (AC, washing machine)
- System performs well for typical residential monitoring

#### 4.5.3 Power Measurement Accuracy
**Comparison**: System readings vs. calibrated power meter

| Test | Actual (W) | System (W) | Error | Error % |
|------|------------|------------|-------|---------|
| Test 1 | 150.0 | 148.5 | 1.5 | 1.0% |
| Test 2 | 250.0 | 252.3 | 2.3 | 0.9% |
| Test 3 | 1000.0 | 995.2 | 4.8 | 0.5% |
| Test 4 | 500.0 | 503.1 | 3.1 | 0.6% |
| Test 5 | 75.0 | 74.2 | 0.8 | 1.1% |
| **Average** | - | - | - | **0.8%** |

**Analysis**: Power measurement accuracy is excellent (average error < 1%).

---

## User Acceptance Evaluation

### 4.6 System Usability Scale (SUS) Results

#### 4.6.1 SUS Scores
**Sample Size**: 40 users (30 tenants, 10 landlords)

| User Group | Average SUS Score | Interpretation |
|------------|------------------|----------------|
| Tenants | 78.5 | Good |
| Landlords | 82.3 | Excellent |
| **Overall** | **79.4** | **Good** |

**Target**: > 70 (Above Average)  
**Result**: ✅ **79.4** - Exceeds target

#### 4.6.2 SUS Score Distribution
- **Excellent (80-100)**: 15 users (37.5%)
- **Good (70-79)**: 18 users (45%)
- **Average (50-69)**: 6 users (15%)
- **Poor (<50)**: 1 user (2.5%)

**Analysis**: 82.5% of users rated the system as Good or Excellent.

#### 4.6.3 Individual SUS Items Analysis
| Item | Average Score | Interpretation |
|------|---------------|----------------|
| I think I would like to use this system frequently | 4.2/5 | Positive |
| I found the system unnecessarily complex | 2.1/5 | Simple |
| I thought the system was easy to use | 4.3/5 | Easy |
| I think I would need support to use this system | 1.8/5 | Independent |
| I found the various functions well integrated | 4.1/5 | Well integrated |
| I thought there was too much inconsistency | 2.0/5 | Consistent |
| I would imagine most people would learn quickly | 4.4/5 | Learnable |
| I found the system very cumbersome | 1.9/5 | Not cumbersome |
| I felt very confident using the system | 4.2/5 | Confident |
| I needed to learn a lot before using this system | 1.7/5 | Easy to learn |

**Analysis**: Users found the system easy to use, learn, and navigate.

---

### 4.7 ISO/IEC 25010 Quality Evaluation

#### 4.7.1 Functional Suitability
| Characteristic | Rating | Notes |
|----------------|--------|-------|
| Functional Completeness | 5/5 | All requirements met |
| Functional Correctness | 4.5/5 | Minor edge cases |
| Functional Appropriateness | 5/5 | Meets user needs |

**Overall**: 4.8/5 (Excellent)

#### 4.7.2 Performance Efficiency
| Characteristic | Rating | Notes |
|----------------|--------|-------|
| Time Behavior | 4.5/5 | Fast response times |
| Resource Utilization | 5/5 | Efficient cloud usage |

**Overall**: 4.75/5 (Excellent)

#### 4.7.3 Usability
| Characteristic | Rating | Notes |
|----------------|--------|-------|
| Appropriateness | 4.5/5 | User-friendly interface |
| Learnability | 5/5 | Easy to learn |
| User Error Protection | 4/5 | Good error handling |

**Overall**: 4.5/5 (Good)

#### 4.7.4 Reliability
| Characteristic | Rating | Notes |
|----------------|--------|-------|
| Maturity | 4/5 | Stable with minor issues |
| Availability | 4.5/5 | 97.3% uptime |
| Fault Tolerance | 4/5 | Good error recovery |

**Overall**: 4.2/5 (Good)

#### 4.7.5 Security
| Characteristic | Rating | Notes |
|----------------|--------|-------|
| Confidentiality | 5/5 | Data encryption |
| Integrity | 4.5/5 | Secure data handling |
| Authenticity | 5/5 | Strong authentication |

**Overall**: 4.8/5 (Excellent)

**Overall ISO/IEC 25010 Score**: 4.6/5 (Excellent)

---

## User Feedback Analysis

### 4.8 Qualitative Feedback

#### 4.8.1 Positive Feedback Themes
1. **Real-time Monitoring**: Users appreciated seeing live energy consumption
2. **Easy to Use**: Interface was intuitive and user-friendly
3. **Cost Awareness**: Helped identify high-consuming appliances
4. **Mobile Convenience**: App accessibility from anywhere
5. **Historical Data**: Useful for tracking consumption patterns

#### 4.8.2 Improvement Suggestions
1. **More Detailed Appliance Info**: Add appliance usage statistics
2. **Energy Saving Tips**: Include recommendations
3. **Comparison Features**: Compare with previous periods
4. **Notification Customization**: More alert options
5. **Offline Mode**: Basic functionality without internet

#### 4.8.3 Challenges Encountered
1. **Initial Setup**: Some users needed assistance
2. **WiFi Dependency**: Requires stable internet
3. **Battery Usage**: App consumes battery with real-time updates
4. **Learning Curve**: Minor learning curve for some features

---

## System Limitations Identified

### 4.9 Technical Limitations

1. **Appliance Identification**:
   - Limited to ON/OFF detection
   - Difficulty with similar power consumption appliances
   - Variable-load appliances less accurate

2. **Network Dependency**:
   - Requires stable internet connection
   - No offline functionality

3. **Hardware Constraints**:
   - Single-point monitoring (not per-appliance)
   - Sensor accuracy limitations
   - Power supply requirements

4. **Scalability**:
   - Tested with limited devices (10-20)
   - Cloud free tier limitations
   - Need for optimization at scale

---

## Comparison with Objectives

### 4.10 Objectives Achievement

| Objective | Target | Achieved | Status |
|-----------|--------|----------|--------|
| Design NILM hardware | Complete | ✅ | Achieved |
| Develop mobile app | Complete | ✅ | Achieved |
| Real-time monitoring | Functional | ✅ | Achieved |
| Appliance classification | >90% accuracy | 94% | ✅ Exceeded |
| System usability | SUS >70 | 79.4 | ✅ Exceeded |
| System reliability | >95% uptime | 97.3% | ✅ Exceeded |
| Cost-effective solution | Free tier | ✅ | Achieved |

**Overall Achievement**: 7/7 objectives met or exceeded

---

## Summary of Findings

### 4.11 Key Findings

1. **System Successfully Developed**: All components integrated and functional
2. **High Accuracy**: 94% appliance identification accuracy
3. **Good Usability**: SUS score of 79.4 (above average)
4. **Reliable Performance**: 97.3% uptime, fast response times
5. **User Acceptance**: 82.5% of users rated system as Good or Excellent
6. **Cost-Effective**: Operates within free tier cloud services
7. **Meets Requirements**: All functional and non-functional requirements met

### 4.12 Recommendations

1. **For Future Development**:
   - Implement machine learning for improved appliance identification
   - Add offline functionality
   - Expand to support more appliance types
   - Add energy saving recommendations

2. **For Deployment**:
   - Provide user training materials
   - Establish support system
   - Monitor system performance
   - Collect continuous feedback

3. **For Research**:
   - Conduct longer-term studies
   - Expand to more locations
   - Compare with other NILM systems
   - Evaluate energy savings impact

---

**Note**: This is a framework. Replace with actual test results, data, and analysis from your system evaluation.

