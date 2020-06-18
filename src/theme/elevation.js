// https://github.com/ethercreative/react-native-shadow-generator

import colors from "./colors"

const penumbra = [
  '0px 1px 1px 0px',
  '0px 2px 2px 0px',
  '0px 3px 4px 0px',
  '0px 4px 5px 0px',
  '0px 5px 8px 0px',
  '0px 6px 10px 0px',
  '0px 7px 10px 1px',
  '0px 8px 10px 1px',
  '0px 9px 12px 1px',
  '0px 10px 14px 1px',
  '0px 11px 15px 1px',
  '0px 12px 17px 2px',
  '0px 13px 19px 2px',
  '0px 14px 21px 2px',
  '0px 15px 22px 2px',
  '0px 16px 24px 2px',
  '0px 17px 26px 2px',
  '0px 18px 28px 2px',
  '0px 19px 29px 2px',
  '0px 20px 31px 3px',
  '0px 21px 33px 3px',
  '0px 22px 35px 3px',
  '0px 23px 36px 3px',
  '0px 24px 38px 3px',
]

const parseShadow = (raw) => {
  const [x, y, blur] = raw.split(' ').map((val) => val.replace('px', ''))
  return { x, y, blur }
}

const interpolate = (i, a, b, a2, b2) => (
  // eslint-disable-next-line no-mixed-operators
  (i - a) * (b2 - a2) / (b - a) + a2
)

const buildElevation = ({
  x = 0, y = 0, shadowOpacity = 0, shadowRadius = 0, elevation = 0,
}) => ({
  shadowColor: 'red',
  shadowOffset: { x, y },
  shadowOpacity,
  shadowRadius,
  elevation,
})

const elevation = (value) => {
  if (value === 0) return buildElevation({})
  const depth = value - 1
  const shadow = parseShadow(penumbra[depth])
  return buildElevation({
    y: shadow.y === 1 ? 1 : Math.floor(shadow.y * 0.5),
    shadowOpacity: parseFloat(interpolate(depth, 1, 24, 0.2, 0.6).toFixed(2)),
    shadowRadius: parseFloat(interpolate(shadow.blur, 1, 38, 1, 16).toFixed(2)),
    elevation: value,
  })
}

export default elevation
