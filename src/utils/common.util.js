import { MODULE_STATUS, MODULE_ACTION_STATUS } from '@constants/common.constant'

export const isPermitted = (isSuperAdmin, path, permissions, roleAccess) => {
  if (isSuperAdmin || path === '/') return true

  const [moduleName, subModuleName] = path.split('/').filter((e) => {
    return e === 0 || e
  })

  if (permissions) {
    const module = permissions.find((permission) => permission.name === moduleName)
    if (!module) return false

    const submodule = module.subModules.find((submodule) => submodule.name === subModuleName)
    if (!submodule) return false

    const subAction = submodule.actions.find((ac) => ac.name === roleAccess)

    if (!subAction) return false

    return true
  }
  return false
}

export const isPermittedForGlobalModule = (isSuperAdmin, path, permissions, roleAccess) => {
  if (isSuperAdmin || path === '/') return true

  const [moduleName] = path.split('/').filter((e) => {
    return e === 0 || e
  })

  if (permissions) {
    const module = permissions.find((permission) => permission.name === moduleName)

    if (!module) return false

    const action = module.actions.find((ac) => ac.name === roleAccess)

    if (!action) return false

    return true
  }
  return false
}

export const sleep = (ms) => {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve(timeout)
    }, ms)
  })
}

export const obfuscateEmail = (email) => {
  if (!email) {
    return ''
  }
  // Split email into local part and domain part
  const [localPart, domain] = email.split('@')

  // Get the first characters of the local part
  const firstCharLocalPart = localPart.slice(0, 1)

  // Replace characters in the local part with 'x', except the first character
  const obfuscatedLocalPart = firstCharLocalPart + localPart.slice(1).replace(/./g, '*')

  const obfuscatedEmail = obfuscatedLocalPart + '@' + domain

  return obfuscatedEmail
}

export function getAllActionKeys(modules) {
  let actionKeys = []

  modules.forEach((module) => {
    module.subModules.forEach((subModule) => {
      subModule.actions.forEach((action) => {
        actionKeys.push(action.key)
      })
    })
  })

  return actionKeys
}

const transformActions = ({
  apiActions,
  currentModuleName,
  currentSubModuleName,
  permissionDetailList
}) => {
  let hasActionLocked = false
  let actionLockedCount = 0

  const transformedActions = apiActions.map((actionData) => {
    const { key, displayName, status, name } = actionData

    const locked =
      status === MODULE_ACTION_STATUS.ALWAYS_TRUE || status === MODULE_ACTION_STATUS.ALWAYS_FALSE
    const value = status === MODULE_ACTION_STATUS.ALWAYS_TRUE || permissionDetailList.has(key)
    const hidden = status === MODULE_ACTION_STATUS.HIDDEN

    if (locked) {
      hasActionLocked = true
      actionLockedCount += 1
    }

    const transformedAction = {
      id: key,
      moduleId: currentModuleName,
      subModuleId: currentSubModuleName,
      label: displayName,
      value,
      locked,
      disabled: locked,
      status,
      hidden,
      type: name,
      data: actionData
    }

    return transformedAction
  })

  const actionsStatus = {
    hasActionLocked,
    isAllActionLocked: actionLockedCount === transformedActions.length
  }

  const actionsData = {
    data: transformedActions.filter((action) => !action.hidden),
    actionsStatus
  }

  return actionsData
}

const transformSubModules = ({ apiSubModules, currentModuleName, permissionDetailList }) => {
  let hasSubModuleLocked = false
  let subModuleLockedCount = 0

  const data = apiSubModules.map((currentSubmodule) => {
    const {
      name: currentSubModuleName,
      actions: currentActions,
      displayName: currentSubModuleDisplayName,
      ...currentSubmoduleData
    } = currentSubmodule

    const {
      data: actionTransformed,
      actionsStatus: { hasActionLocked, isAllActionLocked }
    } = transformActions({
      apiActions: currentActions,
      currentModuleName,
      currentSubModuleName,
      permissionDetailList
    })

    if (hasActionLocked) {
      hasSubModuleLocked = true
    }

    if (isAllActionLocked) {
      subModuleLockedCount += 1
    }

    const transformedSubModule = {
      id: currentSubModuleName,
      moduleId: currentModuleName,
      value: MODULE_STATUS.EMPTY,
      label: currentSubModuleDisplayName,
      data: currentSubmoduleData,
      locked: isAllActionLocked,
      actions: actionTransformed,
      hasItemLocked: hasActionLocked
    }

    return transformedSubModule
  })

  const subModulesStatus = {
    hasSubModuleLocked,
    isAllSubModulesLocked: subModuleLockedCount === data.length
  }

  return {
    data,
    subModulesStatus
  }
}

export const transformPermissionData = (apiPermissions = [], permissionDetailList = new Set()) =>
  apiPermissions.reduce((data, currentModule) => {
    const {
      name: currentModuleName,
      displayName: currentModuleDisplayName,
      type: currentModuleType,
      subModules: currentSubModules,
      ...currentModuleData
    } = currentModule

    const { modules: modulesData = [] } = data[currentModuleType] || {}

    let modules = []

    const {
      data: transformedSubModules,
      subModulesStatus: { hasSubModuleLocked, isAllSubModulesLocked }
    } = transformSubModules({
      apiSubModules: currentSubModules,
      currentModuleName,
      permissionDetailList
    })

    const newModule = {
      id: currentModuleName,
      value: MODULE_STATUS.EMPTY,
      label: currentModuleDisplayName,
      data: currentModuleData,
      subModules: transformedSubModules,
      hasItemLocked: hasSubModuleLocked,
      locked: isAllSubModulesLocked
    }

    modules = [...modulesData, newModule]

    const isAllModuleLocked = modules.every((module) => module.locked)

    const rootModule = {
      modules,
      locked: isAllModuleLocked,
      hasItemLocked: hasSubModuleLocked
    }

    return {
      ...data,
      [currentModuleType]: rootModule
    }
  }, {})

export const truncateStringInMiddle = (str, maxLength) => {
  if (str.length <= maxLength) {
    return str
  }

  const charsToShow = maxLength - 3 // Account for the length of the ellipsis
  const frontChars = Math.ceil(charsToShow / 2)
  const backChars = Math.floor(charsToShow / 2)

  const frontPart = str.slice(0, frontChars)
  const backPart = str.slice(str.length - backChars)

  return `${frontPart}...${backPart}`
}

export const buildHierarchy = (data, parentField = 'locationId', childField = 'parentId') => {
  const cloneData = data.map((item) => ({ ...item, ancestorsName: [] }))

  const map = {}
  const roots = []

  // Create a map of items
  cloneData.forEach((item) => {
    item.children = []
    map[item[parentField]] = item
  })

  // Build the hierarchy
  cloneData.forEach((item) => {
    if (item[childField]) {
      const parent = map[item[childField]]
      if (parent) {
        // Add the current item's name to the parent's children array
        parent.children.push(item)

        // Add the parent's ancestors and its own name to the current item's ancestors
        item.ancestorsName = [...parent.ancestorsName, parent.name]
      }
    } else {
      // If there is no parent, it is a root item
      roots.push(item)
    }
  })

  return roots
}

export const replaceId = (url, params) => {
  if (typeof params !== 'object' || params === null) {
    throw new Error('Params must be a non-null object')
  }

  return url.replace(/:(\w+)/g, (_, key) => params[key] || `:${key}`)
}

export const joinArray = (arr, key) => {
  let result = ''
  if (Array.isArray(arr)) {
    if (key) {
      result = arr.map((item) => item?.[key])?.join(', ')
    } else {
      result = arr.map((item) => item)?.join(', ')
    }
  }
  if (typeof arr === 'string') {
    result = arr.split(',').join(' > ')
  }

  return result
}

export const capitalizeFirstLetterOfEachWord = (str) => {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const isObjectAndTruthy = (obj) => {
  return obj && typeof obj === 'object' && !Array.isArray(obj)
}

export const hasEditAccessBy = (auditors = [], createdBy = {}, leadAuditor = {}) => {
  const currentUserId = JSON.parse(localStorage.getItem('user_information'))?._id
  let hasAccess = false
  if (Array.isArray(auditors)) {
    const result = auditors.filter((item) => item?._id === currentUserId)
    if (result.length > 0) hasAccess = true
  }
  if (isObjectAndTruthy(createdBy)) {
    for (const item in createdBy) {
      if (currentUserId === createdBy[item]) hasAccess = true
    }
  }
  if (isObjectAndTruthy(leadAuditor)) {
    for (const item in leadAuditor) {
      if (currentUserId === leadAuditor[item]) hasAccess = true
    }
  }
  return hasAccess
}
