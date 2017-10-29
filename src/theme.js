const SettingsStore = require('./stores/SettingsStore')

const theme = {
    titleFontSize: SettingsStore.titleFontSize || '18px',
    listSpacing: SettingsStore.listSpacing || '16px'
}

exports.theme = theme;