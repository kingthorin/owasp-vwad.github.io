/**
 * OWASP VWAD — shared data and routing
 * Loads collection, assigns unique slugs, provides search and app-by-slug.
 */
(function () {
  'use strict';

  function slugify(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function assignSlugs(collection) {
    var seen = {};
    collection.forEach(function (app, i) {
      var base = slugify(app.name);
      var slug = base;
      var n = 1;
      while (seen[slug]) {
        n += 1;
        slug = base + '-' + n;
      }
      seen[slug] = true;
      app._slug = slug;
      app._index = i;
    });
    return collection;
  }

  var base = (typeof window !== 'undefined' && window.VWAD_BASE) ? window.VWAD_BASE + '/' : '';
  var collectionPromise = fetch(base + 'data/collection.json')
    .then(function (r) {
      if (!r.ok) throw new Error('Failed to load collection');
      return r.json();
    })
    .then(assignSlugs);

  function getAppBySlug(slug) {
    return collectionPromise.then(function (list) {
      return list.find(function (app) {
        return app._slug === slug;
      }) || null;
    });
  }

  function searchApps(query, filters) {
    query = (query || '').toLowerCase().trim();
    filters = filters || {};
    return collectionPromise.then(function (list) {
      return list.filter(function (app) {
        if (filters.collection && filters.collection.length) {
          var hasCollection = (app.collection || []).some(function (c) {
            return filters.collection.indexOf(c) !== -1;
          });
          if (!hasCollection) return false;
        }
        if (filters.technology && filters.technology.length) {
          var tech = (app.technology || []).map(function (t) {
            return t.toLowerCase();
          });
          var hasTech = filters.technology.some(function (t) {
            return tech.indexOf(t.toLowerCase()) !== -1;
          });
          if (!hasTech) return false;
        }
        if (!query) return true;
        var searchable = [
          app.name,
          app.author,
          app.notes,
          (app.technology || []).join(' '),
          (app.collection || []).join(' ')
        ].join(' ').toLowerCase();
        return searchable.indexOf(query) !== -1;
      });
    });
  }

  function getPathSlug() {
    var pathname = window.location.pathname || '';
    var parts = pathname.split('app/');
    if (parts.length < 2) return null;
    return parts[1].replace(/\/$/, '') || null;
  }

  window.VWAD = {
    getCollection: function () {
      return collectionPromise;
    },
    getAppBySlug: getAppBySlug,
    searchApps: searchApps,
    getPathSlug: getPathSlug,
    slugify: slugify
  };
})();
