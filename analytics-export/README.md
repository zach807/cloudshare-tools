# CloudShare Analytics Export Tool

A single-page tool that exports **all data** from CloudShare's Sisense BI dashboards as a ZIP of CSVs — no API keys, no installs, no backend required.

---

## What It Exports

| File | Cube | Contents |
|------|------|----------|
| `training_analytics.csv` | CloudShareTrainingCube | Course info, student records, participation, session time, drop-off rates |
| `sales_enablement.csv` | SalesEnablement | POC opportunities, SE ownership, usage metrics, disk/GB |
| `sales_experiences.csv` | SalesExperiencesCube | Experience names, participants, status, active time |
| `resources.csv` | ResourcesConsumptionCube | Daily billing by project/blueprint/env/region |
| `environments.csv` | CloudShareEnvironmentsCube | Environment data (fields auto-discovered from dashboard) |
| `project_members.csv` | ProjectMemberUsageCube | Project member usage data (fields auto-discovered from dashboard) |

---

## How to Use

### Step 1 — Open the tool
Open `index.html` in any browser (just double-click it, no server needed).

### Step 2 — Navigate to CloudShare Analytics
1. Log in at [use.cloudshare.com](https://use.cloudshare.com) (or your Accelerate portal)
2. Click **Analytics** in the navigation
3. This opens **bi.cloudshare.com** — stay on that tab

### Step 3 — Open the browser console
- **Windows/Linux:** `F12` → Console tab
- **Mac:** `Cmd + Option + J`

> **Chrome tip:** If you see a warning about pasting, type `allow pasting` and press Enter first.

### Step 4 — Paste and run
1. Click **Copy** in the tool
2. Paste into the console
3. Press **Enter**
4. Watch progress logs appear — export takes 30–60 seconds for large accounts
5. A ZIP file downloads automatically when complete

---

## Output Format

The ZIP is named `cloudshare_analytics_YYYY-MM-DD.zip` and contains up to 6 CSVs. Each CSV has a header row. Values with commas, quotes, or newlines are properly quoted per RFC 4180.

---

## Technical Details

### How It Works
The script uses Sisense's internal JAQL API (`/api/datasources/{cube}/jaql`) via the authenticated Angular HTTP client (`window.prism.$injector.get('$http')`). This means:
- No additional login required
- CSRF tokens handled automatically
- Only works when you're already logged in at `bi.cloudshare.com`

### Row Limit
Sisense returns a maximum of **50,000 rows per query**. For most CloudShare accounts this is sufficient, but very large tenants hitting this cap will need to either:
- Filter by date range (modify the JAQL `filters` array in the script)
- Request a direct DB export from CloudShare support

### Environments & Project Members (Cubes 5 & 6)
These two cubes auto-discover their field list by fetching the widget definitions from their respective dashboards:
- **Environments:** dashboard `63d928c2edbb5ec6d88f930b`
- **Project Members:** dashboard `652bd3c9be28a68c906f240c`

If those dashboard IDs change or the dashboards are restructured, fallback fields are used and a warning appears in the console.

### Error Handling
If any individual cube fails, the export continues with the remaining cubes. Failed cubes are listed at the end in the console. You still get a ZIP with whatever succeeded.

---

## Files

```
cloudshare_analytics_export/
├── index.html    ← The tool (open this in a browser)
└── README.md     ← This file
```

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `Cannot read property '$injector'` | You're not on `bi.cloudshare.com`. Navigate there first. |
| 0 rows in a CSV | Your account has no data in that cube, or the cube name differs. |
| Wrong column names in environments/project_members | Dashboard layout changed. Data is still correct. |
| Script runs but no ZIP downloads | Check browser popup/download blocker settings. |
| Partial export (some cubes failed) | Check console for error details. Network errors are usually transient — try again. |

---

*Built for CloudShare internal use. No external dependencies, no data leaves the browser.*
