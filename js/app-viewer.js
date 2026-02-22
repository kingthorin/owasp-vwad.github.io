/**
 * Renders a single app on 404.html when path is /app/<slug>
 */
(function () {
  'use strict';

  function escapeHtml(s) {
    if (s == null) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function formatDate(iso) {
    if (!iso) return '';
    try {
      var d = new Date(iso);
      return isNaN(d.getTime()) ? iso : d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return iso;
    }
  }

  function renderApp(app) {
    var html = '<article class="app-detail">';
    html += '<h1 class="app-detail-title">' + escapeHtml(app.name) + '</h1>';

    html += '<div class="app-detail-meta">';
    if (app.collection && app.collection.length) {
      html += '<div class="app-detail-row"><span class="label">Collections</span> ';
      html += app.collection.map(function (c) {
        return '<span class="pill pill-collection">' + escapeHtml(c) + '</span>';
      }).join(' ');
      html += '</div>';
    }
    if (app.technology && app.technology.length) {
      html += '<div class="app-detail-row"><span class="label">Technology</span> ';
      html += app.technology.map(function (t) {
        return '<span class="pill">' + escapeHtml(t) + '</span>';
      }).join(' ');
      html += '</div>';
    }
    if (app.author) {
      html += '<div class="app-detail-row"><span class="label">Author</span> ' + escapeHtml(app.author) + '</div>';
    }
    if (app.stars != null) {
      html += '<div class="app-detail-row"><span class="label">Stars</span> ' + escapeHtml(String(app.stars)) + '</div>';
    }
    if (app.last_contributed) {
      html += '<div class="app-detail-row"><span class="label">Last contributed</span> ' + escapeHtml(formatDate(app.last_contributed)) + '</div>';
    }
    html += '</div>';

    html += '<div class="app-detail-links">';
    html += '<a href="' + escapeHtml(app.url) + '" class="btn btn-primary" target="_blank" rel="noopener">Main link</a>';
    if (app.references && app.references.length) {
      app.references.forEach(function (ref) {
        html += ' <a href="' + escapeHtml(ref.url) + '" class="btn btn-secondary" target="_blank" rel="noopener">' + escapeHtml(ref.name) + '</a>';
      });
    }
    html += '</div>';

    if (app.notes) {
      html += '<div class="app-detail-notes"><h2>Notes</h2><p>' + escapeHtml(app.notes) + '</p></div>';
    }

    if (app.badge) {
      html += '<div class="app-detail-badge">';
      html += '<img src="https://img.shields.io/github/stars/' + escapeHtml(app.badge) + '?style=flat" alt="GitHub stars">';
      html += '</div>';
    }

    var base = (typeof window !== 'undefined' && window.VWAD_BASE) ? window.VWAD_BASE + '/' : '';
    html += '<p class="app-detail-back"><a href="' + base + 'index.html">← Back to directory</a></p>';
    html += '</article>';
    return html;
  }

  function show(el) {
    el.classList.remove('hidden');
  }
  function hide(el) {
    el.classList.add('hidden');
  }

  var appView = document.getElementById('app-view');
  var notFound = document.getElementById('not-found');
  var loading = document.getElementById('loading');

  var slug = window.VWAD.getPathSlug();
  if (!slug) {
    hide(loading);
    var noSlug = document.getElementById('no-slug');
    show(noSlug || notFound);
    return;
  }

  window.VWAD.getAppBySlug(slug).then(function (app) {
    hide(loading);
    if (app) {
      document.title = app.name + ' — OWASP VWAD';
      appView.innerHTML = renderApp(app);
      show(appView);
    } else {
      show(notFound);
    }
  }).catch(function () {
    hide(loading);
    show(notFound);
  });
})();
