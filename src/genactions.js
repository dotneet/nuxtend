const pluralize = require('pluralize')
const {capitalize, snakeToCamel} = require('./utils')

module.exports = function (context, actionObj) {
  if (!context) {
    console.warn('[nuxtend] genactions: conext is not passed.')
    return {}
  }
  let action = '' 
  let alias = null
  let funcNameBase = ''
  if (typeof actionObj === 'string') {
    action = actionObj
  } else {
    action = actionObj.name
    if (actionObj.alias) {
      alias = actionObj.alias
    }
  }
  if (!action) {
    console.warn('[nuxtend] genactions: action is not passed.')
    return {}
  }
  let pathPrefix = ''
  let lastSlashPos = action.lastIndexOf('/')
  if (lastSlashPos === -1) {
    funcNameBase = action
  } else {
    pathPrefix = action.substr(0, lastSlashPos + 1)
    funcNameBase = action.substr(lastSlashPos + 1)
  }
  const capitalizedAction = capitalize(snakeToCamel(funcNameBase))
  const pluralizedAction = pluralize.plural(funcNameBase)
  const funcs = {}

  // usage example: this.getUser(123) or this.getUser({id: 123, params: {status=sleeping}})
  funcs[`get${capitalizedAction}`] = function (arg) {
    const fullQualifiedActionName = `${pathPrefix}${pluralizedAction}/get`
    if (typeof this.$store._actions[fullQualifiedActionName] !== 'undefined') {
      return this.$store.dispatch(fullQualifiedActionName, arg)
    } else {
      let id = arg
      let params = null
      if (typeof arg === 'object') {
        id = arg.id
        params = arg.params
      }
      return this.$axios.get(`/${pathPrefix}${pluralizedAction}/${id}`, {params})
    }
  }

  funcs[`get${capitalizedAction}List`] = function (params) {
    const fullQualifiedActionName = `${pathPrefix}${pluralizedAction}/getList`
    if (typeof this.$store._actions[fullQualifiedActionName] !== 'undefined') {
      return this.$store.dispatch(fullQualifiedActionName, params)
    } else {
      return this.$axios.get(`/${pathPrefix}${pluralizedAction}`, params)
    }
  }

  funcs[`post${capitalizedAction}`] = function (arg) {
    const fullQualifiedActionName = `${pathPrefix}${pluralizedAction}/create`
    if (typeof this.$store._actions[fullQualifiedActionName] !== 'undefined') {
      return this.$store.dispatch(fullQualifiedActionName, arg)
    } else {
      return this.$axios.post(`/${pathPrefix}${pluralizedAction}`, arg)
    }
  }

  funcs[`put${capitalizedAction}`] = function (arg) {
    const fullQualifiedActionName = `${pathPrefix}${pluralizedAction}/update`
    if (typeof this.$store._actions[fullQualifiedActionName] !== 'undefined') {
      return this.$store.dispatch(fullQualifiedActionName, arg)
    } else {
      let id = arg
      let params = null
      if (typeof arg === 'object') {
        id = arg.id
        params = arg.params
      }
      return this.$axios.put(`/${pathPrefix}${pluralizedAction}/${id}`, {params})
    }
  }

  funcs[`delete${capitalizedAction}`] = function (arg) {
    const fullQualifiedActionName = `${pathPrefix}${pluralizedAction}/delete`
    if (typeof this.$store._actions[fullQualifiedActionName] !== 'undefined') {
      return this.$store.dispatch(fullQualifiedActionName, arg)
    } else {
      let id = arg
      let params = null
      if (typeof arg === 'object') {
        id = arg.id
        params = arg.params
      }
      return this.$axios.delete(`/${pathPrefix}${pluralizedAction}/${id}`, {params})
    }
  }

  return funcs
}
