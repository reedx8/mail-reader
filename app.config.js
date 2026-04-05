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
    },
    scheme: IS_DEV ? 'mailreader-dev' : 'mailreader',
    icon: getIcon(),
});

const getUniqueIdentifier = () => {
    if (IS_DEV) {
        return 'com.anonymous.mailreader.dev';
    }

    if (IS_PREVIEW) {
        return 'com.anonymous.mailreader.preview';
    }

    return 'com.anonymous.mailreader';
};

const getAppName = () => {
    if (IS_DEV) {
        return 'Mail Reader (Dev)';
    }

    if (IS_PREVIEW) {
        return 'Mail Reader (Preview)';
    }

    return 'Mail Reader';
};

const getIcon = () => {
    if (IS_DEV) {
        return './assets/images/icon.png';
    }

    if (IS_PREVIEW) {
        return './assets/images/icon-preview.png';
    }

    return './assets/images/icon.png';
};
