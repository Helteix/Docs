---
sidebar_position: 2
title: "Active settings"
---

## Introduction
The GameSettings System enables you to have multiple instances of the same settings.
At any time, you can choose which one is active, giving you the possibility to test easily different scenarios with only one line of code.

By default, the first `GameSettings` asset created is set as the default one.
:::info
The default `GameSettings` asset is the one that will be set active on game launch (before even the first scene loading.)
:::

:::info
You can see which `GameSettings` asset is active by looking at his tab header inside the settings panel. The active `GameSettings` header is always bold. The one with a star is the default one.
:::

## 1 - Create new `GameSettings` assets

---
### Editor
Because we add the `CreateAssetMenu` attribute on our setting, we can create new one pretty easily.
One other way to do that is to use the + button in the settings panel.
<p align="center">
<img src= {require("/img/Tools/Settings_3.png").default} width="600" class="centered-image"/>
</p>

---
### API
Under the Helteix.Tools.Editor assembly, you can access the `GameSettingsEditorPrefs` class to create new settings assets.


```csharp
private void CreateNewSettings()
{
    GameSettingsEditorPrefs.instance.CreateNewSettings(typeof(SampleHelteixSettings));
}
```
If you don't want to bother with the default creation paths etc... just use Unity's API.

:::info
During runtime, use Unity's API because the `GameSettingsEditorPrefs` class is editor exclusive.
:::

```csharp
private void CreateNewSettings()
{ 
    var newSettings = ScriptableObject.CreateInstance<SampleHelteixSettings>();
}
```


## 2 - Select the default `GameSettings`

:::warning
You can't change the default `GameSettings` asset during play mode.
:::

---
### Editor
By clicking the star button, you can set a `GameSettings` to be the default one.
<p align="center">
<img src= {require("/img/Tools/Settings_4.png").default} width="600" class="centered-image"/>
</p>

---
### API
Under the Helteix.Tools.Editor assembly, you can access the `GameSettingsEditorPrefs` class to change the default settings assets.

```csharp
private void CreateNewSettings()
{ 
    var newSettings = ScriptableObject.CreateInstance<SampleHelteixSettings>();
    
    GameSettingsEditorPrefs.instance.SetAsDefault(newSettings, typeof(SampleHelteixSettings));
}
```
The method takes two parameters :
- **scriptableObject**: The asset to set as default.
- **type**: The type that the settings asset will represent. This is to facilitate settings class inheritance. Most of the time, it will be of the type of the ScriptableObject.


## 3 - Change the active `GameSettings` asset

---
### Editor

There is currently no way to change the active asset inside the editor.

---
### API
Once you have a reference to the asset you want to set active, call the `SetActive`method.

```csharp
public class SampleHelteixUtilities : MonoBehaviour
{
    [SerializedField]
    private SampleHelteixSettings sampleHelteixSettings;

    private void Start()
    {
        sampleHelteixSettings.SetActive();
    }
}
```

## Example

Here is the script for a `MonoBehaviour` that creates a new `SampleHelteixSettings` and set it active on Start.

```csharp
using System;
using UnityEngine;

public class SampleHelteixUtilities : MonoBehaviour
{
    private SampleHelteixSettings sampleHelteixSettings;

    private void Start()
    {
        CreateNewSettings();

        sampleHelteixSettings.SetActive();
    }

    private void CreateNewSettings()
    {
        sampleHelteixSettings = ScriptableObject.CreateInstance<SampleHelteixSettings>();
    }
}
```