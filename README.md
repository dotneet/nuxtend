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

## Abstraction of calling api and actions. (since 0.2.0)

export default nuxnted({
  nuxtend: {
    actions: ['apple']
  },
  async asyncData () {
    // if 'apples/get' action is defined call it, if not call $axios.get('/apples/10')
    this.getApple(10)
    // and also below functions can be used as well.
    // - action: 'apples/getList'  api: this.$axios.get('/apples', {params: {status: 'dropped'}})
    // this.getAppleList({status: 'dropped'})
    // - action: 'apples/create'  api: this.$axios.post('/apples', {status: 'dropped'})
    // this.postApple({status: 'dropped'})
    // - action: 'apples/update'  api: this.$axios.put('/apples', {status: 'dropped'})
    // this.putApple({status: 'dropped'})
    // - action: 'apples/delete'  api: this.$axios.delete('/apples/10')
    // this.putApple(10)
  }
})


