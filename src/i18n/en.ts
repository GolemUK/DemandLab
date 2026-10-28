export default {
  cover: {
  "title": "Understand the tech. Find the next step.",
  "description": "Practical reading for digital life, from cloud storage to everyday work. Find the cause, check the sources and choose what to do next.",
  "browse": "Explore the articles",
  "tools": "Free tools",
  "start": "Start with a question",
  "promiseTitle": "Understand first. Take action next.",
  "promiseText": "Our guides bring together clear steps, source links and warnings before actions that could delete your data.",
  "about": "Our editorial approach",
  "readNext": "Your next read",
  "library": "A library of solutions",
  "doMore": "From reading to doing",
  "inBrowser": "In your browser",
  "principlesTitle": "Useful by design.",
  "menu": "Menu",
  "principles": [
    [
      "A real problem",
      "Every article starts with a question you might recognise from everyday life."
    ],
    [
      "Clear next steps",
      "Understand what to check and why before changing your settings."
    ],
    [
      "Traceable sources",
      "Source links and verification dates help you judge how current the advice is."
    ],
    [
      "Private by default",
      "Order Rescue processes CSV files locally. Your files are not sent to a server."
    ]
  ]
},
  "nav": {
    "problems": "Topics",
    "tools": "Free tools",
    "guides": "Articles",
    "solutions": "For business",
    "about": "About",
    "privacy": "Privacy",
    "contact": "Contact",
    "home": "Home",
    "breadcrumb": "Breadcrumb",
    "mainLabel": "Main navigation",
    "footerLabel": "Footer navigation"
  },
  "home": {
    "title": "Practical solutions for everyday digital life",
    "description": "Clear guides to technology, everyday apps and the work you need to get done.",
    "eyebrow": "A practical lab for everyday work",
    "intro": "Less time untangling spreadsheets. More time doing the work that matters. Start with a clear view of your orders.",
    "cta": "Check your orders",
    "secondary": "Read the guide",
    "focus": "THE FIRST FOCUS",
    "focusTitle": "An order should never get lost in a spreadsheet.",
    "focusText": "Missed dispatch dates, unclear statuses, repeated records. Find what needs a second look before it becomes a bigger problem.",
    "featured": "01 / FREE TOOL",
    "toolDesc": "Turn a CSV order export into a focused review list. Spot overdue dispatches, missing details and possible duplicate records.",
    "toolAction": "Open Order Rescue",
    "local": "Your file stays in your browser",
    "noAccount": "No account. No upload. No charge.",
    "workflow": [
      "Import your CSV",
      "Confirm the columns",
      "Review what needs attention"
    ],
    "guideLabel": "02 / PRACTICAL KNOWLEDGE",
    "guidesTitle": "A better way to run the everyday.",
    "allGuides": "Explore guides",
    "categoryLabel": "03 / PROBLEMS WE WORK ON",
    "categories": [
      [
        "Business operations",
        "Keep orders visible from first request to dispatch."
      ],
      [
        "Data & spreadsheets",
        "Make the table easier to trust and maintain."
      ],
      [
        "Automation",
        "Identify repeatable tasks before building software."
      ]
    ],
    "categoryNote": "Our first published guide and tool focus on order tracking. More topics will follow when they are ready.",
    "solutionsLabel": "04 / BUILT AROUND YOUR WORK",
    "solutionsTitle": "When the spreadsheet needs a little more.",
    "solutionsText": "A focused internal tool, a clearer process or a small automation. Discuss the actual problem directly with the developer. Scope and delivery are agreed manually.",
    "solutionsAction": "About custom solutions"
  },
  "tool": {
    "title": "Order Rescue — CSV order review",
    "description": "A practical CSV check for overdue dispatches, missing data and records worth reviewing.",
    "eyebrow": "FREE TOOL / BUSINESS OPERATIONS",
    "intro": "Find the orders that need a second look.",
    "privacy": "Your CSV is processed only in this browser. No upload, analytics or account. Data stays in memory and disappears when you refresh or close this page.",
    "uploadTitle": "Start with your order export",
    "uploadText": "UTF-8 CSV · comma or semicolon · up to 5 MiB (5,242,880 bytes) · 10,000 rows",
    "file": "Choose a CSV file",
    "sample": "Load sample data",
    "downloadSample": "Download example CSV",
    "clear": "Clear data",
    "busy": "Working in your browser…",
    "ready": "File read. Confirm the column mapping below.",
    "mapping": "Confirm your columns",
    "mappingHelp": "Check every match before analyzing. Ambiguous headers remain unselected. Required fields are marked *. Each CSV column can be used once.",
    "unmapped": "Not mapped",
    "required": "Required",
    "fields": {
      "order_id": "Order ID",
      "created_at": "Created date",
      "status": "Fulfillment status",
      "ship_by": "Dispatch deadline",
      "payment_status": "Payment status",
      "total": "Total"
    },
    "date": "Analysis reference date",
    "dateHelp": "Dates must use YYYY-MM-DD. A dispatch deadline is the last date an order should be sent, not delivered. Today’s deadlines are not overdue.",
    "warn": "Include a workflow warning for open orders without a dispatch deadline",
    "analyze": "Analyze orders",
    "results": "Your review list",
    "export": "Download review report",
    "category": "Issue category",
    "severity": "Severity",
    "all": "All",
    "row": "CSV row",
    "order": "Order ID",
    "issue": "Issue",
    "explanation": "Why it matters",
    "action": "Suggested next action",
    "noId": "Missing ID",
    "empty": "No issues found by these checks. This is not a guarantee that every order is correct.",
    "noMatches": "No issues match these filters.",
    "summary": [
      "Imported rows",
      "Orders to review",
      "Overdue dispatches",
      "Exact duplicate records",
      "Rows with invalid or missing fields",
      "Informational warnings"
    ],
    "priority": "Review overdue dispatches first, then missing or invalid critical data, then exact duplicate records, then other warnings. Priorities help organize a manual check; they do not prove an order is wrong.",
    "counts": "Orders to review counts unique non-empty IDs, plus each row without an ID. Duplicates counts additional identical records. An order can have multiple issues.",
    "demo": "Sample data uses 2026-10-15 as its reference date. This is fictional example data, not customer information.",
    "loaded": "Imported rows:",
    "showing": "Matching issues:",
    "previous": "Previous",
    "next": "Next",
    "page": "Page",
    "noscript": "Enable JavaScript to run the browser-only CSV tool.",
    "statuses": "Accepted statuses",
    "statusHelp": "Fulfillment: new, processing, shipped, delivered, cancelled, returned. Payment: paid, unpaid, refunded, unknown. Common Ukrainian aliases are also accepted. Unrecognized values are flagged.",
    "reset": "Data cleared.",
    "reportReady": "Analysis complete.",
    "sampleName": "example-orders.csv"
  },
  "profitCalculator": {
    "title": "Free Profit Margin & Selling Price Calculator",
    "open": "Open calculator",
    "description": "Estimate unit profit, margin, markup and a suggested selling price using costs, payment fees and a tax rate you enter.",
    "eyebrow": "PRICING · PROFIT PLANNING",
    "intro": "See what remains after per-item costs, payment fees and your manually entered tax rate.",
    "modeLabel": "Calculation mode",
    "knownPrice": "I know the selling price",
    "targetPrice": "I want a target margin",
    "unitCost": "Product or service cost per unit",
    "additionalCosts": "Other per-unit costs",
    "packaging": "Packaging paid by seller",
    "sellerShipping": "Shipping paid by seller",
    "fixedFee": "Fixed payment fee per sale",
    "percentageFee": "Percentage payment fee",
    "taxRate": "Tax rate on revenue",
    "salePrice": "Selling price per unit",
    "targetMargin": "Target margin",
    "quantity": "Planned number of sales",
    "periodFixedCosts": "Other fixed costs for this period",
    "currency": "Display currency",
    "taxNote": "This estimate applies the tax rate you enter to revenue. It is not tax, accounting or legal advice and does not model tax on profit or country-specific rules. Changing currency only changes the label; it does not convert amounts.",
    "reset": "Reset values",
    "copy": "Copy results",
    "resultsEyebrow": "ESTIMATE",
    "resultsTitle": "Price and profit breakdown",
    "recommendedPrice": "Selling price per unit",
    "profitPerUnit": "Profit per unit before period costs",
    "margin": "Margin",
    "markup": "Markup on unit costs",
    "periodProfit": "Estimated profit for planned sales",
    "breakEven": "Sales to cover period fixed costs",
    "priceStructure": "Price structure per unit",
    "scenarios": "Target-margin scenarios",
    "costs": "Unit costs and fixed fee",
    "fees": "Percentage fee",
    "tax": "Revenue tax estimate",
    "scenarioMargin": "Target margin",
    "scenarioPrice": "Price per unit",
    "scenarioProfit": "Profit per unit",
    "scenarioMarkup": "Markup",
    "enterValues": "Enter costs and a price or target margin to see the estimate.",
    "formula": "Unit profit = price − percentage fee − entered revenue tax − unit costs − fixed payment fee. Period profit subtracts the other fixed costs once. Break-even quantity is shown only when unit profit is positive. Values are not rounded until display.",
    "client": {"invalid":"Enter valid non-negative amounts and a whole number of planned sales.","rates":"The payment fee and revenue tax rates together must be below 100%.","margin":"Enter a target margin below 100%.","quantity":"Planned sales must be a whole number of at least 1.","unreachable":"This target margin is not possible with the selected costs, fees and tax rate. Reduce the target or review the inputs.","noBreakEven":"Not reached with these values","copyDone":"Results copied.","copyFail":"Could not copy automatically. Select and copy the values manually.","loss":"Loss","notAvailable":"—","unit":"units","estimate":"Estimate only"}
  },
  "imageOptimizer": {
    "title": "Free Image Optimizer & Converter",
    "open": "Open image optimizer",
    "description": "Resize and convert JPEG, PNG and WebP images locally in your browser, with before-and-after sizes and batch downloads.",
    "eyebrow": "IMAGES · LOCAL BROWSER TOOL",
    "intro": "Resize and convert images on this device. Your files are not uploaded.",
    "privacy": "Private by design: image decoding, resizing and export happen in this browser. No image data is sent to a server, analytics or a third-party API. Your files are not saved unless you choose a download.",
    "choose": "Choose JPEG, PNG or WebP images",
    "drop": "or drop images here",
    "limits": "Up to 10 files · 20 MiB per file · 80 MiB per batch · 40 megapixels per image",
    "width": "Output width (px)",
    "height": "Output height (px)",
    "lockRatio": "Preserve aspect ratio",
    "format": "Output format",
    "quality": "Quality for JPEG and WebP",
    "background": "Background when exporting JPEG",
    "process": "Optimize images",
    "clear": "Clear list",
    "progress": "Processing",
    "results": "Image results",
    "before": "Before",
    "after": "After",
    "original": "Original",
    "optimized": "Optimized",
    "saved": "Change in file size",
    "larger": "The exported file is larger than the original. Try another format or quality setting.",
    "download": "Download",
    "downloadZip": "Download all as ZIP",
    "remove": "Remove image",
    "empty": "Choose at least one image to begin.",
    "noResults": "No image has been processed yet.",
    "summary": "Batch size summary",
    "inputTotal": "Original total",
    "outputTotal": "Export total",
    "difference": "Space saved",
    "formatHelp": "PNG keeps transparency. JPEG has no transparency; choose a background color. Browser support for export is checked when you process the file.",
    "metadataNote": "Re-encoding may remove metadata such as EXIF, ICC color profiles or location data. These are not preserved by this tool.",
    "footer": "A smaller file is not guaranteed; compare the result before replacing an original.",
    "client": {"fileType":"Only JPEG, PNG and WebP files are supported.","empty":"The selected file is empty or unreadable.","count":"Choose no more than 10 images at once.","batch-size":"The selected batch exceeds 80 MiB. Choose fewer or smaller files.","noDimensions":"Enter an output width or height to resize the images.","pixels":"The image exceeds the 40-megapixel safety limit.","decode":"This image could not be decoded by the browser.","canvas":"This browser could not create a processing canvas.","encode":"The browser could not export this image.","format-unsupported":"This browser does not support exporting the chosen image format.","quality":"Choose quality from 10% to 100%.","background":"Choose a valid JPEG background color.","empty-list":"Choose at least one image.","output-limit":"The batch output reached the 100 MiB safety limit. Download the completed items or process fewer images.","zip-size":"The ZIP would exceed 100 MiB. Download the images individually.","zip":"Could not prepare the ZIP. Download the images individually.","processing":"Processing image {current} of {total}…","complete":"Processed {count} image(s).","needs-processing":"Settings changed. Run optimization again to refresh the results.","not-processed":"Not processed","percent":"%","downloadZipReady":"ZIP archive prepared."}
  },
  "errors": {
    "empty": "The CSV contains no data rows. Include a header and at least one order.",
    "size": "The file exceeds 5 MiB (5,242,880 bytes). Export a smaller file.",
    "rows": "The CSV exceeds 10,000 data rows. Split the export into smaller files.",
    "csv": "The CSV could not be read reliably. Check quotes, comma/semicolon separators and equal column counts.",
    "headers": "Column headers must be non-empty and unique. Rename repeated headers before importing.",
    "mapping": "Map Order ID, Created date and Fulfillment status to three different columns. Each column can be used only once.",
    "date": "Choose a valid reference date in YYYY-MM-DD format.",
    "encoding": "The file is not valid UTF-8. Export it again using UTF-8 encoding.",
    "worker": "The browser could not complete the analysis. Clear the data and try again in a browser that supports Web Workers."
  },
  "severity": {
    "high": "High",
    "medium": "Medium",
    "info": "Information"
  },
  "issues": {
    "overdue": [
      "Overdue dispatch",
      "The dispatch deadline is before the reference date and the order is still new or processing.",
      "Check whether the order was dispatched. Update the status or agree a new dispatch date."
    ],
    "missing_id": [
      "Missing order ID",
      "This row has no order identifier.",
      "Find the order in your source records and assign its correct ID."
    ],
    "missing_status": [
      "Missing status",
      "The fulfillment status is blank.",
      "Confirm the order’s current stage and enter a consistent status."
    ],
    "unknown_status": [
      "Unrecognized status",
      "The fulfillment status does not match a supported value.",
      "Review the original value and use one of the documented statuses."
    ],
    "invalid_created": [
      "Invalid created date",
      "The created date is missing, impossible or not in YYYY-MM-DD format.",
      "Check the source date. Do not guess day and month for an ambiguous value."
    ],
    "invalid_ship": [
      "Invalid dispatch date",
      "The dispatch deadline is impossible or not in YYYY-MM-DD format.",
      "Confirm the deadline and write it as YYYY-MM-DD."
    ],
    "duplicate": [
      "Exact duplicate record",
      "Every parsed field matches an earlier record. This is an additional occurrence.",
      "Compare the source records and line items before deciding whether to remove anything."
    ],
    "repeated_id": [
      "Repeated order ID",
      "This ID appears in multiple rows. These may be separate line items in one order.",
      "Compare item details and the order structure. Do not delete a row based on its ID alone."
    ],
    "payment": [
      "Verify payment arrangement",
      "A shipped order is marked unpaid. Cash on delivery or agreed payment terms may explain this.",
      "Check the agreed payment method and due date before contacting the buyer."
    ],
    "missing_ship": [
      "No dispatch deadline",
      "An open order has no dispatch deadline. This does not establish that it is overdue.",
      "Set a dispatch deadline if your workflow uses one."
    ],
    "unknown_payment": [
      "Unrecognized payment status",
      "The payment value does not match a supported status.",
      "Review the original payment value; use paid, unpaid, refunded or unknown."
    ]
  },
  "footer": {
    "tagline": "Understand everyday technology. Put useful knowledge to work.",
    "note": "Built for people doing the work.",
    "language": "Language",
    "skip": "Skip to content"
  },
  "contact": {
    "heading": "Let’s discuss your workflow",
    "text": "Custom work starts with a manual conversation on Telegram or Viber. Requirements, scope, price and delivery are agreed directly. There is no checkout or automatic delivery.",
    "missing": "Contact details are not configured yet. Telegram and Viber contact will appear here when the owner adds them.",
    "telegram": "Discuss on Telegram",
    "viber": "Discuss on Viber",
    "generalHeading": "Get in touch with DemandLab",
    "generalText": "Available contact channels are listed below."
  },
  "pages": {
    "tools": [
      "Free tools",
      "Small, focused tools for everyday business work. No account required."
    ],
    "guides": [
      "Practical articles & guides",
      "Useful explanations for everyday technology and real working problems."
    ],
    "solutions": [
      "Custom solutions",
      "Software built around a specific workflow, after a direct conversation."
    ],
    "about": [
      "About DemandLab",
      "A practical-solutions portal for individuals and small businesses."
    ],
    "privacy": [
      "Privacy",
      "What happens to your data when you use this site."
    ],
    "contact": [
      "Contact DemandLab",
      "Article corrections, questions about tools and conversations about custom solutions."
    ]
  },
  "support": {
    "guideTag": "ORDER TRACKING / PRACTICAL GUIDE",
    "readGuide": "Read the guide",
    "backGuides": "All guides",
    "related": "Put the guide into practice",
    "relatedText": "Check your own CSV export in Order Rescue. Your data stays in the browser.",
    "aboutSections": [
      [
        "A practical information portal",
        "DemandLab helps a broad audience understand everyday technology and solve concrete problems. Articles, source-backed explanations and free tools come first."
      ],
      [
        "What we publish",
        "Our editorial scope covers the internet, smartphones, computers, AI and software, and practical business problems. We publish a category only when useful material is ready."
      ],
      [
        "Sources and updates",
        "Guides show their publication date, actual update date and source-check date. We prioritize official documentation, distinguish diagnosis from deletion, and explain important limits."
      ],
      [
        "A separate business direction",
        "Order Rescue and custom software remain available for people and small businesses that need workflow help. They are one part of the portal, not its entire purpose."
      ]
    ],
    "solutionSections": [
      [
        "Start with the actual task",
        "Describe where orders get lost, what you currently use and which step takes time. A small anonymized example is more useful than a long feature wishlist. Do not send customer data in the first message."
      ],
      [
        "Agree a clear scope",
        "After a manual conversation, the scope, price, delivery format and acceptance checks can be agreed directly. A request does not start a purchase or a subscription."
      ],
      [
        "Build only what helps",
        "Possible work includes an internal tool, a CSV transformation or a small workflow automation. Feasibility and maintenance are discussed before anything is promised."
      ]
    ],
    "privacySections": [
      [
        "Order files stay on your device",
        "Order Rescue reads the selected CSV in browser memory and analyzes it in a background worker. The application has no file-upload endpoint and does not send CSV contents to our server, analytics services or AI providers."
      ],
      [
        "What is retained",
        "Uploaded CSV data is not saved to local storage or cookies. Clear data removes the current data and report from the application; refreshing or closing the page discards it. Files you download remain on your device until you delete them."
      ],
      [
        "The exported review report",
        "By default the report includes order ID, issue type, severity, explanation and suggested action. It does not copy unrelated columns such as customer names or addresses. Order IDs may still be sensitive, so share reports only with people who need them."
      ],
      [
        "Website requests and hosting",
        "Opening the website requests its HTML, styles, scripts and sample files from the hosting provider. That provider may process ordinary request information, such as IP address and browser information, according to its own policies. The site includes no external analytics scripts."
      ],
      [
        "Search, advertising and analytics",
        "Search filters the catalog in your browser. A submitted query appears in the URL and may remain in browser history and hosting logs. Do not enter private information. No advertising or analytics scripts are currently installed, and the site sets no cookies of its own. This notice and any required consent controls must be reviewed before adding them."
      ],
      [
        "Contact services",
        "If configured, Telegram and Viber links open those services. Messages you send there are subject to those services’ policies. Do not send personal customer information unless it is necessary and you have established an appropriate way to handle it."
      ],
      [
        "Updates to this notice",
        "This notice describes the current implementation. It must be reviewed when hosting, contact details or data handling change. Privacy questions can be sent through the project’s configured contact channels."
      ]
    ],
    "contactSections": [
      [
        "Corrections and questions",
        "To report an article error, include its URL, the inaccurate passage and an official source if available. For a technical problem, include your browser and short reproduction steps."
      ],
      [
        "Keep private files private",
        "Do not send passwords, access codes, customer personal information or full operational CSV files. Use a fictional example to explain a problem."
      ],
      [
        "Custom solutions",
        "Describe the problem and the result you need. Scope and terms are discussed directly; the website does not take payments."
      ]
    ]
  },
  "editorial": {
    "eyebrow": "PRACTICAL ANSWERS FOR DIGITAL LIFE",
    "headline": "Understand the problem. Find your next step.",
    "description": "Clear guides to technology, everyday apps and the work you need to get done.",
    "featured": "THE MAIN GUIDE",
    "latest": "Fresh & useful",
    "topics": "Explore by topic",
    "tools": "Free interactive tools",
    "business": "For businesses",
    "businessText": "Custom software and workflow tools are a separate part of DemandLab. Start with the problem; discuss a focused solution directly.",
    "businessLink": "Explore business solutions",
    "searchTitle": "What would you like to solve?",
    "searchLabel": "Search problems, articles and tools",
    "searchPlaceholder": "Try: Google storage, orders, CSV…",
    "searchButton": "Search",
    "searchClear": "Clear",
    "searchPage": "Search DemandLab",
    "searchDescription": "Find published practical guides and working tools.",
    "searchResults": "Results",
    "searchNone": "No matching material yet. Try a broader term or browse all articles.",
    "searchHint": "Search titles, summaries, categories and tags. Results stay within this language.",
    "searchNoJS": "JavaScript improves filtering. All published items are listed below.",
    "articles": "Articles",
    "toolsType": "Tool",
    "guideType": "Guide",
    "published": "Published",
    "updated": "Updated",
    "checked": "Sources checked",
    "toc": "In this guide",
    "tags": "Article topics",
    "checklist": "Before you finish",
    "sources": "Official sources & references",
    "relatedArticles": "Related reading",
    "relatedTools": "Related tools",
    "read": "Read the guide",
    "categoryDescriptions": {"technology":"Practical guides to cloud storage, browsers and everyday internet services.","mobile":"Practical guides to smartphone storage, settings and everyday apps.","windows":"Practical guides to Windows settings, files and computer maintenance.","ai":"Practical guides to checking AI output and choosing useful software.","business":"Order tracking, spreadsheets and practical routines for small business operations."},
    "categoryDescription": "Published practical guides in this topic.",
    "planned": "Not published yet",
    "plannedNote": "These topics are part of our editorial scope. Links appear only when a guide is published.",
    "all": "All published materials",
    "categories": {
      "technology": "Technology & internet",
      "mobile": "Smartphones & apps",
      "windows": "Windows & computers",
      "ai": "AI & software",
      "business": "Practical business solutions"
    }
  }
} as const;
