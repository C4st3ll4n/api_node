const config = request('./jest.config')
config.testMatch = ['**/*.test.ts']
module.exports = config