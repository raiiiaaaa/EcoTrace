import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AktivitasPageRoutingModule } from './aktivitas-routing.module';

import { AktivitasPage } from './aktivitas.page';
import { TambahComponent } from './tambah/tambah.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AktivitasPageRoutingModule
  ],
  declarations: [AktivitasPage, TambahComponent]
})
export class AktivitasPageModule {}

