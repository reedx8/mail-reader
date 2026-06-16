const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

export default ({ config }) => ({
    ...config,
    name: getAppName(),
    ios: {
        ...config.ios,
        bundleIdentifier: getUniqueIdentifier(),
    },
    android: {
        ...config.android,
        package: getUniqueIdentifier(),
        adaptiveIcon: getAdaptiveIcon(),
    },
    scheme: IS_DEV ? 'mailreader-dev' : 'mailreader',
    icon: getIcon(),
});

const getAdaptiveIcon = () => {
    if (IS_DEV) {
        return {
            foregroundImage: './assets/images/ic_launcher_foreground_dev.png',
            backgroundImage: './assets/images/ic_launcher_background.png',
            monochromeImage: './assets/images/ic_launcher_monochrome_dev.png',
        };
    }
    if (IS_PREVIEW) {
        return {
            foregroundImage: './assets/images/ic_launcher_foreground.png',
            backgroundImage: './assets/images/ic_launcher_background.png',
            monochromeImage: './assets/images/ic_launcher_monochrome.png',
        };
    }

    return {
        foregroundImage: './assets/images/ic_launcher_foreground.png',
        backgroundImage: './assets/images/ic_launcher_background.png',
        monochromeImage: './assets/images/ic_launcher_monochrome.png',
    };
};

const getUniqueIdentifier = () => {
    if (IS_DEV) {
        return 'com.fullstaxdev.mailreader.dev';
    }

    if (IS_PREVIEW) {
        return 'com.fullstaxdev.mailreader.preview';
    }

    return 'com.fullstaxdev.mailreader';
};

const getAppName = () => {
    if (IS_DEV) {
        return 'MailReader (Dev)';
    }

    if (IS_PREVIEW) {
        return 'MailReader (Preview)';
    }

    return 'MailReader';
};

const getIcon = () => {
    if (IS_DEV) {
        return './assets/images/icon-2-dev.png';
    }

    if (IS_PREVIEW) {
        return './assets/images/icon-3.png';
    }

    return './assets/images/icon-3.png';
};
