const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  webpack: {
    configure(webpackConfig, { env }) {
      // Uncomment this to simplify debugging in production
      if (env === "production") {
        webpackConfig.optimization.minimizer = [
          new TerserPlugin({
            terserOptions: {
              mangle: false,
              compress: {
                keep_classnames: true,
                keep_fnames: true,
              },
            },
          }),
        ];

        webpackConfig.optimization.moduleIds = "named";

        webpackConfig.optimization.concatenateModules = false;

        webpackConfig.resolve.alias = {
          ...webpackConfig.resolve.alias,
          "react-dom$": "react-dom/profiling",
          "scheduler/tracing": "scheduler/tracing-profiling",
        };
      }

      return webpackConfig;
    },
  },
};
