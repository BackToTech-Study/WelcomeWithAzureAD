import { MsalInterceptorConfiguration } from '@azure/msal-angular';
import { BrowserCacheLocation, InteractionType, IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
import { environment } from 'src/environments/environment';


export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.clientId,
      authority: `https://login.microsoftonline.com/${environment.tennantID}`,
      redirectUri: 'http://localhost:4200/'
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage
    }
  });
}


export const protectedResources = {
  weather: 'https://localhost:7268/WeatherForecast'
};

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set(protectedResources.weather, [`api://${environment.resourceClientId}/access_as_user`]);

  return {
      interactionType: InteractionType.Redirect,
      protectedResourceMap
  };
}