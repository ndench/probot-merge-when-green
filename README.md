[![Build Status](https://travis-ci.com/phstc/probot-merge-when-green.svg?branch=master)](https://travis-ci.com/phstc/probot-merge-when-green)

![Merge when green logo](merge-when-green.png)

# Merge when green

Tired of waiting for long-running tests before merging pull requests?

Label your pull requests with `merge when green` then let Merge when green to patiently "wait" for all tests to pass then merge your pull request (and delete the pull request branch - you can always restore it).

![](https://raw.githubusercontent.com/phstc/probot-merge-when-green/master/merge-when-green-1.png)
![](https://raw.githubusercontent.com/phstc/probot-merge-when-green/master/merge-when-green-2.png)

## Installation instructions

Go to https://github.com/apps/merge-when-green

### Requirements

Merge when green only works with Travis CI, and CicleCI with GitHub Checks enabled.

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
