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

export { vendor_binaries, predefined_settings, php_versions }
