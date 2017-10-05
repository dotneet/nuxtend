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

## methods can be used on asyncData/fetch via `this`.

This feature enables you to call a vuex action in same syntax anywhere. 
Of course you can call non vuex action methods also.

```js
import nuxtend from 'nuxtend'
import {mapActions} from 'vuex'

const mixinA = {
  methods: {
    ...mapActions({'findBooks': 'books/find'})
  }
}

export default nuxtend({
  mixins: [mixinA],
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
  },
  methods: {
    ...mapActions({
      'findAudios': 'audios/find'
    })
  }
})
```

