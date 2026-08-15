# SafeVoice — Anonymous Safety Intelligence System

SafeVoice is an AI-assisted anonymous safety intelligence platform that helps communities report safety incidents, visualize location-based risk patterns, and improve awareness of potentially unsafe areas.

The platform combines anonymous incident reporting, location-based safety visualization, data-driven safety analytics, emergency SOS support, and authenticated administrator moderation in a single React application.

## 🌐 Live Demo

**Production Application:**  
https://anonymous-safety-intelligence-syste.vercel.app

---

## 🎯 Problem Statement

Many safety incidents remain unreported because people may fear:

- judgment or social consequences
- exposure of their identity
- lack of accessible reporting systems
- uncertainty about unsafe areas

Individual incidents can also remain isolated, making it difficult to identify recurring patterns across locations and time.

SafeVoice addresses this problem by combining anonymous reporting with location-based safety intelligence.

---

## 💡 Solution

SafeVoice allows users to submit safety incidents without directly attaching their personal identity to the report.

Stored reports can be used to:

- analyze incident categories and severity
- visualize reported locations
- identify areas with higher concentrations of incidents
- generate data-derived safety insights
- support administrator moderation
- record emergency SOS events

The goal is to transform individual reports into useful community-level safety information.

---

# 🚀 Key Features

## 1. Anonymous Safety Reporting

Users can submit safety incidents with:

- incident category
- severity
- description
- location
- geographical coordinates when available

Reports are stored in Supabase and can be reviewed through the administrative interface.

---

## 2. Interactive Safety Heatmap

Reports containing valid latitude and longitude coordinates can be displayed on an interactive map.

The heatmap supports:

- location-based incident visualization
- severity-based indicators
- multiple reported locations
- interactive map exploration
- geographical safety awareness

Reports without coordinates can still be stored, but cannot be plotted geographically.

---

## 3. Safety Intelligence Dashboard

The dashboard derives its core statistics from stored application data.

It includes:

- total safety reports
- high-risk reports
- active safety alerts
- incident trends
- category breakdown
- recent reports
- safety insights
- risk indicators

Primary report metrics are derived from application data rather than fixed demonstration numbers.

---

## 4. AI-Assisted Safety Analysis

SafeVoice includes an analysis layer intended to support safety awareness.

The system can assist with:

- incident categorization
- severity analysis
- identifying recurring patterns
- generating safety-oriented insights
- location-based risk awareness

AI-assisted information is presented as decision-support information and does not replace human judgment, law enforcement, or emergency services.

---

## 5. Emergency SOS

The SOS interface provides an emergency alert workflow.

It includes:

- SOS activation
- activation countdown
- available location information
- SOS event storage
- emergency support interface

The current system records SOS events within the application. It does not claim to automatically dispatch police, ambulances, or emergency responders.

---

## 6. Admin Moderation

Administrators have a separate authenticated interface for managing submitted reports.

The admin system supports:

- reviewing reports
- verifying reports
- updating report status
- monitoring safety information
- reviewing incident details
- managing safety alerts

Administrative database operations are protected using authentication and Supabase Row Level Security policies.

---

## 7. Privacy-Focused Design

SafeVoice is designed around anonymous community reporting.

The reporting workflow does not require users to publicly attach their personal identity to an incident report.

Location information is handled separately from personal identity so geographical safety information can be used without unnecessarily exposing the reporter.

---

# 🔐 Access Control

SafeVoice uses separate application flows for public users and administrators.

### Public User

Public users can access:

- Dashboard
- Heatmap
- Report
- SOS
- Help
- Settings

### Administrator

Administrators authenticate through the dedicated admin login flow before accessing administrative functionality.

Database permissions are additionally enforced through Supabase policies rather than relying only on frontend navigation.

---

# 🗺️ System Workflow

```text
User
 │
 ▼
Anonymous Safety Report
 │
 ├── Category
 ├── Severity
 ├── Description
 └── Location / Coordinates
 │
 ▼
Supabase Database
 │
 ├───────────────┬────────────────┐
 ▼               ▼                ▼
Dashboard      Heatmap           Admin
Analytics      Visualization     Moderation
 │               │                │
 └───────────────┴────────────────┘
                 │
                 ▼
        Community Safety Awareness

Moderation
🧰 Tech Stack
Frontend
React

TypeScript

Vite

Tailwind CSS

Framer Motion

Lucide React

Backend & Data
Supabase

PostgreSQL

Supabase Authentication

Supabase Row Level Security (RLS)

Visualization
Interactive geographic visualization

Location-based incident markers

Dashboard analytics

Deployment
Vercel

GitHub

🔒 Security
SafeVoice uses Supabase Row Level Security to protect database operations.

Security measures include:

authenticated administrator access

administrator-specific database policies

anonymous SOS event insertion

restricted administrator report updates

restricted safety alert creation and modification

environment variables for Supabase configuration

.env excluded from version control

The frontend uses the Supabase public anonymous key. Server-side service-role credentials are not included in the frontend application.

📊 Application Modules
Landing Page
Project introduction

Safety-focused messaging

Feature overview

Navigation to application modules

Dashboard
Safety statistics

Incident trends

Category information

Recent reports

Safety alerts

Anonymous Reporting
Multi-step report workflow

Incident category

Severity selection

Description

Location handling

Database submission

Heatmap
Interactive geographic visualization

Incident locations

Safety-related markers

Location-based exploration

SOS
Emergency interface

Countdown workflow

Location handling

SOS event recording

Admin
Authenticated administrator login

Report moderation

Report status management

Safety alert management

Settings
Application settings interface

User-facing configuration options

Help
Platform guidance

Feature explanations

Safety-oriented information

🖼️ Screenshots
Landing Page


Dashboard


Heatmap


Incident Reporting


SOS


⚙️ Local Development
1. Clone the repository
git clone https://github.com/rakshachahar/anonymous-safety-intelligence-system.git
cd anonymous-safety-intelligence-system
2. Install dependencies
npm install
3. Configure environment variables
Create a .env file in the project root:

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
Do not commit the .env file to Git.

4. Start the development server
npm run dev
5. Run production checks
npm run lint
npm run typecheck
npm run build
🚀 Deployment
SafeVoice is deployed using Vercel.

Production URL:

https://anonymous-safety-intelligence-syste.vercel.app

Production Configuration
Framework: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
The following environment variables must be configured in the deployment platform:

VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
⚠️ Current Limitations
SafeVoice is a production-style prototype and should not be treated as a replacement for official emergency or law-enforcement systems.

Current limitations include:

AI-assisted analysis is intended as decision-support functionality

SOS events are recorded by the application and do not automatically dispatch emergency services

emergency response integrations are not connected to external authorities

advanced predictive risk modeling is not yet implemented

safe route optimization is not implemented as a production navigation service

further security auditing would be required before operating at large real-world scale

real-time notification infrastructure is not currently integrated

🔮 Future Scope
Potential future improvements include:

predictive safety risk modeling

real-time safety alerts

community report verification

verified authority integrations

safe route recommendations

multilingual accessibility

advanced geospatial analytics

mobile application support

privacy-preserving analytics

real-time notification infrastructure

advanced AI-powered pattern detection

📌 Example Use Case
Scenario
A user experiences repeated harassment near a public transportation area during late evening hours.

Platform Response
The user submits an anonymous report.

The incident is categorized and assigned a severity level.

Location information is stored when available.

The report becomes available for safety analytics.

The location can contribute to geographic safety visualization.

Administrators can review and moderate the report.

Aggregated information can help identify recurring safety patterns.

The system is intended to improve awareness and support community-level safety intelligence rather than replace official emergency response systems.

❤️ Mission
SafeVoice aims to make anonymous safety reports more visible and useful by transforming individual experiences into community-level safety intelligence.

The project focuses on:

Privacy → Reporting → Intelligence → Awareness → Prevention

👩‍💻 Author
Raksha Chahar

B.Tech AI/ML Engineering Student

GitHub:
https://github.com/rakshachahar

Repository:
https://github.com/rakshachahar/anonymous-safety-intelligence-system