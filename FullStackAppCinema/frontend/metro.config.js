const { getDefaultConfig } = require("@react-native/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

// Thêm các phần mở rộng file hỗ trợ
defaultConfig.resolver.sourceExts = [...defaultConfig.resolver.sourceExts, "jsx", "js", "ts", "tsx"];

module.exports = defaultConfig;
