(function() {
  if (document.getElementById('cs-export-overlay')) {
    document.getElementById('cs-export-overlay').style.display = 'flex';
    return;
  }

  var overlay = document.createElement('div');
  overlay.id = 'cs-export-overlay';
  overlay.innerHTML = [
    '<div id="cs-modal" style="background:#ffffff;border-radius:16px;padding:0;width:400px;box-shadow:0 25px 60px rgba(0,0,0,0.3);font-family:Poppins,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;color:#242D37;overflow:hidden">',
    '  <div style="background:linear-gradient(135deg,#f8f4f1 0%,#f0ebe6 50%,#e8dfd8 100%);padding:24px 28px 20px;border-bottom:1px solid #e8eaed">',
    '    <div style="display:flex;justify-content:space-between;align-items:center">',
    '      <div>',
    '        <div style="font-size:11px;font-weight:600;color:#F05C37;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:4px">CloudShare</div>',
    '        <div style="font-size:20px;font-weight:700;color:#242D37;letter-spacing:-0.3px">Engagement Export</div>',
    '      </div>',
    '      <div id="cs-export-close" style="cursor:pointer;color:#9ca3af;font-size:24px;line-height:1;padding:4px 8px;border-radius:8px;transition:all 0.15s">&times;</div>',
    '    </div>',
    '  </div>',
    '  <div style="padding:24px 28px">',
    '    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">',
    '      <div>',
    '        <label style="display:block;font-size:12px;font-weight:500;color:#6b7280;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Start Date</label>',
    '        <input type="date" id="cs-date-from" style="width:100%;padding:10px 12px;background:#f8f8f8;border:1px solid #e8eaed;border-radius:8px;color:#242D37;font-size:14px;font-family:inherit;outline:none;transition:border-color 0.15s" onfocus="this.style.borderColor=\'#F05C37\'" onblur="this.style.borderColor=\'#e8eaed\'" />',
    '      </div>',
    '      <div>',
    '        <label style="display:block;font-size:12px;font-weight:500;color:#6b7280;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">End Date</label>',
    '        <input type="date" id="cs-date-to" style="width:100%;padding:10px 12px;background:#f8f8f8;border:1px solid #e8eaed;border-radius:8px;color:#242D37;font-size:14px;font-family:inherit;outline:none;transition:border-color 0.15s" onfocus="this.style.borderColor=\'#F05C37\'" onblur="this.style.borderColor=\'#e8eaed\'" />',
    '      </div>',
    '    </div>',
    '    <div style="display:flex;gap:20px;margin-bottom:24px;padding:14px 16px;background:#f8f8f8;border-radius:8px">',
    '      <label style="display:flex;align-items:center;gap:8px;font-size:13px;color:#3a3f47;cursor:pointer;user-select:none">',
    '        <input type="checkbox" id="cs-skip-deleted" checked style="accent-color:#F05C37;width:16px;height:16px;cursor:pointer" /> Skip deleted',
    '      </label>',
    '      <label style="display:flex;align-items:center;gap:8px;font-size:13px;color:#3a3f47;cursor:pointer;user-select:none">',
    '        <input type="checkbox" id="cs-skip-completed" style="accent-color:#F05C37;width:16px;height:16px;cursor:pointer" /> Skip completed',
    '      </label>',
    '    </div>',
    '    <button id="cs-export-run" style="width:100%;padding:13px;background:#F05C37;color:white;border:none;border-radius:8px;font-size:15px;font-weight:600;font-family:inherit;cursor:pointer;transition:all 0.15s;letter-spacing:0.2px" onmouseover="this.style.background=\'#d94f2e\'" onmouseout="if(!this.disabled)this.style.background=\'#F05C37\'">Export to CSV</button>',
    '    <div id="cs-export-status" style="margin-top:16px;font-size:13px;color:#6b7280;min-height:20px;text-align:center"></div>',
    '    <div style="margin-top:8px;width:100%;height:5px;background:#f0f0f0;border-radius:3px;overflow:hidden">',
    '      <div id="cs-export-bar" style="width:0%;height:100%;background:linear-gradient(90deg,#F05C37,#ff8a65);border-radius:3px;transition:width 0.3s"></div>',
    '    </div>',
    '  </div>',
    '</div>'
  ].join('\n');
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(36,45,55,0.5);display:flex;align-items:center;justify-content:center;z-index:999999;backdrop-filter:blur(3px)';
  document.body.appendChild(overlay);

  document.getElementById('cs-export-close').onclick = function() { overlay.style.display = 'none'; };
  overlay.onclick = function(e) { if (e.target === overlay) overlay.style.display = 'none'; };

  document.getElementById('cs-export-run').onclick = async function() {
    var btn = document.getElementById('cs-export-run');
    var status = document.getElementById('cs-export-status');
    var bar = document.getElementById('cs-export-bar');
    btn.disabled = true;
    btn.style.opacity = '0.7';
    btn.style.background = '#999';
    btn.textContent = 'Exporting...';
    bar.style.width = '0%';
    bar.style.background = 'linear-gradient(90deg,#F05C37,#ff8a65)';

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
      status.textContent = allClasses.length + ' classes (skipped ' + skippedDate + ' date, ' + skippedStatus + ' status)';

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
      var wrappedStudentTasks = studentTasks.map(function(fn) {
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
      var sr = await runPool(wrappedStudentTasks, CONCURRENCY);

      var engagementTasks = [], totalStudents = 0;
      for (var i = 0; i < sr.length; i++) {
        if (sr[i].e) { studentErrors.push({name:allClasses[sr[i].ci].name, error:sr[i].e}); continue; }
        totalStudents += sr[i].s.length;
        for (var j = 0; j < sr[i].s.length; j++) engagementTasks.push({ci:sr[i].ci, s:sr[i].s[j]});
      }

      bar.style.width = '50%';
      status.textContent = totalStudents + ' students found. Fetching engagement...';

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

      var blob = new Blob([csvRows.join('\n')], {type:'text/csv'});
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'cloudshare_engagement.csv';
      a.click();

      var elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      bar.style.width = '100%';
      bar.style.background = 'linear-gradient(90deg, #22c55e, #4ade80)';
      status.innerHTML = '<span style="color:#22c55e;font-weight:600">Export complete</span> &mdash; ' + (csvRows.length-1) + ' rows from ' + allClasses.length + ' classes in ' + elapsed + 's';
      if (studentErrors.length) status.innerHTML += '<br><span style="color:#e8870e">' + studentErrors.length + ' classes had errors</span>';

    } catch(e) {
      status.innerHTML = '<span style="color:#ef4444">Error: ' + e.message + '</span>';
      console.error('Export failed:', e);
    }

    btn.disabled = false;
    btn.style.opacity = '1';
    btn.style.background = '#F05C37';
    btn.textContent = 'Export to CSV';
  };
})();
