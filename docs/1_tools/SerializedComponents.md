---
sidebar_position: 1
title: "Serialized Components"
---

<p align="center"> 
<img src="/img/Tools/SerializedComponentsUI.png" width="600" class="centered-image"/>
</p>

## Introduction
Serialized Components provide developers with a way to attach behavior to virtually anything—yes, even `ScriptableObjects`—by enabling the serialization of interfaces.  
The system is conceptually similar to Unity’s built-in `MonoBehaviour` pattern, but adapted for broader use cases.

## Tutorial
The most common use case arises when you want to attach custom logic to a `ScriptableObject`.

For example:  
You’re building an ability system where each ability is a `ScriptableObject`, and you want the behavior of each ability to be contained *within* that asset—without relying on prefabs or scene-based logic.

### 1: Define the Interface
Start by creating an interface (or a class) that inherits from `ISComponent`. This defines the contract your components must follow:

```csharp
public interface IAbilityBehaviour : ISComponent
{
    void Attack();
}
```

### 2: Create the Container
Next, define your `ScriptableObject` and add a field of type `SComponentContainer<IAbilityBehaviour>`.  
You’ll then be able to access and invoke logic defined in the serialized component.

```csharp
public class AbilityData : ScriptableObject
{
    [SerializeField]
    public SComponentContainer<IAbilityBehaviour> container;

    public void Attack()
    {
        if(container.HasComponent)
            container.Component.Attack();
    }
}
```

### 3: Implement Behavior Classes
Now, create the actual component implementations.

```csharp
[System.Serializable]
public class ShortRangeAbility : IAbilityBehaviour
{
    [SerializeField] private float damage;
    
    public void Attack()
    {
        Debug.Log($"Dealing {damage} damage at short range");
    }
}
```

```csharp
[System.Serializable]
public class LongRangeAbility : IAbilityBehaviour
{
    [SerializeField] private float damage;
    [SerializeField] private float range;
    
    public void Attack()
    {
        Debug.Log($"Dealing {damage} damage at {range} range");
    }
}
```

### 4: Assign Components
You can now assign these components directly to your `ScriptableObject` through the Unity Editor.

<p align="center"> 
<img src="/img/Tools/AbilityData_1.png" width="400" class="centered-image"/>
</p>
<p align="center"> 
<img src="/img/Tools/AbilityData_2.png" width="400" class="centered-image"/>
</p>
<p align="center"> 
<img src="/img/Tools/AbilityData_3.png" width="400" class="centered-image"/>
</p>

### 5: Customize Component Paths
Use the `AddSerializedComponentMenu` attribute to organize your components in a custom menu structure:

```csharp
[System.Serializable, AddSerializedComponentMenu("Abilities/LongRange")]
public class LongRangeAbility : IAbilityBehaviour
{
    [SerializeField] private float damage;
    [SerializeField] private float range;

    public void Attack()
    {
        Debug.Log($"Dealing {damage} damage at {range} range");
    }
}
```

<p align="center"> 
<img src="/img/Tools/AbilityData_4.png" width="400" class="centered-image"/>
</p>

## Samples

Here are the available samples that you can access in the package :
1. the **SerializedComponentInScene** scene contains an example of serialized components that prints different messages.