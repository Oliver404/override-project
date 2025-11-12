---
title: Introduction
createdAt: 2025-11-02
---

# Introduction

**Override Push** is an Android library that simplifies the integration of **Firebase Cloud Messaging (FCM)** and **Huawei Push Kit (HMS)**, allowing developers to use a single code base to manage push notifications across all variants of the app.

## How does it work?

Our library transparently acts as a middleware, allowing you to:
- **Total Abstraction:** Handles tokens and push messages with a set of unified interfaces and classes.
- **Compilation by Flavor:** Uses Gradle Product Flavors to build two variants of the application (Google/Huawei), each with its own set of services and configurations.
- **Zero Duplication of Logic:** All your business logic for handling tokens and receiving messages is written once.
