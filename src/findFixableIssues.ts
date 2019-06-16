// Based on https://github.com/phstc/probot-github-flow/blob/868819b65d20367fe5f682999fbeb97421d227b7/lib/utils/findFixableIssues.js
export default (body: string): string[] => {
  const matches = body.match(
    /(close|closes|closed|fix|fixes|fixed|resolve|resolves|resolved)\s*(#\d+|https?:\/\/github\.com\/.*\/.*\/issues\/\d+|.*\/.*#\d+)/gi
  )

  return Array.from(
    new Set(
      (matches || []).map(
        (match): string => {
          if (match.indexOf('#') > -1) {
            // #1234
            return String(match.split('#').pop())
          } else {
            // https://github.com/org/repo/issues/1234
            return String(match.split('/').pop())
          }
        }
      )
    )
  )
}
