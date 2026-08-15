# SafeVoice — Anonymous Safety Intelligence System

SafeVoice is an AI-powered anonymous safety intelligence platform designed to help communities report safety incidents, visualize risk patterns, and improve awareness of potentially unsafe areas.

The platform combines anonymous incident reporting, location-based safety visualization, AI-assisted risk analysis, emergency SOS support, and administrator moderation in a single web application.

## 🌐 Live Demo

**Live Application:**  
https://anonymous-safety-int-zx3y.bolt.host

---

## 🎯 Problem Statement

Many safety incidents remain unreported because people may fear:

- judgment or social consequences
- exposure of their identity
- lack of accessible reporting systems
- uncertainty about where unsafe patterns are occurring

Individual incidents can also remain isolated, making it difficult to identify recurring safety patterns across locations and time.

SafeVoice addresses this problem by providing an anonymous reporting system combined with data-driven safety intelligence.

---

## 💡 Solution

SafeVoice allows users to submit safety incidents without directly attaching personal identity information to the report.

Submitted reports can be used to:

- analyze incident categories and severity
- visualize incident locations on a heatmap
- identify high-risk areas
- generate safety insights from stored data
- support administrator moderation
- provide emergency SOS functionality

The goal is to turn individual anonymous reports into useful community-level safety information.

---

# 🚀 Key Features

## 1. Anonymous Safety Reporting

Users can submit safety incidents with information such as:

- incident category
- severity
- description
- location
- geographical coordinates when available

Reports are stored in the SafeVoice database and can be reviewed through the administrative interface.

---

## 2. Location-Based Safety Heatmap

The platform visualizes safety reports geographically.

Reports containing latitude and longitude can appear on the interactive map, allowing users to identify areas with reported incidents.

The heatmap supports:

- location-based incident visualization
- severity indicators
- multiple incident locations
- interactive map exploration

---

## 3. Safety Intelligence Dashboard

The dashboard provides analytics based on stored safety reports.

It includes:

- total safety reports
- high-risk reports
- active alerts
- safe areas
- incident trends
- category breakdown
- recent reports
- active safety alerts
- data-derived safety insights

Dashboard statistics are generated from the application's stored data rather than relying on fixed demonstration numbers.

---

## 4. AI-Assisted Safety Analysis

SafeVoice includes an AI analysis layer designed to extract useful information from reported incidents.

The analysis can support:

- incident categorization
- risk scoring
- safety insights
- identification of recurring patterns
- location-based risk awareness

AI-generated information is presented as decision-support information rather than replacing human judgment or official emergency services.

---

## 5. Emergency SOS

SafeVoice provides an emergency SOS interface for urgent situations.

The SOS workflow includes:

- emergency alert activation
- countdown before activation
- location information when available
- storage of SOS events
- emergency support interface

The system records SOS events for the application rather than claiming to automatically dispatch real-world emergency services.

---

## 6. Admin Moderation

Administrators have a separate authenticated interface for managing submitted reports.

The admin dashboard supports:

- reviewing reports
- verifying reports
- updating report status
- monitoring safety information
- reviewing reported incidents

Administrative actions are protected through authenticated access and database permissions.

---

## 7. Privacy-Focused Design

SafeVoice is designed around anonymous community reporting.

The reporting experience does not require users to publicly attach their personal identity to an incident report.

Location sharing is treated separately from personal identity, allowing geographical safety information to be used without unnecessarily exposing the reporter.

---

# 🔄 System Workflow

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
  ▼
Safety Analysis
  │
  ├── Risk Score
  ├── Category Analysis
  └── Safety Insights
  │
  ├───────────────┬───────────────┐
  ▼               ▼               ▼
Dashboard       Heatmap          Admin
Analytics       Visualization   Moderation
  │
  ▼
Community Safety Awareness
