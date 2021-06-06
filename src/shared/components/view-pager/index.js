import { forwardRef } from 'react'
import PagerView from 'react-native-pager-view'

const ViewPager = forwardRef((props, ref) => {
  return <PagerView ref={ref} {...props} />
})

export default ViewPager
