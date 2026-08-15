# SafeVoice — Anonymous Safety Intelligence System

SafeVoice is an AI-assisted anonymous safety intelligence platform that helps communities report safety incidents, visualize location-based risk patterns, and improve awareness of potentially unsafe areas.

The platform combines anonymous incident reporting, location-based safety visualization, data-driven safety analytics, emergency SOS support, and authenticated administrator moderation in a single React application.

## 🌐 Live Demo

**Live Application:**  
https://anonymous-safety-int-zx3y.bolt.host

> The current public demo is hosted through Bolt. A production deployment will be provided separately.

---

## 🎯 Problem Statement

Many safety incidents remain unreported because people may fear:

- judgment or social consequences
- exposure of their identity
- lack of accessible reporting systems
- uncertainty about unsafe areas

Individual incidents can also remain isolated, making it difficult to identify recurring patterns across locations and time.

SafeVoice addresses this by combining anonymous reporting with location-based safety intelligence.

---

## 💡 Solution

SafeVoice allows users to submit safety incidents without directly attaching their personal identity to the report.

Stored reports can be used to:

- analyze incident categories and severity
- visualize reported locations
- identify high-risk areas
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

Reports without coordinates can still be stored and displayed in the reporting system, but cannot be plotted geographically.

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

The dashboard avoids relying on fixed demonstration statistics for its primary report metrics.

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