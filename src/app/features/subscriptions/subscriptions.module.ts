import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SubscriptionsComponent} from './containers/subscriptions/subscriptions.component';
import {SubscriptionsRoutingModule} from './subscriptions-routing.module';
import { PlanListComponent } from './components/plan-list/plan-list.component';
import { SubscriptionListComponent } from './components/subscription-list/subscription-list.component';
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    SubscriptionsComponent,
    PlanListComponent,
    SubscriptionListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SubscriptionsRoutingModule
  ]
})
export class SubscriptionsModule {
}
