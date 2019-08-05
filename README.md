[![Build Status](https://travis-ci.com/phstc/probot-merge-when-green.svg?branch=master)](https://travis-ci.com/phstc/probot-merge-when-green)

![Merge when green logo](merge-when-green.png)

# Merge when green

Tired of waiting for long-running tests before merging pull requests?

Label your pull requests with `merge when green` then let Merge when green to automatically merge your pull requests once all tests have passed.


![](https://raw.githubusercontent.com/phstc/probot-merge-when-green/master/merge-when-green-1.png)
![](https://raw.githubusercontent.com/phstc/probot-merge-when-green/master/merge-when-green-2.png)

## Installation instructions

Visit https://github.com/marketplace/merge-when-green

### Configuration

Merge when green supports both Checks and Statuses. You can configure which ones must pass for the PR to be considered
"green" in order for it to be merged. Create a `.github/merge-when-green.yml` file to list the require checks/statuses:

```yaml
requiredChecks:
  - circleci
  - travis-ci
requiredStatuses:
  - jenkins
```

By default, Merge when green will only require the `cicleci` and `travis-ci` checks.

Merge when green also allows you to ensure that all requested reviews have approved the pull request. Just add the 
following to your `.github/merge-when-green.yml`:

```yaml
requireApprovalFromRequestedReviewers: true
```

You can change method that Merge when green uses to merge pull requests with the `mergeMethod` option. Valid values are 
`merge`, `squash` and `rebase`, the default is `merge`.

```yaml
mergeMethod: squash
```

#### Travis CI and CicleCI

To work with Travis CI and CicleCI make sure GitHub Checks are enabled.

* https://blog.travis-ci.com/2018-05-07-announcing-support-for-github-checks-api-on-travis-ci-com
* https://circleci.com/docs/2.0/enable-checks/


## Running in development

```sh
# Install dependencies
yarn install

# Run typescript
yarn run build

# Run the bot
yarn start
```

## Logo

:clap: design by [Glauber Rodger](https://github.com/rdgr).

## Contributing

If you have suggestions for how Merge when green could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2018 Pablo Cantero <pablohstc@gmail.com> (https://github.com/phstc/probot-merge-when-green)
