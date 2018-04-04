const pluralize = require('pluralize')
const {capitalize} = require('./utils')

module.exports = function (context, action) {
  if (!context) {
    console.warn('[nuxtend] genactions: conext is not passed.')
    return {}
  }
  if (!action) {
    console.warn('[nuxtend] genactions: action is not passed.')
    return {}
  }
  const capitalizedAction = capitalize(action)
  const pluralizedAction = pluralize.plural(action)
  const funcs = {}

  // usage example: this.getUser(123) or this.getUser({id: 123, params: {status=sleeping}})
  funcs[`get${capitalizedAction}`] = function (arg) {
    const fullQualifiedActionName = `${pluralizedAction}/get`
    if (typeof this.$store._actions[fullQualifiedActionName] !== 'undefined') {
      return this.$store.dispatch(fullQualifiedActionName, arg)
    } else {
      let id = arg
      let params = null
      if (typeof arg === 'object') {
        id = arg.id
        params = arg.params
      }
      return this.$axios.get(`/${pluralizedAction}/${id}`, {params})
    }
  }

  funcs[`get${capitalizedAction}List`] = function (params) {
    const fullQualifiedActionName = `${pluralizedAction}/getList`
    if (typeof this.$store._actions[fullQualifiedActionName] !== 'undefined') {
      return this.$store.dispatch(fullQualifiedActionName, params)
    } else {
      return this.$axios.get(`/${pluralizedAction}`, params)
    }
  }

  funcs[`post${capitalizedAction}`] = function (arg) {
    const fullQualifiedActionName = `${pluralizedAction}/create`
    if (typeof this.$store._actions[fullQualifiedActionName] !== 'undefined') {
      return this.$store.dispatch(fullQualifiedActionName, arg)
    } else {
      return this.$axios.post(`/${pluralizedAction}`, arg)
    }
  }

  funcs[`put${capitalizedAction}`] = function (arg) {
    const fullQualifiedActionName = `${pluralizedAction}/update`
    if (typeof this.$store._actions[fullQualifiedActionName] !== 'undefined') {
      return this.$store.dispatch(fullQualifiedActionName, arg)
    } else {
      let id = arg
      let params = null
      if (typeof arg === 'object') {
        id = arg.id
        params = arg.params
      }
      return this.$axios.put(`/${pluralizedAction}/${id}`, {params})
    }
  }

  funcs[`delete${capitalizedAction}`] = function (arg) {
    const fullQualifiedActionName = `${pluralizedAction}/delete`
    if (typeof this.$store._actions[fullQualifiedActionName] !== 'undefined') {
      return this.$store.dispatch(fullQualifiedActionName, arg)
    } else {
      let id = arg
      let params = null
      if (typeof arg === 'object') {
        id = arg.id
        params = arg.params
      }
      return this.$axios.delete(`/${pluralizedAction}/${id}`, {params})
    }
  }

  return funcs
}
