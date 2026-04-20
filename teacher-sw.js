/* ═══════════════════════════════════════════════════════
   teacher-sw.js — Service Worker cho Teacher Panel
   Nhận Web Push notification khi HV nộp bài / hoàn thành
   ═══════════════════════════════════════════════════════ */

var CACHE_NAME = 'teacher-sw-v1';

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(self.clients.claim());
});

/* ── Push event: hiển thị notification ── */
self.addEventListener('push', function(e) {
  var data = {};
  try { data = e.data ? e.data.json() : {}; } catch(err) {}

  var title = data.title || 'Tiếng Anh² Hiếu';
  var body  = data.body  || 'Có thông báo mới từ học viên';
  var icon  = data.icon  || '/favicon.png';
  var tag   = data.tag   || 'teacher-notif';
  var url   = data.url   || '/';

  var opts = {
    body: body,
    icon: icon,
    badge: '/favicon.png',
    tag: tag,
    renotify: true,
    data: { url: url }
  };

  e.waitUntil(self.registration.showNotification(title, opts));
});

/* ── Notification click: mở teacher panel ── */
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  var targetUrl = (e.notification.data && e.notification.data.url) || '/';
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clients) {
      for (var i = 0; i < clients.length; i++) {
        var c = clients[i];
        if (c.url.indexOf('teacher') !== -1 && 'focus' in c) {
          return c.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
