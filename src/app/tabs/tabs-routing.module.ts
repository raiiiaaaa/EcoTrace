import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';
import { OnboardingGuard } from '../guards/onboarding.guard';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'beranda',
        loadChildren: () => import('../beranda/beranda.module').then( m => m.BerandaPageModule)
      },
      {
        path: 'aktivitas',
        loadChildren: () => import('../aktivitas/aktivitas.module').then( m => m.AktivitasPageModule),
        canLoad: [OnboardingGuard]
      },
      {
        path: 'edukasi',
        loadChildren: () => import('../edukasi/edukasi.module').then( m => m.EdukasiPageModule),
        canLoad: [OnboardingGuard]
      },
      {
        path: '',
        redirectTo: '/tabs/beranda',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/beranda',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
