---
sidebar_position: 1
title: "Using TypeRef"
---

## Declaring a `TypeRef`
Add a serialized `TypeRef` field to any serializable object. In the inspector you assign it by dragging the **script asset** of the type you want to reference.

```csharp
using Helteix.Tools.TypeMapping;
using UnityEngine;

public class AbilitySpawner : MonoBehaviour
{
    [SerializeField]
    private TypeRef abilityType;
}
```

## Reading the type
`TypeRef` implicitly converts to `System.Type`, or you can use the `Type` property:

```csharp
Type type = abilityType;          // implicit conversion
Type sameType = abilityType.Type; // explicit
```

## Creating an instance
`TypeRef` can instantiate the referenced type for you:

```csharp
// as object
object instance = abilityType.CreateInstance();

// strongly typed (must be assignable to T)
IAbility ability = abilityType.CreateInstance<IAbility>();
```

`CreateInstance` uses `Activator.CreateInstance`, so the target type needs an accessible parameterless constructor.

## Checking validity and compatibility
```csharp
if (abilityType.IsValid)
{
    // the GUID resolves to a real, known type
}

// True if 'someType' is assignable to the referenced type.
// Also handles open generic definitions and interfaces.
bool ok = abilityType.IsAssignableFrom(typeof(FireballAbility));
```
