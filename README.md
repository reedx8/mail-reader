# USPS Mail Reader

iOS Mobile App utilizing computer vision to match mail to the correct loop within routes at USPS, speeding up casing, improving accuracy, and faciliting flexibility in USPS carriers. Future plans include matching mail to the correct shelf within the case using VR/AR glasses.

## Get started

1. Install dependencies

    ```bash
    npm install
    ```

2. Plug in your iPhone to computer and turn developer mode on - you may also need to create your code signing certificate ([https://github.com/expo/fyi/blob/main/setup-xcode-signing.md](https://github.com/expo/fyi/blob/main/setup-xcode-signing.md)), and any further setup you may need is explained further in expo doc ([https://docs.expo.dev/get-started/set-up-your-environment/#plug-in-your-device-via-usb-and-enable-developer-mode](https://docs.expo.dev/get-started/set-up-your-environment/#plug-in-your-device-via-usb-and-enable-developer-mode))

3. To start the development and run, run the following command in project directory depending on if you're on public or private wifi. Choose your plugged in device when prompted:

Public:

    ```bash
    npx expo start --tunnel
    ```

Private:

    ```bash
    npx expo run:ios --device
    ```
