import {mapActions} from 'vuex'

function bindContext(actions, context) {
  const target = {'$store': context.store}
  const result = {}
  for (let key in actions) {
    let action = actions[key]
    result[key] = action.bind(target)
  }
  return result
}

function createAsyncDataFunction(component, originalAsyncData) {
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
    Object.assign(target, bindContext(mapActions(component.actions), context))
    if (originalAsyncData) {
      let r = await originalAsyncData.apply(target, [context])
      Object.assign(data, r)
    }
    return data
  }
}

function createFetchFunction(component, originalFetch) {
  return async (context) => {
    for (let idx in component.mixins) {
      let mixin = component.mixins[idx]
      if (typeof mixin.fetch !== 'undefined') {
        await mixin.fetch(context)
      }
    }
    let target = {}
    Object.assign(target, bindContext(mapActions(component.actions), context))
    if (originalFetch) {
      await originalFetch.apply(target, [context])
    }
  }
}

function mergeActions(component) {
  let actions = {}
  if (component.mixins) {
    component.mixins.forEach(mixin => {
      if (mixin.actions) {
        Object.assign(actions, mixin.actions)
      }
    })
  }
  if (component.actions) {
    Object.assign(actions, component.actions)
  }
  return actions
}

export default function (component) {
  let com = Object.assign(component)
  let {asyncData, fetch} = com
  com.actions = mergeActions(com)
  com.methods = {...mapActions(com.actions), ...component.methods}
  com.fetch = createFetchFunction(com, fetch)
  com.asyncData = createAsyncDataFunction(com, asyncData)
  return com
}
