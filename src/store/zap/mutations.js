/**
 *
 *    Copyright (c) 2020 Silicon Labs
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import Vue from 'vue'

export function updateInformationText(state, text) {
  state.informationText = text
}

export function updateClusters(state, clusters) {
  state.clusters = clusters
}

export function updateSelectedCluster(state, cluster) {
  state.clustersView.selected = cluster
}

export function updateSelectedEndpoint(state, endpoint) {
  state.endpointView.selectedEndpoint = endpoint
}

export function updateAttributes(state, attributes) {
  attributes.forEach((attribute) => {
    if (state.attributeView.defaultValues[attribute.id] === undefined) {
      Vue.set(
        state.attributeView.defaultValues,
        attribute.id,
        attribute.defaultValue
      )
    }
    if (state.attributeView.reportingMin[attribute.id] === undefined) {
      Vue.set(state.attributeView.reportingMin, attribute.id, 0)
    }
    if (state.attributeView.reportingMax[attribute.id] === undefined) {
      Vue.set(state.attributeView.reportingMax, attribute.id, 65344)
    }
    if (state.attributeView.reportableChange[attribute.id] === undefined) {
      Vue.set(state.attributeView.reportableChange, attribute.id, 0)
    }
  })
  state.attributes = attributes
}

export function initializeDefaultEndpoints(state, defaultEndpoints) {
  defaultEndpoints.forEach((endpoint) => {
    if (state.endpointView.endpointId[endpoint.id] === undefined) {
      Vue.set(state.endpointView.endpointId, endpoint.id, endpoint.eptId)
    }
    if (state.endpointView.endpointType[endpoint.id] === undefined) {
      Vue.set(
        state.endpointView.endpointType,
        endpoint.id,
        endpoint.endpointType
      )
    }
    if (state.endpointView.networkId[endpoint.id] === undefined) {
      Vue.set(state.endpointView.networkId, endpoint.id, endpoint.network)
    }
  })
}

export function addEndpoint(state, endpoint) {
  Vue.set(state.endpointView.endpointId, endpoint.id, endpoint.eptId)
  Vue.set(state.endpointView.endpointType, endpoint.id, endpoint.endpointType)
  Vue.set(state.endpointView.networkId, endpoint.id, endpoint.network)
  Vue.set(
    state.endpointView.endpointIdValidationIssues,
    endpoint.id,
    endpoint.endpointIdValidationIssues
  )
  Vue.set(
    state.endpointView.networkIdValidationIssues,
    endpoint.id,
    endpoint.networkIdValidationIssues
  )
}

export function updateEndpoint(state, context) {
  context.changes.forEach((data) => {
    Vue.set(state.endpointView[data.updatedKey], context.id, data.value)
  })
  Vue.set(
    state.endpointView.endpointIdValidationIssues,
    context.id,
    context.endpointIdValidationIssues
  )
  Vue.set(
    state.endpointView.networkIdValidationIssues,
    context.id,
    context.networkIdValidationIssues
  )
}

export function initializeDefaultEndpointsTypes(state, defaultEndpointsTypes) {
  defaultEndpointsTypes.forEach((endpointType) => {
    if (state.endpointTypeView.name[endpointType.id] === undefined) {
      Vue.set(state.endpointTypeView.name, endpointType.id, endpointType.name)
    }
    if (state.endpointTypeView.deviceTypeRef[endpointType.id] === undefined) {
      Vue.set(
        state.endpointTypeView.deviceTypeRef,
        endpointType.id,
        endpointType.deviceTypeRef
      )
    }
  })
}

export function addEndpointType(state, endpointType) {
  Vue.set(state.endpointTypeView.name, endpointType.id, endpointType.name)
  Vue.set(
    state.endpointTypeView.deviceTypeRef,
    endpointType.id,
    endpointType.deviceTypeRef
  )
}

export function updateAttributeDefaults(state, selectionContext) {
  Vue.set(
    state.attributeView.defaultValues,
    selectionContext.id,
    selectionContext.newDefaultValue
  )
  Vue.set(
    state.attributeView.defaultValueValidationIssues,
    selectionContext.id,
    selectionContext.defaultValueValidationIssues
  )
}

export function updateCommands(state, commands) {
  state.commands = commands
}

export function updateZclDeviceTypes(state, zclDeviceTypes) {
  state.zclDeviceTypes = zclDeviceTypes
}

export function updateEndpointConfigs(state, endpoints) {
  state.endpoints = endpoints
}

export function selectConfiguration(state, configurationName) {
  state.configurationView.selected = configurationName
}

export function updateInclusionList(state, selectionContext) {
  var inclusionList = state[selectionContext.view][selectionContext.listType]
  if (selectionContext.added && !inclusionList.includes(selectionContext.id)) {
    inclusionList.push(selectionContext.id)
  } else if (
    !selectionContext.added &&
    inclusionList.includes(selectionContext.id)
  ) {
    var elementIndex = inclusionList.indexOf(selectionContext.id)
    inclusionList.splice(elementIndex, 1)
  }
  state[selectionContext.view][selectionContext.listType] = inclusionList
}

export function setDeviceTypeReference(state, endpointIdDeviceTypeRefPair) {
  Vue.set(
    state.endpointTypeView.deviceTypeRef,
    endpointIdDeviceTypeRefPair.endpointId,
    endpointIdDeviceTypeRefPair.deviceTypeRef
  )
}

export function updateSelectedEndpointType(state, endpointType) {
  state.endpointTypeView.selectedEndpointType = endpointType
}

export function removeEndpointType(state, endpointType) {
  state.endpointTypeView.selectedEndpointType = []
  Vue.delete(state.endpointTypeView.name, endpointType.id)
  Vue.delete(state.endpointTypeView.deviceTypeRef, endpointType.id)
}

export function deleteEndpoint(state, endpoint) {
  state.endpointView.selectedEndpoint = []
  Vue.delete(state.endpointView.endpointId, endpoint.id)
  Vue.delete(state.endpointView.endpointType, endpoint.id)
  Vue.delete(state.endpointView.networkId, endpoint.id)
}

export function setClusterList(state, data) {
  state.clustersView.selectedClients = data.clients
  state.clustersView.selectedServers = data.servers
}

export function resetAttributeDefaults(state) {
  state.attributeView.defaultValues = {}
  state.attributeView.reportingMin = {}
  state.attributeView.reportingMin = {}
  state.attributeView.reportableChange = {}
  state.attributeView.storageOption = {}

  state.attributes.forEach((attribute) => {
    Vue.set(
      state.attributeView.defaultValues,
      attribute.id,
      attribute.defaultValue
    )
    Vue.set(state.attributeView.storageOption, attribute.id, 'ram')
    Vue.set(state.attributeView.reportingMin, attribute.id, 0)
    Vue.set(state.attributeView.reportingMax, attribute.id, 65344)
    Vue.set(state.attributeView.reportableChange, attribute.id, 0)
  })
}

export function setAttributeLists(state, data) {
  state.attributeView.selectedAttributes = data.included
  state.attributeView.selectedSingleton = data.singleton
  state.attributeView.selectedBounded = data.bounded
  state.attributeView.selectedReporting = data.includedReportable

  resetAttributeDefaults(state)
  Object.entries(data.defaultValue).forEach(([attributeRef, defaultVal]) => {
    Vue.set(state.attributeView.defaultValues, attributeRef, defaultVal)
  })
  Object.entries(data.storageOption).forEach(
    ([attributeRef, storageOption]) => {
      Vue.set(state.attributeView.storageOption, attributeRef, storageOption)
    }
  )

  Object.entries(data.minInterval).forEach(([attributeRef, defaultVal]) => {
    Vue.set(state.attributeView.reportingMin, attributeRef, defaultVal)
  })

  Object.entries(data.maxInterval).forEach(([attributeRef, defaultVal]) => {
    Vue.set(state.attributeView.reportingMax, attributeRef, defaultVal)
  })
  Object.entries(data.reportableChange).forEach(
    ([attributeRef, defaultVal]) => {
      Vue.set(state.attributeView.reportableChange, attributeRef, defaultVal)
    }
  )
}

export function setCommandLists(state, data) {
  state.commandView.selectedIn = data.incoming
  state.commandView.selectedOut = data.outgoing
}

export function setRecommendedClusterList(state, data) {
  Vue.set(state.clustersView, 'recommendedClients', data.recommendedClients)
  Vue.set(state.clustersView, 'recommendedServers', data.recommendedServers)
}

export function setRequiredAttributesList(state, data) {
  Vue.set(state.attributeView, 'requiredAttributes', data.requiredAttributes)
}

export function setRequiredCommandsList(state, data) {
  Vue.set(state.commandView, 'requiredCommands', data.requiredCommands)
}

export function setLeftDrawerState(state, data) {
  state.leftDrawerOpenState = data
}

export function setMiniState(state, data) {
  state.miniState = data
}

export function initializeEndpoints(state, endpoints) {
  endpoints.forEach((e) => {
    Vue.set(state.endpointView.endpointId, e.endpointRef, e.endpointId)
  })
}

export function initializeEndpointTypes(state, endpointTypes) {
  endpointTypes.forEach((et) => {
    Vue.set(state.endpointTypeView.name, et.id, et.name)
  })
}

export function setOptions(state, data) {
  Vue.set(state.genericOptions, data.option, [
    ...new Set(
      data.data
        .filter((d) => {
          return d.optionCategory === data.option
        })
        .map((d) => {
          return { optionCode: d.optionCode, optionLabel: d.optionLabel }
        })
    ),
  ])
}

export function setSelectedGenericOption(state, keyValue) {
  Vue.set(state.selectedGenericOptions, keyValue.key, keyValue.value)
}

export function setDefaultUiMode(state, uiMode) {
  Vue.set(state.calledArgs, `defaultUiMode`, uiMode)
}

export function setStudioConfigPath(state, filePath) {
  state.studioProject = filePath
}

export function setAttributeEditting(state, context) {
  Vue.set(
    state.attributeView.editableAttributes,
    context.attributeId,
    context.editState
  )
}
