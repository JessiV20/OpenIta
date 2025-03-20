import { Routes } from '@angular/router';
import { InicioComponent } from '../componentes/vistas/inicio/inicio.component';
import { TarjetaComponent } from '../componentes/vistas/tarjeta/tarjeta.component';

export const routes: Routes = [
    {path: '', redirectTo: 'inicio/formIta', pathMatch: 'full'},
    {path: 'inicio/formIta', component: InicioComponent},
    {path:'tarjeta/inicio', component: TarjetaComponent},
    {path:'**', component:InicioComponent},
];
