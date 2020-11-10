// eslint-disable-next-line import/no-extraneous-dependencies
import LocalizedStringsCore from 'react-localization'

const getInterfaceLanguage = () => 'en'

export default class LocalizedStrings extends LocalizedStringsCore {
  constructor(props) {
    super(props, getInterfaceLanguage)
  }
}
