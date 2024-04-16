import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { projectsRoutingModule } from './projects-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomerListComponent } from './pages/projects-list/projects-list.component';
import { FormProjectComponent } from './components/form-project/form-project.component';
import { ViewProjectComponent } from './pages/view-project/view-project.component';
import { ListEventsComponent } from './pages/list-events/list-events.component';
import { ViewEventComponent } from './pages/view-event/view-event.component';
import { FormParticipantComponent } from './components/form-participant/form-participant.component';

@NgModule({
    imports: [
        CommonModule,
        projectsRoutingModule,
        SharedModule
    ],
    declarations: [
        CustomerListComponent,
        FormProjectComponent,
        ViewProjectComponent,
        ListEventsComponent,
        ViewEventComponent,
        FormParticipantComponent,
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class projectsModule { }
