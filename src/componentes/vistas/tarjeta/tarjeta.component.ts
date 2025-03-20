import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';


@Component({
  selector: 'app-tarjeta',
  imports: [],
  templateUrl: './tarjeta.component.html',
  styleUrl: './tarjeta.component.css'
})
export class TarjetaComponent {
  nombre:string='';
  correo:string='';
  carrera:string='';
  modalidad:string='';
  constructor(private route: ActivatedRoute){ }
ngOnInit(){
  this.route.queryParams.subscribe(params => {
    if (params['response']) {
        try {
            const datos = JSON.parse(params['response']);  // Convertir string a objeto
            console.log('Nombre:', datos.usuario?.nombre);
            console.log('Correo:', datos.usuario?.correo);
            console.log('Carrera:', datos.usuario?.carrera);
            console.log('Modalidad:', datos.usuario?.modalidad);
            this.nombre = datos.usuario?.nombre;
            this.correo = datos.usuario?.correo;
            this.carrera = datos.usuario?.carrera;
            this.modalidad = datos.usuario?.modalidad;
        } catch (error) {
            console.error('Error al parsear JSON:', error);
        }
    }
});

}
 
}
