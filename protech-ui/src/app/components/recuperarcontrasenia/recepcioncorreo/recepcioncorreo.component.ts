import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from 'ngx-toastr';

import { RecuperarconrtraseniaService } from "../../../services/recuperarconrtrasenia.service";

@Component({
  selector: 'app-recepcioncorreo',
  templateUrl: './recepcioncorreo.component.html',
  styleUrls: ['./recepcioncorreo.component.css']
})
export class RecepcioncorreoComponent implements OnInit {

  formCorreo: FormGroup;
  correo:any={};
  correoValido:boolean=true;
  constructor(private formBuilder:FormBuilder, private _recuperarContraseniaService:RecuperarconrtraseniaService, private _toastr: ToastrService) {
    this.buildFormCorreo();
  }

  ngOnInit(): void {
  }


  private buildFormCorreo(){
    this.formCorreo = this.formBuilder.group({
      correo:['',[Validators.email,Validators.required]]
    });
  }

  validarFormCorreo(): boolean{
    if(this.formCorreo.valid){
      this.correo = {
        correo: this.formCorreo.get('correo').value
      }
      return true;
    }else{
      this.formCorreo.markAllAsTouched();
      return false;
    }
  }

  enviarCorreo(){

    if(this.validarFormCorreo()){
      this._recuperarContraseniaService.mandarCorreo(this.correo).subscribe((data:any)=>{

        if(data.status){
          this._toastr.success('Correo enviado','Pro-Tech');
        }
      },error=>{
        this.correoValido = false;
      });
    }
  }


}
