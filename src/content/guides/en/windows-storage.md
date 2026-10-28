---
title: "How to Free Up Space on the C: Drive in Windows 11 Safely"
description: "Check what is using your C: drive, review Windows cleanup suggestions, and understand Downloads, the Recycle Bin and OneDrive before removing files."
locale: en
slug: free-up-space-c-drive-windows
translationKey: windows-storage-space
published: true
category: windows
tags: [Windows 11, C drive, low disk space, Storage Sense, temporary files, OneDrive]
publishedAt: "2026-10-18"
updatedAt: "2026-10-25"
sourcesCheckedAt: "2026-10-25"
sources:
  - title: "Microsoft: Free up drive space in Windows"
    url: "https://support.microsoft.com/en-us/windows/experience/storage-filemanagement/free-up-drive-space-in-windows"
  - title: "Microsoft: Manage drive space with Storage Sense"
    url: "https://support.microsoft.com/en-us/windows/experience/storage-filemanagement/manage-drive-space-with-storage-sense"
  - title: "Microsoft: Work with synced files in File Explorer"
    url: "https://support.microsoft.com/en-us/sharepoint/sync/work-with-synced-files-in-file-explorer"
relatedArticles: [google-storage-full]
relatedTools: []
image: {src: "/images/windows-flow-en.svg", alt: "Four safer cleanup steps: confirm the drive, locate a category, inspect its files and recheck free space", width: 960, height: 300, caption: "A decision sequence, not a screenshot or replica of Windows menus."}
---

When Windows says your C: drive is almost full, do not start by deleting files in bulk. First confirm which drive is short on space and what is using it. Windows cleanup recommendations group items and estimate how much space they may free. Review each group before removing anything: the Recycle Bin, Downloads and synced folders can contain files you still need.

This guide covers Windows 11. Names and locations can vary slightly by Windows version and display language.

> **Reading the diagram:** it is a decision sequence, not a screenshot or exact reproduction of the Windows interface.

## Confirm that the C: drive is the problem

Open File Explorer and select **This PC**. Check the free-space indicator for the drive that contains Windows, usually C:. If a different volume such as D: is full, cleaning C: will not free space there. Before moving folders, check whether an app, backup or sync service depends on them.

Also distinguish local disk space from a cloud quota. Photos and documents may use space on the PC, in OneDrive or in another cloud account; these are separate measurements. If your Google storage is full, cleaning the Windows drive will not by itself reduce usage in Google Drive, Gmail or Photos. See the guide to [Google storage still being full](/en/guides/google-storage-still-full/).

## Review Windows storage categories

In Windows 11, open **Settings → System → Storage** and allow Windows to calculate the categories. These categories help you decide where to look, but they may not immediately identify a specific file. If a category looks unexpectedly large, open it and inspect its contents using Windows before removing anything.

Open **Cleanup recommendations** for a more focused review. Windows may list temporary files, large or unused files, cloud content and unused apps. Read the list and estimated space for each group. Do not select the entire list automatically.

## Remove temporary files selectively

Temporary files can include update logs, caches and other data Windows considers eligible for cleanup. Open the category and read the explanation for each item. The choices vary by device. If you are unsure what a file type does, leave it selected for later review.

Pay special attention to **Downloads**. It is an ordinary folder for your files, not just a browser cache. It may contain documents, installers, archives and the only copy of something you need.

One item needs extra care: **Previous Windows installation(s)**, sometimes associated with Windows.old. Removing it can take away the option to return to the previous Windows version. If you upgraded recently and may need to roll back, keep it until you are sure.

## Set up Storage Sense carefully

**Storage Sense** can automate cleanup of some temporary data on the system drive. Open its settings under Storage and review the schedule, Recycle Bin, Downloads and cloud-content options. What Windows removes automatically depends on the settings you choose.

Do not enable automatic cleanup of Downloads or the Recycle Bin unless you check those locations routinely. Emptying the Recycle Bin may be permanent for an ordinary user. Restore anything you want to keep and back up important files before enabling deletion.

> **OneDrive caution:** Storage Sense settings can manage local copies. Making a synced file **online-only** frees space on this device while keeping it available to download again when you have a connection. That differs from deleting a file from OneDrive. Check sync and the cloud copy before changing a synced file.

## Find personal files you can move

Videos, backups and old exports can use more space than system caches. Review large files in your profile folders and decide whether to move them to an external drive or another verified storage location. Before removing the original, open the destination copy and confirm it is complete.

If you use OneDrive, wait for sync to finish and verify the file from the web or another device. Deleting a synced file can also remove it from the cloud folder. A cloud icon does not mean the file is a backup that can safely be deleted everywhere.

Avoid manually clearing Windows system folders such as WinSxS or removing unfamiliar files from application folders. Be cautious with third-party “cleaners” that promise a specific large saving: check the publisher and review every proposed action.

## Check the result and stop when you have enough space

After each small cleanup, return to **Storage** or **This PC** and check the free space. If you now have enough room for the update or task you needed, stop there. If space disappears again quickly, check which category is growing; new videos, an app cache, backups or a continually synced folder may be responsible.

Before a larger move or deletion, make a backup on storage that does not depend on the same sync. Cleanup is not a substitute for a backup, and the label “temporary” does not prove that a particular item is unimportant to you.
