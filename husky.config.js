module.exports = {
  hooks: {
    // 'pre-commit': 'yarn test src --silent',
    'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
  },
}
