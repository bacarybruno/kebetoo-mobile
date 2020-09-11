/**
 * Creates insets from the top (T), right (R), bottom (B) and left (L) values
 * @param {*} top
 * @param {*} right
 * @param {*} bottom
 * @param {*} left
 */
const fromTRBL = (top, right, bottom, left) => {
  if (top && right && bottom && left) {
    return {
      top, right, bottom, left,
    }
  }
  throw new Error('fromTRBL requires all values to be defined. Use only instead!')
}

/**
 * Create a symmetric insets values :
 * horizontal = left and right
 * vertical = top and bottom
 * @param {*} value
 */
const symmetric = ({ horizontal = 0, vertical = 0 }) => ({
  top: vertical,
  right: horizontal,
  bottom: vertical,
  left: horizontal,
})

/**
 * Create insets by only passing the required field.
 * The others fields will be equal to 0
 * @param {*} value
 */
const only = ({
  top = 0, right = 0, bottom = 0, left = 0,
}) => ({
  top,
  right,
  bottom,
  left,
})

/**
 * Create insets with the same value
 * @param {*} value
 */
const all = (value) => ({
  top: value,
  right: value,
  bottom: value,
  left: value,
})

/**
 * Create insets with all values equal to 0
 */
const zero = () => only({})

export default {
  fromTRBL,
  symmetric,
  only,
  all,
  zero,
}
