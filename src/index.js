function bindContext (methods, context) {
  const target = {'$store': context.store}
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
        Object.assign(data, r)
      }
    }
    let target = {}
    Object.assign(target, bindContext(methods, context))
    let r = await originalAsyncData.apply(target, [context])
    Object.assign(data, r)
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
    Object.assign(target, bindContext(methods, context))
    await originalFetch.apply(target, [context])
  }
}

function mergeMethods (component) {
  let methods = {}
  if (component.mixins) {
    component.mixins.forEach(mixin => {
      if (mixin.methods) {
        Object.assign(methods, mixin.methods)
      }
    })
  }
  if (component.methods) {
    Object.assign(methods, component.methods)
  }
  return methods
}

export default function (component) {
  let com = Object.assign(component)
  let {asyncData, fetch} = com
  const methods = mergeMethods(com)
  if (fetch) {
    com.fetch = createFetchFunction(com, fetch, methods)
  }
  if (asyncData) {
    com.asyncData = createAsyncDataFunction(com, asyncData, methods)
  }
  return com
}
