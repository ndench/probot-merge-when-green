// Based on https://github.com/phstc/probot-github-flow/blob/868819b65d20367fe5f682999fbeb97421d227b7/test/utils/findFixableIssues.test.js
import findFixableIssues from '../src/findFixableIssues'

test('returns issues', () => {
  expect(findFixableIssues('Closes #1234')).toEqual(['1234'])
  expect(
    findFixableIssues('Fix https://github.com/org/repo/issues/1234')
  ).toEqual(['1234'])
  expect(findFixableIssues('Resolve #1234 Fix #1234')).toEqual(['1234'])
  expect(findFixableIssues('Close #1234 \n Fixes #5678')).toEqual([
    '1234',
    '5678'
  ])
  expect(findFixableIssues('Closes username/repository#1234')).toEqual(['1234'])
})

test('returns no issues', () => {
  expect(findFixableIssues('Hello World')).toEqual([])
})
