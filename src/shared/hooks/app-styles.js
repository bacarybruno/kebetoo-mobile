import useAppColors from '@app/shared/hooks/app-colors'

const useAppStyles = (themedStylesFactory) => {
  const { colors } = useAppColors()
  return themedStylesFactory(colors)
}

export default useAppStyles
