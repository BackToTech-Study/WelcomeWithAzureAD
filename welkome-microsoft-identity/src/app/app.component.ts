import { Component, OnDestroy, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AuthenticationResult, InteractionStatus} from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { WeatherService } from './services/weather.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'welkome-microsoft-identity';

  userName: string | undefined = undefined;
  private readonly _destroying$ = new Subject<void>();

  forecastCollection: any[] = [];

  constructor(
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private weatherService: WeatherService,
  ) {  }

  ngOnInit(): void {
      this.msalBroadcastService.inProgress$
        .pipe(
          filter((status: InteractionStatus) => status === InteractionStatus.None),
          takeUntil(this._destroying$)
        )
        .subscribe(() => {
          const accounts = this.authService.instance.getAllAccounts(); 
          this.userName = accounts.length > 0 ? accounts.shift()?.name : "";
        });      
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  login() {
    this.authService.loginPopup()
      .subscribe((response: AuthenticationResult) => {
        this.authService.instance.setActiveAccount(response.account);
      });
  }

  logout() {
      this.authService.logoutPopup({
        postLogoutRedirectUri: 'http://localhost:4200'
      });   
  }

  getForecast() {
    this.weatherService.getForecast().subscribe((result) => {
      this.forecastCollection = result.map(data => { return {
        date: new Date(data.date).toUTCString(),
        summary: data.summary,
        temperatureC: data.temperatureC
      }});
    })
  }
}
