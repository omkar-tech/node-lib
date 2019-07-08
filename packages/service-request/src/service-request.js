/**
 * Base service configuration and request handling
 */

import aws from 'aws-sdk'
// import { ROLE_PLATFORM_ADMIN } from '@omkartech/role-policy'
import { STAGE, REGION } from './constants'

const LAMBDA = {}
const LAMBDA_EVENT_RESPONSE = 202

export class ServiceRequest {
  data = {}

  constructor(serviceName, { stage, region, ...requestParameters } = {}) {
    this.set({
      stage,
      serviceNameTemplate: serviceName,
      requestParameters,
      region,
    })
  }

  set(appendData) {
    this.data = {
      ...this.data,
      ...appendData,
    }

    return this
  }
  get(property) {
    return this.data[property]
  }

  getStage() {
    return this.get('stage')
  }

  getServiceName() {
    return this.get('serviceNameTemplate')
      .replace('{STAGE}', this.getStage())
      .replace('STAGE', this.getStage())
  }

  getRegion() {
    return this.get('region')
  }
  getLambda() {
    const region = this.getRegion()
    const lambda = LAMBDA[region]
    if (lambda) {
      return lambda
    }

    const newLambda = new aws.Lambda({ region })

    LAMBDA[region] = newLambda

    return newLambda
  }

  getRequestPayload() {
    return {
      ...this.get('payload'),
      Stage: this.getStage(),

    //   requestContext: {
    //     authorizer: {
    //       claims: {
    //         'custom:user-role': ROLE_PLATFORM_ADMIN,
    //       },
    //     },
    //   },
    }
  }

  getRequestParameters() {
    return {
      // items that may be overwritten by requestParameters
      InvocationType: 'RequestResponse',
      LogType: 'None',

      // spread requestParameters
      ...this.get('requestParameters'),

      // items that should not be overwritten by requestParameters go below
      FunctionName: this.getServiceName(),
      Payload: JSON.stringify(this.getRequestPayload()),
    }
  }

  handleError(error) {
    this.set({ responseError: error })
    if (error instanceof Error) {
      throw error
    }

    if (error instanceof String) {
      throw new Error(error)
    }

    console.log(`ServiceRequest: error not handled ${error}`)

    throw new Error(error)
  }

  handleResponse({ Payload, ...rest } = {}) {
    const invokeType = this.getRequestParameters().InvocationType
    if (
      (!Payload && invokeType !== 'Event') ||
      (invokeType === 'Event' && rest && rest.StatusCode !== LAMBDA_EVENT_RESPONSE)
    ) {
      throw new Error(`ServiceRequest: Invalid response. Received ${JSON.stringify(rest)}`)
    }

    try {
      if (invokeType === 'Event' && rest && rest.StatusCode === LAMBDA_EVENT_RESPONSE) {
        return rest
      }

      const { message, errorMessage, body, ...response } = JSON.parse(Payload) || {}
      if (errorMessage || message) {
        const errMsg = JSON.parse(errorMessage || message)
        const err = new Error(errMsg.message)
        err.type = errMsg.type || 'RequestError'
        err.status = errMsg.status
        throw err
      }

      if (body) {
        const requestResponse = JSON.parse(body)
        this.set({ requestResponse })
        return requestResponse
      }

      // this response is for lambdas that don't return data in the "body" property above.
      return response

    } catch (e) {
      console.log(`Error in parsing payload: ${JSON.stringify(e, null, 2)}`)
      throw e
    }
  }

  request(payload = {}) {
    this.set({ payload })

    return this.getLambda()
      .invoke(this.getRequestParameters())
      .promise()
      .then(this.handleResponse.bind(this))
      .catch(this.handleError.bind(this))
  }
}

export function serviceRequestComposer({ region = REGION, stage = STAGE, ...serviceParams } = {}) {
  const serviceDefaults = {
    region,
    stage,
    ...serviceParams,
  }

  function serviceRequestFactory(serviceName, options) {
    return new ServiceRequest(serviceName, {
      ...serviceDefaults,
      ...options,
    })
  }

  serviceRequestFactory.setDefaults = function(addDefaults) {
    Object.assign(serviceDefaults, addDefaults)
  }

  return serviceRequestFactory
}

export default serviceRequestComposer()
