const pluralize = require('pluralize')
const objectAssign = require('object-assign')
const { capitalize, snakeToCamel } = require('./utils')

module.exports = function (context, actionObj) {
  if (!context) {
    console.warn('[nuxtend] genactions: conext is not passed.')
    return {}
  }
  let action = ''
  let funcNameBase = ''
  if (typeof actionObj === 'string') {
    action = actionObj
  } else {
    action = actionObj.name
  }
  if (!action) {
    console.warn('[nuxtend] genactions: action is not passed.')
    return {}
  }
  let pathPrefix = ''
  const lastSlashPos = action.lastIndexOf('/')
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
      return this.$axios.get(`/${pathPrefix}${pluralizedAction}/${id}`, { params })
    }
  }

  funcs[`get${capitalizedAction}List`] = function (config) {
    const fullQualifiedActionName = `${pathPrefix}${pluralizedAction}/getList`
    if (typeof this.$store._actions[fullQualifiedActionName] !== 'undefined') {
      return this.$store.dispatch(fullQualifiedActionName, config)
    } else {
      return this.$axios.get(`/${pathPrefix}${pluralizedAction}`, config)
    }
  }

  funcs[`post${capitalizedAction}`] = function (arg, config) {
    const fullQualifiedActionName = `${pathPrefix}${pluralizedAction}/create`
    if (typeof this.$store._actions[fullQualifiedActionName] !== 'undefined') {
      const payload = objectAssign({}, arg, { config })
      return this.$store.dispatch(fullQualifiedActionName, payload)
    } else {
      return this.$axios.post(`/${pathPrefix}${pluralizedAction}`, arg, config)
    }
  }

  funcs[`put${capitalizedAction}`] = function (arg, config) {
    const fullQualifiedActionName = `${pathPrefix}${pluralizedAction}/update`
    if (typeof this.$store._actions[fullQualifiedActionName] !== 'undefined') {
      const payload = objectAssign({}, arg, { config })
      return this.$store.dispatch(fullQualifiedActionName, payload)
    } else {
      let id = arg
      let params = null
      const config = null
      if (typeof arg === 'object') {
        id = arg.id
        params = arg
      }
      return this.$axios.put(`/${pathPrefix}${pluralizedAction}/${id}`, params, config)
    }
  }

  funcs[`delete${capitalizedAction}`] = function (arg, config) {
    const fullQualifiedActionName = `${pathPrefix}${pluralizedAction}/delete`
    if (typeof this.$store._actions[fullQualifiedActionName] !== 'undefined') {
      const payload = objectAssign({}, arg, { config })
      return this.$store.dispatch(fullQualifiedActionName, payload)
    } else {
      let id = arg
      if (typeof arg === 'object') {
        id = arg.id
      }
      return this.$axios.delete(`/${pathPrefix}${pluralizedAction}/${id}`, config)
    }
  }

  return funcs
}
