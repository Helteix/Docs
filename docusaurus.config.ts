import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// One independently-versioned docs instance per Helteix package.
const packageDocs = [
  {id: 'tools', label: 'Tools'},
  {id: 'singletons', label: 'Singletons'},
  {id: 'channeled-properties', label: 'Channeled Properties'},
  {id: 'graphs', label: 'Graphs'},
  {id: 'cards', label: 'Cards'},
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
      // Only released (versioned) docs are shown. The live `<package>/` folder is
      // the working copy for the next version; run `docs:version:<id> <ver>` to freeze it.
      includeCurrentVersion: false,
    },
  ]),

  themeConfig: {
    navbar: {
      title: 'Helteix',
      items: [
        {
          type: 'dropdown',
          label: 'Packages',
          position: 'left',
          items: packageDocs.map((pkg) => ({
            type: 'doc',
            docId: 'intro',
            docsPluginId: pkg.id,
            label: pkg.label,
          })),
        },
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
