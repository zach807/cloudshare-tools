// CloudShare Engagement Export v6
// Injects a config overlay with date pickers, then runs the export
(function() {
  // Don't inject twice
  if (document.getElementById('cs-export-overlay')) {
    document.getElementById('cs-export-overlay').style.display = 'flex';
    return;
  }

  var overlay = document.createElement('div');
  overlay.id = 'cs-export-overlay';
  overlay.innerHTML = [
    '<div style="background:#1e293b;border-radius:12px;padding:28px;width:380px;box-shadow:0 20px 60px rgba(0,0,0,0.5);font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;color:#e2e8f0">',
    '  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">',
    '    <div style="font-size:18px;font-weight:700;color:#f8fafc">CloudShare Export</div>',
    '    <div id="cs-export-close" style="cursor:pointer;color:#64748b;font-size:22px;line-height:1;padding:4px 8px;border-radius:6px;transition:background 0.15s">&times;</div>',
    '  </div>',
    '  <div style="margin-bottom:16px">',
    '    <label style="display:block;font-size:13px;color:#94a3b8;margin-bottom:6px">Start Date (optional)</label>',
    '    <input type="date" id="cs-date-from" style="width:100%;padding:10px 12px;background:#0f172a;border:1px solid #334155;border-radius:8px;color:#e2e8f0;font-size:14px;outline:none" />',
    '  </div>',
    '  <div style="margin-bottom:16px">',
    '    <label style="display:block;font-size:13px;color:#94a3b8;margin-bottom:6px">End Date (optional)</label>',
    '    <input type="date" id="cs-date-to" style="width:100%;padding:10px 12px;background:#0f172a;border:1px solid #334155;border-radius:8px;color:#e2e8f0;font-size:14px;outline:none" />',
    '  </div>',
    '  <div style="margin-bottom:20px;display:flex;gap:16px">',
    '    <label style="display:flex;align-items:center;gap:6px;font-size:13px;color:#cbd5e1;cursor:pointer">',
    '      <input type="checkbox" id="cs-skip-deleted" checked style="accent-color:#3b82f6;width:16px;height:16px" /> Skip deleted',
    '    </label>',
    '    <label style="display:flex;align-items:center;gap:6px;font-size:13px;color:#cbd5e1;cursor:pointer">',
    '      <input type="checkbox" id="cs-skip-completed" style="accent-color:#3b82f6;width:16px;height:16px" /> Skip completed',
    '    </label>',
    '  </div>',
    '  <button id="cs-export-run" style="width:100%;padding:12px;background:linear-gradient(135deg,#3b82f6,#2563eb);color:white;border:none;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer;transition:opacity 0.15s">Export to CSV</button>',
    '  <div id="cs-export-status" style="margin-top:14px;font-size:13px;color:#94a3b8;min-height:20px;text-align:center"></div>',
    '  <div id="cs-export-progress" style="margin-top:8px;width:100%;height:4px;background:#0f172a;border-radius:2px;overflow:hidden;display:none">',
    '    <div id="cs-export-bar" style="width:0%;height:100%;background:linear-gradient(90deg,#3b82f6,#60a5fa);border-radius:2px;transition:width 0.3s"></div>',
    '  </div>',
    '</div>'
  ].join('\n');
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:999999;backdrop-filter:blur(4px)';
  document.body.appendChild(overlay);

  document.getElementById('cs-export-close').onclick = function() { overlay.style.display = 'none'; };
  overlay.onclick = function(e) { if (e.target === overlay) overlay.style.display = 'none'; };

  document.getElementById('cs-export-run').onclick = async function() {
    var btn = document.getElementById('cs-export-run');
    var status = document.getElementById('cs-export-status');
    var progressBar = document.getElementById('cs-export-progress');
    var bar = document.getElementById('cs-export-bar');
    btn.disabled = true;
    btn.style.opacity = '0.6';
    btn.textContent = 'Exporting...';
    progressBar.style.display = 'block';
    bar.style.width = '0%';

    var DATE_FROM = document.getElementById('cs-date-from').value;
    var DATE_TO = document.getElementById('cs-date-to').value;
    var SKIP_DELETED = document.getElementById('cs-skip-deleted').checked;
    var SKIP_COMPLETED = document.getElementById('cs-skip-completed').checked;
    var CONCURRENCY = 15;
    var MAX_RETRIES = 3;
    var RETRY_DELAY = 1000;

    var isAccelerate = window.location.hostname.indexOf('accelerate') !== -1;
    var platform = isAccelerate ? 'Accelerate' : 'Classic';
    var apiBase = isAccelerate ? 'https://accelerate-api.cloudshare.com' : '';

    function parseDate(str) {
      if (!str) return null;
      if (str.indexOf('-') === 4) return new Date(str);
      var parts = str.split('/');
      if (parts.length >= 3) {
        return new Date(parseInt(parts[2].split(' ')[0], 10), parseInt(parts[0], 10) - 1, parseInt(parts[1], 10));
      }
      return null;
    }

    function isInDateRange(dateStr) {
      if (!DATE_FROM && !DATE_TO) return true;
      var d = parseDate(dateStr);
      if (!d || isNaN(d.getTime())) return true;
      if (DATE_FROM && d < new Date(DATE_FROM + 'T00:00:00')) return false;
      if (DATE_TO && d > new Date(DATE_TO + 'T23:59:59')) return false;
      return true;
    }

    function shouldSkip(s) {
      var v = (s || '').toLowerCase();
      if (SKIP_DELETED && v === 'deleted') return true;
      if (SKIP_COMPLETED && v === 'completed') return true;
      return false;
    }

    async function fetchRetry(url, retries) {
      for (var a = 0; a <= (retries || MAX_RETRIES); a++) {
        try {
          var r = await fetch(url, {credentials:'include'});
          if (r.status === 429) { await new Promise(function(v){setTimeout(v, RETRY_DELAY * Math.pow(2, a))}); continue; }
          return r;
        } catch(e) {
          if (a < (retries || MAX_RETRIES)) { await new Promise(function(v){setTimeout(v, RETRY_DELAY)}); continue; }
          throw e;
        }
      }
      return null;
    }

    async function runPool(tasks, concurrency) {
      var results = new Array(tasks.length), idx = 0;
      async function worker() { while (idx < tasks.length) { var i = idx++; results[i] = await tasks[i](); } }
      var workers = [];
      for (var w = 0; w < Math.min(concurrency, tasks.length); w++) workers.push(worker());
      await Promise.all(workers);
      return results;
    }

    try {
      // Step 1: Load classes
      status.textContent = 'Loading classes...';
      var allClasses = [], skippedDate = 0, skippedStatus = 0, startTime = Date.now();

      if (isAccelerate) {
        var offset = 0, total = 0;
        do {
          var lr = await fetchRetry(apiBase + '/api/v1/Experiences/List?offset=' + offset + '&limit=100&count=true');
          var ld = await lr.json();
          total = ld.count || 0;
          var items = ld.data || [];
          for (var i = 0; i < items.length; i++) {
            if (shouldSkip(items[i].statusId)) { skippedStatus++; continue; }
            if (!isInDateRange(items[i].startDate)) { skippedDate++; continue; }
            allClasses.push({id:items[i].legacyId, name:items[i].name, eid:items[i].id, kind:items[i].kindId||'training', st:items[i].statusId||'', sd:items[i].startDate||''});
          }
          offset += 100;
          bar.style.width = Math.min(10, (offset/Math.max(total,1))*10) + '%';
          status.textContent = 'Loading: ' + (allClasses.length + skippedDate + skippedStatus) + '/' + total + ' (kept ' + allClasses.length + ')';
        } while ((allClasses.length + skippedDate + skippedStatus) < total);
      } else {
        var cr = await fetchRetry('/api/v3/class');
        var cd = await cr.json();
        for (var i = 0; i < cd.length; i++) {
          if (shouldSkip(cd[i].statusId || cd[i].status)) { skippedStatus++; continue; }
          if (!isInDateRange(cd[i].startDate)) { skippedDate++; continue; }
          allClasses.push({id:cd[i].id, name:cd[i].name||'Unnamed', eid:'', kind:'class', st:cd[i].statusId||cd[i].status||'', sd:cd[i].startDate||''});
        }
      }

      bar.style.width = '10%';
      status.textContent = allClasses.length + ' classes (skipped ' + skippedDate + ' date / ' + skippedStatus + ' status)';

      // Step 2: Fetch students
      status.textContent = 'Fetching students for ' + allClasses.length + ' classes...';
      var studentErrors = [];
      var studentTasks = allClasses.map(function(t, ti) {
        return async function() {
          if (!t.id) return {ci:ti, s:[], e:'no ID'};
          try {
            var r = await fetchRetry(apiBase + '/api/v3/instructorConsole/class/' + t.id + '/students?shouldTakeMachines=false');
            if (r && r.ok) { var s = await r.json(); return {ci:ti, s:s.filter(function(x){return x.id && x.id.indexOf('SD')===0}), e:null}; }
            return {ci:ti, s:[], e:'HTTP ' + (r?r.status:'null')};
          } catch(e) { return {ci:ti, s:[], e:e.message}; }
        };
      });

      var studentsDone = 0;
      var origStudentTasks = studentTasks.map(function(fn, idx) {
        return async function() {
          var result = await fn();
          studentsDone++;
          if (studentsDone % Math.max(1, Math.floor(allClasses.length/20)) === 0) {
            bar.style.width = (10 + (studentsDone/allClasses.length) * 40) + '%';
            status.textContent = 'Students: ' + studentsDone + '/' + allClasses.length + ' classes';
          }
          return result;
        };
      });
      var sr = await runPool(origStudentTasks, CONCURRENCY);

      var engagementTasks = [], totalStudents = 0;
      for (var i = 0; i < sr.length; i++) {
        if (sr[i].e) { studentErrors.push({name:allClasses[sr[i].ci].name, error:sr[i].e}); continue; }
        totalStudents += sr[i].s.length;
        for (var j = 0; j < sr[i].s.length; j++) engagementTasks.push({ci:sr[i].ci, s:sr[i].s[j]});
      }

      bar.style.width = '50%';
      status.textContent = totalStudents + ' students found. Fetching engagement...';

      // Step 3: Fetch engagement
      var engDone = 0;
      var engTasks = engagementTasks.map(function(item) {
        return async function() {
          try {
            var r = await fetchRetry(apiBase + '/api/v3/classAnalytics/studentTabsAndPanelsEngagement?studentId=' + item.s.id);
            var eng = (r && r.ok) ? await r.json() : {tabs:[], days:[]};
            engDone++;
            if (engDone % Math.max(1, Math.floor(engagementTasks.length/20)) === 0) {
              bar.style.width = (50 + (engDone/engagementTasks.length) * 40) + '%';
              status.textContent = 'Engagement: ' + engDone + '/' + engagementTasks.length;
            }
            return {ci:item.ci, s:item.s, eng:eng};
          } catch(e) { engDone++; return {ci:item.ci, s:item.s, eng:{tabs:[],days:[]}}; }
        };
      });
      var er = await runPool(engTasks, CONCURRENCY);

      bar.style.width = '90%';
      status.textContent = 'Building CSV...';

      // Step 4: Build CSV
      function esc(val) { var s = (val||'').toString(); if (s.indexOf(',')!==-1||s.indexOf('"')!==-1||s.indexOf('\n')!==-1) return '"'+s.replace(/"/g,'""')+'"'; return s; }

      var csvRows = ['training_name,class_id,experience_id,platform,kind,status,start_date,student_name,student_email,date,tab_name,active_seconds,active_minutes'];
      for (var i = 0; i < er.length; i++) {
        var t = allClasses[er[i].ci], s = er[i].s, eng = er[i].eng;
        var sn = ((s.firstName||'')+' '+(s.lastName||'')).trim(), se = s.email||'';
        var tabs = (eng&&eng.tabs)?eng.tabs:[], days = (eng&&eng.days)?eng.days:[];
        if (!tabs.length || !days.length) {
          csvRows.push([esc(t.name),esc(t.id),esc(t.eid),platform,esc(t.kind),esc(t.st),esc(t.sd),esc(sn),esc(se),'','',0,0].join(','));
          continue;
        }
        for (var ti2 = 0; ti2 < tabs.length; ti2++) {
          for (var di = 0; di < days.length; di++) {
            var d = days[di], mo = d.month<10?'0'+d.month:''+d.month, dy = d.dayOfMonth<10?'0'+d.dayOfMonth:''+d.dayOfMonth;
            var secs = (tabs[ti2].activeSecondsPerDay&&tabs[ti2].activeSecondsPerDay[di])?tabs[ti2].activeSecondsPerDay[di]:0;
            csvRows.push([esc(t.name),esc(t.id),esc(t.eid),platform,esc(t.kind),esc(t.st),esc(t.sd),esc(sn),esc(se),d.year+'-'+mo+'-'+dy,esc(tabs[ti2].name),secs,(secs/60).toFixed(2)].join(','));
          }
        }
      }

      // Step 5: Download
      var blob = new Blob([csvRows.join('\n')], {type:'text/csv'});
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'cloudshare_engagement.csv';
      a.click();

      var elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      bar.style.width = '100%';
      bar.style.background = 'linear-gradient(90deg, #22c55e, #4ade80)';
      status.innerHTML = '<span style="color:#4ade80;font-weight:600">Done!</span> ' + (csvRows.length-1) + ' rows from ' + allClasses.length + ' classes in ' + elapsed + 's';
      if (studentErrors.length) status.innerHTML += '<br><span style="color:#f59e0b">' + studentErrors.length + ' classes had errors (check console)</span>';
      console.log('Export complete: ' + (csvRows.length-1) + ' rows, ' + elapsed + 's, ' + studentErrors.length + ' errors');

    } catch(e) {
      status.innerHTML = '<span style="color:#ef4444">Error: ' + e.message + '</span>';
      console.error('Export failed:', e);
    }

    btn.disabled = false;
    btn.style.opacity = '1';
    btn.textContent = 'Export to CSV';
  };
})();
