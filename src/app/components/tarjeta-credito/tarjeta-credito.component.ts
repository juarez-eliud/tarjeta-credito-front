import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Tarjeta } from 'src/app/models/tarjeta';
import { TarjetaService } from 'src/app/services/tarjeta.service';

@Component({
  selector: 'app-tarjeta-credito',
  templateUrl: './tarjeta-credito.component.html',
  styleUrls: ['./tarjeta-credito.component.css']
})
export class TarjetaCreditoComponent implements OnInit {

  listadoTarjetas = new Array<Tarjeta>();
  form: FormGroup;
  accion = 'agregar';
  id: number | undefined;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private tarjetaService: TarjetaService) { 
    this.form = this.fb.group({
      titular: ['', Validators.required],
      numeroTarjeta: ['', [Validators.required, Validators.maxLength(16), Validators.minLength(16)]],
      fechaExpiracion: ['', [Validators.required, Validators.maxLength(5), Validators.minLength(5)]],
      cvv: ['', [Validators.required, Validators.maxLength(3), Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.obtenerTarjetas();
  }

  obtenerTarjetas() {
    this.tarjetaService.getListTarjetas().subscribe(response => {
      this.listadoTarjetas = response;
      console.log(this.listadoTarjetas);
    });
  }

  guardarTarjeta() {
    const tarjeta = this.form.value as Tarjeta;

    //Otra forma de binding de formulario
    /* const tarjeta: Tarjeta = {
      titular: this.form.get('titular')?.value,
      numeroTarjeta: this.form.get('numeroTarjeta')?.value,
      fechaExpiracion: this.form.get('fechaExpiracion')?.value,
      cvv: this.form.get('cvv')?.value
    } */

    //this.listadoTarjetas.push(tarjeta);

    if(this.id == undefined){
      //Agregar una nueva tarjeta
      this.tarjetaService.saveTarjeta(tarjeta).subscribe(() => {
        this.toastr.success('La tarjeta fue registrada con éxito!', 'Tarjeta registrada!');
        this.obtenerTarjetas();
        this.form.reset();
      });
    }else {
      //Editar tarjeta
      tarjeta.id = this.id;
      this.tarjetaService.updateTarjeta(this.id, tarjeta).subscribe(() => {
        this.form.reset();
        this.accion = 'agregar';
        this.id = undefined;
        this.toastr.info('La tarjeta fue actualizada con éxito', 'Tarjeta actualizada');
        this.obtenerTarjetas();
      }, error => {
        console.log(error);
      });
    }



  }

  eliminarTarjeta(id: number) {
    //this.listadoTarjetas.splice(index,1);
    this.tarjetaService.deleteTarjeta(id).subscribe(() => {
      this.obtenerTarjetas();
      this.toastr.error('La tarjeta fue eliminada con éxito!', 'Tarjeta eliminada!');
    });
  }

  editarTarjeta(tarjeta: Tarjeta) {
    this.accion = 'editar';
    this.id = tarjeta.id;
    this.form.patchValue({
      titular: tarjeta.titular,
      numeroTarjeta: tarjeta.numeroTarjeta,
      fechaExpiracion: tarjeta.fechaExpiracion,
      cvv: tarjeta.cvv
    });
  }

}
