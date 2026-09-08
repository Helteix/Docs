import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// One independently-versioned docs instance per Helteix package.
const packageDocs = [
  {id: 'tools', label: 'Tools', version: '1.7.0'},
  {id: 'singletons', label: 'Singletons', version: '1.4.0'},
  {id: 'channeled-properties', label: 'Channeled Properties', version: '2.1.0'},
  {id: 'graphs', label: 'Graphs', version: '1.2.0'},
  {id: 'cards', label: 'Cards', version: '0.3.0'},
];

const config: Config = {
  title: 'Helteix',
  favicon: 'img/LTXIcon.png',

  future: {
    v4: true,
  },

  url: 'https://helteix.github.io',
  baseUrl: '/Docs/',

  organizationName: 'Helteix',
  projectName: 'Docs',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // Enables ```mermaid diagrams in the docs.
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  // Tracks which package the visitor is browsing so the navbar can show only
  // that package's version selector.
  clientModules: [require.resolve('./src/currentPackage.js')],

  presets: [
    [
      'classic',
      {
        // Default docs instance: the landing / "All Packages" overview.
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.ts'),
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  // One docs plugin instance per package, each with its own versioning.
  plugins: packageDocs.map((pkg) => [
    '@docusaurus/plugin-content-docs',
    {
      id: pkg.id,
      path: pkg.id,
      routeBasePath: pkg.id,
      sidebarPath: require.resolve('./sidebars.ts'),
      // The live `<package>/` folder is the current (served) version, labelled with the
      // package's version. Freeze it on release: `docs:version:<id> <newVersion>`.
      versions: {
        current: {label: pkg.version, badge: true},
      },
    },
  ]),

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Helteix',
      items: [
        // Per-package version selectors. CSS (custom.css) shows only the one
        // matching the package currently being browsed.
        ...packageDocs.map((pkg) => ({
          type: 'docsVersionDropdown' as const,
          docsPluginId: pkg.id,
          position: 'right' as const,
          className: `nav-ver nav-ver--${pkg.id}`,
        })),
      ],
    },
    prism: {
      theme: prismThemes.vsDark,
      additionalLanguages: ['csharp'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
