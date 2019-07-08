import serviceRequest, { serviceRequestComposer } from '../src/service-request'
// import { ROLE_AWS_APP_ADMIN } from '@omkartech/role-policy'
process.env.STAGE = 'int'

describe('serviceRequestProvider()', () => {
  const serviceTestProvider = serviceRequestComposer({})
  it('should be a function', () => {
    expect(serviceTestProvider).toBeDefined()
  })
})

describe('ServiceRequest()', () => {
  it('should be a function', () => {
    expect(serviceRequest).toBeDefined()
  })
})

describe('Service Instance', () => {
  const testService = serviceRequest('test-{STAGE}-get', {
    stage: 'int',
    payload: {},
    test: true,
  })

  describe('instance functions', () => {
    it('should have function get()', () => {
      expect(testService.get).toBeDefined()
    })
    it('should have function set()', () => {
      expect(testService.set).toBeDefined()
    })
    it('should have function getStage()', () => {
      expect(testService.getStage).toBeDefined()
    })
    it('should have function getRegion()', () => {
      expect(testService.getRegion).toBeDefined()
    })

    it('should have function getServiceName()', () => {
      expect(testService.getServiceName).toBeDefined()
    })

    it('should have function getRequestPayload()', () => {
      expect(testService.getRequestPayload).toBeDefined()
    })

    it('should have function getRequestParameters()', () => {
      expect(testService.getRequestParameters).toBeDefined()
    })

    it('should have function getLambda()', () => {
      expect(testService.getLambda).toBeDefined()
    })

    it('should have function request()', () => {
      expect(testService.request).toBeDefined()
    })

    it('should get region', () => {
      expect(testService.getRegion()).toBe('us-west-2')
    })
    it('should get serviceName', () => {
      expect(testService.getServiceName()).toBe('test-int-get')
    })

    describe('Request parameters', () => {
      const requestParamsResult = testService.getRequestParameters()
      it('should get added test property', () => {
        // test lambda property
        expect(requestParamsResult).toHaveProperty('test')
        expect(requestParamsResult.test).toBe(true)
      })
      it('should have InvocationType of RequestResponse', () => {
        expect(requestParamsResult.InvocationType).toBe('RequestResponse')
      })
      it('should have FunctionName of test-int-get', () => {
        expect(requestParamsResult.FunctionName).toBe('test-int-get')
      })

      // Paylod is JSON stringified
      it('should have stringified payload', () => {
        expect(typeof requestParamsResult.Payload).toBe('string')
      })
    })

    describe('Payload', () => {
      const payload = testService.getRequestPayload()
      it('Stage - should have proper stage to pass through to next service', () => {
        expect(payload.Stage).toBe('int')
      })
    //   it('requestContext - should have authorizer role', () => {
    //     expect(payload.requestContext.authorizer.claims['custom:user-role']).toBe(
    //         ROLE_AWS_APP_ADMIN
    //     )
    //   })
    })

    describe('Invoke Lambda Event', () => {
      const svcParams = {
        InvocationType: 'Event',
        region: 'us-west-2',
      }
      const lambdaPayLoad = {}
      it('Stage - Invoke Lambda Successfully as an Event', () => {
        return serviceRequest('Name-of-your-lambda', svcParams)
          .request(lambdaPayLoad)
          .then((res) => {
            expect(res.StatusCode).toBe(202)
          })
      })
      it('Lambda - Not Found', () => {
        return serviceRequest('dev-Not-Found', svcParams)
          .request(lambdaPayLoad)
          .catch((err) => {
            expect(err.code).toBe('ResourceNotFoundException')
          })
      })
    })

    // set new stage to prod
    // moving this above can cause failed tests for stage
    it('should set stage to prod', () => {
      testService.set({ stage: 'prod' })
      expect(testService.getStage()).toBe('prod')
      expect(testService.getServiceName()).toBe('test-prod-get')
    })
  })
})
