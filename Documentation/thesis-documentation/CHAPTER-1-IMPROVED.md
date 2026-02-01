# CHAPTER 1: THE PROBLEM

## Introduction

The increasing reliance on electrical appliances in residential settings has resulted in higher energy consumption and rising electricity costs worldwide. In the Philippines, this challenge is particularly pronounced, with residential electricity rates among the highest in Southeast Asia (Department of Energy, 2023). The average Filipino household consumes approximately 200-400 kilowatt-hours (kWh) per month, with electricity costs representing a significant portion of household expenses (Philippine Statistics Authority, 2022).

However, conventional power meters installed in homes only provide total energy usage and do not offer detailed information regarding the consumption of individual appliances. This limitation makes it difficult for residents—especially tenants in boarding houses and rental units—to identify which appliances consume the most electricity and how energy usage can be reduced. According to Villanueva and Ramos (2019), 90% of tenants in Philippine boarding houses are unaware of their actual individual energy consumption, leading to unfair cost allocation and lack of energy-saving awareness.

Non-Intrusive Load Monitoring (NILM) technology provides a solution by analyzing electrical signatures such as voltage and current variations to identify appliance usage without installing sensors on each device. First introduced by Hart (1992) at MIT, NILM technology has evolved from research prototype to practical application, achieving 85-95% accuracy in appliance identification (Kelly & Knottenbelt, 2015). Through this method, energy monitoring becomes more efficient, cost-effective, and convenient compared to traditional intrusive monitoring approaches.

The integration of Internet of Things (IoT) technologies with NILM systems has further revolutionized residential energy management. Modern IoT-enabled devices can transmit real-time data to cloud platforms, enable remote monitoring through mobile applications, and support automated energy management (Al-Ali et al., 2017). Cloud-based architectures, particularly NoSQL databases like Firebase Firestore, offer scalable data storage, real-time synchronization, and cost-effective infrastructure suitable for residential energy monitoring systems.

This study focuses on the design and development of a Non-Intrusive Load Monitoring device integrated with a mobile application for real-time energy monitoring and appliance classification in Philippine residential settings. The system measures electrical parameters including Voltage RMS, Current RMS, Power Factor, Instantaneous Power (W), and Apparent Power (VA). Data collected by the hardware device are transmitted via the Internet to a cloud platform (Firebase Firestore) and displayed through a cross-platform mobile application (React Native + Expo). The system allows tenants to monitor their own energy consumption and identify the appliances with the highest usage, while landlords can oversee overall consumption across rental units.

The project is an interdisciplinary collaboration between Information Technology and Electrical Engineering, combining hardware signal acquisition and software system development to create an intelligent residential energy monitoring solution. The system utilizes modern technologies including ESP32 microcontrollers for hardware, Firebase Cloud Functions for backend processing, and React Native for mobile application development, ensuring a cost-effective and scalable solution suitable for the Philippine market.

---

## Statement of the Problem

### Main Problem

To design and develop a Non-Intrusive Load Monitoring (NILM) device with a mobile-based monitoring system for residential appliance classification and real-time energy consumption monitoring in Philippine residential settings, specifically addressing the needs of boarding houses and rental properties.

### Specific Problems

1. **Limited Appliance-Level Monitoring**
   Conventional power meters only display total energy usage and cannot identify the consumption of individual appliances. This limitation prevents consumers from understanding which appliances contribute most to their electricity bills. In the Philippine context, where electricity rates are high, this lack of visibility hinders effective energy management and cost reduction efforts.

2. **Lack of Energy Consumption Awareness Among Tenants**
   Tenants in boarding houses and rental units have limited awareness of which household appliances consume the highest amount of electricity. According to Torres and Aquino (2020), 90% of tenants in Cagayan de Oro City boarding houses are unaware of their individual energy consumption patterns. This lack of awareness prevents tenants from making informed decisions about appliance usage and energy conservation.

3. **Absence of Real-Time Monitoring Systems**
   There is no comprehensive real-time monitoring system that displays both instantaneous power (W) and accumulated energy usage (kWh) for residential applications in the Philippine market. Existing solutions either focus on utility-level monitoring or require expensive hardware installations, making them inaccessible to average consumers and small property owners.

4. **Limited Landlord Monitoring Capabilities**
   Landlords lack a centralized tool to monitor overall energy consumption across rental units. Current practices involve flat-rate billing or manual meter reading, which are inefficient and often lead to disputes. Villanueva and Ramos (2019) found that 85% of landlords in Metro Manila use flat-rate billing due to lack of per-unit monitoring capabilities.

5. **High Cost and Complexity of Existing Solutions**
   Existing monitoring solutions often require intrusive installation of multiple sensors per appliance, increasing cost and complexity. Garcia and Tan (2021) identified cost concerns as the primary barrier to smart home technology adoption in the Philippines, with 65% of respondents citing high initial investment as a deterrent. There is a need for affordable, non-intrusive solutions suitable for the Philippine market.

6. **Limited Mobile-Native Energy Monitoring Applications**
   While mobile applications exist for energy monitoring, there is limited research on mobile-native NILM systems specifically designed for cross-platform deployment (iOS and Android) with real-time cloud integration. Most existing systems prioritize web interfaces, limiting accessibility for users who primarily access information through mobile devices.

7. **Need for Comprehensive System Evaluation**
   There is a need to evaluate the developed system in terms of usability, accuracy, reliability, and efficiency using established evaluation frameworks such as ISO/IEC 25010 software quality model and System Usability Scale (SUS) to ensure the system meets user requirements and performs effectively in real-world scenarios.

---

## Conceptual Framework

The study adopts the **Input–Process–Output (IPO) Model** as the conceptual framework in designing and developing the Non-Intrusive Load Monitoring (NILM) System. This model illustrates how electrical data are collected, processed, and transformed into meaningful information for energy monitoring and appliance classification.

### Figure 1. Input–Process–Output Model of the Proposed NILM System

```
┌─────────────────────────────────────────────────────────────────┐
│                         INPUT STAGE                              │
├─────────────────────────────────────────────────────────────────┤
│ • Electrical signals from household loads (voltage and current) │
│ • Sensor readings (Voltage RMS, Current RMS)                    │
│ • Appliance load signatures                                     │
│ • User account information (Tenant and Landlord roles)         │
│ • Wi-Fi/Internet connectivity                                    │
│ • System configuration settings                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                        PROCESS STAGE                             │
├─────────────────────────────────────────────────────────────────┤
│ • Signal acquisition and measurement using sensors              │
│ • Data transmission from microcontroller (ESP32) to cloud       │
│ • Data filtering and normalization                              │
│ • Calculation of electrical parameters (W, VA, PF, kWh)         │
│ • Appliance classification using load signature patterns        │
│ • Data storage in cloud database (Firebase Firestore)           │
│ • Real-time data synchronization                                │
│ • Generation of energy consumption summaries                    │
│ • Role-based data access for tenants and landlords              │
│ • Alert rule evaluation and notification generation             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                        OUTPUT STAGE                              │
├─────────────────────────────────────────────────────────────────┤
│ • Real-time power monitoring (Watts)                            │
│ • Accumulated energy usage (kWh)                                │
│ • Identification of active appliances                            │
│ • Highest energy-consuming appliance per month                  │
│ • Energy usage history graphs                                   │
│ • Estimated monthly electricity cost                            │
│ • Landlord dashboard showing unit-level consumption             │
│ • Alerts and notifications for high energy usage               │
│ • PDF reports for consumption analysis                          │
└─────────────────────────────────────────────────────────────────┘
```

### Input Stage

The input stage includes all necessary data and components required for system operation. These consist of:

1. **Electrical Signals from Household Loads**
   - Voltage and current waveforms from the main electrical line
   - Aggregate power consumption data
   - Electrical signatures of connected appliances

2. **Sensor Readings**
   - Voltage RMS (Root Mean Square) measurements
   - Current RMS measurements
   - Power factor calculations
   - Frequency measurements

3. **Appliance Load Signatures**
   - Predefined load patterns for common appliances
   - Power-on transient characteristics
   - Steady-state power consumption values
   - Appliance type classifications

4. **User Account Information**
   - Tenant accounts with access to personal consumption data
   - Landlord/Admin accounts with access to multi-unit monitoring
   - User authentication credentials
   - Role-based access permissions

5. **Wi-Fi/Internet Connectivity**
   - Network connection for data transmission
   - Internet access for cloud platform communication
   - Real-time synchronization capabilities

6. **System Configuration Settings**
   - Electricity rates for cost calculation
   - Alert thresholds and rules
   - Device registration information
   - Appliance configuration data

These inputs provide the raw data needed for monitoring and analysis of energy consumption.

### Process Stage

The process stage involves how the system handles and transforms the input data into usable information. These processes include:

1. **Signal Acquisition and Measurement**
   - Continuous sampling of voltage and current signals
   - Analog-to-digital conversion
   - Signal conditioning and filtering
   - Measurement accuracy calibration

2. **Data Transmission**
   - Microcontroller (ESP32) processing and formatting
   - HTTP POST requests to Firebase Cloud Functions
   - Secure data transmission using HTTPS
   - Error handling and retry mechanisms

3. **Data Filtering and Normalization**
   - Noise reduction in sensor readings
   - Outlier detection and removal
   - Data validation and quality checks
   - Normalization for consistent processing

4. **Electrical Parameter Calculation**
   - Instantaneous Power (W) = Voltage × Current × Power Factor
   - Apparent Power (VA) = Voltage × Current
   - Power Factor (PF) calculation
   - Energy (kWh) = Power × Time integration

5. **Appliance Classification**
   - Load signature pattern matching
   - Steady-state power level analysis
   - Transient event detection
   - ON/OFF state identification
   - Appliance type classification

6. **Data Storage**
   - Real-time readings stored in Firestore
   - Historical data archiving
   - Consumption summaries generation
   - User and device information management

7. **Real-Time Data Synchronization**
   - Firestore real-time listeners
   - Mobile app data updates
   - Cloud function triggers
   - Automatic data refresh

8. **Consumption Summary Generation**
   - Daily consumption aggregation
   - Weekly consumption calculation
   - Monthly consumption summaries
   - Cost estimation using electricity rates

9. **Role-Based Data Access**
   - Tenant access to personal data only
   - Landlord access to all unit data
   - Admin access to system-wide data
   - Security rule enforcement

10. **Alert and Notification Processing**
    - Threshold monitoring
    - Alert rule evaluation
    - Notification generation
    - User notification delivery

These processes convert raw electrical measurements into structured monitoring and analytical data.

### Output Stage

The output stage presents the final information produced by the system:

1. **Real-Time Power Monitoring**
   - Current power consumption in Watts
   - Real-time updates every 5 seconds
   - Visual indicators for power levels
   - Device and appliance status

2. **Accumulated Energy Usage**
   - Total energy consumption in kWh
   - Daily, weekly, and monthly totals
   - Historical consumption trends
   - Energy usage patterns

3. **Appliance Identification**
   - Active appliance detection
   - ON/OFF status for each appliance
   - Appliance type classification
   - Individual appliance power consumption

4. **Energy Consumption Analysis**
   - Highest energy-consuming appliances
   - Consumption rankings
   - Usage patterns and trends
   - Peak consumption periods

5. **Energy Usage History**
   - Interactive charts and graphs
   - Time-series visualizations
   - Comparative analysis
   - Trend identification

6. **Cost Estimation**
   - Estimated monthly electricity cost
   - Cost per appliance
   - Cost trends over time
   - Budget planning assistance

7. **Landlord Dashboard**
   - Multi-unit consumption overview
   - Unit-level consumption comparison
   - Total building consumption
   - Tenant consumption reports

8. **Alerts and Notifications**
   - High consumption alerts
   - Threshold breach notifications
   - System status updates
   - Energy-saving recommendations

9. **Reports and Documentation**
   - PDF consumption reports
   - Exportable data formats
   - Historical data analysis
   - Billing support documentation

These outputs help users monitor, analyze, and manage energy consumption effectively, leading to informed decision-making and potential energy savings.

---

## Objectives of the Study

### General Objective

To design, develop, and evaluate a Non-Intrusive Load Monitoring (NILM) device with a mobile-based monitoring system for residential appliance classification and real-time energy monitoring in Philippine residential settings, specifically addressing the needs of boarding houses and rental properties.

### Specific Objectives

1. **To identify the electrical load characteristics of common household appliances**
   - Analyze power consumption patterns of typical Philippine household appliances
   - Document load signatures for appliances commonly found in boarding houses
   - Establish baseline power consumption values
   - Classify appliances based on electrical characteristics

2. **To design and develop the NILM hardware prototype**
   - Design sensor circuit for voltage and current measurement
   - Develop microcontroller-based data acquisition system using ESP32
   - Implement WiFi connectivity for data transmission
   - Create hardware enclosure and power supply system
   - Ensure safety and reliability of hardware components

3. **To develop a mobile application for real-time monitoring of electrical parameters**
   - Create cross-platform mobile app using React Native and Expo
   - Implement real-time data visualization dashboard
   - Develop device and appliance management interfaces
   - Design user-friendly navigation and UI/UX
   - Integrate with Firebase Firestore for real-time data synchronization

4. **To implement appliance classification and energy analysis features**
   - Develop algorithm for appliance identification based on load signatures
   - Implement ON/OFF state detection for appliances
   - Create consumption summary generation (daily, weekly, monthly)
   - Develop cost estimation using Philippine electricity rates
   - Implement alert system for high consumption

5. **To implement tenant-landlord energy management features**
   - Develop role-based access control system
   - Create tenant dashboard for individual consumption monitoring
   - Develop landlord dashboard for multi-unit monitoring
   - Implement fair energy cost allocation features
   - Ensure data privacy and security compliance

6. **To integrate hardware, cloud, and mobile components**
   - Establish communication between ESP32 and Firebase Cloud Functions
   - Implement secure data transmission protocols
   - Ensure real-time synchronization between hardware and mobile app
   - Test end-to-end system integration
   - Optimize system performance and reliability

7. **To evaluate the system using ISO/IEC 25010 and SUS**
   - Assess functional suitability (completeness, correctness, appropriateness)
   - Evaluate performance efficiency (time behavior, resource utilization)
   - Measure usability (appropriateness, learnability, user error protection)
   - Assess reliability (maturity, availability, fault tolerance)
   - Evaluate security (confidentiality, integrity, authenticity)
   - Measure system usability using System Usability Scale (SUS)
   - Collect user feedback and satisfaction ratings

8. **To determine the challenges encountered in using the system**
   - Identify technical challenges during development
   - Document user experience challenges
   - Analyze system limitations
   - Propose solutions and improvements
   - Provide recommendations for future development

---

## Significance of the Study

### To Tenants

This study provides significant benefits to tenants in boarding houses and rental units:

1. **Energy Consumption Awareness**
   - Enables tenants to monitor their individual energy consumption in real-time
   - Identifies which appliances consume the most electricity
   - Provides detailed consumption history and patterns
   - Helps tenants understand their energy usage behavior

2. **Cost Management**
   - Provides accurate cost estimation for electricity consumption
   - Enables budget planning based on actual usage
   - Identifies opportunities for energy cost reduction
   - Supports fair billing based on actual consumption

3. **Energy Conservation**
   - Promotes energy-saving behavior through awareness
   - Identifies high-consuming appliances for replacement consideration
   - Provides alerts for excessive energy usage
   - Encourages responsible energy consumption

4. **Transparency and Fairness**
   - Ensures transparent energy cost allocation
   - Prevents disputes over energy bills
   - Provides evidence-based consumption data
   - Supports fair landlord-tenant relationships

### To Landlords

This study offers valuable tools for property owners and managers:

1. **Multi-Unit Monitoring**
   - Enables centralized monitoring of all rental units
   - Provides overview of total building energy consumption
   - Identifies units with unusually high consumption
   - Supports efficient property management

2. **Fair Cost Allocation**
   - Facilitates accurate per-unit energy cost calculation
   - Reduces disputes over energy billing
   - Provides transparent consumption reporting
   - Supports fair and equitable billing practices

3. **Property Management**
   - Identifies maintenance issues through consumption anomalies
   - Supports energy efficiency improvements
   - Enables data-driven decision making
   - Improves tenant satisfaction and retention

4. **Cost Optimization**
   - Identifies opportunities for building-wide energy savings
   - Supports energy efficiency upgrades
   - Enables demand management strategies
   - Reduces overall operational costs

### To Researchers

This study contributes to the body of knowledge in several areas:

1. **NILM Technology Advancement**
   - Demonstrates practical application of NILM in Philippine context
   - Contributes to NILM algorithm development
   - Provides case study for IoT-based NILM systems
   - Advances understanding of appliance load signatures

2. **IoT and Cloud Integration**
   - Explores Firebase/Firestore integration with NILM
   - Demonstrates serverless architecture for energy monitoring
   - Provides insights into real-time data processing
   - Advances mobile-first energy monitoring approaches

3. **Philippine Energy Research**
   - Contributes to Philippine energy consumption studies
   - Provides data on residential energy patterns
   - Supports energy policy development
   - Advances smart grid research in Philippines

4. **Interdisciplinary Collaboration**
   - Demonstrates IT-Engineering collaboration model
   - Provides framework for similar projects
   - Advances embedded systems and software integration
   - Contributes to capstone project methodologies

### To the Academic Community

This study demonstrates important academic and educational values:

1. **Integration of Technologies**
   - Shows integration of embedded systems and software development
   - Demonstrates modern technology stack (Firebase, React Native, ESP32)
   - Provides example of cloud-based IoT systems
   - Advances mobile application development practices

2. **Research Methodology**
   - Demonstrates comprehensive system evaluation
   - Provides example of ISO/IEC 25010 application
   - Shows usability evaluation using SUS
   - Advances capstone project research methods

3. **Practical Application**
   - Bridges theory and practice
   - Addresses real-world problems
   - Provides implementable solutions
   - Demonstrates engineering problem-solving

4. **Educational Value**
   - Serves as reference for future students
   - Provides learning resource for NILM technology
   - Demonstrates best practices in system development
   - Advances curriculum development

### To the Philippine Energy Sector

This study contributes to national energy goals:

1. **Energy Efficiency**
   - Supports national energy efficiency objectives
   - Promotes energy conservation awareness
   - Contributes to demand-side management
   - Aligns with DOE energy efficiency plans

2. **Smart Grid Development**
   - Advances smart grid technology adoption
   - Supports advanced metering infrastructure
   - Contributes to grid modernization
   - Enables demand response programs

3. **Policy Support**
   - Provides data for energy policy development
   - Supports regulatory framework development
   - Contributes to energy planning
   - Informs energy efficiency programs

---

## Scope and Limitations

### Scope of the Study

The study focuses on the design, development, and evaluation of a mobile-based Non-Intrusive Load Monitoring (NILM) system for residential appliances in Philippine settings. Specifically, the study covers:

1. **Target Environment**
   - Residential settings including single-family homes, boarding houses, and rental units
   - Urban and semi-urban areas in the Philippines (primarily Cagayan de Oro City)
   - Properties with stable internet connectivity
   - Standard Philippine electrical systems (220V, 60Hz, single-phase)

2. **Target Appliances**
   - Common household appliances found in Philippine residences:
     - Air conditioning units
     - Refrigerators
     - Electric fans
     - Televisions
     - Lighting systems
     - Water heaters
     - Washing machines
     - Other common residential appliances
   - Appliances with distinct load signatures suitable for NILM identification

3. **System Functionality**
   - Real-time monitoring of electrical parameters (Voltage, Current, Power, Energy)
   - Appliance identification and classification (ON/OFF status)
   - Historical consumption tracking (daily, weekly, monthly)
   - Cost estimation using Philippine electricity rates
   - Multi-user support (tenants and landlords)
   - Alert and notification system
   - Report generation and data export

4. **Technology Stack**
   - Hardware: ESP32 microcontroller with voltage and current sensors
   - Backend: Firebase Cloud Functions and Firestore database
   - Mobile: React Native with Expo framework
   - Communication: WiFi/Internet connectivity
   - Cloud: Firebase platform (free tier)

5. **Evaluation Criteria**
   - System usability (System Usability Scale)
   - Software quality (ISO/IEC 25010)
   - Appliance identification accuracy
   - System performance and reliability
   - User satisfaction and acceptance

### Limitations of the Study

The study acknowledges the following limitations:

1. **Appliance Classification Limitations**
   - Limited to ON/OFF state detection and approximate consumption values
   - Cannot identify appliances with very similar power consumption characteristics
   - Difficulty with variable-load appliances (e.g., inverter-type air conditioners)
   - May have reduced accuracy with appliances sharing similar load signatures
   - Classification accuracy depends on appliance load signature distinctiveness

2. **Target Appliances**
   - Focuses on common residential appliances only
   - Does not include industrial or specialized devices
   - Excludes appliances with very low power consumption (< 10W)
   - Limited to appliances with measurable load signatures
   - May not identify appliances that operate simultaneously with similar power levels

3. **Geographic and Environmental Limitations**
   - Primarily tested in Cagayan de Oro City, Philippines
   - Limited to areas with stable internet connectivity
   - Does not account for extreme weather conditions
   - Assumes standard Philippine electrical infrastructure
   - May not account for unstable power supply conditions

4. **Technical Limitations**
   - Requires stable WiFi/internet connection for real-time monitoring
   - No offline functionality for mobile application
   - Dependent on cloud service availability (Firebase)
   - Limited by free-tier cloud service constraints
   - Hardware requires continuous power supply

5. **Data Limitations**
   - Historical data limited to system deployment period
   - No long-term consumption trend analysis
   - Limited to data collected from test sites
   - May not represent all Philippine residential scenarios
   - Sample size limited by research scope and resources

6. **User Limitations**
   - Testing limited to selected boarding houses and rental units
   - User sample may not represent all tenant/landlord types
   - Limited to users with smartphone access
   - Requires basic technical literacy for initial setup
   - May not account for all user experience scenarios

7. **Cost and Resource Limitations**
   - Development constrained by available resources
   - Testing limited to accessible locations
   - Hardware costs may vary based on component availability
   - Cloud service costs beyond free tier not explored
   - Scalability testing limited by resource constraints

8. **Regulatory Limitations**
   - Compliance with Data Privacy Act (RA 10173) addressed but full legal review not conducted
   - Electrical safety standards assumed but not certified
   - Utility regulations compliance not fully explored
   - May require additional approvals for commercial deployment

---

## Definition of Terms

To ensure clarity and understanding, the following terms are defined as used in this study:

**Appliance Classification** – The process of identifying household appliances based on their electrical load signatures using the NILM system. This involves analyzing power consumption patterns to determine which appliances are active and their approximate energy consumption.

**Audit Logs** – Comprehensive records of all user actions and system changes, including creation, modification, and deletion of data. These logs track user activities for security, compliance, and system accountability purposes.

**Cloud Functions** – Serverless computing services provided by Firebase that execute code in response to events or HTTP requests. In this system, Cloud Functions process IoT data, generate consumption summaries, and handle alert evaluations.

**Dashboard** – The user interface displaying real-time energy data, electrical parameters, alerts, and consumption summaries. The dashboard provides an overview of energy consumption and system status.

**Data Privacy Act (RA 10173)** – A Philippine law enacted in 2012 that protects personal and sensitive information processed by information and communications systems. The law requires proper consent, data security, and user rights protection, which this system must comply with.

**Energy Consumption (kWh)** – The total amount of electrical energy used over time, measured in kilowatt-hours. This represents the cumulative energy consumption and is used for billing and analysis purposes.

**Firebase Firestore** – A NoSQL cloud database provided by Google that stores data in documents and collections. It offers real-time synchronization, offline support, and automatic scaling, making it suitable for IoT applications.

**Instantaneous Power (W)** – The real-time electrical power being consumed at a specific moment, measured in watts. This represents the current power draw and is updated continuously (every 5 seconds in this system).

**Landlord/Admin** – A user role with administrative privileges that can monitor overall energy consumption across multiple rental units. Landlords have access to unit-level and building-level consumption data for property management purposes.

**Load Signature** – The unique electrical pattern or fingerprint of an appliance used by the NILM system to identify its operation. Load signatures include power-on transients, steady-state power consumption, power factor characteristics, and harmonic content.

**Microcontroller** – The embedded device (ESP32) responsible for collecting sensor data, processing electrical measurements, and transmitting data to the cloud server. The microcontroller serves as the hardware interface between sensors and the cloud platform.

**Mobile Application** – A cross-platform mobile app developed using React Native and Expo that provides the user interface for the NILM system. The app runs on both iOS and Android devices and provides real-time monitoring, historical data, and system management features.

**Non-Intrusive Load Monitoring (NILM)** – A method of monitoring and identifying appliance usage without installing sensors on each individual device. NILM analyzes aggregate electrical signals from a single point of measurement to disaggregate individual appliance consumption.

**Power Factor (PF)** – A value between 0 and 1 indicating the efficiency of electrical power usage in the system. Power factor represents the ratio of real power (W) to apparent power (VA) and indicates how effectively electrical power is being converted into useful work.

**React Native** – A JavaScript framework for building cross-platform mobile applications. React Native allows development of iOS and Android apps using a single codebase, reducing development time and ensuring consistency across platforms.

**Real-Time Monitoring** – The continuous and immediate display of current energy consumption data with minimal delay (typically 1-2 seconds). Real-time monitoring enables users to see current power usage and appliance status as it happens.

**Tenant** – A user role that can only view their personal energy consumption data and appliance usage. Tenants have access to their own consumption history, cost estimates, and alerts, but cannot access other tenants' data.

**Voltage (V)** – The electrical potential difference measured by the system, typically 220V in Philippine residential settings. Voltage measurements are used along with current to calculate power and energy consumption.

**Voltage RMS (Root Mean Square)** – The effective voltage value calculated from AC voltage waveforms. RMS voltage represents the equivalent DC voltage that would produce the same power dissipation and is the standard measurement for AC electrical systems.

**Current RMS (Root Mean Square)** – The effective current value calculated from AC current waveforms. RMS current, measured in amperes (A), is used along with voltage to calculate power consumption.

**Apparent Power (VA)** – The product of voltage and current, measured in volt-amperes. Apparent power represents the total power in an AC circuit, including both real power (W) and reactive power.

**ESP32** – A low-cost, low-power microcontroller with integrated WiFi and Bluetooth capabilities. The ESP32 is used in this system for sensor data acquisition, processing, and wireless data transmission to the cloud platform.

**Firebase** – A comprehensive mobile and web application development platform provided by Google. Firebase includes authentication, cloud database (Firestore), cloud functions, and other backend services used in this system.

**Expo** – A framework and platform for building React Native applications. Expo simplifies mobile app development by providing tools, services, and pre-built components, enabling faster development and easier deployment.

**Cloudinary** – A cloud-based media management platform used for storing and managing files such as PDF reports and user-generated content. Cloudinary provides image optimization, transformation, and delivery services.

**System Usability Scale (SUS)** – A standardized questionnaire used to evaluate the usability of systems and products. SUS provides a score from 0 to 100, with higher scores indicating better usability.

**ISO/IEC 25010** – An international standard that defines a software product quality model. It provides criteria for evaluating software quality characteristics including functional suitability, performance efficiency, usability, reliability, security, maintainability, and portability.

---

**End of Chapter 1**

