import LocalizedStrings from 'react-native-localization'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/en'
import 'dayjs/locale/fr'

import frStrings from 'Kebetoo/assets/locales/fr'
import enStrings from 'Kebetoo/assets/locales/en'

const strings = new LocalizedStrings({
  fr: frStrings,
  en: enStrings,
})

dayjs.locale(strings.getLanguage())
dayjs.extend(relativeTime)

export default strings
