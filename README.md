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

```js
export default nuxnted({
  nuxtend: {
    actions: ['apple', 'me/banana']
  },
  async asyncData () {
    // if 'apples/get' action is defined call it, if not call $axios.get('/apples/10')
    const res = await this.getApple(10)
    // and also below functions can be used as well.
    // - action: 'apples/getList'  api: this.$axios.get('/apples', {params: {status: 'dropped'}})
    // this.getAppleList({status: 'dropped'})
    // - action: 'apples/create'  api: this.$axios.post('/apples', {status: 'dropped'})
    // this.postApple({status: 'dropped'})
    // - action: 'apples/update'  api: this.$axios.put('/apples/10', {status: 'dropped'})
    // this.putApple({id: 10, params: {status: 'dropped'}})
    // - action: 'apples/delete'  api: this.$axios.delete('/apples/10')
    // this.deleteApple(10)

    // - action: 'me/bananas/get' api: this.$axios.get('/me/bananas/10')
    // this.getBanaa(1)

    return {
      apple: res.data
    }
  }
})
```


