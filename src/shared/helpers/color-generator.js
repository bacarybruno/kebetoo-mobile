export const colors = ['#e57373', '#f06292', '#ba68c8', '#9575cd', '#7986cb', '#64b5f6',
  '#4fc3f7', '#4dd0e1', '#4db6ac', '#81c784', '#aed581', '#ff8a65', '#d4e157', '#673ab7',
  '#ffb74d', '#a1887f', '#90a4ae'];

const toNumber = (str) => {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = 31 * h + str.charCodeAt(i);
    // eslint-disable-next-line no-bitwise
    h |= 0; // Convert to 32bit integer
  }
  return h;
};

export default (str) => colors[Math.abs(toNumber(str)) % colors.length];
