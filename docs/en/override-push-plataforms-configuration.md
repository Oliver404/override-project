---
title: Configuring Platforms
createdAt: 2025-11-02
---
# Preparing Platforms

For **Override Push** to work properly, you need to configure your project on both platforms.

## Google (Firebase Cloud Messaging)

1. Create or access your project in the [Firebase Console].
2. Register your Android app.
3. Download the configuration file **`google-services.json`** and place it in the root directory of your application module (`app/`).

## Huawei (Push Kit)

1. Create or access your project in [AppGallery Connect].
2. Enable the **Push Kit** service.
3. Download the configuration file **`agconnect-services.json`** and place it in the root directory of your application module (`app/`).

# Gradle and *Flavors* settings

This is the key to integration. You need to set up Google and Huawei *plugins* and define your *flavors*.

## Root Level Project

Make sure the repositories and dependencies of *plugins* are configured on `build.gradle.kts` or `build.gradle`:

---COMPONENT---
{
  "component": "CodeBlock",
  "props": {
    "code": [
      {
        "label": "Gradle",
        "lang": "gradle",
        "code": "buildscript {\n\trepositories {\n\t\t// ...\n\t\tgoogle()\n\t\tmavenCentral()\n\t\tmaven { url \"https://developer.huawei.com/repo/\" }\n\t}\n\tdependencies {\n\t\t// ...\n\t\tclasspath \"com.google.gms:google-services:4.4.1\" \n\t\tclasspath \"com.huawei.agconnect:agcp:1.9.1.300\"\n\t}\n}"
      }
    ]
  }
}
---COMPONENT---

## Application Module

Apply Google and Huawei *plugins* to the start of the file.

---COMPONENT---
{
  "component": "CodeBlock",
  "props": {
    "code": [
      {
        "label": "Gradle",
        "lang": "gradle",
        "code": "apply plugin: \"com.android.application\"\napply plugin: \"com.google.gms.google-services\"\napply plugin: \"com.huawei.agconnect\""
      }
    ]
  }
}
---COMPONENT---


### Defines *Product Flavors*

A tutorial on how to create the flavors can be found at <<URL>>.