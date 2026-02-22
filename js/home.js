/**
 * Home page: browse all apps, search by any criteria, link to app pages
 */
(function () {
  'use strict';

  var COLLECTIONS = ['online', 'offline', 'mobile', 'container', 'platform'];

  function escapeHtml(s) {
    if (s == null) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function getAppUrl(app) {
    return 'app.html#' + (app._slug || '');
  }

  function renderTable(apps) {
    if (!apps.length) {
      return '<p class="muted">No applications match.</p>';
    }
    var html = '<div class="table-wrap"><table class="apps-table"><thead><tr>';
    html += '<th>Name</th><th>Collections</th><th>Technology</th><th>Author</th><th>Stars</th>';
    html += '</tr></thead><tbody>';
    apps.forEach(function (app) {
      var url = getAppUrl(app);
      html += '<tr>';
      html += '<td><a href="' + escapeHtml(url) + '">' + escapeHtml(app.name) + '</a></td>';
      html += '<td>' + (app.collection || []).map(function (c) {
        return '<span class="pill pill-collection">' + escapeHtml(c) + '</span>';
      }).join(' ') + '</td>';
      html += '<td>' + (app.technology || []).slice(0, 3).map(function (t) {
        return '<span class="pill">' + escapeHtml(t) + '</span>';
      }).join(' ') + (app.technology && app.technology.length > 3 ? ' …' : '') + '</td>';
      html += '<td>' + escapeHtml(app.author || '—') + '</td>';
      html += '<td>' + (app.stars != null ? escapeHtml(String(app.stars)) : '—') + '</td>';
      html += '</tr>';
    });
    html += '</tbody></table></div>';
    return html;
  }

  function initSearch() {
    var searchInput = document.getElementById('search-input');
    var collectionSelect = document.getElementById('filter-collection');
    var techInput = document.getElementById('filter-technology');
    var resultsEl = document.getElementById('browse-results');
    var countEl = document.getElementById('result-count');
    if (!resultsEl) return;

    function runSearch() {
      var query = searchInput ? searchInput.value.trim() : '';
      var collection = collectionSelect && collectionSelect.value ? [collectionSelect.value] : [];
      var techFilter = techInput ? techInput.value.trim() : '';
      var filters = { collection: collection };
      if (techFilter) filters.technology = [techFilter];

      window.VWAD.searchApps(query, filters).then(function (apps) {
        if (countEl) countEl.textContent = apps.length + ' application' + (apps.length === 1 ? '' : 's');
        resultsEl.innerHTML = renderTable(apps);
      });
    }

    if (searchInput) searchInput.addEventListener('input', runSearch);
    if (searchInput) searchInput.addEventListener('change', runSearch);
    if (collectionSelect) collectionSelect.addEventListener('change', runSearch);
    if (techInput) techInput.addEventListener('input', runSearch);
    if (techInput) techInput.addEventListener('change', runSearch);

    runSearch();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
  } else {
    initSearch();
  }
})();
