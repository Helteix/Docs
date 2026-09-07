---
title: "Introduction"
sidebar_position: 0
---

## Introduction
**Type Mapping** lets you reference and serialize C# `Type` information **without fear of renaming** files, classes, namespaces or assemblies. It also lets you create objects dynamically from a serialized type.

Unity's own serialization can't safely store a `System.Type`, and hard-coding type names as strings breaks the moment you rename or move a class. Type Mapping solves this by serializing the **GUID of the script file** rather than the type name.

## How it works
The core type is `TypeRef`, a serializable struct. Under the hood, a `TypeRef` stores the C# file's asset **GUID**. Because the GUID is stable across renames, moves and assembly changes, the reference keeps pointing at the right type. At build time, the GUID is resolved to the concrete `Type` information via a generated `TypeMappingCollection`, and a `TypeMappingManager` caches the lookups at runtime.

## When to use it
- You want to expose a *type* as an inspector field (e.g. "which ability class should this data spawn?").
- You need to serialize a type reference that must survive refactors.
- You want to instantiate objects dynamically from a type chosen in the editor.

The **Singletons** package uses Type Mapping internally so its prefab references keep working even when you rename your singleton classes.
