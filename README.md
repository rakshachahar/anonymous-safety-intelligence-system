# 🛡️ SafeVoice — Anonymous Safety Intelligence System

A privacy-focused web application for **anonymously reporting safety incidents and transforming community reports into useful, location-based safety intelligence**.

SafeVoice combines anonymous incident reporting, safety analytics, geographic visualization, emergency SOS support, and administrator moderation into a single platform.

🌐 **Live Demo:**
https://anonymous-safety-intelligence-syste.vercel.app/

---

## 🎯 Why SafeVoice?

Many safety incidents go unreported because people may be uncomfortable revealing their identity, unsure where to report an incident, or unaware of recurring safety patterns in their area.

SafeVoice focuses on a simple idea:

> **Make safety reporting easier, keep it privacy-focused, and turn individual reports into useful community-level information.**

Instead of treating every incident as an isolated event, SafeVoice provides a way to aggregate reports and visualize broader safety patterns.

---

## 🚀 Key Features

### 📝 Anonymous Incident Reporting

Users can submit safety incidents without publicly identifying themselves.

A report can include:

* Incident category
* Severity
* Description
* Location
* Geographic coordinates when available

Submitted reports are stored in Supabase and can be reviewed through the administrator interface.

---

### 📍 Safety Heatmap

Reports containing valid geographic coordinates can be displayed on an interactive map.

This allows users and administrators to identify areas where reported incidents are concentrated and understand geographic safety patterns.

The heatmap is based on **actual stored report data**, rather than hardcoded demonstration values.

---

### 📊 Safety Dashboard

The dashboard provides an overview of safety-related application data.

It includes:

* Total reports
* High-risk reports
* Safety alerts
* Incident trends
* Category breakdown
* Recent reports
* Risk indicators

The displayed statistics are derived from the application's stored data.

---

### 🚨 SOS Support

SafeVoice includes an SOS workflow for recording emergency events.

The workflow provides:

* SOS activation
* Countdown interface
* Available location information
* SOS event recording

**Important:** SafeVoice does not automatically contact police, ambulances, or other emergency services.

The SOS functionality should therefore **not be considered a replacement for official emergency services**.

---

### 🔐 Admin Moderation

Administrators can securely access the management interface to review submitted reports and manage safety-related information.

Administrator access is separated from normal user functionality and protected using authentication and database-level security controls.

---

## 🧠 Problem Statement

Safety incidents often remain invisible at the community level because individual reports are scattered across different channels or never submitted at all.

Traditional reporting systems can also discourage users when they require personal identification or complicated reporting processes.

At the same time, raw incident reports are difficult to interpret without analytics and geographic context.

SafeVoice addresses these problems by combining:

**Anonymous Reporting → Structured Data → Analytics → Geographic Intelligence → Community Awareness**

---

## ⚙️ How It Works

### 1. Submit a Report

A user submits an incident through the reporting interface.

### 2. Store Structured Information

The application stores the incident details, severity, category, description, and available location information in Supabase.

### 3. Process Report Data

Stored reports are used to calculate dashboard statistics, trends, risk indicators, and category distributions.

### 4. Visualize Geographic Patterns

Reports containing coordinates can be displayed on the safety heatmap.

### 5. Monitor Through Admin Interface

Authorized administrators can review and moderate reports through the protected admin interface.

### 6. Record SOS Events

When the SOS workflow is activated, the event and available location information can be recorded for application-level tracking.

---

## 🏗️ Architecture

```text
                         ┌──────────────────────┐
                         │      SafeVoice       │
                         │      Web Client      │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ React + TypeScript   │
                         │        + Vite        │
                         └──────────┬───────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
        ┌───────────┐        ┌───────────┐        ┌────────────┐
        │  Reports  │        │    SOS    │        │ Analytics  │
        └─────┬─────┘        └─────┬─────┘        └──────┬─────┘
              │                    │                     │
              └────────────────────┼─────────────────────┘
                                   ▼
                         ┌──────────────────────┐
                         │       Supabase       │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
              PostgreSQL          Auth             RLS
                    │               │               │
                    └───────────────┼───────────────┘
                                    ▼
                         Safety Intelligence
                                    │
                         ┌──────────┴──────────┐
                         ▼                     ▼
                    Dashboard              Heatmap
```

---

## 🖥️ Application Modules

| Module        | Purpose                                                 |
| ------------- | ------------------------------------------------------- |
| **Landing**   | Introduces SafeVoice and its purpose                    |
| **Dashboard** | Displays safety statistics, trends, and risk indicators |
| **Report**    | Allows anonymous incident submission                    |
| **Heatmap**   | Visualizes reported incidents geographically            |
| **SOS**       | Provides the emergency-event workflow                   |
| **Admin**     | Provides authenticated report moderation                |
| **Settings**  | Provides application settings                           |
| **Help**      | Provides platform and safety guidance                   |

---

## 🧰 Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Framer Motion
* Lucide React

### Backend & Database

* Supabase
* PostgreSQL
* Supabase Authentication
* Supabase Row Level Security

### Deployment

* Vercel
* GitHub

---

## 🔒 Privacy & Security

SafeVoice is designed around privacy-conscious community reporting.

Security considerations include:

* Separate administrator authentication
* Supabase Row Level Security
* Restricted administrator database operations
* Anonymous SOS event support
* Environment variables for Supabase configuration
* `.env` excluded from version control
* No Supabase service-role credentials exposed in the frontend

The application uses the Supabase public client key on the frontend.

Sensitive server-side credentials are not exposed through the client application.

> **Note:** Anonymous reporting does not guarantee complete anonymity against every possible infrastructure, network, or legal-level identification mechanism. Privacy claims should therefore be understood within the application's implemented architecture.

---

## 📸 Screenshots

### Landing Page

Screenshots are available in the repository's project assets.

### Dashboard

The dashboard presents report statistics, trends, alerts, and risk indicators.

### Safety Heatmap

The heatmap visualizes reports with available geographic coordinates.

### Incident Reporting

Users can submit structured safety reports without publicly identifying themselves.

### SOS

The SOS interface provides the emergency-event workflow and countdown experience.

---

## 🛠️ Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/rakshachahar/anonymous-safety-intelligence-system.git

cd anonymous-safety-intelligence-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Do not commit `.env` or other secret credentials to Git.

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available through the local development URL provided by Vite.

### 5. Verify the Project

Run the available project checks:

```bash
npm run lint
npm run typecheck
npm run build
```

---

## 📂 Project Structure

```text
anonymous-safety-intelligence-system/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── lib/
│   ├── hooks/
│   ├── services/
│   └── ...
│
├── public/
│
├── .env
├── .gitignore
├── package.json
├── vite.config.*
├── tailwind.config.*
└── README.md
```

> The exact folder structure may evolve as the project is developed.

---

## 🚀 Deployment

SafeVoice is deployed using **Vercel**.

🌐 **Production Application:**
https://anonymous-safety-intelligence-syste.vercel.app/

### Deployment Configuration

```text
Framework: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Required Environment Variables

```env
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

---

## 📌 Example Use Case

A person experiences repeated harassment around a particular location.

Instead of publicly identifying themselves, they can submit an anonymous report containing:

* What happened
* Incident category
* Severity
* Description
* Location
* Available geographic information

The report can then contribute to the application's analytics and geographic visualization.

If multiple reports are submitted around the same area, the system can make that pattern easier to identify.

This turns isolated reports into **community-level safety intelligence**.

---

## 📊 Data Flow

```text
User
 │
 ▼
Incident Report
 │
 ├── Category
 ├── Severity
 ├── Description
 ├── Location
 └── Coordinates
 │
 ▼
Supabase PostgreSQL
 │
 ├───────────────┬─────────────────┐
 ▼               ▼                 ▼
Dashboard      Heatmap          Admin Review
 │               │                 │
 ▼               ▼                 ▼
Statistics   Geographic       Moderation
Trends       Patterns          & Management
```

---

## ⚠️ Limitations

SafeVoice is currently a production-style project with several limitations:

* SOS events are recorded by the application but do not automatically dispatch emergency services.
* Safety insights depend on the quality and quantity of submitted reports.
* Reports without coordinates cannot be displayed on the geographic visualization.
* The current system does not implement advanced predictive risk modelling.
* External authority and emergency-service integrations are not connected.
* Anonymous reporting does not guarantee absolute anonymity at every infrastructure layer.
* Large-scale deployment would require additional security, privacy, reliability, and compliance auditing.
* Geographic patterns may be misleading when report volume is low or reporting behavior is uneven across locations.

---

## 🔮 Future Improvements

Potential extensions include:

* 🤖 Predictive safety-risk modelling
* 🔔 Real-time community alerts
* ✅ Report verification mechanisms
* 🌐 Multilingual reporting
* 🗺️ Safe-route recommendations
* 📍 Advanced geospatial analytics
* 📱 Dedicated mobile application
* 🔐 Privacy-preserving analytics
* 🏛️ Integration with verified civic services
* 🧠 AI-assisted incident classification
* 🔎 Advanced pattern detection
* 📈 Time-based risk forecasting

---

## 🎓 Project Focus

SafeVoice explores how modern web technologies, structured incident reporting, geographic visualization, authentication, database security, and data-driven analytics can be combined to create more privacy-conscious community safety tools.

### Core Concept

```text
Privacy
   ↓
Anonymous Reporting
   ↓
Structured Data
   ↓
Safety Intelligence
   ↓
Community Awareness
```

---

## 👩‍💻 Author

**Raksha Chahar**

B.Tech AI/ML Engineering Student

**GitHub:**
https://github.com/rakshachahar

**Repository:**
https://github.com/rakshachahar/anonymous-safety-intelligence-system

---

## 📄 License

This project is licensed under the MIT License.

See the [LICENSE](LICENSE) file for details.
