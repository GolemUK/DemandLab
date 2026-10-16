---
title: "How to Track Small Business Orders Without an Expensive CRM"
description: "Build an order table with clear statuses, dispatch deadlines and a daily review routine. Learn when a spreadsheet is enough and when to move on."
locale: en
slug: order-tracking-without-crm
translationKey: order-tracking
published: true
category: business
tags: [orders, spreadsheets, CSV, small business]
publishedAt: "2026-10-16"
updatedAt: "2026-10-16"
sourcesCheckedAt: "2026-10-16"
sources:
  - title: "Google Sheets: create dropdown lists"
    url: "https://support.google.com/docs/answer/186103?hl=en"
relatedArticles: []
relatedTools: [order-rescue]
---

A spreadsheet can be a useful order register when the workflow is simple and someone is responsible for keeping it current. The main problem is usually not the number of columns. It is uncertainty about which record is current and who must act next.

This guide starts with one shared table and a daily check. You can use the process in Excel, Google Sheets or another spreadsheet application.

## When a spreadsheet is sufficient

A table is a reasonable starting point when orders follow similar steps, a small team can agree who updates them, and you can review open orders each working day. Choose one source of truth. A copy in a messenger conversation should not become a second register.

Name an owner for the table. If several people edit it, assign responsibility for each stage: who records the order, who confirms payment and who marks dispatch. Keep version history or regular dated backups. Protect headings and formulas from accidental edits.

## Decide what one row represents

Choose between **one row per order** and **one row per line item** before entering data. Both can work, but switching between them makes totals and duplicates difficult to interpret.

For a simple dispatch register, use one row per order. If you need individual products, keep a separate items sheet linked by order ID, or add an item ID to each line. Repeated order IDs are then expected; they are not automatically duplicate orders.

## The columns you need

| Column | What to enter | Working rule |
| --- | --- | --- |
| Order ID | A stable identifier, such as DL-101 | Never reuse an old ID for a new order |
| Created date | The date the order was accepted | Use YYYY-MM-DD |
| Fulfillment status | The current stage | Choose from a fixed dropdown |
| Dispatch deadline | The last date to send the order | Keep it separate from estimated delivery |
| Payment status | Paid, unpaid, refunded or unknown | Do not assume shipped means paid |
| Total | The order amount, if useful | Use a consistent currency and decimal format |
| Owner | The person responsible for the next step | Useful when several people share the work |
| Next action | A short, specific instruction | For example: confirm stock before packing |

Customer contact details are not required for a review export. Keep them in the appropriate operational system and export only the columns needed for your check. Order Rescue uses the first three columns as required fields; dispatch deadline and payment status enable additional checks. Total is optional and is not checked for accounting accuracy.

## Make statuses mean one thing

Use a short list: **new → processing → shipped → delivered**, with **cancelled** and **returned** as separate outcomes. Define when a status changes. For example, “shipped” should mean the parcel was handed to the carrier, not merely that a label was printed.

Keep payment separate: **paid, unpaid, refunded, unknown**. A shipped order can legitimately be unpaid because of cash on delivery or agreed terms. It needs a payment-arrangement check, not an automatic accusation of non-payment.

In the spreadsheet, use data validation to create dropdowns. Avoid near-duplicates such as “in work”, “working” and “process” unless you deliberately translate them into one canonical status.

## Find overdue dispatches

Pick a reference date. An order is overdue for dispatch when its dispatch deadline is **before** that date and its status is **new** or **processing**. A deadline today is not overdue under this rule. A shipped order is no longer waiting for dispatch, even if its original deadline has passed.

For a manual check, filter the status column to new and processing, sort dispatch deadlines from earliest to latest, and inspect dates before the reference date. Put blank deadlines in a separate view: a missing date does not tell you whether an order is late.

## A practical example

Imagine the reference date is **2026-10-15**. These records are fictional examples:

| Order ID | Created | Status | Dispatch by | Payment |
| --- | --- | --- | --- | --- |
| DL-101 | 2026-10-10 | processing | 2026-10-14 | paid |
| DL-102 | 2026-10-12 | shipped | 2026-10-13 | unpaid |
| DL-103 | 2026-10-13 | new | — | paid |

Check DL-101 first: its dispatch deadline has passed and it is still processing. Verify whether the parcel actually left before changing any field. For DL-102, check the payment arrangement; it is not overdue for dispatch. For DL-103, decide whether a dispatch deadline should be recorded. Do not invent a deadline just to remove a warning.

## Review duplicate IDs carefully

Start by checking your row model. Two rows with the same ID and different products may represent one order with two line items. Even two identical rows need review: look at the source export, quantities and whether the file includes repeated snapshots.

Order Rescue treats an exact duplicate as an additional row whose parsed fields all match an earlier row. Repeated IDs are reported separately. Neither finding deletes or changes a record. Keep a backup and confirm the intended correction in the source system.

## A daily order check

1. Open the shared register and choose today's local date as the reference.
2. Confirm that newly received orders are present and have an ID, a created date and a status.
3. Review overdue dispatches first. Assign an owner and a next action for each unresolved order.
4. Check missing fields, unrecognized statuses and unclear dates against the original records.
5. Review repeated records and shipped-unpaid orders without assuming they are errors.
6. Make confirmed changes in the source register, record the reason where useful, and save a dated version.

To speed up steps 3–5, export a UTF-8 CSV and open [Order Rescue](/en/tools/order-rescue/). Confirm the column mapping, select your reference date and download the review report. The CSV stays in your browser. The tool checks operational signals, not stock availability, address accuracy, financial reconciliation or every possible business problem.

## When to move to a CRM or order system

Consider a dedicated system when people regularly overwrite each other's work, orders must be synchronized across sales channels, access permissions matter, or you need reliable reminders and a history of changes per order. The deciding factor is the cost and risk of manual coordination, not an arbitrary row count.

Before migrating, document your statuses, required fields and handoffs. Clean a copy of the data, test an import with a small sample, and verify totals and links to line items. A more expensive system will not fix undefined responsibilities by itself.
