---
sidebar_position: 3
title: "📡 Channeled Properties"
---

### ⚡ **Channeled Properties**

This is my most powerful package so far—and it’s completely free!  
Ever had this problem:  
An effect slows down time, the player opens the pause menu, but when they close it, the time scale doesn’t return to normal?

These issues are common and usually require complicated dependency chains where every object needs to be aware of the others.  
That’s where **Channeled Properties** come in:  
Create a property (like `TimeScale`) of type `float`. Multiple objects can write to their own channels, specifying a priority and a value.  
No need to preempt every possible game scenario or to manually link runtime and UI scripts...
Everything runs smoothly applying the observer pattern.

**Price: Free**