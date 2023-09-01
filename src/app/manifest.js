export default function manifest() {
  return {
    name: 'To Do List',
    short_name: 'TO DO',
    description: 'A simple to-do list to keep track of things to do',
    start_url: '/',
    display: 'standalone',
    background_color: '#141517',
    theme_color: '#ff670e',
    icons: [
      {
        src: '/src/app/imgs/icon/logo-icon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
    screenshots: [
      {
        src: '/src/app/imgs/screenshots/screenshot-1.png',
        type: 'image/png',
        sizes: '2256x1286',
        form_factor: 'narrow',
      },
      {
        src: '/src/app/imgs/screenshots/screenshot-2.png',
        type: 'image/png',
        sizes: '2256x1283',
        form_factor: 'narrow',
      },
      {
        src: '/src/app/imgs/screenshots/screenshot-3.png',
        type: 'image/png',
        sizes: '2256x1279',
        form_factor: 'narrow',
      },
      {
        src: '/src/app/imgs/screenshots/screenshot-4.png',
        type: 'image/png',
        sizes: '2256x1285',
        form_factor: 'narrow',
      },
      {
        src: '/src/app/imgs/screenshots/screenshot-5.png',
        type: 'image/png',
        sizes: '2256x1282',
        form_factor: 'narrow',
      },
      {
        src: '/src/app/imgs/screenshots/screenshot-6.png',
        type: 'image/png',
        sizes: '2256x1288',
        form_factor: 'narrow',
      },
      {
        src: '/src/app/imgs/screenshots/screenshot-7.png',
        type: 'image/png',
        sizes: '2256x1284',
        form_factor: 'narrow',
      },
      {
        src: '/src/app/imgs/screenshots/screenshot-8.png',
        type: 'image/png',
        sizes: '2256x1284',
        form_factor: 'narrow',
      },
      {
        src: '/src/app/imgs/screenshots/screenshot-9.png',
        type: 'image/png',
        sizes: '2256x1269',
        form_factor: 'narrow',
      },
    ],
  }
}
