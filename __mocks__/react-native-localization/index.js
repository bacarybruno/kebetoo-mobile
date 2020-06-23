export default class RNLocalization {
  language = 'en'

  constructor(props) {
    this.props = props
    this.setLanguage(this.language)
  }

  setLanguage(interfaceLanguage) {
    this.language = interfaceLanguage
    if (this.props[interfaceLanguage]) {
      const localizedStrings = this.props[this.language]
      Object.keys(localizedStrings).forEach((key) => {
        if (localizedStrings.hasOwnProperty(key)) {
          this[key] = localizedStrings[key]
        }
      })
    }
  }

  setInterfaceLanguage(interfaceLanguage) {
    this.setLanguage(interfaceLanguage)
  }

  getLanguage() {
    return this.language
  }

  getInterfaceLanguage() {
    return this.language
  }

  formatString(key) {
    const localizedStrings = this.props[this.language]
    return localizedStrings[key]
  }
}
