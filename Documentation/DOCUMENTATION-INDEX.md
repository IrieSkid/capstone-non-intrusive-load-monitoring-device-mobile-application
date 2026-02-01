# NILM Project - Documentation Index

Complete guide to all project documentation organized by category.

## 📋 Quick Navigation

- [Database Design](#database-design)
- [Thesis Documentation](#thesis-documentation)
- [Mobile App Prototype](#mobile-app-prototype)
- [Getting Started](#getting-started)

---

## 🗄️ Database Design

**Location:** `Documentation/database-design/`

### Essential Files

| File | Purpose | When to Use |
|------|---------|-------------|
| **[README.md](database-design/README.md)** | Main database documentation | Start here for overview |
| **[ERD.md](database-design/ERD.md)** | Entity Relationship Diagram | Understanding relationships |
| **[schema.sql](database-design/schema.sql)** | MySQL schema | SQL implementation |
| **[schema-postgresql.sql](database-design/schema-postgresql.sql)** | PostgreSQL schema | SQL implementation |
| **[schema-firestore.md](database-design/schema-firestore.md)** | Firestore schema ⭐ | **Recommended for NILM** |

### Design Documentation

| File | Purpose |
|------|---------|
| **[DESIGN-DECISIONS.md](database-design/DESIGN-DECISIONS.md)** | All design decisions and analysis |
| **[EXECUTIVE-SUMMARY.md](database-design/EXECUTIVE-SUMMARY.md)** | Summary for initial paper submission |
| **[CAPSTONE-ASSESSMENT.md](database-design/CAPSTONE-ASSESSMENT.md)** | Database design assessment |
| **[system-flowchart.md](database-design/system-flowchart.md)** | System flowcharts and data flow |

### Implementation Guides

| File | Purpose |
|------|---------|
| **[API-endpoints-reference.md](database-design/API-endpoints-reference.md)** | Complete REST API documentation |
| **[IOT-COMMUNICATION-GUIDE.md](database-design/IOT-COMMUNICATION-GUIDE.md)** | Hardware integration guide ⭐ |
| **[tech-stack-recommendations.md](database-design/tech-stack-recommendations.md)** | Technology stack recommendations |
| **[FIRESTORE-DECISION.md](database-design/FIRESTORE-DECISION.md)** | Rationale for choosing Firestore |

### ERD Import Files (Draw.io)

| File | Purpose |
|------|---------|
| **[ERD-drawio-import.sql](database-design/ERD-drawio-import.sql)** | Full SQL schema for Draw.io |
| **[ERD-drawio-simplified.sql](database-design/ERD-drawio-simplified.sql)** | Simplified SQL (compatibility) |
| **[DRAWIO-IMPORT-INSTRUCTIONS.md](database-design/DRAWIO-IMPORT-INSTRUCTIONS.md)** | Step-by-step import guide |

---

## 📚 Thesis Documentation

**Location:** `Documentation/thesis-documentation/`

### Thesis Chapters

| File | Purpose |
|------|---------|
| **[CHAPTER-1-IMPROVED.md](thesis-documentation/CHAPTER-1-IMPROVED.md)** | Problem and Introduction |
| **[CHAPTER-2-LITERATURE-REVIEW.md](thesis-documentation/CHAPTER-2-LITERATURE-REVIEW.md)** | Literature Review |
| **[CHAPTER-3-RESEARCH-DESIGN.md](thesis-documentation/CHAPTER-3-RESEARCH-DESIGN.md)** | Research Design and Methodology |
| **[CHAPTER-4-ANALYSIS-FRAMEWORK.md](thesis-documentation/CHAPTER-4-ANALYSIS-FRAMEWORK.md)** | Analysis Framework |

### Research Materials

| File | Purpose |
|------|---------|
| **[THESIS-STRUCTURE-GUIDE.md](thesis-documentation/THESIS-STRUCTURE-GUIDE.md)** | Complete thesis structure guide |
| **[SURVEY-QUESTIONNAIRES.md](thesis-documentation/SURVEY-QUESTIONNAIRES.md)** | Research instruments |
| **[USER-INTERVIEW-GUIDE.md](thesis-documentation/USER-INTERVIEW-GUIDE.md)** | User interview guide |
| **[ACCURACY-TESTING-PROTOCOL.md](thesis-documentation/ACCURACY-TESTING-PROTOCOL.md)** | Testing protocol |

### UI/UX Documentation

| File | Purpose |
|------|---------|
| **[MOBILE-APP-UI-SPECIFICATION.md](thesis-documentation/MOBILE-APP-UI-SPECIFICATION.md)** | Complete UI/UX specification |

---

## 📱 Mobile App Prototype

**Location:** `Documentation/mobile-app-prototype/`

### Prototype Files

| File | Purpose |
|------|---------|
| **[index.html](mobile-app-prototype/index.html)** | Prototype index page |
| **[styles.css](mobile-app-prototype/styles.css)** | Prototype styles |
| **[screens/](mobile-app-prototype/screens/)** | Individual screen mockups (19 screens) |

---

## 🚀 Getting Started

### For Developers

1. **Start with:** [Database Design README](database-design/README.md)
2. **Review:** [ERD](database-design/ERD.md) and [Design Decisions](database-design/DESIGN-DECISIONS.md)
3. **Choose Database:** [Firestore](database-design/schema-firestore.md) (recommended) or [SQL](database-design/schema.sql)
4. **Implement API:** [API Endpoints Reference](database-design/API-endpoints-reference.md)
5. **Integrate Hardware:** [IoT Communication Guide](database-design/IOT-COMMUNICATION-GUIDE.md)

### For Researchers

1. **Start with:** [Thesis Structure Guide](thesis-documentation/THESIS-STRUCTURE-GUIDE.md)
2. **Review Chapters:** [Chapter 1](thesis-documentation/CHAPTER-1-IMPROVED.md) through [Chapter 4](thesis-documentation/CHAPTER-4-ANALYSIS-FRAMEWORK.md)
3. **Research Materials:** [Survey Questionnaires](thesis-documentation/SURVEY-QUESTIONNAIRES.md) and [User Interview Guide](thesis-documentation/USER-INTERVIEW-GUIDE.md)
4. **Testing:** [Accuracy Testing Protocol](thesis-documentation/ACCURACY-TESTING-PROTOCOL.md)

### For Designers

1. **UI Specification:** [Mobile App UI Specification](thesis-documentation/MOBILE-APP-UI-SPECIFICATION.md)
2. **Prototypes:** [Mobile App Prototype](mobile-app-prototype/)

---

## 📊 Documentation Statistics

- **Database Design Files:** 20+ files
- **Thesis Documentation:** 9 files
- **Prototype Files:** 21 files (HTML/CSS)
- **Total Documentation:** 50+ files

---

## 🔍 Finding What You Need

### By Task

| Task | Documentation |
|------|--------------|
| **Set up database** | [Database Design README](database-design/README.md) |
| **Understand relationships** | [ERD](database-design/ERD.md) |
| **Implement API** | [API Endpoints](database-design/API-endpoints-reference.md) |
| **Integrate hardware** | [IoT Guide](database-design/IOT-COMMUNICATION-GUIDE.md) |
| **Write thesis** | [Thesis Structure Guide](thesis-documentation/THESIS-STRUCTURE-GUIDE.md) |
| **Design UI** | [UI Specification](thesis-documentation/MOBILE-APP-UI-SPECIFICATION.md) |

### By Role

| Role | Key Documents |
|------|---------------|
| **Developer** | ERD, Schemas, API Docs, IoT Guide |
| **Researcher** | Thesis Chapters, Survey Questionnaires |
| **Designer** | UI Specification, Prototypes |
| **Project Manager** | Executive Summary, Capstone Assessment |

---

## 📝 Documentation Standards

- **Markdown Format:** All documentation uses Markdown
- **Mermaid Diagrams:** ERD and flowcharts use Mermaid notation
- **Code Examples:** SQL, JavaScript, and other code examples included
- **Version Control:** All documentation is version-controlled in Git

---

## 🔗 Related Resources

- **[Main Project README](../README.md)** - Project overview
- **[Project Structure](../PROJECT-STRUCTURE.md)** - Folder structure guide
- **[GitHub Repository](https://github.com/IrieSkid/capstone-non-intrusive-load-monitoring-device-mobile-application)** - Source code

---

**Last Updated:** 2026  
**Status:** ✅ Complete and Organized
