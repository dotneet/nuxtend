const objectAssign = require('object-assign')
const genActions = require('./genactions')

function bindContext (methods, context) {
  const target = {'$store': context.store, '$axios': context.$axios}
  const result = {}
  for (let key in methods) {
    result[key] = methods[key].bind(target)
  }
  return result
}

function createAsyncDataFunction (component, originalAsyncData, methods) {
  return async (context) => {
    let data = {}
    for (let idx in component.mixins) {
      let mixin = component.mixins[idx]
      if (typeof mixin.asyncData !== 'undefined') {
        let r = await mixin.asyncData(context)
        objectAssign(data, r)
      }
    }
    let target = {}
    objectAssign(target, bindContext(methods, context))
    let r = await originalAsyncData.apply(target, [context])
    objectAssign(data, r)
    return data
  }
}

function createFetchFunction (component, originalFetch, methods) {
  return async (context) => {
    for (let idx in component.mixins) {
      let mixin = component.mixins[idx]
      if (typeof mixin.fetch !== 'undefined') {
        await mixin.fetch(context)
      }
    }
    let target = {}
    objectAssign(target, bindContext(methods, context))
    await originalFetch.apply(target, [context])
  }
}

function mergeMethods (component) {
  let methods = {}
  if (component.mixins) {
    component.mixins.forEach(mixin => {
      if (mixin.methods) {
        objectAssign(methods, mixin.methods)
      }
    })
  }
  if (component.methods) {
    objectAssign(methods, component.methods)
  }
  if (component.nuxtend && component.nuxtend.actions) {
    for (let act of component.nuxtend.actions) {
      const funcs = genActions({}, act)
      for (let name in funcs) {
        if (typeof methods[name] === 'undefined') {
          methods[name] = funcs[name]
        }
      }
    }
  }
  return methods
}

module.exports = function (component) {
  let com = objectAssign(component)
  let {asyncData, fetch} = com
  const methods = mergeMethods(com)
  if (fetch) {
    com.fetch = createFetchFunction(com, fetch, methods)
  }
  if (asyncData) {
    com.asyncData = createAsyncDataFunction(com, asyncData, methods)
  }
  com.methods = methods
  return com
}

