---
sidebar_position: 2
title: "Attributes"
---

## `[TypeRefOf]`
By default a `TypeRef` field accepts any type. Use `[TypeRefOf(typeof(Base))]` to **restrict** the picker to types assignable to a given base class or interface. The attribute allows multiple usages, so you can accept several bases.

```csharp
using Helteix.Tools.TypeMapping;
using UnityEngine;

public class AbilitySpawner : MonoBehaviour
{
    [SerializeField, TypeRefOf(typeof(IAbility))]
    private TypeRef abilityType; // only IAbility implementations can be assigned
}
```

Open generic definitions are supported as bases too — for example `typeof(MonoSingleton<,,>)`.

## `[AlwaysIncludeInTypeMapping]`
Type Mapping only needs to bake types that are actually referenced. If you plan to resolve a type **dynamically** (one that isn't directly referenced by any `TypeRef` field), mark it with `[AlwaysIncludeInTypeMapping]` so it is guaranteed to be present in the generated mapping in a build.

```csharp
using Helteix.Tools.TypeMapping;

[AlwaysIncludeInTypeMapping]
public class HiddenAbility : IAbility
{
    // referenced only at runtime, but still baked into the type mapping
}
```

:::info
In the editor, types resolve directly from the asset database, so mappings always work while you develop. `[AlwaysIncludeInTypeMapping]` matters mostly for **builds**, where only baked types are available.
:::
