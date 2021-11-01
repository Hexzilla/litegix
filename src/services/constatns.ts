const php_versions: Array<object> = [
  {
    value: 'php72',
    text: 'PHP 7.2',
  },
  {
    value: 'php73',
    text: 'PHP 7.3',
  },
  {
    value: 'php74',
    text: 'PHP 7.4',
  },
  {
    value: 'php80',
    text: 'PHP 8.0',
  },
]

const web_application_stacks: Array<object> = [
  {
    value: 'nginx_apache2',
    text: 'NGINX + Apache2 Hybrid (You will be able to use .htaccess)',
  },
  {
    value: 'native_nginx',
    text: "Native NGINX (You won't be able to use .htaccess but it is faster)",
  },
  {
    value: 'nginx_custom',
    text: 'Native NGINX + Custom config (For power user. Manual Nginx implementation)',
  },
]

const web_environments: Array<object> = [
  {
    value: 'production',
    text: 'Production',
  },
  {
    value: 'development',
    text: 'Development',
  },
]

const web_ssl_methods: Array<object> = [
  {
    value: 'basic',
    text: 'Basic (One SSL certificate for all domains on this web app)',
  },
  {
    value: 'advanced',
    text: 'Advanced (Different SSL certificate for every domain on this web app)',
  },
]

const vendor_binaries: Array<object> = [
  {
    value: 'php72',
    text: '/Litegix/Packages/php72/bin/php',
  },
  {
    value: 'php73',
    text: '/Litegix/Packages/php73/bin/php',
  },
  {
    value: 'php74',
    text: '/Litegix/Packages/php74/bin/php',
  },
  {
    value: 'php80',
    text: '/Litegix/Packages/php80/bin/php',
  },
  {
    value: 'node',
    text: '/user/bin/node',
  },
  {
    value: 'bash',
    text: '/bin/bash',
  },
]

const predefined_settings: Array<object> = [
  {
    value: 'e1',
    text: 'Every Minutes',
  },
  {
    value: 'e10',
    text: 'Every 10 Minutes',
  },
  {
    value: 'e30',
    text: 'Every 30 Minutes',
  },
  {
    value: 'eh',
    text: 'Every Hours',
  },
  {
    value: 'mn',
    text: 'All midnight',
  },
  {
    value: 'ed',
    text: 'Every Day',
  },
  {
    value: 'ew',
    text: 'Every Week',
  },
  {
    value: 'em',
    text: 'Every Month',
  },
]

export {
  vendor_binaries,
  predefined_settings,
  php_versions,
  web_application_stacks,
  web_environments,
  web_ssl_methods,
}
