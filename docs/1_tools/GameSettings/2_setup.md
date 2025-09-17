---
sidebar_position: 1
title: "Setup"
---

## Introduction
You can unpack the unity package found under *.../Packages/HelteixTools/Samples/GameSettingsSample.unitypackage*.
The following tutorial explains how to recreate everything you will find in this package.

### 1: Create de Settings class
Start by creating a class that inherits from `GameSettings<>`. The generic part has to be the class itself.

```csharp
public class SampleHelteixSettings : GameSettings<SampleHelteixSettings>
{

}
```

### 2: Setup creation - *Optional*
`GameSettings<>` inherits from `ScriptableObjects` which means you can add the `CreateAssetMenu` attribute to enable asset creation in the editor with a right click in the Project panel.

Let's add it to our class.

```csharp
[GameSettingsTitle(title = "Singletons", color = "#8d7eff")]
[CreateAssetMenu(fileName = "New Sample Settings", menuName = "Helteix/Samples/Settings")]
public class SampleHelteixSettings : GameSettings<SampleHelteixSettings>
{

}
```

You can also add the `AutoGenerateGameSettings` attribute on top of the class if you the system to create at least one settings instance if none is found in the project.
By default, auto generated settings are created at the path selected in the global settings (cf. intro).

```csharp
[AutoGenerateGameSettings]
[GameSettingsTitle(title = "Singletons", color = "#8d7eff")]
[CreateAssetMenu(fileName = "New Sample Settings", menuName = "Helteix/Samples/Settings")]
public class SampleHelteixSettings : GameSettings<SampleHelteixSettings>
{

}
```

### 3: Customize the editor's look - *Optional*

The `GameSettingsTitle` attribute is used to customize the settings appearance in the editor. 
As of now, there are two parameters available :
- *title* : The name displayed in the treeview and on the header.
- *color* : The color of some elements in the setting's inspector. Needs to be hexadecimal.

```csharp
[GameSettingsTitle("Singletons", "#8d7eff")]
[CreateAssetMenu(fileName = "New Sample Settings", menuName = "Helteix/Samples/Settings")]
public class SampleHelteixSettings : GameSettings<SampleHelteixSettings>
{

}
```

### 4: Fill the class
Like any other `ScriptableObject`, you can add Serialized fields and have them appear in the editor.
Like any other unity Object, you can also create your own custom editor if you want to.


```csharp
[GameSettingsTitle("Singletons", "#8d7eff")]
[CreateAssetMenu(fileName = "New Sample Settings", menuName = "Helteix/Samples/Settings")]
public class SampleHelteixSettings : GameSettings<SampleHelteixSettings>
{
    [SerializeField]
    private bool sampleToggle;
    [SerializeField, Range(0, 15)]
    private int sampleSlider;
}
```

### 4: Access your settings

In any other script, you can access to the active setting asset by doing:

```csharp
public class SampleHelteixSettingsLogger : MonoBehaviour
{
    private void Start()
    {
        Debug.Log($"toggle value : {SampleHelteixSettings.Current.sampleToggle}");
        Debug.Log($"slider slider : {SampleHelteixSettings.Current.sampleSlider}");
    }
}
```