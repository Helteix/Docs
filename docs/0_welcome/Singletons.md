---
sidebar_position: 2
title: "📌️ Singletons"
---

We all love singletons, right?  
The **Singletons** package offers a flexible way to use singletons in your game, providing **three main patterns**:

1. **MonoSingleton** — *the most used one.* A `MonoBehaviour` singleton designed to be instantiated **at runtime**: the system creates its `GameObject` on first access. It is **not** persistent by default — add the `[DontDestroyOnLoad]` attribute to make it survive scene loads.
2. **SceneSingleton**: Access a unique object that already lives in a scene (or across all loaded scenes), without ever creating one from scratch. It belongs to its scene.
3. **Classic**: A plain singleton that doesn't inherit from `MonoBehaviour`, for pure C# systems.

All three share the same customizable **factory / finder** foundation, so you can control how a singleton is created or how an existing one is found.

**Price: Free**