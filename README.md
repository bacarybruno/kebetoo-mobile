# Kebetoo
[![Code Style](https://badgen.net/badge/code%20style/airbnb/fd5c63)](https://github.com/airbnb/javascript) [![codecov](https://codecov.io/gh/bacarybruno/kebetoo-mobile/branch/develop/graph/badge.svg?token=FHQ0ZB0KEQ)](https://codecov.io/gh/bacarybruno/kebetoo-mobile) [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/bacarybruno/kebetoo-mobile)

A microblogging app for the African community.
Built with React Native.

## Key features

- Create posts different content types : text, audio, images
- Comment posts with text and audio
- Share text, images and audios from other apps to Kebetoo
- Receive notifications when other users interact with your posts

You can also:
- React to a post (like, dislike, share) or comment (love)
- See the stats of your posts
- Enable Dark mode
- ... and much more !

## Roadmap
This project is under active development. A public roadmap will be available soon.
For now, the product backlog is hosted on the [project section](https://github.com/bacarybruno/kebetoo-mobile/projects/1).

## Installation
Kebetoo requires [Node.js](https://nodejs.org/) and [React Native](http://reactnative.dev) to run.
This installation guide will focus on android.

### Steps
Install the dependencies and devDependencies of the [server app](https://github.com/bacarybruno/kebetoo-mobile) then start the server.

```sh
$ mongod
$ cd kebetoo-strapi-app
$ yarn install
$ yarn develop

```

Install the dependencies and devDependencies of the [serverless project](https://github.com/bacarybruno/kebetoo-serverless) then start the server.

```sh
$ cd kebetoo-serverless
$ yarn install
$ yarn develop

```

Ensure that you have plugged your android device and enabled usb debugging.
Install the dependencies and devDependencies of the [client app](https://github.com/bacarybruno/kebetoo-mobile) then start the client.

```sh
$ cd kebetoo-mobile
$ yarn install
$ yarn start
$ yarn android:tcp
$ yarn android:dev
```

Once the app is open, toggle developer options and change bundle location to `localhost:1148`.
And the reload the app.

### Contributing
Want to contribute? Great, create a fork a the project and start hacking!
Ensuite that the coverage of your code is under 80%. That's the minimum required for this project.

A new contribution guide will soon be created.

Here are the instructions related to tests.

#### Run tests
```sh
$ yarn test src
```

#### Generate coverage report
```sh
$ yarn coverage
```

## Other informations
Useful informations can be found in the [documentation](https://github.com/bacarybruno/kebetoo-mobile/blob/develop/docs.md).
