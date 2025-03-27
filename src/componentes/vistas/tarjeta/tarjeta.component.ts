import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import html2canvas from 'html2canvas';
import { ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-tarjeta',
  imports: [CommonModule, HttpClientModule], 
  templateUrl: './tarjeta.component.html',
  styleUrl: './tarjeta.component.css'
})
export class TarjetaComponent {
  @ViewChild('tarjeta', { static: false }) tarjeta!: ElementRef;
  nombre:string='';
  correo:string='';
  carrera:string='';
  modalidad:string='';
  fotoBase64: string | null = null; 
  imagenGenerada: string | null = null;
  fondosCarreras: { [key: string]: string } = {
    'Ingeniería en Tics': 'url(/background/tics.jpg)',
    'Ingeniería Industrial': 'url(/background/industrial.jpg)',
    'Ingeniería en Gestión Empresarial': 'url(/background/ige.avif)',
    'Ingeniería Química': 'url(/background/quimica.jpg)',
    'Ingeniería Eléctrica': 'url(/background/electrica.jpg)',
    'Ingeniería Electrónica': 'url(/background/electronica.jpg)',
    'Ingeniería Mécanica': 'url(/background/mecanica.jpg)',
    'Ingeniería en Materiales': 'url(/background/materiales.jpg)',
    'Ingeniería en Semiconductores': 'url(/background/semiconductor.avif)',
    'Ingeniería en Ciberseguridad': 'url(/background/ciberseguridad.jpg)',
    'Licenciatura en Administración': 'url(/background/admin.jpg)',
  };

  imagenesCarreras: { [key: string]: { [key: string]: string } } = {
    'Ingeniería en Tics': {
      'Presencial': '/tics.png',
      'Distancia': '/tics.png',
    },
    'Ingeniería Industrial': {
      'Presencial': '/industrial-presencial.png',
      'Distancia': '/industrial-distancia.png',
    },
    'Ingeniería en Gestión Empresarial': {
      'Presencial': '/ige-presencial.png',
      'Distancia': '/ige-distancia.png',
    },
    'Ingeniería Química': {
      'Presencial': '/quimica.png',
      'Distancia': '/quimica.png',
    },
    'Ingeniería Eléctrica': {
      'Presencial': '/electrica.png',
      'Distancia': '/electrica.png',
    },
    'Ingeniería Electrónica': {
      'Presencial': '/electronica.png',
      'Distancia': '/electronica.png',
    },
    'Ingeniería Mécanica': {
      'Presencial': '/mecanica.png',
      'Distancia': '/mecanica.png',
    },
    'Ingeniería en Materiales': {
      'Presencial': '/materiales.png',
      'Distancia': '/materiales.png',
    },
    'Ingeniería en Semiconductores': {
      'Presencial': '/semiconductores.png',
      'Distancia': '/semiconductores.png',
    },
    'Ingeniería en Ciberseguridad': {
      'Presencial': '/ciberseguridad.png',
      'Distancia': '/ciberseguridad.png',
    },
    'Licenciatura en Administración': {
      'Presencial': '/administracion.png',
      'Distancia': '/administracion.png',
    },
  };


  constructor(private route: ActivatedRoute, private http : HttpClient){ }
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
  ngAfterViewInit() {
    setTimeout(() => {
      this.generarImagen();
    }, 500);
  }

  async generarImagen() {
    if (this.tarjeta) {
      try {
        const canvas = await html2canvas(this.tarjeta.nativeElement, {
          scale: 0.9, // Reducir la escala
          logging: false,
          useCORS: true
        });
        
        // Reducir calidad/convertir a JPEG para menor tamaño
        this.imagenGenerada = canvas.toDataURL('image/jpeg', 0.9);
        console.log('Imagen generada con tamaño reducido');
        this.enviarCorreo();
      } catch (error) {
        console.error('Error al generar imagen:', error);
      }
    }
  }
  getFondoCarrera(): string {
    return this.fondosCarreras[this.carrera] || 'url(https://i.pinimg.com/736x/6c/6f/fc/6c6ffce59781902ca471f01db946a7bb.jpg)';
  }
  getQR(): string {
    const modalidadSeleccionada = this.modalidad || 'Presencial';
    return this.imagenesCarreras[this.carrera]?.[modalidadSeleccionada] || '/tics.png';
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
  enviarCorreo() {
    if (!this.imagenGenerada) {
      console.error('No hay imagen generada para enviar');
      alert('Primero debe generarse la imagen');
      return;
    }
  
    console.log('Preparando para enviar correo...');
    
    // Extraer solo la parte base64 de la imagen
    const imagenParaEnviar = this.imagenGenerada.split(',')[1] || this.imagenGenerada;
  
    this.http.post('http://localhost:4300/api/enviar-correo', {
      nombre: this.nombre,
      correo: this.correo,
      asunto: 'Tarjeta de presentación',
      mensaje: `¡Hola ${this.nombre}, gracias por tu interés en nuestra institución!`,
      imagen: imagenParaEnviar
    })
    .subscribe({
      next: (response) => {
        console.log('Correo enviado exitosamente:', response);
        alert('Correo enviado con éxito');
      },
      error: (error) => {
        console.error('Error al enviar el correo:', error);
        alert('Hubo un error al enviar el correo');
      }
    });
  }
}  