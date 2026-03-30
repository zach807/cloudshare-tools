# CloudShare Analytics Export

A bookmarklet-based tool that exports all 7 CloudShare Sisense analytics datasets as a ZIP of CSVs — with zero server-side dependencies.

## How It Works

The `index.html` page is a setup guide that contains a draggable bookmarklet button. The user:

1. Drags the button to their browser bookmarks bar
2. Navigates to `bi.cloudshare.com` (the Sisense BI page)
3. Clicks the bookmark

The bookmarklet then:
- Verifies it's running on `bi.cloudshare.com` (prompts to navigate there if not)
- Opens an overlay modal with a progress tracker
- Queries each of the 7 Sisense cubes via `window.prism.$injector.get('$http')`
- Builds CSVs from the JAQL response (`resp.data.values`)
- Packages everything into a ZIP file (built-in, no CDN dependency)
- Downloads `cloudshare_analytics_YYYY-MM-DD.zip`

## The 7 Datasets

| Filename | Cube | Description |
|---|---|---|
| `cost_control.csv` | `Cost_Control` | Use case, project, course, policy, cost, usage dates |
| `user_hours_utilization.csv` | `User_Hour_Utilization` | Course, user hours, email, class type, role |
| `experiences_participation.csv` | `Experiences_And_Participation` | Experience names, types, hashed IDs, country, participation |
| `attendance_completion.csv` | `Attendance_And_Completion` | Time buckets, drop-off, names, hours, attendance flag |
| `blueprints_environments.csv` | `Blueprint_And_Environment` | Envs, blueprints, owners, disk/RAM hours, create dates |
| `resource_utilization.csv` | `Resource_Utilization` | Project, disk GBH, memory GBH, region, date |
| `project_members_activity.csv` | `Project_Members_Activity` | Member names, emails, roles, experience/invitation/participation counts |

## Technical Notes

### JAQL Query Format
```javascript
window.prism.$injector.get('$http').post('/api/datasources/CUBE_NAME/jaql', {
  datasource: { title: 'CUBE_NAME' },
  metadata: [
    { jaql: { table: 'TABLE', column: 'COLUMN', dim: '[TABLE.COLUMN]', datatype: 'text|numeric|datetime' } }
  ],
  count: 50000
})
```

Response: `resp.data.values` — array of row arrays, each cell is `{data: value, text: displayValue}`

### Field Quirks
- **Cost Control**: Two cost fields — lowercase `cost` (dim `[UserHoursBreakdown.cost]`) and uppercase `Cost` (dim `[UserHoursBreakdown.Cost]`) — both included as they may differ
- **User Hour Utilization**: `User Email` field has dim pointing to `Project Name` (that's how it's exposed in Sisense)
- **Resource Utilization**: `EnvName` field also has dim pointing to `ProjectName`

### Error Handling
Failed datasets are skipped and marked in red in the overlay. The ZIP still downloads with all successful CSVs. No dataset failure blocks the others.

### ZIP Builder
Uses a self-contained ZIP implementation (CRC-32 + local file headers + central directory + EOCD), no CDN or external library required.

## Development

To update the bookmarklet:
1. Edit `_bookmarklet_src.js` (human-readable source)
2. Run: `node -e "const fs=require('fs'); let s=fs.readFileSync('_bookmarklet_src.js','utf8'); s=s.replace(/\/\/[^\n]*/g,'').replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s+/g,' ').trim(); fs.writeFileSync('_bookmarklet_encoded.txt','javascript:'+encodeURIComponent(s),'utf8')"`
3. Rebuild `index.html` by reinserting the encoded content

## Related Tools

- **Engagement Export**: `../cloudshare_engagement_export/index.html` — exports student engagement data via the CloudShare REST API (use.cloudshare.com)

## Files

```
cloudshare_analytics_export/
├── index.html                  # Main setup page (open in browser)
├── _bookmarklet_src.js         # Human-readable bookmarklet source
├── _bookmarklet_encoded.txt    # URL-encoded bookmarklet href
└── README.md                   # This file
```
