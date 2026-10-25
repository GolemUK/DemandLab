---
title: "Windows 11 slow after an update: a safe recovery checklist"
description: "Diagnose post-update slowness before resetting or reinstalling Windows."
locale: en
slug: windows-11-slow-after-update
translationKey: windows-recovery
published: true
category: windows
tags: ["Windows 11","updates","recovery"]

relatedArticles: []
relatedTools: []
publishedAt: '2026-10-25'
updatedAt: '2026-10-25'
sourcesCheckedAt: '2026-10-25'
sources: [{"title":"Microsoft Support: Recovery options in Windows","url":"https://support.microsoft.com/en-us/windows/experience/backup-recovery/recovery-options-in-windows"},{"title":"Microsoft Learn: Windows release health","url":"https://learn.microsoft.com/windows/release-health/"}]
---

## Windows 11 slow after an update: a safe recovery checklist

Diagnose post-update slowness before resetting or reinstalling Windows.

> **Important**: Service interfaces and policies can change. Confirm current steps in official documentation.

## Step-by-step solution

### 1. Do not reinstall first

Note when the issue began and inspect Settings → Windows Update → Update history. Distinguish slow startup, freezes, network failure, and app-specific lag. Back up important files before recovery changes.

### 2. Inspect resource usage

Open Task Manager with Ctrl+Shift+Esc and sort by CPU, memory, and disk. Brief post-update indexing can be normal; persistent load from one process warrants investigation.

### 3. Recover disk space carefully

Open Settings → System → Storage. Review categories before removing temporary files. Do not manually delete Windows folders or install dubious registry cleaners.

### 4. Check drivers and startup

For Wi‑Fi, audio, or display issues, inspect Device Manager and the device manufacturer’s official driver page. Disable nonessential startup apps temporarily and compare boot time.

### 5. Use built-in recovery options

Install available Windows fixes first. If one update clearly triggered the issue, consider uninstalling it through supported recovery settings when available. System Restore works only if a restore point exists.

### 6. Escalate when data is at risk

For repeated blue screens, possible drive failure, or missing files, stop experimenting and protect the data. Coordinate changes with IT on managed work devices.

## Quick checklist

- [ ] Avoid unofficial Windows images.
- [ ] Back up before driver or recovery changes.
- [ ] An update rollback may no longer be available.

## Official references

- https://support.microsoft.com/windows
- https://learn.microsoft.com/windows/release-health/
