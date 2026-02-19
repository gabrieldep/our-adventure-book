
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/our-adventure-book/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "preload": [
      "chunk-MHL2LZHC.js"
    ],
    "route": "/our-adventure-book"
  },
  {
    "renderMode": 2,
    "redirectTo": "/our-adventure-book",
    "route": "/our-adventure-book/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 8128, hash: '8d5f90749b728043409ea4ffeae7386192c110ce10cc8e0756c67c6ff8e2f02e', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 4242, hash: '5edabe9314c415e81075f6fdabb3909bf73f320a582c053f9656bf639fa6e874', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 28218, hash: '3ff9a64f1f887926486546efa0c07aecf8637d65c8f807d36944f88ff0136209', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-5PYDJJXD.css': {size: 23750, hash: 'KOpwqfRf2Xk', text: () => import('./assets-chunks/styles-5PYDJJXD_css.mjs').then(m => m.default)}
  },
};
