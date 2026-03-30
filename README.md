# USPS Mail Reader

iOS Mobile App utilizing computer vision to match mail to the correct loop within routes at USPS, speeding up casing, improving accuracy, and faciliting flexibility in USPS carriers.

## Get started

1. Install dependencies

    ```bash
    npm install
    ```

2. Plug in your iPhone to computer and turn developer mode on - you may also need to create your code signing certificate ([https://github.com/expo/fyi/blob/main/setup-xcode-signing.md](https://github.com/expo/fyi/blob/main/setup-xcode-signing.md)), and any further setup you may need is explained further in expo doc ([https://docs.expo.dev/get-started/set-up-your-environment/#plug-in-your-device-via-usb-and-enable-developer-mode](https://docs.expo.dev/get-started/set-up-your-environment/#plug-in-your-device-via-usb-and-enable-developer-mode))

3. (Dev build) To build and run on device, use `npm run dev:ios`.
    - If on public wifi, cancel metro builder once built, and run `npm run tunnel`.
    - (iPhone) Trust your device at Settings -> General -> VPN And Device Management -> Developer App (Use your cellular network instead if apple wont trust the app on your device).

4. (Preview build) To build and run without a dev server on device, use `npm run preview:ios`.
