var React = require('react')
var Link = require('react-router/lib/Link')
var TimeAgo = require('react-timeago').default

var SettingsStore = require('../stores/SettingsStore')
var pluralise = require('../utils/pluralise')
var urlParse = require('url-parse')

import { ItemTitle, ItemMeta, ItemBy, ItemTime, ItemScore, ItemHost } from '../Items';

var ItemTimeAgo = ItemTime.withComponent(TimeAgo);

var parseHost = function(url) {
  var hostname = (urlParse(url, true)).hostname
  var parts = hostname.split('.').slice(-3)
  if (parts[0] === 'www') {
    parts.shift()
  }
  return parts.join('.')
}

/**
 * Reusable logic for displaying an item.
 */
var ItemMixin = {
  /**
   * Render an item's metadata bar.
   */
  renderItemMeta(item, extraContent) {
    var itemDate = new Date(item.time * 1000)

    if (item.type === 'job') {
      return <ItemMeta>
        <ItemTimeAgo date={itemDate}/>
      </ItemMeta>
    }

    return <ItemMeta>
      <ItemScore>
        {item.score} point{pluralise(item.score)}
      </ItemScore>{' '}
      <ItemBy>
        by <Link to={`/user/${item.by}`}>{item.by}</Link>
      </ItemBy>{' '}
      <ItemTimeAgo date={itemDate}/>
      {' | '}
      <Link to={`/${item.type}/${item.id}`}>
        {item.descendants > 0 ? item.descendants + ' comment' + pluralise(item.descendants) : 'discuss'}
      </Link>
      {extraContent}
    </ItemMeta>
  },

  /**
   * Render an item's title bar.
   */
  renderItemTitle(item) {
    var hasURL = !!item.url
    var title
    if (item.dead) {
      title = '[dead] ' + item.title
    }
    else {
      title = (hasURL ? <a href={item.url}>{item.title}</a>
                      : <Link to={`/${item.type}/${item.id}`}>{item.title}</Link>)
    }
    return <ItemTitle style={{fontSize: SettingsStore.titleFontSize}}>
      {title}
      {hasURL && ' '}
      {hasURL && <ItemHost>({parseHost(item.url)})</ItemHost>}
    </ItemTitle>
  }
}

module.exports = ItemMixin
