(function() {
  if (document.getElementById('cs-export-overlay')) {
    document.getElementById('cs-export-overlay').style.display = 'flex';
    return;
  }

  var overlay = document.createElement('div');
  overlay.id = 'cs-export-overlay';
  overlay.innerHTML = [
    '<div id="cs-modal" style="background:#ffffff;border-radius:16px;padding:0;width:420px;max-height:90vh;overflow-y:auto;box-shadow:0 25px 60px rgba(0,0,0,0.3);font-family:Poppins,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;color:#242D37;overflow:hidden">',
    '  <div style="background:linear-gradient(135deg,#f8f4f1 0%,#f0ebe6 50%,#e8dfd8 100%);padding:20px 24px 16px;border-bottom:1px solid #e8eaed;position:sticky;top:0;z-index:10">',
    '    <div style="display:flex;justify-content:space-between;align-items:center">',
    '      <div>',
    '        <div style="font-size:10px;font-weight:600;color:#F05C37;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:3px">CLOUDSHARE</div>',
    '        <div style="font-size:18px;font-weight:700;color:#242D37;letter-spacing:-0.3px">Engagement Export</div>',
    '      </div>',
    '      <div id="cs-export-close" style="cursor:pointer;color:#9ca3af;font-size:24px;line-height:1;padding:4px 8px;border-radius:8px">&times;</div>',
    '    </div>',
    '  </div>',
    '  <div style="padding:20px 24px;overflow-y:auto">',

    '    <div style="font-size:10px;font-weight:600;color:#F05C37;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;display:flex;align-items:center;gap:8px">',
    '      Date Range',
    '      <span style="flex:1;height:1px;background:#e8eaed;display:inline-block"></span>',
    '    </div>',
    '    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">',
    '      <div>',
    '        <label style="display:block;font-size:11px;font-weight:500;color:#6b7280;margin-bottom:5px;text-transform:uppercase;letter-spacing:0.5px">Start Date</label>',
    '        <input type="date" id="cs-date-from" style="width:100%;padding:9px 10px;background:#f8f8f8;border:1px solid #e8eaed;border-radius:8px;color:#242D37;font-size:13px;font-family:inherit;outline:none;box-sizing:border-box" onfocus="this.style.borderColor=\'#F05C37\'" onblur="this.style.borderColor=\'#e8eaed\'" />',
    '      </div>',
    '      <div>',
    '        <label style="display:block;font-size:11px;font-weight:500;color:#6b7280;margin-bottom:5px;text-transform:uppercase;letter-spacing:0.5px">End Date</label>',
    '        <input type="date" id="cs-date-to" style="width:100%;padding:9px 10px;background:#f8f8f8;border:1px solid #e8eaed;border-radius:8px;color:#242D37;font-size:13px;font-family:inherit;outline:none;box-sizing:border-box" onfocus="this.style.borderColor=\'#F05C37\'" onblur="this.style.borderColor=\'#e8eaed\'" />',
    '      </div>',
    '    </div>',

    '    <div style="font-size:10px;font-weight:600;color:#F05C37;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;display:flex;align-items:center;gap:8px">',
    '      Filters',
    '      <span style="flex:1;height:1px;background:#e8eaed;display:inline-block"></span>',
    '    </div>',

    '    <div style="margin-bottom:12px">',
    '      <label style="display:block;font-size:11px;font-weight:500;color:#6b7280;margin-bottom:5px;text-transform:uppercase;letter-spacing:0.5px">Status</label>',
    '      <div id="cs-status-dropdown-wrap" style="position:relative">',
    '        <div id="cs-status-trigger" style="width:100%;padding:9px 10px;background:#f8f8f8;border:1px solid #e8eaed;border-radius:8px;color:#242D37;font-size:13px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;box-sizing:border-box;user-select:none">',
    '          <span id="cs-status-label">All except Deleted</span>',
    '          <span style="color:#9ca3af;font-size:10px">&#9660;</span>',
    '        </div>',
    '        <div id="cs-status-menu" style="display:none;position:absolute;top:calc(100% + 4px);left:0;right:0;background:#fff;border:1px solid #e8eaed;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.12);z-index:100;overflow:hidden">',
    '          <div style="padding:6px 0">',
    '            <label style="display:flex;align-items:center;gap:8px;padding:7px 12px;font-size:13px;color:#3a3f47;cursor:pointer;user-select:none">',
    '              <input type="checkbox" class="cs-status-cb" value="inprogress" checked style="accent-color:#F05C37;width:14px;height:14px;cursor:pointer" /> In Progress',
    '            </label>',
    '            <label style="display:flex;align-items:center;gap:8px;padding:7px 12px;font-size:13px;color:#3a3f47;cursor:pointer;user-select:none">',
    '              <input type="checkbox" class="cs-status-cb" value="completed" checked style="accent-color:#F05C37;width:14px;height:14px;cursor:pointer" /> Completed',
    '            </label>',
    '            <label style="display:flex;align-items:center;gap:8px;padding:7px 12px;font-size:13px;color:#3a3f47;cursor:pointer;user-select:none">',
    '              <input type="checkbox" class="cs-status-cb" value="deleted" style="accent-color:#F05C37;width:14px;height:14px;cursor:pointer" /> Deleted',
    '            </label>',
    '            <label style="display:flex;align-items:center;gap:8px;padding:7px 12px;font-size:13px;color:#3a3f47;cursor:pointer;user-select:none">',
    '              <input type="checkbox" class="cs-status-cb" value="draft" checked style="accent-color:#F05C37;width:14px;height:14px;cursor:pointer" /> Draft',
    '            </label>',
    '            <label style="display:flex;align-items:center;gap:8px;padding:7px 12px;font-size:13px;color:#3a3f47;cursor:pointer;user-select:none">',
    '              <input type="checkbox" class="cs-status-cb" value="scheduled" checked style="accent-color:#F05C37;width:14px;height:14px;cursor:pointer" /> Scheduled',
    '            </label>',
    '            <label style="display:flex;align-items:center;gap:8px;padding:7px 12px;font-size:13px;color:#3a3f47;cursor:pointer;user-select:none">',
    '              <input type="checkbox" class="cs-status-cb" value="other" checked style="accent-color:#F05C37;width:14px;height:14px;cursor:pointer" /> Other / Unknown',
    '            </label>',
    '          </div>',
    '        </div>',
    '      </div>',
    '    </div>',

    '    <div style="margin-bottom:12px">',
    '      <label style="display:block;font-size:11px;font-weight:500;color:#6b7280;margin-bottom:5px;text-transform:uppercase;letter-spacing:0.5px">Minimum Students</label>',
    '      <input type="number" id="cs-min-students" value="1" min="0" style="width:100%;padding:9px 10px;background:#f8f8f8;border:1px solid #e8eaed;border-radius:8px;color:#242D37;font-size:13px;font-family:inherit;outline:none;box-sizing:border-box" onfocus="this.style.borderColor=\'#F05C37\'" onblur="this.style.borderColor=\'#e8eaed\'" />',
    '      <div style="font-size:11px;color:#9ca3af;margin-top:4px">&#9432; Values &gt; 0 require fetching students first &mdash; adds processing time</div>',
    '    </div>',

    '    <div style="margin-bottom:16px">',
    '      <label style="display:block;font-size:11px;font-weight:500;color:#6b7280;margin-bottom:5px;text-transform:uppercase;letter-spacing:0.5px">Class Name Filter</label>',
    '      <div id="cs-class-dropdown-wrap" style="position:relative">',
    '        <div id="cs-class-trigger" style="width:100%;padding:9px 10px;background:#f8f8f8;border:1px solid #e8eaed;border-radius:8px;color:#242D37;font-size:13px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;box-sizing:border-box;user-select:none">',
    '          <span id="cs-class-label" style="color:#9ca3af">Loading classes...</span>',
    '          <span style="color:#9ca3af;font-size:10px">&#9660;</span>',
    '        </div>',
    '        <div id="cs-class-menu" style="display:none;position:absolute;top:calc(100% + 4px);left:0;right:0;background:#fff;border:1px solid #e8eaed;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.12);z-index:100;overflow:hidden">',
    '          <div style="padding:8px 10px;border-bottom:1px solid #e8eaed">',
    '            <input type="text" id="cs-class-search" placeholder="Search classes..." style="width:100%;border:none;outline:none;font-size:13px;font-family:inherit;color:#242D37;background:transparent;box-sizing:border-box" />',
    '          </div>',
    '          <div style="padding:5px 10px;border-bottom:1px solid #f0f0f0;display:flex;gap:10px">',
    '            <span id="cs-class-select-all" style="font-size:11px;color:#F05C37;cursor:pointer;font-weight:500">Select All</span>',
    '            <span id="cs-class-deselect-all" style="font-size:11px;color:#F05C37;cursor:pointer;font-weight:500">Deselect All</span>',
    '          </div>',
    '          <div id="cs-class-list" style="max-height:200px;overflow-y:auto;padding:4px 0">',
    '            <div style="padding:10px 12px;font-size:12px;color:#9ca3af;text-align:center">Loading classes...</div>',
    '          </div>',
    '        </div>',
    '      </div>',
    '    </div>',

    '    <div style="font-size:10px;font-weight:600;color:#F05C37;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;display:flex;align-items:center;gap:8px">',
    '      Export Scope',
    '      <span style="flex:1;height:1px;background:#e8eaed;display:inline-block"></span>',
    '    </div>',
    '    <div style="padding:12px 14px;background:#f8f8f8;border-radius:8px;margin-bottom:18px;display:flex;flex-direction:column;gap:9px">',
    '      <label style="display:flex;align-items:flex-start;gap:8px;font-size:13px;color:#3a3f47;cursor:pointer;user-select:none">',
    '        <input type="radio" name="cs-scope" value="full" checked style="accent-color:#F05C37;width:14px;height:14px;cursor:pointer;margin-top:1px" />',
    '        <div>',
    '          <span style="font-weight:500;color:#242D37">Full engagement</span>',
    '          <div style="font-size:11px;color:#9ca3af;margin-top:1px">One row per student per tab per day (full detail)</div>',
    '        </div>',
    '      </label>',
    '      <label style="display:flex;align-items:flex-start;gap:8px;font-size:13px;color:#3a3f47;cursor:pointer;user-select:none">',
    '        <input type="radio" name="cs-scope" value="students" style="accent-color:#F05C37;width:14px;height:14px;cursor:pointer;margin-top:1px" />',
    '        <div>',
    '          <span style="font-weight:500;color:#242D37">Students only</span>',
    '          <div style="font-size:11px;color:#9ca3af;margin-top:1px">One row per student &mdash; skips engagement calls (faster)</div>',
    '        </div>',
    '      </label>',
    '      <label style="display:flex;align-items:flex-start;gap:8px;font-size:13px;color:#3a3f47;cursor:pointer;user-select:none">',
    '        <input type="radio" name="cs-scope" value="summary" style="accent-color:#F05C37;width:14px;height:14px;cursor:pointer;margin-top:1px" />',
    '        <div>',
    '          <span style="font-weight:500;color:#242D37">Summary only</span>',
    '          <div style="font-size:11px;color:#9ca3af;margin-top:1px">One row per class with student count (no engagement data)</div>',
    '        </div>',
    '      </label>',
    '    </div>',

    '    <button id="cs-export-run" style="width:100%;padding:12px;background:#F05C37;color:white;border:none;border-radius:8px;font-size:14px;font-weight:600;font-family:inherit;cursor:pointer;letter-spacing:0.2px" onmouseover="this.style.background=\'#d94f2e\'" onmouseout="if(!this.disabled)this.style.background=\'#F05C37\'">Export to CSV</button>',
    '    <div id="cs-export-status" style="margin-top:12px;font-size:12px;color:#6b7280;min-height:18px;text-align:center"></div>',
    '    <div style="margin-top:6px;width:100%;height:5px;background:#f0f0f0;border-radius:3px;overflow:hidden">',
    '      <div id="cs-export-bar" style="width:0%;height:100%;background:linear-gradient(90deg,#F05C37,#ff8a65);border-radius:3px;transition:width 0.3s"></div>',
    '    </div>',
    '  </div>',
    '</div>'
  ].join('\n');

  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(36,45,55,0.5);display:flex;align-items:center;justify-content:center;z-index:999999;backdrop-filter:blur(3px)';
  document.body.appendChild(overlay);

  document.getElementById('cs-export-close').onclick = function() { overlay.style.display = 'none'; };
  overlay.onclick = function(e) { if (e.target === overlay) overlay.style.display = 'none'; };

  // ---- Status dropdown ----
  var statusTrigger = document.getElementById('cs-status-trigger');
  var statusMenu = document.getElementById('cs-status-menu');
  var statusLabel = document.getElementById('cs-status-label');

  statusTrigger.onclick = function(e) {
    e.stopPropagation();
    var isOpen = statusMenu.style.display !== 'none';
    statusMenu.style.display = isOpen ? 'none' : 'block';
  };

  document.addEventListener('click', function(e) {
    var wrap = document.getElementById('cs-status-dropdown-wrap');
    if (wrap && !wrap.contains(e.target)) {
      statusMenu.style.display = 'none';
    }
    var cwrap = document.getElementById('cs-class-dropdown-wrap');
    if (cwrap && !cwrap.contains(e.target)) {
      var cmenu = document.getElementById('cs-class-menu');
      if (cmenu) cmenu.style.display = 'none';
    }
  });

  function updateStatusLabel() {
    var cbs = document.querySelectorAll('.cs-status-cb');
    var checked = [];
    var unchecked = [];
    for (var i = 0; i < cbs.length; i++) {
      if (cbs[i].checked) {
        checked.push(cbs[i].parentNode.textContent.trim());
      } else {
        unchecked.push(cbs[i].parentNode.textContent.trim());
      }
    }
    if (unchecked.length === 0) {
      statusLabel.textContent = 'All statuses';
    } else if (checked.length === 0) {
      statusLabel.textContent = 'None selected';
    } else if (unchecked.length === 1) {
      statusLabel.textContent = 'All except ' + unchecked[0];
    } else if (checked.length <= 2) {
      statusLabel.textContent = checked.join(', ');
    } else {
      statusLabel.textContent = checked.length + ' statuses selected';
    }
  }

  var cbs = document.querySelectorAll('.cs-status-cb');
  for (var ci = 0; ci < cbs.length; ci++) {
    cbs[ci].onchange = updateStatusLabel;
  }
  updateStatusLabel();

  // ---- Class dropdown state ----
  var prefetchedClasses = null; // null = loading, [] = loaded (may be empty), array of {id, name, eid, kind, st, sd}
  var prefetchError = false;

  var classDropTrigger = document.getElementById('cs-class-trigger');
  var classDropMenu = document.getElementById('cs-class-menu');
  var classDropLabel = document.getElementById('cs-class-label');
  var classSearchInput = document.getElementById('cs-class-search');
  var classListEl = document.getElementById('cs-class-list');

  classDropTrigger.onclick = function(e) {
    e.stopPropagation();
    var isOpen = classDropMenu.style.display !== 'none';
    classDropMenu.style.display = isOpen ? 'none' : 'block';
    if (!isOpen && classSearchInput) {
      classSearchInput.focus();
    }
  };

  classSearchInput.oninput = function() {
    renderClassList(classSearchInput.value);
  };

  document.getElementById('cs-class-select-all').onclick = function(e) {
    e.stopPropagation();
    var checkboxes = classListEl.querySelectorAll('.cs-class-cb');
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = true;
      // also mark the backing data
      var nm = checkboxes[i].getAttribute('data-name');
      setClassChecked(nm, true);
    }
    updateClassLabel();
  };

  document.getElementById('cs-class-deselect-all').onclick = function(e) {
    e.stopPropagation();
    var checkboxes = classListEl.querySelectorAll('.cs-class-cb');
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = false;
      var nm = checkboxes[i].getAttribute('data-name');
      setClassChecked(nm, false);
    }
    updateClassLabel();
  };

  // Track checked state per class name (name used as key since ids may vary)
  var classCheckedState = {}; // name -> bool

  function setClassChecked(name, val) {
    classCheckedState[name] = val;
  }

  function isClassChecked(name) {
    if (classCheckedState.hasOwnProperty(name)) return classCheckedState[name];
    return true; // default checked
  }

  function updateClassLabel() {
    if (prefetchedClasses === null) {
      classDropLabel.style.color = '#9ca3af';
      classDropLabel.textContent = 'Loading classes...';
      return;
    }
    if (prefetchError) {
      classDropLabel.style.color = '#ef4444';
      classDropLabel.textContent = 'Failed to load classes';
      return;
    }
    var total = prefetchedClasses.length;
    if (total === 0) {
      classDropLabel.style.color = '#9ca3af';
      classDropLabel.textContent = 'No classes found';
      return;
    }
    var checkedCount = 0;
    for (var i = 0; i < prefetchedClasses.length; i++) {
      if (isClassChecked(prefetchedClasses[i].name)) checkedCount++;
    }
    classDropLabel.style.color = '#242D37';
    if (checkedCount === 0) {
      classDropLabel.textContent = 'None selected';
    } else if (checkedCount === total) {
      classDropLabel.textContent = 'All classes (' + total + ')';
    } else {
      classDropLabel.textContent = checkedCount + ' of ' + total + ' selected';
    }
  }

  function renderClassList(searchTerm) {
    if (prefetchedClasses === null) {
      classListEl.innerHTML = '<div style="padding:10px 12px;font-size:12px;color:#9ca3af;text-align:center">Loading classes...</div>';
      return;
    }
    if (prefetchError) {
      classListEl.innerHTML = '<div style="padding:10px 12px;font-size:12px;color:#ef4444;text-align:center">Error loading classes. Try refreshing.</div>';
      return;
    }
    if (prefetchedClasses.length === 0) {
      classListEl.innerHTML = '<div style="padding:10px 12px;font-size:12px;color:#9ca3af;text-align:center">No classes found.</div>';
      return;
    }

    var term = (searchTerm || '').toLowerCase().trim();
    var html = '';
    var shownCount = 0;
    for (var i = 0; i < prefetchedClasses.length; i++) {
      var cls = prefetchedClasses[i];
      if (term && cls.name.toLowerCase().indexOf(term) === -1) continue;
      var checked = isClassChecked(cls.name) ? ' checked' : '';
      var escapedName = cls.name.replace(/\\/g, '\\\\').replace(/'/g, '\\\'').replace(/"/g, '&quot;');
      html = html + '<label style="display:flex;align-items:center;gap:8px;padding:6px 12px;font-size:13px;color:#3a3f47;cursor:pointer;user-select:none">' +
        '<input type="checkbox" class="cs-class-cb" data-name="' + escapedName + '"' + checked + ' style="accent-color:#F05C37;width:14px;height:14px;cursor:pointer;flex-shrink:0" />' +
        '<span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + escapeHtml(cls.name) + '</span>' +
        '</label>';
      shownCount++;
    }
    if (shownCount === 0) {
      classListEl.innerHTML = '<div style="padding:10px 12px;font-size:12px;color:#9ca3af;text-align:center">No matches for "' + escapeHtml(term) + '"</div>';
      return;
    }
    classListEl.innerHTML = html;

    // attach change listeners
    var newCbs = classListEl.querySelectorAll('.cs-class-cb');
    for (var j = 0; j < newCbs.length; j++) {
      newCbs[j].onchange = (function(cb) {
        return function() {
          setClassChecked(cb.getAttribute('data-name'), cb.checked);
          updateClassLabel();
        };
      })(newCbs[j]);
    }
  }

  function escapeHtml(s) {
    return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ---- Pre-fetch classes in background ----
  var isAccelerate = window.location.hostname.indexOf('accelerate') !== -1;
  var apiBase = isAccelerate ? 'https://accelerate-api.cloudshare.com' : '';

  function doPreFetch() {
    var p;
    if (isAccelerate) {
      p = fetchAllAccelerateClasses();
    } else {
      p = fetchAllClassicClasses();
    }
    p.then(function(classes) {
      prefetchedClasses = classes;
      classCheckedState = {};
      updateClassLabel();
      renderClassList('');
    }, function(err) {
      prefetchError = true;
      prefetchedClasses = [];
      updateClassLabel();
      renderClassList('');
      console.error('CS Export: class prefetch failed', err);
    });
  }

  function fetchAllAccelerateClasses() {
    return new Promise(function(resolve, reject) {
      var results = [];
      var offset = 0;
      var total = 0;

      function fetchPage() {
        fetch(apiBase + '/api/v1/Experiences/List?offset=' + offset + '&limit=100&count=true', {credentials:'include'})
          .then(function(r) { return r.json(); })
          .then(function(ld) {
            total = ld.count || 0;
            var items = ld.data || [];
            for (var i = 0; i < items.length; i++) {
              results.push({
                id: items[i].legacyId,
                name: items[i].name || 'Unnamed',
                eid: items[i].id,
                kind: items[i].kindId || 'training',
                st: items[i].statusId || '',
                sd: items[i].startDate || ''
              });
            }
            offset += 100;
            if (results.length < total) {
              fetchPage();
            } else {
              resolve(results);
            }
          })
          .catch(reject);
      }
      fetchPage();
    });
  }

  function fetchAllClassicClasses() {
    return new Promise(function(resolve, reject) {
      fetch('/api/v3/class', {credentials:'include'})
        .then(function(r) { return r.json(); })
        .then(function(cd) {
          var results = [];
          for (var i = 0; i < cd.length; i++) {
            results.push({
              id: cd[i].id,
              name: cd[i].name || 'Unnamed',
              eid: '',
              kind: 'class',
              st: cd[i].statusId || cd[i].status || '',
              sd: cd[i].startDate || ''
            });
          }
          resolve(results);
        })
        .catch(reject);
    });
  }

  // Start pre-fetch after overlay is in DOM (setTimeout 0 ensures non-blocking)
  setTimeout(function() { doPreFetch(); }, 0);

  // ---- Export button ----
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
    var MIN_STUDENTS = parseInt(document.getElementById('cs-min-students').value, 10) || 0;
    var CONCURRENCY = 15;
    var MAX_RETRIES = 3;
    var RETRY_DELAY = 1000;

    var scopeRadios = document.querySelectorAll('input[name="cs-scope"]');
    var EXPORT_SCOPE = 'full';
    for (var ri = 0; ri < scopeRadios.length; ri++) {
      if (scopeRadios[ri].checked) { EXPORT_SCOPE = scopeRadios[ri].value; break; }
    }

    var allowedStatuses = {};
    var statusCbs = document.querySelectorAll('.cs-status-cb');
    for (var si = 0; si < statusCbs.length; si++) {
      allowedStatuses[statusCbs[si].value] = statusCbs[si].checked;
    }

    var platform = isAccelerate ? 'Accelerate' : 'Classic';

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

    function normalizeStatus(s) {
      var v = (s || '').toLowerCase().replace(/[\s_-]/g, '');
      if (v === 'inprogress' || v === 'active' || v === 'running') return 'inprogress';
      if (v === 'completed' || v === 'complete' || v === 'finished') return 'completed';
      if (v === 'deleted' || v === 'removed') return 'deleted';
      if (v === 'draft') return 'draft';
      if (v === 'scheduled' || v === 'pending') return 'scheduled';
      return 'other';
    }

    function isStatusAllowed(s) {
      var key = normalizeStatus(s);
      if (allowedStatuses.hasOwnProperty(key)) return allowedStatuses[key];
      return allowedStatuses['other'] !== false;
    }

    function isClassSelected(name) {
      return isClassChecked(name);
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

    function esc(val) {
      var s = (val || '').toString();
      if (s.indexOf(',') !== -1 || s.indexOf('"') !== -1 || s.indexOf('\n') !== -1) return '"' + s.replace(/"/g, '""') + '"';
      return s;
    }

    try {
      var allClasses = [], skippedDate = 0, skippedStatus = 0, skippedName = 0, startTime = Date.now();

      // Use pre-fetched data if available, otherwise fall back to fetching
      if (prefetchedClasses !== null && !prefetchError) {
        status.textContent = 'Applying filters to ' + prefetchedClasses.length + ' classes...';
        for (var i = 0; i < prefetchedClasses.length; i++) {
          var pc = prefetchedClasses[i];
          if (!isStatusAllowed(pc.st)) { skippedStatus++; continue; }
          if (!isInDateRange(pc.sd)) { skippedDate++; continue; }
          if (!isClassSelected(pc.name)) { skippedName++; continue; }
          allClasses.push(pc);
        }
        bar.style.width = '10%';
        status.textContent = allClasses.length + ' classes (skipped ' + skippedDate + ' date, ' + skippedStatus + ' status, ' + skippedName + ' name)';
      } else {
        // Fallback: fetch classes now (pre-fetch not ready or failed)
        status.textContent = 'Loading classes...';
        if (isAccelerate) {
          var offset = 0, total = 0;
          do {
            var lr = await fetchRetry(apiBase + '/api/v1/Experiences/List?offset=' + offset + '&limit=100&count=true');
            var ld = await lr.json();
            total = ld.count || 0;
            var items = ld.data || [];
            for (var i = 0; i < items.length; i++) {
              if (!isStatusAllowed(items[i].statusId)) { skippedStatus++; continue; }
              if (!isInDateRange(items[i].startDate)) { skippedDate++; continue; }
              if (!isClassSelected(items[i].name)) { skippedName++; continue; }
              allClasses.push({id:items[i].legacyId, name:items[i].name, eid:items[i].id, kind:items[i].kindId||'training', st:items[i].statusId||'', sd:items[i].startDate||''});
            }
            offset += 100;
            bar.style.width = Math.min(10, (offset / Math.max(total, 1)) * 10) + '%';
            status.textContent = 'Loading: ' + (allClasses.length + skippedDate + skippedStatus + skippedName) + '/' + total + ' (kept ' + allClasses.length + ')';
          } while ((allClasses.length + skippedDate + skippedStatus + skippedName) < total);
        } else {
          var cr = await fetchRetry('/api/v3/class');
          var cd = await cr.json();
          for (var i = 0; i < cd.length; i++) {
            if (!isStatusAllowed(cd[i].statusId || cd[i].status)) { skippedStatus++; continue; }
            if (!isInDateRange(cd[i].startDate)) { skippedDate++; continue; }
            if (!isClassSelected(cd[i].name)) { skippedName++; continue; }
            allClasses.push({id:cd[i].id, name:cd[i].name||'Unnamed', eid:'', kind:'class', st:cd[i].statusId||cd[i].status||'', sd:cd[i].startDate||''});
          }
        }
        bar.style.width = '10%';
        status.textContent = allClasses.length + ' classes (skipped ' + skippedDate + ' date, ' + skippedStatus + ' status, ' + skippedName + ' name)';
      }

      if (allClasses.length === 0) {
        bar.style.width = '100%';
        bar.style.background = 'linear-gradient(90deg,#22c55e,#4ade80)';
        status.innerHTML = '<span style="color:#e8870e">No classes matched filters. Try adjusting your criteria.</span>';
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.background = '#F05C37';
        btn.textContent = 'Export to CSV';
        return;
      }

      status.textContent = 'Fetching students for ' + allClasses.length + ' classes...';
      var studentErrors = [];
      var studentTasks = [];
      for (var ti = 0; ti < allClasses.length; ti++) {
        studentTasks.push((function(t, tiLocal) {
          return async function() {
            if (!t.id) return {ci:tiLocal, s:[], e:'no ID'};
            try {
              var r = await fetchRetry(apiBase + '/api/v3/instructorConsole/class/' + t.id + '/students?shouldTakeMachines=false');
              if (r && r.ok) {
                var s = await r.json();
                var filtered = [];
                for (var k = 0; k < s.length; k++) {
                  if (s[k].id && s[k].id.indexOf('SD') === 0) filtered.push(s[k]);
                }
                return {ci:tiLocal, s:filtered, e:null};
              }
              return {ci:tiLocal, s:[], e:'HTTP ' + (r ? r.status : 'null')};
            } catch(e) { return {ci:tiLocal, s:[], e:e.message}; }
          };
        })(allClasses[ti], ti));
      }

      var studentsDone = 0;
      var wrappedStudentTasks = [];
      for (var wi = 0; wi < studentTasks.length; wi++) {
        wrappedStudentTasks.push((function(fn) {
          return async function() {
            var result = await fn();
            studentsDone++;
            if (studentsDone % Math.max(1, Math.floor(allClasses.length / 20)) === 0) {
              bar.style.width = (10 + (studentsDone / allClasses.length) * 40) + '%';
              status.textContent = 'Students: ' + studentsDone + '/' + allClasses.length + ' classes';
            }
            return result;
          };
        })(studentTasks[wi]));
      }
      var sr = await runPool(wrappedStudentTasks, CONCURRENCY);

      var filteredByMin = 0;
      var filteredSr = [];
      for (var i = 0; i < sr.length; i++) {
        if (sr[i].e) {
          studentErrors.push({name:allClasses[sr[i].ci].name, error:sr[i].e});
          continue;
        }
        if (MIN_STUDENTS > 0 && sr[i].s.length < MIN_STUDENTS) {
          filteredByMin++;
          continue;
        }
        filteredSr.push(sr[i]);
      }

      if (MIN_STUDENTS > 0) {
        status.textContent = 'Filtered to ' + filteredSr.length + ' classes (' + filteredByMin + ' below min ' + MIN_STUDENTS + ' students)';
      }

      if (EXPORT_SCOPE === 'students') {
        bar.style.width = '90%';
        status.textContent = 'Building students CSV...';
        var csvRows = ['training_name,class_id,experience_id,platform,kind,status,start_date,student_name,student_email'];
        for (var i = 0; i < filteredSr.length; i++) {
          var t = allClasses[filteredSr[i].ci];
          var students = filteredSr[i].s;
          for (var j = 0; j < students.length; j++) {
            var sn = ((students[j].firstName || '') + ' ' + (students[j].lastName || '')).trim();
            var se = students[j].email || '';
            csvRows.push([esc(t.name), esc(t.id), esc(t.eid), platform, esc(t.kind), esc(t.st), esc(t.sd), esc(sn), esc(se)].join(','));
          }
          if (students.length === 0) {
            csvRows.push([esc(t.name), esc(t.id), esc(t.eid), platform, esc(t.kind), esc(t.st), esc(t.sd), '', ''].join(','));
          }
        }

        var blob = new Blob([csvRows.join('\n')], {type:'text/csv'});
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'cloudshare_students.csv';
        a.click();

        var elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        bar.style.width = '100%';
        bar.style.background = 'linear-gradient(90deg,#22c55e,#4ade80)';
        status.innerHTML = '<span style="color:#22c55e;font-weight:600">Export complete</span> &mdash; ' + (csvRows.length - 1) + ' rows from ' + filteredSr.length + ' classes in ' + elapsed + 's';
        if (studentErrors.length) status.innerHTML += '<br><span style="color:#e8870e">' + studentErrors.length + ' classes had errors</span>';

      } else if (EXPORT_SCOPE === 'summary') {
        bar.style.width = '90%';
        status.textContent = 'Building summary CSV...';
        var csvRows = ['training_name,class_id,experience_id,platform,kind,status,start_date,student_count'];
        for (var i = 0; i < filteredSr.length; i++) {
          var t = allClasses[filteredSr[i].ci];
          csvRows.push([esc(t.name), esc(t.id), esc(t.eid), platform, esc(t.kind), esc(t.st), esc(t.sd), filteredSr[i].s.length].join(','));
        }

        var blob = new Blob([csvRows.join('\n')], {type:'text/csv'});
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'cloudshare_summary.csv';
        a.click();

        var elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        bar.style.width = '100%';
        bar.style.background = 'linear-gradient(90deg,#22c55e,#4ade80)';
        status.innerHTML = '<span style="color:#22c55e;font-weight:600">Export complete</span> &mdash; ' + (csvRows.length - 1) + ' classes in ' + elapsed + 's';
        if (studentErrors.length) status.innerHTML += '<br><span style="color:#e8870e">' + studentErrors.length + ' classes had errors</span>';

      } else {
        var engagementTasks = [], totalStudents = 0;
        for (var i = 0; i < filteredSr.length; i++) {
          totalStudents += filteredSr[i].s.length;
          for (var j = 0; j < filteredSr[i].s.length; j++) {
            engagementTasks.push({ci:filteredSr[i].ci, s:filteredSr[i].s[j]});
          }
        }

        bar.style.width = '50%';
        status.textContent = totalStudents + ' students found. Fetching engagement...';

        var engDone = 0;
        var engTasks = [];
        for (var ei = 0; ei < engagementTasks.length; ei++) {
          engTasks.push((function(item) {
            return async function() {
              try {
                var r = await fetchRetry(apiBase + '/api/v3/classAnalytics/studentTabsAndPanelsEngagement?studentId=' + item.s.id);
                var eng = (r && r.ok) ? await r.json() : {tabs:[], days:[]};
                engDone++;
                if (engDone % Math.max(1, Math.floor(engagementTasks.length / 20)) === 0) {
                  bar.style.width = (50 + (engDone / engagementTasks.length) * 40) + '%';
                  status.textContent = 'Engagement: ' + engDone + '/' + engagementTasks.length;
                }
                return {ci:item.ci, s:item.s, eng:eng};
              } catch(e) { engDone++; return {ci:item.ci, s:item.s, eng:{tabs:[], days:[]}}; }
            };
          })(engagementTasks[ei]));
        }
        var er = await runPool(engTasks, CONCURRENCY);

        bar.style.width = '90%';
        status.textContent = 'Building CSV...';

        var csvRows = ['training_name,class_id,experience_id,platform,kind,status,start_date,student_name,student_email,date,tab_name,active_seconds,active_minutes'];
        for (var i = 0; i < er.length; i++) {
          var t = allClasses[er[i].ci], s = er[i].s, eng = er[i].eng;
          var sn = ((s.firstName || '') + ' ' + (s.lastName || '')).trim(), se = s.email || '';
          var tabs = (eng && eng.tabs) ? eng.tabs : [], days = (eng && eng.days) ? eng.days : [];
          if (!tabs.length || !days.length) {
            csvRows.push([esc(t.name), esc(t.id), esc(t.eid), platform, esc(t.kind), esc(t.st), esc(t.sd), esc(sn), esc(se), '', '', 0, 0].join(','));
            continue;
          }
          for (var ti2 = 0; ti2 < tabs.length; ti2++) {
            for (var di = 0; di < days.length; di++) {
              var d = days[di];
              var mo = d.month < 10 ? '0' + d.month : '' + d.month;
              var dy = d.dayOfMonth < 10 ? '0' + d.dayOfMonth : '' + d.dayOfMonth;
              var secs = (tabs[ti2].activeSecondsPerDay && tabs[ti2].activeSecondsPerDay[di]) ? tabs[ti2].activeSecondsPerDay[di] : 0;
              csvRows.push([esc(t.name), esc(t.id), esc(t.eid), platform, esc(t.kind), esc(t.st), esc(t.sd), esc(sn), esc(se), d.year + '-' + mo + '-' + dy, esc(tabs[ti2].name), secs, (secs / 60).toFixed(2)].join(','));
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
        bar.style.background = 'linear-gradient(90deg,#22c55e,#4ade80)';
        status.innerHTML = '<span style="color:#22c55e;font-weight:600">Export complete</span> &mdash; ' + (csvRows.length - 1) + ' rows from ' + filteredSr.length + ' classes in ' + elapsed + 's';
        if (studentErrors.length) status.innerHTML += '<br><span style="color:#e8870e">' + studentErrors.length + ' classes had errors</span>';
        if (filteredByMin > 0) status.innerHTML += '<br><span style="color:#9ca3af">' + filteredByMin + ' classes skipped (below min students)</span>';
      }

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
