---
sidebar_position: 2
title: "📌️ Singletons"
---

We all love singletons, right?  
The **Singletons** package offers a flexible way to use singletons in your game, providing **three main methods** to access them:

1. **Classic**: Create a singleton that doesn't inherit from MonoBehaviour.
2. **MonoSingleton**: Create a MonoBehaviour singleton designed to be instantiated **at runtime**. Once awake, the MonoSingleton moves to the `DontDestroyOnLoad` scene to persist across scene loads.
3. **SceneSingleton**: What if you just want to access a unique object in your scene (or across all loaded scenes)? The SceneSingleton lets you do exactly that, by preventing the singleton from being created from scratch and instead accessing the instance already present in any open scene.

This package gives you the flexibility to choose the singleton pattern that best fits your needs, whether global or scene-specific.

**Price: Free**