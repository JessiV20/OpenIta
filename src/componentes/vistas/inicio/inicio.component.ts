import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';
import {  ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-inicio',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    HttpClientModule,
    RouterModule,
    MatRadioModule
  ],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']  // Asegúrate de usar 'styleUrls' (plural)
})
export class InicioComponent {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  isCameraOpen = false;
  photo: string | null = null;
  stream: MediaStream | null = null;
  formulario: FormGroup;
  carreraSeleccionada: string | null = null;
  modalidad:string[]=['Presencial','Distancia']
  carreras: string[] = ['Ingeniería en Tics', 'Ingeniería Industrial', 'Ingeniería en Gestión Empresarial', 'Ingeniería en Química','Ingeniería Eléctrica','Ingeniería Electrónica', 'Ingeniería Mécanica', 'Ingeniería en Materiales', 'Ingeniería en Semiconductores', 'Ingeniería en Ciberseguridad', 'Licenciatura en Administración'];
  datos:any[]=[];
  modalidades: string[] = ['Presencial', 'Distancia'];
  constructor(private fb: FormBuilder, private http: HttpClient, private route: Router) {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      carrera: ['', Validators.required],
      modalidad: ['Presencial']

    });
  }
  async openCamera() {
    this.isCameraOpen = true;
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (this.videoElement && this.videoElement.nativeElement) {
        this.videoElement.nativeElement.srcObject = this.stream;
      }
    } catch (error) {
      console.error('Error al acceder a la cámara', error);
      alert('No se pudo acceder a la cámara. Verifica los permisos.');
    }
  }

  takePhoto() {
    if (!this.videoElement || !this.canvasElement) return;

    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.photo = canvas.toDataURL('image/png'); // Convertir imagen a base64
    }

    // Detener la cámara después de tomar la foto
    this.closeCamera();
  }

  closeCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.isCameraOpen = false;

      // Liberar el flujo de la cámara
      if (this.videoElement && this.videoElement.nativeElement) {
        this.videoElement.nativeElement.srcObject = null;
        this.videoElement.nativeElement.style.display = 'none'; // Ocultar el video
      }
    }
  }

  enviarFormulario() {

     this.datos = this.formulario.value;
    Swal.fire({
      title: "Estas Seguro?",
      html: (`<strong>Revisa tus datos antes de confirmar</strong><br><br>` +
        `<strong>Nombre</strong>: ${this.formulario.value.nombre}<br>` +
        `<strong>Correo</strong>: ${this.formulario.value.correo}<br>` +
        `<strong>Carrera</strong>: ${this.formulario.value.carrera}<br>`+
        ` <strong>Modalidad:</strong> ${this.formulario.value.modalidad}`),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Datos Correctos!"
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.formulario.valid) {
          const datosFormulario = this.formulario.value;

          // Enviar los datos al servidor
          this.http.post('http://localhost:4300/api/guardar-datos', datosFormulario).subscribe(
            (response: any) => {
              console.log('Datos guardados en el servidor:', response);
              Swal.fire({
                title: "Bienvenid@ al Ita.",
                width: 600,
                padding: "3em",
                color: "#716add",
                background: "#fff url(/images/trees.png)",
                backdrop: `
                  rgba(0,0,123,0.4)
                  url("/NyanCat.gif")
                  left top
                  no-repeat
                `,timer: 3000
              });

              this.route.navigate(['tarjeta/inicio'], { queryParams: { response: JSON.stringify(response) } });



            },
            (error) => {
              console.error('Error al guardar los datos', error);
              if (error.status === 400) {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "El correo ya esta registrado!"
                });
              } else {
                alert('Hubo un error al guardar los datos');
              }
            }
          );
        } else {
          console.log('Formulario no válido');
        }
      }
    });

}

}
