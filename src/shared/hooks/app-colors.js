import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useColorScheme } from 'react-native'

import { appSelector } from '@app/redux/selectors'
import { createThemeColors } from '@app/theme/colors'

const useAppColors = () => {
  const colorScheme = useColorScheme()
  const theme = useSelector(appSelector)?.theme ?? 'light'
  const themeColorScheme = theme === 'dark' || theme === 'light' ? theme : colorScheme
  const colors = useMemo(() => createThemeColors(themeColorScheme), [themeColorScheme])
  return colors
}

export default useAppColors
