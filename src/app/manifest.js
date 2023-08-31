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
        src: '/src/app/imgs/',
        type: 'image/png',
        sizes: '540x720',
        form_factor: 'narrow',
      },
    ],
  }
}
