# Draw.io ERD Layout Guide

This guide provides a recommended layout for arranging the 11 database tables in Draw.io for optimal readability and visual organization.

## Recommended Layout Structure

### Layout Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         TOP SECTION                                      │
│                    (User Management)                                     │
│                                                                           │
│  ┌──────────────┐              ┌──────────────────┐                     │
│  │  TBLUSERS    │──────────────│ TBLUSER_SESSIONS │                     │
│  │  (Center)    │              │   (Right)        │                     │
│  └──────────────┘              └──────────────────┘                     │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                    MIDDLE-LEFT SECTION                                   │
│                  (Device & Appliance Management)                         │
│                                                                           │
│  ┌──────────────┐                                                        │
│  │ TBLDEVICES   │                                                        │
│  │              │                                                        │
│  └──────┬───────┘                                                        │
│         │                                                                 │
│         │                                                                 │
│  ┌──────▼───────┐                                                        │
│  │TBLAPPLIANCES │                                                        │
│  └──────────────┘                                                        │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                    MIDDLE-CENTER SECTION                                 │
│                    (Data Collection)                                     │
│                                                                           │
│  ┌────────────────────────────┐                                          │
│  │ TBLREAL_TIME_READINGS      │                                          │
│  │      (Large, Central)      │                                          │
│  └────────────────────────────┘                                          │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                    MIDDLE-RIGHT SECTION                                 │
│                  (Consumption & Billing)                                 │
│                                                                           │
│  ┌──────────────────────┐      ┌──────────────────┐                     │
│  │TBLCONSUMPTION_       │──────│TBLELECTRICITY_   │                     │
│  │  SUMMARIES           │      │  RATES           │                     │
│  └──────────────────────┘      └──────────────────┘                     │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                    BOTTOM-LEFT SECTION                                   │
│                  (Notifications & Alerts)                                 │
│                                                                           │
│  ┌──────────────────┐          ┌──────────────────┐                     │
│  │TBLNOTIFICATIONS  │          │ TBLALERT_RULES   │                     │
│  └──────────────────┘          └──────────────────┘                     │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┘
│                    BOTTOM-RIGHT SECTION                                  │
│                  (Audit & System Config)                                  │
│                                                                           │
│  ┌──────────────────┐          ┌──────────────────┐                     │
│  │ TBLAUDIT_LOGS    │          │TBLSYSTEM_SETTINGS│                     │
│  └──────────────────┘          └──────────────────┘                     │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Detailed Layout Coordinates

### Grid-Based Layout (Recommended)

Use a **grid system** with coordinates for precise positioning:

#### Grid Size: 10x10 units (each unit = ~200px)

### Table Positions

#### **TOP ROW (Y: 0-2)**

1. **TBLUSERS**
   - Position: (3, 0) - Center-top
   - Size: 2 units wide × 1.5 units tall
   - **This is the central hub - place prominently**

2. **TBLUSER_SESSIONS**
   - Position: (6, 0) - Right of users
   - Size: 2 units wide × 1.5 units tall
   - **Connected to TBLUSERS**

---

#### **MIDDLE-LEFT COLUMN (X: 0-2, Y: 3-6)**

3. **TBLDEVICES**
   - Position: (0, 3) - Left side
   - Size: 2 units wide × 1.5 units tall
   - **Connected to TBLUSERS (top)**

4. **TBLAPPLIANCES**
   - Position: (0, 5) - Below devices
   - Size: 2 units wide × 1.5 units tall
   - **Connected to TBLDEVICES (above)**

---

#### **MIDDLE-CENTER (X: 3-5, Y: 3-6)**

5. **TBLREAL_TIME_READINGS**
   - Position: (3, 4) - Center of diagram
   - Size: 2.5 units wide × 2 units tall
   - **Largest table - central position**
   - **Connected to TBLDEVICES (left) and TBLAPPLIANCES (left)**

---

#### **MIDDLE-RIGHT COLUMN (X: 6-8, Y: 3-6)**

6. **TBLCONSUMPTION_SUMMARIES**
   - Position: (6, 3) - Right side, top
   - Size: 2.5 units wide × 2 units tall
   - **Large table - many connections**
   - **Connected to: TBLUSERS, TBLDEVICES, TBLAPPLIANCES, TBLELECTRICITY_RATES**

7. **TBLELECTRICITY_RATES**
   - Position: (6, 5.5) - Right side, below consumption
   - Size: 2.5 units wide × 1.5 units tall
   - **Connected to TBLCONSUMPTION_SUMMARIES (above)**

---

#### **BOTTOM-LEFT (X: 0-2, Y: 7-9)**

8. **TBLNOTIFICATIONS**
   - Position: (0, 7) - Bottom-left
   - Size: 2 units wide × 1.5 units tall
   - **Connected to TBLUSERS (top-center)**

9. **TBLALERT_RULES**
   - Position: (0, 8.5) - Below notifications
   - Size: 2 units wide × 1.5 units tall
   - **Connected to TBLUSERS, TBLDEVICES, TBLAPPLIANCES**

---

#### **BOTTOM-RIGHT (X: 6-8, Y: 7-9)**

10. **TBLAUDIT_LOGS**
    - Position: (6, 7) - Bottom-right
    - Size: 2 units wide × 1.5 units tall
    - **Connected to TBLUSERS (top-center)**

11. **TBLSYSTEM_SETTINGS**
    - Position: (6, 8.5) - Below audit logs
    - Size: 2 units wide × 1.5 units tall
    - **Connected to TBLUSERS (top-center) via created_by and updated_by**

---

## Visual Grouping Strategy

### Color Coding (Optional but Recommended)

1. **User Management** (Blue)
   - TBLUSERS
   - TBLUSER_SESSIONS

2. **Device Management** (Green)
   - TBLDEVICES
   - TBLAPPLIANCES

3. **Data Collection** (Orange)
   - TBLREAL_TIME_READINGS

4. **Consumption & Billing** (Purple)
   - TBLCONSUMPTION_SUMMARIES
   - TBLELECTRICITY_RATES

5. **Notifications & Alerts** (Red)
   - TBLNOTIFICATIONS
   - TBLALERT_RULES

6. **System & Audit** (Gray)
   - TBLAUDIT_LOGS
   - TBLSYSTEM_SETTINGS

---

## Step-by-Step Arrangement Instructions

### Step 1: Place Central Hub
1. **TBLUSERS** - Place at top-center
   - This is the main entity that connects to most tables
   - Make it slightly larger or more prominent

### Step 2: Place User-Related Tables
2. **TBLUSER_SESSIONS** - Place to the right of TBLUSERS
   - Direct connection to users

### Step 3: Place Device Hierarchy (Left Side)
3. **TBLDEVICES** - Place on left side, below users
4. **TBLAPPLIANCES** - Place below devices
   - Shows parent-child relationship vertically

### Step 4: Place Data Collection (Center)
5. **TBLREAL_TIME_READINGS** - Place in center
   - Largest table, many connections
   - Connects to devices and appliances

### Step 5: Place Consumption Tables (Right Side)
6. **TBLCONSUMPTION_SUMMARIES** - Place on right side, middle
7. **TBLELECTRICITY_RATES** - Place below consumption summaries
   - Shows relationship between consumption and rates

### Step 6: Place Notification Tables (Bottom Left)
8. **TBLNOTIFICATIONS** - Bottom-left
9. **TBLALERT_RULES** - Below notifications
   - Both connect to users

### Step 7: Place System Tables (Bottom Right)
10. **TBLAUDIT_LOGS** - Bottom-right
11. **TBLSYSTEM_SETTINGS** - Below audit logs
    - Both connect to users for audit trail

---

## Connection Line Routing Tips

### Minimize Line Crossings

1. **Route from TBLUSERS:**
   - Use curved lines or route around other tables
   - Group connections by direction (left, right, bottom)

2. **Route to TBLCONSUMPTION_SUMMARIES:**
   - This table has many connections
   - Use different line colors or styles for different relationship types
   - Route lines from different sides (top, left, right)

3. **Route from TBLREAL_TIME_READINGS:**
   - Connects to devices and appliances
   - Route lines to the left side

### Line Styles

- **Solid lines** for required relationships (NOT NULL foreign keys)
- **Dashed lines** for optional relationships (nullable foreign keys)
- **Different colors** for different relationship types

---

## Recommended Table Sizes

### Large Tables (More Fields)
- **TBLREAL_TIME_READINGS** - 2.5w × 2h
- **TBLCONSUMPTION_SUMMARIES** - 2.5w × 2h
- **TBLUSERS** - 2w × 1.5h (prominent position)

### Medium Tables
- **TBLDEVICES** - 2w × 1.5h
- **TBLAPPLIANCES** - 2w × 1.5h
- **TBLELECTRICITY_RATES** - 2.5w × 1.5h
- **TBLALERT_RULES** - 2w × 1.5h

### Small Tables
- **TBLUSER_SESSIONS** - 2w × 1.5h
- **TBLNOTIFICATIONS** - 2w × 1.5h
- **TBLAUDIT_LOGS** - 2w × 1.5h
- **TBLSYSTEM_SETTINGS** - 2w × 1.5h

---

## Alternative Layout: Hierarchical Top-Down

If you prefer a top-down hierarchical layout:

```
TBLUSERS (Top Center)
    │
    ├── TBLUSER_SESSIONS (Right)
    │
    ├── TBLDEVICES (Left)
    │   └── TBLAPPLIANCES (Below)
    │       └── TBLREAL_TIME_READINGS (Center)
    │
    ├── TBLCONSUMPTION_SUMMARIES (Right)
    │   └── TBLELECTRICITY_RATES (Below)
    │
    ├── TBLNOTIFICATIONS (Bottom Left)
    ├── TBLALERT_RULES (Bottom Left)
    ├── TBLAUDIT_LOGS (Bottom Right)
    └── TBLSYSTEM_SETTINGS (Bottom Right)
```

---

## Quick Reference: Table Positions

| Table | X Position | Y Position | Group |
|-------|-----------|------------|-------|
| TBLUSERS | Center (3) | Top (0) | User Management |
| TBLUSER_SESSIONS | Right (6) | Top (0) | User Management |
| TBLDEVICES | Left (0) | Middle (3) | Device Management |
| TBLAPPLIANCES | Left (0) | Middle (5) | Device Management |
| TBLREAL_TIME_READINGS | Center (3) | Middle (4) | Data Collection |
| TBLCONSUMPTION_SUMMARIES | Right (6) | Middle (3) | Consumption |
| TBLELECTRICITY_RATES | Right (6) | Middle (5.5) | Consumption |
| TBLNOTIFICATIONS | Left (0) | Bottom (7) | Notifications |
| TBLALERT_RULES | Left (0) | Bottom (8.5) | Notifications |
| TBLAUDIT_LOGS | Right (6) | Bottom (7) | System |
| TBLSYSTEM_SETTINGS | Right (6) | Bottom (8.5) | System |

---

## Tips for Best Results

1. **Start with TBLUSERS** - Place it first as the central hub
2. **Group Related Tables** - Keep related tables close together
3. **Use Alignment** - Align tables in columns/rows for clean look
4. **Minimize Crossings** - Route connection lines to avoid crossing
5. **Use Colors** - Color-code table groups for visual organization
6. **Add Labels** - Label relationship lines with cardinality (1:N, etc.)
7. **Spacing** - Leave enough space between tables for connection lines
8. **Zoom Out** - View entire diagram to ensure balanced layout

---

## Example Draw.io Workflow

1. **Import Mermaid ERD** (from ERD-mermaid-drawio.md)
2. **Arrange Tables** using this layout guide
3. **Adjust Positions** for optimal spacing
4. **Style Tables** with colors/formatting
5. **Route Connections** to minimize crossings
6. **Add Labels** to relationship lines
7. **Export** as PNG/SVG for documentation

---

**Layout Guide Created:** 2026  
**Recommended Layout:** Grid-based with TBLUSERS as central hub  
**Total Tables:** 11 tables organized in 6 logical groups
