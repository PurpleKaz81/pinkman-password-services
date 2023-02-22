# Pinkman Password Services

Pinkman Password Services is a JavaScript web app that provides a simple and secure way to generate and authenticate passwords.

## Table of Contents

- [What is it for?](#what-is-it-for)
- [Features](#features)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## What is it for?

The Pinkman Password Services project's goal is to assist users in creating and verifying safe passwords. Create original, safe passwords for any application or website with the tool's password generator and authenticator function.

## Features

The project includes the following features:

- **Password generator:** The password generator feature creates a (relatively) secure random password of a specified length and character set, and automatically copies it to the user's clipboard. The generator uses a cryptographically secure pseudorandom number generator to ensure that the passwords are difficult to guess or crack. Users get a password with upper and lower case letters, numbers, and special characters. The tool then uses the clipboard API to copy the password to the user's clipboard so it can be easily pasted into a form or application.
- **Password authenticator:** The password authenticator feature allows users to check whether a password meets certain criteria. The tool includes a function, `validatePassword()`, which takes the value of a password input field and uses a regular expression pattern to test whether the password meets the criteria. If the password meets the criteria, the function returns `true`. Otherwise, it returns `false`. This feature can help users ensure that their passwords are strong and meet security best practices.
- **Password toggle:** The password toggle feature allows users to reveal or hide their passwords as they type them in. Users can click on the eye icon to toggle between hidden and visible password input fields. This feature can help users ensure that they have entered the correct password and also provides a better user experience.

## Usage

To use the Pinkman Password Services web app:

1. Open the web app in your browser.
2. Click the `Generate & Copy` button to generate a random password and copy it to your clipboard.
3. Paste the password into the password authenticator field and click or hit `Submit`. The password authenticator will check whether the password meets certain criteria (e.g. includes upper and lower case letters, numbers, and special characters).
4. If the password is valid, a Bootstrap 5 modal will appear with a success message. If the password is invalid, an error message will appear below the submit button.

## Contributing

If you're interested in contributing to the Pinkman Password Services project, we welcome your suggestions and pull requests. Please feel free to reach out to us on GitHub or by email at rakasin@gmail.com if you have any ideas or questions.

## License

This project is licensed under the [MIT License](https://mit-license.org/).
