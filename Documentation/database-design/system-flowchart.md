# NILM System - System Flowchart

## System Architecture Flow

```mermaid
flowchart TD
    Start([System Start]) --> UserAuth{User Authentication}
    UserAuth -->|Valid| MainMenu[Main Dashboard]
    UserAuth -->|Invalid| LoginError[Show Login Error]
    LoginError --> UserAuth
    
    MainMenu --> DeviceMgmt[Device Management]
    MainMenu --> RealTimeMonitor[Real-Time Monitoring]
    MainMenu --> Reports[Consumption Reports]
    MainMenu --> Settings[Settings & Alerts]
    
    %% Device Management Flow
    DeviceMgmt --> RegisterDevice[Register New Device]
    RegisterDevice --> ValidateDevice{Validate Device Serial}
    ValidateDevice -->|Valid| SaveDevice[Save to Database]
    ValidateDevice -->|Invalid| DeviceError[Show Error]
    SaveDevice --> ConfigureAppliances[Configure Appliances]
    ConfigureAppliances --> SaveAppliances[Save Appliance Data]
    SaveAppliances --> MainMenu
    
    %% Real-Time Monitoring Flow
    RealTimeMonitor --> ConnectDevice{Device Online?}
    ConnectDevice -->|Yes| ReceiveData[Receive IoT Data]
    ConnectDevice -->|No| ShowOffline[Show Offline Status]
    ReceiveData --> ParseData[Parse JSON Data]
    ParseData --> ValidateData{Data Valid?}
    ValidateData -->|Yes| SaveReading[Save to real_time_readings]
    ValidateData -->|No| LogError[Log Error]
    SaveReading --> UpdateApplianceStatus[Update Appliance Status]
    UpdateApplianceStatus --> CheckAlerts{Check Alert Rules}
    CheckAlerts -->|Threshold Exceeded| CreateNotification[Create Notification]
    CheckAlerts -->|OK| DisplayData[Display on Dashboard]
    CreateNotification --> DisplayData
    DisplayData --> MainMenu
    
    %% Reports Flow
    Reports --> SelectPeriod[Select Time Period]
    SelectPeriod --> SelectAppliance[Select Appliance/Device]
    SelectAppliance --> QuerySummary[Query consumption_summaries]
    QuerySummary --> GetRate[Get electricity_rate_id from summary]
    GetRate --> CalculateCost[Calculate Cost using Rate]
    CalculateCost --> GenerateChart[Generate Charts/Graphs]
    GenerateChart --> DisplayReport[Display Report]
    DisplayReport --> ExportOption{Export Report?}
    ExportOption -->|Yes| ExportPDF[Export as PDF]
    ExportOption -->|No| MainMenu
    ExportPDF --> MainMenu
    
    %% Settings Flow
    Settings --> ManageAlerts[Manage Alert Rules]
    Settings --> ManageRates[Manage Electricity Rates]
    Settings --> UserProfile[User Profile]
    ManageAlerts --> CreateRule[Create/Edit Alert Rule]
    CreateRule --> SaveRule[Save to alert_rules]
    SaveRule --> MainMenu
    ManageRates --> CreateRate[Create/Edit Rate]
    CreateRate --> SaveRate[Save to electricity_rates]
    SaveRate --> MainMenu
    
    style Start fill:#90EE90
    style MainMenu fill:#87CEEB
    style SaveReading fill:#FFD700
    style CreateNotification fill:#FF6B6B
    style DisplayReport fill:#98D8C8
```

## Data Flow Diagram

```mermaid
flowchart LR
    subgraph Hardware["Hardware Layer"]
        Sensors[Sensors<br/>Voltage & Current]
        Microcontroller[Microcontroller<br/>ESP32/Arduino]
    end
    
    subgraph Network["Network Layer"]
        WiFi[WiFi Connection]
        Internet[Internet/Cloud]
    end
    
    subgraph Backend["Backend Server"]
        API[REST API<br/>Node.js/Express]
        Database[(Database<br/>MySQL/PostgreSQL)]
        MQTT[MQTT Broker<br/>Optional]
    end
    
    subgraph Mobile["Mobile App"]
        ReactNative[React Native<br/>Expo Go]
        UI[User Interface]
    end
    
    Sensors -->|Analog Signals| Microcontroller
    Microcontroller -->|Digital Data| WiFi
    WiFi -->|HTTP/MQTT| Internet
    Internet -->|Data Stream| API
    API -->|Store Data| Database
    API -->|Real-time Updates| ReactNative
    ReactNative -->|Display| UI
    UI -->|User Actions| API
    API -->|Query| Database
    
    style Sensors fill:#FFB6C1
    style Microcontroller fill:#FFB6C1
    style API fill:#87CEEB
    style Database fill:#FFD700
    style ReactNative fill:#98D8C8
```

## IoT Data Collection Flow

```mermaid
sequenceDiagram
    participant H as Hardware Device
    participant API as Backend API
    participant DB as Database
    participant App as Mobile App
    
    H->>API: POST /api/readings<br/>{device_id, voltage, current, power, etc.}
    API->>DB: Validate device_id
    DB-->>API: Device exists & active
    API->>DB: INSERT real_time_readings
    API->>DB: UPDATE appliances.status
    API->>DB: SELECT alert_rules WHERE threshold exceeded
    alt Alert Triggered
        API->>DB: INSERT notifications
    end
    API-->>H: 200 OK
    
    App->>API: GET /api/readings/realtime?device_id=X
    API->>DB: SELECT latest readings
    DB-->>API: Return readings
    API-->>App: JSON response
    App->>App: Update UI
    
    App->>API: GET /api/notifications/unread
    API->>DB: SELECT unread notifications
    DB-->>API: Return notifications
    API-->>App: JSON response
    App->>App: Show notifications
```

## User Registration & Device Setup Flow

```mermaid
flowchart TD
    Start([New User]) --> Register[Register Account]
    Register --> ValidateEmail{Email Valid?}
    ValidateEmail -->|No| EmailError[Show Error]
    EmailError --> Register
    ValidateEmail -->|Yes| HashPassword[Hash Password]
    HashPassword --> SaveUser[Save to users table]
    SaveUser --> Login[Login to App]
    
    Login --> Dashboard[Dashboard]
    Dashboard --> AddDevice[Add Device]
    AddDevice --> EnterSerial[Enter Device Serial Number]
    EnterSerial --> ValidateSerial{Serial Valid?}
    ValidateSerial -->|No| SerialError[Show Error]
    SerialError --> EnterSerial
    ValidateSerial -->|Yes| SaveDevice[Save to devices table]
    SaveDevice --> ScanAppliances[Scan for Appliances]
    ScanAppliances --> DetectAppliances[Detect Connected Appliances]
    DetectAppliances --> ConfigureAppliances[Configure Appliance Names]
    ConfigureAppliances --> SaveAppliances[Save to appliances table]
    SaveAppliances --> StartMonitoring[Start Monitoring]
    
    style Start fill:#90EE90
    style Dashboard fill:#87CEEB
    style StartMonitoring fill:#FFD700
```

## Consumption Report Generation Flow

```mermaid
flowchart TD
    Start([User Requests Report]) --> SelectType{Report Type?}
    SelectType -->|Daily| DailyReport[Daily Report]
    SelectType -->|Weekly| WeeklyReport[Weekly Report]
    SelectType -->|Monthly| MonthlyReport[Monthly Report]
    
    DailyReport --> QueryDaily[Query consumption_summaries<br/>WHERE period_type='daily']
    WeeklyReport --> QueryWeekly[Query consumption_summaries<br/>WHERE period_type='weekly']
    MonthlyReport --> QueryMonthly[Query consumption_summaries<br/>WHERE period_type='monthly']
    
    QueryDaily --> CheckCache{Cached?}
    QueryWeekly --> CheckCache
    QueryMonthly --> CheckCache
    
    CheckCache -->|Yes| ReturnCache[Return Cached Data]
    CheckCache -->|No| AggregateData[Aggregate from real_time_readings]
    
    AggregateData --> GetRates[Get Current electricity_rates]
    GetRates --> CalculateCost[Calculate Total Cost<br/>using rate.peso_per_kwh]
    CalculateCost --> SaveSummary[Save to consumption_summaries<br/>with electricity_rate_id reference]
    SaveSummary --> GenerateChart[Generate Chart Data]
    ReturnCache --> GenerateChart
    
    GenerateChart --> FormatData[Format for Display]
    FormatData --> DisplayReport[Display Report]
    DisplayReport --> ExportOption{Export?}
    ExportOption -->|Yes| ExportPDF[Export PDF]
    ExportOption -->|No| End([End])
    ExportPDF --> End
    
    style Start fill:#90EE90
    style DisplayReport fill:#98D8C8
    style ExportPDF fill:#FFD700
```

