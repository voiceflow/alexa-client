/* eslint-disable max-len */
// fixtures generated by running vf-server and alexa service.

// state when waiting on interaction block
export const oldInteraction = {
  last_speak: 'where are you from?',
  sessions: 1,
  globals: [
    {
      sessions: 1,
      user_id:
        'amzn1.ask.account.AEWTGTJ3JEG7M35VTSK6GFE3VMMHHDG7FM2BFAHY2JFA2S2I2UZIMLWMUG53WDXTDVOHDVKO7ERVDK3NROVGHBSYMH63FYEGTP3YXMHA352S4R3ZWCCIODI35IRAINYF4R4VO3IVBSMWFLDV62ASKII7E7GDCP2ZMFN4CILSFF5YWUQYPDEPN7KIB3Q2GMGT367IFFH4C3CFA2A',
      countrySlot: 0,
      voiceflow: {
        permissions: [],
        events: [],
        capabilities: {},
      },
      ageSlot: 45,
      locale: 'en-US',
      platform: 'alexa',
      timestamp: 1588865737,
    },
  ],
  active: true,
  transformed_input: null,
  diagrams: [
    {
      variable_state: {},
      commands: {
        'AMAZON.HelpIntent': {
          diagram_id: '3qVXWc9dmUqiakpZpSnAw49OfmmTpXmG',
          mappings: [],
          end: false,
        },
        'AMAZON.StopIntent': {
          diagram_id: 'nfJFGM0yhDHLmne2gf9A8GcTsillWS04',
          mappings: [],
          end: false,
        },
      },
      id: 'wNt8ySvDY8TcYnKNWX00Nzdx8q97C7KZ',
    },
  ],
  enteringNewDiagram: false,
  locale: 'en-US',
  amzn_api_info: {
    api_endpoint: 'https://api.amazonalexa.com',
    api_access_token:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ.eyJhdWQiOiJodHRwczovL2FwaS5hbWF6b25hbGV4YS5jb20iLCJpc3MiOiJBbGV4YVNraWxsS2l0Iiwic3ViIjoiYW16bjEuYXNrLnNraWxsLjMwNjc0MGVhLTI4YzItNDM4Zi04Nzk0LWY2NjM5YTA3NDE3NSIsImV4cCI6MTU4ODg2NjAzNywiaWF0IjoxNTg4ODY1NzM3LCJuYmYiOjE1ODg4NjU3MzcsInByaXZhdGVDbGFpbXMiOnsiY29udGV4dCI6IkFBQUFBQUFBQUFDV25SWHVadUVUTUxpVHgyWTNiVExES2dFQUFBQUFBQURvcXR4Z2VyclpIcEUyWGs2bjhONzc2UnI3WXkzR1RXWm5mdjdNNE94ZUJrTGNlWFJJdWx2bllZd09QTFY0UzdHSXNmNGQ1OXdnUWN4SVMyU0s2VEM3S1U4SExkbWVZSEF0Z0UwSHc2T3hZTmVYYVpEblBZN3phS0V0N0ptNHRvWGs5ZHVlMzhXZjk5VVFFQ1hVY0k3KzgrVnE0U2hYbHpNWCswMVgyOTdPQ0tOUHM2a0hlWEtQcFpUSWc2U2NhUjhPNEI3Q0Q3UHFEUEI4NEZWN1psekxzRTBNdmI5U1dmOE5kOW10Vk9kVW5qZ2FXdzR4MGZvZFdibnBlRE9KeUk0U3FZaGIzbm9Rdy9la2k3OCs2MCtIVEg3ZjhQdXdGa2FaRE5nK1oycW5kZFlnNEVIUnNDZ0luU0xGMUlpMW9CUEh5TnBJTlhZamN6UzBXa1pyVUw2cFRsOHg0Ukl0dTJSVzZ3YUttRHRkZEFRaUZhMW14ejlWSGxxZm83ZjYrMG9laDVpdTJDRGdqUHlVIiwiY29uc2VudFRva2VuIjpudWxsLCJkZXZpY2VJZCI6ImFtem4xLmFzay5kZXZpY2UuQUVYTFYyNUFGNFNYUE5UQTc0TVpTS01RS1gzNFdZVzVTVERJT0VYSzZLQ0lLUEMzWFFNN01DUUxQSUM3V1lNSUpNMlpYTERXRDNXV1pWSFJXM1VMMzVYWkw2QzVCN0paUUZNSk5WQ0tWVFVBQUpSTkZTUVJOQjNKWEtZS1dBN0pOT01RTVZXSjI1T1dRWjMyVUZSV0NIWDIyMkdMWFRCNlRFNlpKV1dYVVhTUlJWWFFDTVdONCIsInVzZXJJZCI6ImFtem4xLmFzay5hY2NvdW50LkFFV1RHVEozSkVHN00zNVZUU0s2R0ZFM1ZNTUhIREc3Rk0yQkZBSFkySkZBMlMySTJVWklNTFdNVUc1M1dEWFREVk9IRFZLTzdFUlZESzNOUk9WR0hCU1lNSDYzRllFR1RQM1lYTUhBMzUyUzRSM1pXQ0NJT0RJMzVJUkFJTllGNFI0Vk8zSVZCU01XRkxEVjYyQVNLSUk3RTdHRENQMlpNRk40Q0lMU0ZGNVlXVVFZUERFUE43S0lCM1EyR01HVDM2N0lGRkg0QzNDRkEyQSJ9fQ.jYIg5D0m4hGDjFtCuNz-Ox0ACWglndcpZtg4ysuR0r0cQ5d45jKRqyGv_i9oKFLkjSvfILM9xldf7XMmdbj28_epO-6qneG9cU8nFE8dWjohuffIb_v-MKx_M7tzZmemKw4OCZm2Y5pACjCTyN7t-WA_c7__hJ5Z5bR8ZhMVYfo9XUcFGcFPt6LuZGnU_8r5Y56d671FhWJDD07_gqV5dg_llTTx0hRrYmBJ4s6mS8uy8QwOQCD5tYFeyDuXcgRS-2K8iXmyRaaj_K-hEq8PTdBe2Kznt35e9WXY928EbKioVFpyHsuOLdLXapbRNi_XRMCeiVLlT_pVMCAGWDdAQA',
  },
  line_id: 'ck9wxfxb5004z3h5saskt2eg8',
  platform: 'alexa',
  lastOutput: 'how old are you?',
  output: 'where are you from?',
  repeat: 100,
  root_start: true,
  customer_info: {},
  skill_id: 31,
  end: false,
  alexa_permissions: [],
  supported_interfaces: {},
  user:
    'amzn1.ask.account.AEWTGTJ3JEG7M35VTSK6GFE3VMMHHDG7FM2BFAHY2JFA2S2I2UZIMLWMUG53WDXTDVOHDVKO7ERVDK3NROVGHBSYMH63FYEGTP3YXMHA352S4R3ZWCCIODI35IRAINYF4R4VO3IVBSMWFLDV62ASKII7E7GDCP2ZMFN4CILSFF5YWUQYPDEPN7KIB3Q2GMGT367IFFH4C3CFA2A',
  timestamp: '2020-05-07T15:35:30Z',
};

export const newInteraction = {
  stack: [
    {
      blockID: 'ck9wxfxb5004z3h5saskt2eg8',
      variables: {},
      storage: {
        speak: 'where are you from?',
      },
      diagramID: 'wNt8ySvDY8TcYnKNWX00Nzdx8q97C7KZ',
      commands: [
        {
          diagram_id: 'nfJFGM0yhDHLmne2gf9A8GcTsillWS04',
          mappings: [],
          end: false,
          intent: 'AMAZON.StopIntent',
        },
        {
          diagram_id: '3qVXWc9dmUqiakpZpSnAw49OfmmTpXmG',
          mappings: [],
          end: false,
          intent: 'AMAZON.HelpIntent',
        },
      ],
    },
  ],
  variables: {
    sessions: 1,
    ageSlot: 45,
    countrySlot: 0,
    _system: {
      apiEndpoint: 'https://api.amazonalexa.com',
      application: {
        applicationId: 'amzn1.ask.skill.306740ea-28c2-438f-8794-f6639a074175',
      },
      user: {
        userId:
          'amzn1.ask.account.AEWTGTJ3JEG7M35VTSK6GFE3VMMHHDG7FM2BFAHY2JFA2S2I2UZIMLWMUG53WDXTDVOHDVKO7ERVDK3NROVGHBSYMH63FYEGTP3YXMHA352S4R3ZWCCIODI35IRAINYF4R4VO3IVBSMWFLDV62ASKII7E7GDCP2ZMFN4CILSFF5YWUQYPDEPN7KIB3Q2GMGT367IFFH4C3CFA2A',
      },
      device: {
        supportedInterfaces: {},
        deviceId:
          'amzn1.ask.device.AEXLV25AF4SXPNTA74MZSKMQKX34WYW5STDIOEXK6KCIKPC3XQM7MCQLPIC7WYMIJM2ZXLDWD3WWZVHRW3UL35XZL6C5B7JZQFMJNVCKVTUAAJRNFSQRNB3JXKYKWA7JNOMQMVWJ25OWQZ32UFRWCHX222GLXTB6TE6ZJWWXUXSRRVXQCMWN4',
      },
      apiAccessToken:
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ.eyJhdWQiOiJodHRwczovL2FwaS5hbWF6b25hbGV4YS5jb20iLCJpc3MiOiJBbGV4YVNraWxsS2l0Iiwic3ViIjoiYW16bjEuYXNrLnNraWxsLjMwNjc0MGVhLTI4YzItNDM4Zi04Nzk0LWY2NjM5YTA3NDE3NSIsImV4cCI6MTU4ODg2NTk3MywiaWF0IjoxNTg4ODY1NjczLCJuYmYiOjE1ODg4NjU2NzMsInByaXZhdGVDbGFpbXMiOnsiY29udGV4dCI6IkFBQUFBQUFBQUFDV25SWHVadUVUTUxpVHgyWTNiVExES2dFQUFBQUFBQUEybG5PVnFBdVZ1UTBGWFFHbFJpKzJzSVF6enVyeDMrVFh1Y3NCOWlBdnNqWkQ3bDFYSytrR2k4ZmJUL09Lb1RTQU5WNVNvbjdGc0JIVEJMOXhvUmNVTHpLRHYxZUoyQjNJWGNwWm9jdkZSbXV3VXFyckwvOWh0OGEzU01RbWJ3NWhkQnk1cTRvNmNlaGpEbnVsOVQ0SkNNc3Zkem9EVmJZanQreG0ySDlnOEVSUEFmNktUblUvOWluZnZVQ1RkZ1dYK0Vud3pTaHFMR3VmT2J3MDRBa001S3grTWtNQno3bUNNbHpESVNCV2NsdmFkVlhsenBieW1wNkkzZVMzUFZiekN6UlhDNFJtT0w5OG5OKzJWb1Vra0ZKSzg0Q2tZdVIxV0xJekQreG9OQmxMYmVHQUJXbWVLaEJ3Sm9mbHV3RHEzZFpJN2lEdmVzV0FUMXR2UG44bkRXTktGNkk1M3QyNFY1dEo5ZkFjR1NxZHBkVVFhMmJITzVnY1RzM204cmRXZnlMRDVEQkZOLzBYIiwiY29uc2VudFRva2VuIjpudWxsLCJkZXZpY2VJZCI6ImFtem4xLmFzay5kZXZpY2UuQUVYTFYyNUFGNFNYUE5UQTc0TVpTS01RS1gzNFdZVzVTVERJT0VYSzZLQ0lLUEMzWFFNN01DUUxQSUM3V1lNSUpNMlpYTERXRDNXV1pWSFJXM1VMMzVYWkw2QzVCN0paUUZNSk5WQ0tWVFVBQUpSTkZTUVJOQjNKWEtZS1dBN0pOT01RTVZXSjI1T1dRWjMyVUZSV0NIWDIyMkdMWFRCNlRFNlpKV1dYVVhTUlJWWFFDTVdONCIsInVzZXJJZCI6ImFtem4xLmFzay5hY2NvdW50LkFFV1RHVEozSkVHN00zNVZUU0s2R0ZFM1ZNTUhIREc3Rk0yQkZBSFkySkZBMlMySTJVWklNTFdNVUc1M1dEWFREVk9IRFZLTzdFUlZESzNOUk9WR0hCU1lNSDYzRllFR1RQM1lYTUhBMzUyUzRSM1pXQ0NJT0RJMzVJUkFJTllGNFI0Vk8zSVZCU01XRkxEVjYyQVNLSUk3RTdHRENQMlpNRk40Q0lMU0ZGNVlXVVFZUERFUE43S0lCM1EyR01HVDM2N0lGRkg0QzNDRkEyQSJ9fQ.ZZZkALToQ4GJh6Qs6DNUaHTVtZwOXRE7ioA1N0kgtQRt16Ds7WKs7OiKiAcKXRu5xVWlt_3rM66sBwfH5L9wzhpwkd3g7YyJy8ePpBiZGiPtHBLWdHyaDy9svyqntk0G775xcFjag9cZ1vB1WV7dNVDVSxKQAafAKe5MDpTzlBKEYGLPw9Wou6jH84EVixN-QGcpSVpjB0TlZZsL-Z-jaS3eColpcApPC8ocAvDkmBka1_6IDEtnOeB8R2s3XFXvoH2bLdU9ws8sDXYjVcCS_nLNT-HXqHGwGBSOfXWo-cgNhhOI8nQvEGMOSt6__lkRWZ75CkgbOS6VOxar_N9w_Q',
    },
    user_id:
      'amzn1.ask.account.AEWTGTJ3JEG7M35VTSK6GFE3VMMHHDG7FM2BFAHY2JFA2S2I2UZIMLWMUG53WDXTDVOHDVKO7ERVDK3NROVGHBSYMH63FYEGTP3YXMHA352S4R3ZWCCIODI35IRAINYF4R4VO3IVBSMWFLDV62ASKII7E7GDCP2ZMFN4CILSFF5YWUQYPDEPN7KIB3Q2GMGT367IFFH4C3CFA2A',
    voiceflow: {
      permissions: [],
      events: [],
      capabilities: {},
    },
    locale: 'en-US',
    platform: 'alexa',
    timestamp: 1588865737,
  },
  storage: {
    output: 'where are you from?',
    sessions: 1,
    repeat: 100,
    alexa_permissions: [],
    locale: 'en-US',
    user:
      'amzn1.ask.account.AEWTGTJ3JEG7M35VTSK6GFE3VMMHHDG7FM2BFAHY2JFA2S2I2UZIMLWMUG53WDXTDVOHDVKO7ERVDK3NROVGHBSYMH63FYEGTP3YXMHA352S4R3ZWCCIODI35IRAINYF4R4VO3IVBSMWFLDV62ASKII7E7GDCP2ZMFN4CILSFF5YWUQYPDEPN7KIB3Q2GMGT367IFFH4C3CFA2A',
    supported_interfaces: {},
  },
};
