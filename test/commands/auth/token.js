'use strict'

const td = require('testdouble')
const proxyquire = require('proxyquire')

let netrc = td.object('netrc-parser')
netrc.default.loadSync = td.function()
netrc['@global'] = true
const cli = proxyquire('heroku-cli-util', {'netrc-parser': netrc})

const cmd = proxyquire('../../../src/commands/auth/token', {'heroku-cli-util': cli})
const expect = require('unexpected')

describe('auth:token', () => {
  beforeEach(() => cli.mockConsole())

  it('shows logged in user', () => {
    netrc.default.machines = {'api.heroku.com': {password: 'myapikey'}}
    return cmd.run({})
      .then(() => expect(cli.stdout, 'to equal', 'myapikey\n'))
      .then(() => expect(cli.stderr, 'to be empty'))
  })
})
