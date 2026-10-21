const assert = require('node:assert/strict')
const { describe, it } = require('node:test')
const MailChecker = require('../platform/node')

function isValid(email) {
  assert.equal(MailChecker.isValid(email), true, `MailChecker.isValid(${email})`)
}

function isInvalid(email) {
  assert.equal(MailChecker.isValid(email), false, `MailChecker.isValid(${email})`)
}

describe('Node', () => {
  it('accepts valid emails', () => {
    isValid('plop@plop.com')
    isValid('my.ok@ok.plop.com')
    isValid('my+ok@ok.plop.com')
    isValid('my=ok@ok.plop.com')
    isValid('ok@gmail.com')
    isValid('ok@hotmail.com')
  })

  it('rejects invalid emails', () => {
    isInvalid(undefined)
    isInvalid(null)
    isInvalid(42)
    isInvalid({})
    isInvalid('plopplop.com')
    isInvalid('my+ok@ok=plop.com')
    isInvalid('my,ok@ok.plop.com')
    isInvalid('ok@tmail.com')
    isInvalid('plop@ip6.pp.ua')
    isInvalid('  ok@gmail.com  ')
    isInvalid('  ok@gmail.com')
    isInvalid('ok@gmail.com  ')
    isInvalid('\nok@gmail.com\n')
    isInvalid('\nok@gmail.com')
    isInvalid('ok@gmail.com\n')
  })

  it('rejects disposable domains and their subdomains', () => {
    isInvalid('ok@33mail.com')
    isInvalid('ok@ok.33mail.com')
    isInvalid('ok@guerrillamailblock.com')
  })

  it('handles email domains case-insensitively', () => {
    isValid('OK@GMAIL.COM')
    isInvalid('OK@YOPMAIL.COM')
  })

  it('checks every blacklisted domain without blocking similar suffixes', () => {
    assert.ok(MailChecker.blacklist() instanceof Set)
    assert.ok(MailChecker.blacklist().size > 0)
    for (const domain of MailChecker.blacklist()) {
      isInvalid(`test@${domain}`)
      isInvalid(`test@subdomain.${domain}`)
      isValid(`test@${domain}.gmail.com`)
    }
  })

  it('supports adding custom domains', (t) => {
    isValid('foo@youtube.com')
    isValid('foo@google.com')
    isValid('ok@gmail.com')

    t.after(() => {
      MailChecker.blacklist().delete('youtube.com')
      MailChecker.blacklist().delete('google.com')
    })
    MailChecker.addCustomDomains(['youtube.com', 'google.com'])

    isInvalid('foo@youtube.com')
    isInvalid('foo@google.com')
    isInvalid('foo@subdomain.youtube.com')
    isValid('ok@gmail.com')
  })

  it('allows calling addCustomDomains without arguments', () => {
    const size = MailChecker.blacklist().size

    MailChecker.addCustomDomains()

    assert.equal(MailChecker.blacklist().size, size)
  })
})
