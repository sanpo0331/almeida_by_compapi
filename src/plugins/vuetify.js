import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, fa } from 'vuetify/iconsets/fa'
import { mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import '@fortawesome/fontawesome-free/css/all.css'

export const vuetify = createVuetify({
  components,
  directives,
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#009688',
          'primary-darken-1': '#004D40',
          secondary: '#B2DFDB',
          update: '#FFC107',
          back: '#757575'
        }
      }
    }
  },
  icons: {
    defaultSet: 'fa' || 'mdi',
    aliases,
    sets: {
      fa,
      mdi
    }
  }
})
