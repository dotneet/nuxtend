This library makes Nuxt.js possible to use mixin for asyncData()/fetch() and provide some helpful features.

## Install

```bash
npm i nuxtend
```

## Mixin

```js
import nuxtend from 'nuxtend'

const m = {
  async asyncData (context) {
    // works!
    return {commonData: 'data'}
  }
}

export default nuxtend({
  mixins: [m],
  async asyncData (context) {
    return {}
  }
})
```

## Vuex action helper

Using `actions` property, you can call a vuex action in same syntax anywhere. 
Of course 'actions' property is supported by mixin.

```js
import nuxtend from 'nuxtend'

const m = {
  actions: {
    'findBooks': 'books/find'
  }
}

export default nuxtend({
  actions: {
    'findAudios': 'audios/find'
  },
  async asyncData (context) {
    const books = await this.findBooks()
    const audios = await this.findAudios()
    return {
      books,
      audios
    }
  },
  mounted () {
    this.findBooks()
  }
})
```

