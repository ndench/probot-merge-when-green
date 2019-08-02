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

By default, Merge when green will only watch for Travis CI and CircleCI checks. To watch for other checks, create a
`.github/merge-when-green.yml` file:

```yaml
requiredChecks:
  - circleci
  - travis-ci
  - my-ci-check
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
