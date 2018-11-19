[![Build Status](https://travis-ci.com/phstc/probot-merge-when-green.svg?branch=master)](https://travis-ci.com/phstc/probot-merge-when-green)

# probot-merge-when-green

Tired of waiting for long-running tests before to merge pull requests?

Label your pull requests with `merge when green` then let merge when green to patiently "wait" for all tests to pass then merge your pull request.

![](https://raw.githubusercontent.com/phstc/probot-merge-when-green/master/merge-when-green-1.png)
![](https://raw.githubusercontent.com/phstc/probot-merge-when-green/master/merge-when-green-2.png)

Merge when green only works with Travis CI, and CicleCI with GitHub Checks enabled.

* https://blog.travis-ci.com/2018-05-07-announcing-support-for-github-checks-api-on-travis-ci-com
* https://circleci.com/docs/2.0/enable-checks/

## Setup

```sh
# Install dependencies
yarn install

# Run typescript
yarn run build

# Run the bot
yarn start
```

## Contributing

If you have suggestions for how probot-merge-when-green could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2018 Pablo Cantero <pablohstc@gmail.com> (https://github.com/phstc/probot-merge-when-green)
