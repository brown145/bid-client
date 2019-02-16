const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'less',
  }),
  addLessLoader({
   javascriptEnabled: true,
   modifyVars: {
     '@primary-color': '#a0d911',
     '@heading-color': '#eaff8f',
     '@layout-header-padding': '0 4px',
     '@background-color-light': '#eaff8f',
     '@layout-header-background': '#262626',
     '@layout-sider-background-light': '#f5f5f5',
     '@layout-footer-background': '#f5f5f5',
     '@layout-body-background': '#fff',
     '@layout-footer-padding': '4px'
   },
 }),
);
