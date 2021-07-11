import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './containers/home/home.component';
import {HomeRoutingModule} from './home-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {UserCardComponent} from './components/user-card/user-card.component';
import { PresentationSectionComponent } from './components/presentation-section/presentation-section.component';
import { HomeMenuComponent } from './components/home-menu/home-menu.component';
import { ContactSectionComponent } from './components/contact-section/contact-section.component';


@NgModule({
  declarations: [
    HomeComponent,
    UserCardComponent,
    PresentationSectionComponent,
    HomeMenuComponent,
    ContactSectionComponent
  ],
  imports: [
    HomeRoutingModule,
    SharedModule,
    CommonModule
  ]
})
export class HomeModule {
}
