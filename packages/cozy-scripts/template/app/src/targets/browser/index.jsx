/* global cozy, __DEVELOPMENT__ */

import 'babel-polyfill'

import '../../styles'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { I18n } from 'cozy-ui/react/I18n'

import store from '../../lib/store'
import App from '../../components/App'

if (__DEVELOPMENT__) {
  // Enables React dev tools for Preact
  // Cannot use import as we are in a condition
  require('preact/devtools')

  // Export React to window for the devtools
  window.React = React
}

const renderApp = function (lang) {
  render(
    <I18n lang={lang} dictRequire={(lang) => require(`../../locales/${lang}`)}>
      <Provider store={store}>
        <App />
      </Provider>
    </I18n>
    , document.querySelector('[role=application]'))
}

// return a defaultData if the template hasn't been replaced by cozy-stack
const getDataOrDefault = function (toTest, defaultData) {
  const templateRegex = /^\{\{\.[a-zA-Z]*\}\}$/ // {{.Example}}
  return templateRegex.test(toTest) ? defaultData : toTest
}

document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[role=application]')
  const data = root.dataset

  // default data will allow to display correctly the cozy-bar
  // in the standalone (without cozy-stack connexion)
  const appIcon = getDataOrDefault(data.cozyIconPath, require('../vendor/assets/icon.svg'))

  const appEditor = getDataOrDefault(data.cozyAppEditor, '')

  const appName = getDataOrDefault(data.cozyAppName, require('../../../package.json').name)

  const appLocale = getDataOrDefault(data.cozyLocale, 'en')

  cozy.client.init({
    cozyURL: '//' + data.cozyDomain,
    token: data.cozyToken
  })
  cozy.bar.init({
    appEditor: appEditor,
    appName: appName,
    iconPath: appIcon,
    lang: appLocale,
    replaceTitleOnMobile: true
  })

  renderApp(appLocale)
})
