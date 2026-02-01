# CHAPTER 3: RESEARCH DESIGN

## Research Design

This study employs a **mixed-methods research design** combining:
- **Development Research**: Design and development of the NILM system
- **Experimental Research**: Testing and evaluation of system performance
- **Descriptive Research**: Analysis of user requirements and system usability

The research follows a **System Development Life Cycle (SDLC)** approach, specifically the **Agile/Iterative Model**, allowing for continuous refinement based on testing and user feedback.

---

## Respondents and Sampling Technique

### Target Respondents

**Primary Users (Tenants)**
- **Population**: Residents in boarding houses and rental units in Cagayan de Oro City
- **Sample Size**: 30-50 tenants
- **Sampling Technique**: Purposive sampling
- **Criteria**:
  - Currently residing in boarding house or rental unit
  - Uses common household appliances (refrigerator, air conditioning, television, etc.)
  - Has access to smartphone (Android or iOS)
  - Willing to participate in system testing for 2-4 weeks

**Secondary Users (Landlords/Administrators)**
- **Population**: Property owners and administrators managing rental properties
- **Sample Size**: 5-10 landlords
- **Sampling Technique**: Purposive sampling
- **Criteria**:
  - Manages rental property with 3+ units
  - Interested in energy consumption monitoring
  - Willing to participate in system evaluation

**Technical Evaluators**
- **Population**: IT professionals and electrical engineers
- **Sample Size**: 5-10 experts
- **Sampling Technique**: Purposive sampling
- **Criteria**:
  - Background in software development or electrical engineering
  - Experience with IoT systems or energy monitoring
  - Willing to evaluate system technical aspects

### Sampling Justification

**Purposive Sampling** is appropriate because:
- Specific user characteristics are required (tenants, landlords)
- Technical expertise needed for system evaluation
- Limited time and resources for random sampling
- Need for users with actual energy monitoring needs

---

## Research Locale

### Primary Location
**Cagayan de Oro City, Philippines**
- Urban residential areas with boarding houses and rental units
- Areas with stable internet connectivity (required for IoT communication)
- Properties with typical household appliances

### Specific Sites
1. **Selected Boarding Houses**: 3-5 boarding houses with 5-10 units each
2. **Rental Apartments**: 2-3 apartment buildings with multiple units
3. **University Dormitories** (if applicable): Student housing facilities

### Selection Criteria for Research Sites
- Willingness of property owner to participate
- Stable WiFi/internet connection
- Typical residential electrical setup (220V, single-phase)
- Mix of appliance types (AC, refrigerator, TV, etc.)
- Safety and security considerations

---

## Research Instruments

### 1. System Requirements Questionnaire
**Purpose**: Gather user requirements and expectations
**Content**:
- Demographics (age, occupation, rental status)
- Current energy monitoring practices
- Desired features and functionalities
- Technical preferences (mobile app features)
- Privacy and data concerns

### 2. System Usability Scale (SUS)
**Purpose**: Evaluate system usability
**Content**: Standard 10-item SUS questionnaire
- System ease of use
- System complexity
- User confidence
- Learning curve
- Overall satisfaction

**Scoring**: 0-100 scale (higher = better usability)

### 3. ISO/IEC 25010 Evaluation Checklist
**Purpose**: Evaluate software quality characteristics
**Content**: Evaluation of:
- **Functional Suitability**: Completeness, correctness, appropriateness
- **Performance Efficiency**: Time behavior, resource utilization
- **Compatibility**: Interoperability, co-existence
- **Usability**: Appropriateness, learnability, user error protection
- **Reliability**: Maturity, availability, fault tolerance
- **Security**: Confidentiality, integrity, authenticity
- **Maintainability**: Modularity, reusability, analyzability
- **Portability**: Adaptability, installability, replaceability

### 4. Accuracy Testing Protocol
**Purpose**: Measure system accuracy in appliance identification
**Content**:
- Controlled testing scenarios
- Known appliance power consumption
- Comparison with actual measurements
- Error rate calculation
- Appliance classification accuracy

### 5. Technical Performance Evaluation Form
**Purpose**: Assess technical system performance
**Content**:
- Data transmission reliability
- Real-time update latency
- System response time
- Error handling
- Data storage efficiency

### 6. User Interview Guide
**Purpose**: Gather qualitative feedback
**Content**:
- Open-ended questions about user experience
- Suggestions for improvement
- Challenges encountered
- Perceived benefits
- Recommendations

### 7. System Logs and Analytics
**Purpose**: Collect quantitative system performance data
**Content**:
- API response times
- Data transmission success rates
- Error frequencies
- User interaction patterns
- System uptime/downtime

---

## System Development Life Cycle (SDLC)

The development follows an **Agile/Iterative SDLC Model** with the following phases:

### Phase 1: Planning Phase

**Objectives**:
- Define project scope and objectives
- Identify stakeholders and requirements
- Establish project timeline
- Allocate resources
- Define success criteria

**Activities**:
- Literature review and technology research
- Stakeholder meetings (tenants, landlords)
- Technology stack selection (Firebase, React Native, ESP32)
- Project planning and scheduling
- Risk assessment

**Deliverables**:
- Project plan document
- Requirements specification
- Technology stack documentation
- Risk management plan

**Timeline**: 2-3 weeks

---

### Phase 2: Requirements Gathering Phase

**Objectives**:
- Collect user requirements
- Define functional and non-functional requirements
- Document system constraints
- Establish acceptance criteria

**Activities**:
- User surveys and questionnaires
- Stakeholder interviews
- Use case development
- Requirement prioritization
- Requirements validation

**Deliverables**:
- Software Requirements Specification (SRS)
- Use case diagrams
- User stories
- Functional requirements document
- Non-functional requirements document

**Key Requirements Identified**:

**Functional Requirements**:
1. User authentication and role-based access (tenant, landlord, admin)
2. Real-time energy monitoring (voltage, current, power, energy)
3. Appliance identification and classification (ON/OFF status)
4. Historical consumption data (daily, weekly, monthly)
5. Energy cost estimation
6. Alerts and notifications
7. Data visualization (charts, graphs)
8. Report generation (PDF export)

**Non-Functional Requirements**:
1. Response time < 2 seconds for real-time updates
2. System availability > 95%
3. Data accuracy > 90% for appliance identification
4. Mobile app compatibility (iOS and Android)
5. Secure data transmission (HTTPS)
6. Scalable architecture (support 100+ devices)
7. User-friendly interface (SUS score > 70)

**Timeline**: 2-3 weeks

---

### Phase 3: Analysis and Design Phase

**Objectives**:
- Design system architecture
- Create database schema
- Design user interface
- Plan system integration
- Define API specifications

**Activities**:
- System architecture design
- Database design (ERD creation)
- UI/UX wireframing
- API endpoint design
- Integration planning
- Security design

**Deliverables**:
- System Architecture Diagram
- Entity Relationship Diagram (ERD)
- Database Schema
- UI/UX Mockups
- API Documentation
- System Flow Diagrams
- Security Design Document

**Design Decisions**:

**System Architecture**:
- **Frontend**: React Native + Expo (mobile app)
- **Backend**: Firebase Cloud Functions (serverless)
- **Database**: Firebase Firestore (NoSQL)
- **Authentication**: Firebase Authentication
- **Real-time**: Firestore real-time listeners
- **Hardware**: ESP32 microcontroller with sensors

**Database Design**:
- 11 core tables (users, devices, appliances, readings, etc.)
- Normalized structure (3NF)
- Optimized for time-series data
- Audit logging for compliance

**UI/UX Design**:
- Material Design principles
- Intuitive navigation
- Real-time data visualization
- Responsive layouts
- Accessible design

**Timeline**: 3-4 weeks

---

### Phase 4: Development Phase

**Objectives**:
- Implement system components
- Integrate hardware and software
- Develop mobile application
- Create cloud functions
- Implement database

**Activities**:
- Firebase project setup
- Firestore database creation
- Cloud Functions development
- Mobile app development
- Hardware programming (Arduino/ESP32)
- API integration
- Real-time data synchronization
- Testing during development

**Development Approach**:
- **Agile Methodology**: 2-week sprints
- **Version Control**: Git + GitHub
- **Code Review**: Peer review process
- **Continuous Testing**: Unit and integration testing

**Component Development**:

**1. Database Setup** (Week 1-2)
- Create Firestore collections
- Configure security rules
- Set up indexes
- Seed initial data

**2. Cloud Functions** (Week 2-3)
- IoT data endpoint (`submitReading`)
- Data validation and processing
- Consumption summary generation
- Alert checking logic

**3. Mobile Application** (Week 3-6)
- Authentication screens
- Dashboard with real-time data
- Device management
- Consumption reports
- Charts and visualizations
- Settings and alerts

**4. Hardware Integration** (Week 4-5)
- ESP32 programming
- Sensor calibration
- HTTP communication
- Error handling
- Testing with actual appliances

**5. Integration and Testing** (Week 6-7)
- End-to-end integration
- Real-time synchronization testing
- Performance optimization
- Bug fixes

**Deliverables**:
- Functional mobile application
- Deployed cloud functions
- Working hardware prototype
- Integrated system
- Source code documentation

**Timeline**: 6-8 weeks

---

### Phase 5: Testing and Evaluation Phase

**Objectives**:
- Verify system functionality
- Evaluate system performance
- Assess user satisfaction
- Measure accuracy and reliability
- Identify improvements

**Testing Types**:

**1. Unit Testing**
- Individual component testing
- Function validation
- Error handling verification

**2. Integration Testing**
- Hardware-software integration
- Mobile app - cloud integration
- Real-time data flow testing

**3. System Testing**
- End-to-end functionality
- Performance under load
- Error recovery
- Security testing

**4. User Acceptance Testing (UAT)**
- Real-world deployment
- User feedback collection
- Usability evaluation
- SUS questionnaire administration

**5. Accuracy Testing**
- Appliance identification accuracy
- Power measurement accuracy
- Energy calculation verification
- Comparison with actual meters

**Evaluation Methods**:

**Quantitative Evaluation**:
- System Usability Scale (SUS) - Target: >70
- ISO/IEC 25010 Quality Metrics
- Accuracy measurements (Target: >90%)
- Performance metrics (response time, uptime)
- Error rates

**Qualitative Evaluation**:
- User interviews
- Expert reviews
- Observation sessions
- Feedback analysis

**Deliverables**:
- Test results and reports
- Evaluation findings
- User feedback summary
- Improvement recommendations
- System documentation

**Timeline**: 3-4 weeks

---

### Phase 6: Deployment Phase

**Objectives**:
- Deploy system to production environment
- Train end users
- Monitor system performance
- Collect production data
- Document deployment

**Activities**:
- Production Firebase setup
- Mobile app distribution (Expo Go or app stores)
- Hardware installation in test sites
- User training sessions
- System monitoring
- Performance tracking

**Deployment Strategy**:
- **Pilot Deployment**: Limited sites (2-3 properties)
- **Gradual Rollout**: Expand based on pilot results
- **Monitoring**: Continuous performance monitoring
- **Support**: User support and troubleshooting

**Deliverables**:
- Deployed production system
- User training materials
- Deployment documentation
- Monitoring dashboard
- Support procedures

**Timeline**: 2-3 weeks

---

## Ethical Considerations

### Data Privacy and Protection

**Compliance with Data Privacy Act (RA 10173)**:
- **Informed Consent**: All participants must provide written consent
- **Data Minimization**: Collect only necessary data
- **Purpose Limitation**: Use data only for stated research purposes
- **Data Security**: Implement encryption and secure storage
- **Access Control**: Role-based access (tenant, landlord, admin)
- **Data Retention**: Define data retention period
- **Right to Access**: Users can access their data
- **Right to Deletion**: Users can request data deletion

**Implementation**:
- Privacy policy in mobile app
- Consent forms for all participants
- Secure data transmission (HTTPS)
- Encrypted data storage
- Access logging (audit logs)
- Regular security audits

### Research Ethics

**Informed Consent**:
- Clear explanation of research purpose
- Voluntary participation
- Right to withdraw
- Confidentiality assurance
- Contact information for questions

**Confidentiality**:
- Anonymize user data in publications
- Secure data storage
- Limited access to personal information
- Data sharing only with consent

**Risk Management**:
- Minimal risk to participants
- No physical harm
- Data breach prevention
- System failure contingency plans

**Institutional Review**:
- Submit to institutional ethics committee (if required)
- Follow university research guidelines
- Obtain necessary approvals

### Technical Ethics

**System Reliability**:
- Accurate energy measurements
- Reliable appliance identification
- Transparent system limitations
- Error handling and recovery

**User Safety**:
- Electrical safety in hardware installation
- Clear safety instructions
- Professional installation guidance
- Emergency procedures

**Intellectual Property**:
- Acknowledge all sources
- Proper citation of technologies used
- Respect open-source licenses
- Document original contributions

---

## Research Timeline

### Overall Timeline: 16-20 weeks

| Phase | Duration | Weeks |
|-------|----------|-------|
| Planning | 2-3 weeks | 1-3 |
| Requirements Gathering | 2-3 weeks | 3-6 |
| Analysis and Design | 3-4 weeks | 6-10 |
| Development | 6-8 weeks | 10-18 |
| Testing and Evaluation | 3-4 weeks | 18-22 |
| Deployment | 2-3 weeks | 22-25 |
| **Total** | **18-25 weeks** | **~6 months** |

---

## Success Criteria

### Technical Success Criteria:
- ✅ System functional requirements met (100%)
- ✅ Appliance identification accuracy > 90%
- ✅ Real-time data update latency < 2 seconds
- ✅ System uptime > 95%
- ✅ Mobile app compatibility (iOS and Android)

### User Acceptance Criteria:
- ✅ SUS score > 70 (above average usability)
- ✅ User satisfaction > 80% (from surveys)
- ✅ Positive feedback from 80%+ of users
- ✅ System meets user requirements

### Research Success Criteria:
- ✅ System successfully developed and deployed
- ✅ Evaluation completed with valid results
- ✅ Documentation complete and comprehensive
- ✅ Thesis requirements met

---

**Note**: This chapter should be customized based on your specific research timeline, available resources, and institutional requirements.

