# Mesh Network Internet Sharing App with Automated Payments

## Overview
Mfumo huu unaruhusu ushirikiano wa internet kupitia mesh network kwa kutumia:
- **WiFi Direct** (Android) na **Multipeer Connectivity** (iOS)
- **Automated Payment Integration** kupitia ClickPesa kwa kutumia payment link:
  [https://checkout.clickpesa.com/payment-page?ref=PYP7677960](https://checkout.clickpesa.com/payment-page?ref=PYP7677960)
- **Dynamic Load Balancing**, **Smart Connection Management** na **Low-Power Mode** ili kupunguza battery drain.

## Structure
- **backend/**: Node.js Express server inayoendesha uthibitishaji wa malipo na data ya watumiaji kwa SQLite.
  - Endpoints: `/verify`, `/status` na `/webhook` zinashughulikia malipo.
- **frontend/**: React Native app pamoja na native modules:
  - **Android:** WiFi Direct module (imeandaliwa na kumeingizwa kwenye MainApplication.java)
  - **iOS:** Multipeer Connectivity module

## Deployment
- **Backend:** Commit & push code kwenye GitHub na deploy kwenye Heroku.
- **Frontend:** Build APK/bundle kwa Android na deploy kwenye Play Store; Fundisha Xcode project na deploy kwenye App Store.

## Maelezo Muhimu
Mfumo huu umeundwa ili kufanya automation kamili bila intervention ya mwanadamu.
