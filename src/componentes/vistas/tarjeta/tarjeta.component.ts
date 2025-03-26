import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import html2canvas from 'html2canvas';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-tarjeta',
  imports: [CommonModule], 
  templateUrl: './tarjeta.component.html',
  styleUrl: './tarjeta.component.css'
})
export class TarjetaComponent {
  @ViewChild('tarjeta', { static: false }) tarjeta!: ElementRef;
  nombre:string='';
  correo:string='';
  carrera:string='';
  modalidad:string='';
  fotoBase64:string='';
  fondosCarreras: { [key: string]: string } = {
    'Ingeniería en Tics': 'url(https://example.com/fondo-sistemas.jpg)',
    'Ingeniería Industrial': 'url(https://i.pinimg.com/736x/6c/6f/fc/6c6ffce59781902ca471f01db946a7bb.jpg)',
    'Ingeniería en Gestión Empresarial': 'url(https://i.pinimg.com/736x/42/e5/a6/42e5a6c2e26c8bd2c4f5fd9ffa6fbf5a.jpg)',
    'Ingeniería Química': 'url(https://i.pinimg.com/736x/71/e6/18/71e61888c6960949c677690a5c26f619.jpg)',
    'Ingeniería Eléctrica': 'url(https://i.pinimg.com/736x/38/42/13/384213759bf0b9f87c48e31b0b767691.jpg)',
    'Ingeniería Electrónica': 'url(https://example.com/fondo-electronica.jpg)',
    'Ingeniería Mécanica': 'url(https://example.com/fondo-quimica.jpg)',
    'Ingeniería en Materiales': 'url(https://example.com/fondo-bioquimica.jpg)',
    'Ingeniería en Semiconductores': 'url(https://example.com/fondo-administracion.jpg)',
    'Ingeniería en Ciberseguridad': 'url(https://example.com/fondo-administracion.jpg)',
    'Licenciatura en Administración': 'url(https://example.com/fondo-administracion.jpg)',
  };
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
      if (params['foto']) {
        this.fotoBase64 = params['foto']; 
      }
    });
  }
  getFondoCarrera(): string {
    return this.fondosCarreras[this.carrera] || 'url(https://i.pinimg.com/736x/6c/6f/fc/6c6ffce59781902ca471f01db946a7bb.jpg)';
  }
  descargarTarjeta() {
    if (!this.tarjeta) return;

    html2canvas(this.tarjeta.nativeElement).then(canvas => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png'); 
      link.download = 'tarjeta.png'; 
      link.click();
    });
  }
}
