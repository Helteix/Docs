---
sidebar_position: 5
title: "Settings"
---

## Introduction
The package ships with a `ChanneledPropertiesSettings` asset, built on the **GameSettings** system from `com.helteix.tools`. It is auto-generated and appears under the *Helteix* section of the project settings. It holds the defaults used when you create a channeled property without specifying every parameter.

## Settings reference

| Setting | Description |
| --- | --- |
| **Log Initialisation Messages** | Whether the system logs messages when channel keys are initialized and cleaned. |
| **Force Capacity To Next Power Of Two** | If enabled, any requested capacity is rounded up to the next power of two. |
| **Default Capacity** | The capacity used when a property is created without specifying one (2–32, default 16). |
| **Expand On Full Capacity Reached** | Default policy for growing a property's channel buffer when it runs out of slots. |
| **Max Groups** | The maximum number of groups a `Formula<T>` can use (1–128, default 32). |

:::tip
Setting a sensible **Default Capacity** avoids reallocations at runtime. Pick a value slightly above the maximum number of channels you expect a single property to hold concurrently.
:::
