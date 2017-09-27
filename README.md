It's a black magic library for Nuxt.js

## mixin works

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

## calling a vuex action via this.

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
    // same syntax with asyncData()
    this.findBooks()
  }
})
```

