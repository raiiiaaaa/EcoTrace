import { Injectable } from '@angular/core';

export interface Activity {
  id: string;
  type: 'Plastik' | 'Kertas' | 'Logam' | 'B3';
  name: string;
  weight: number; // in kg
  status: 'Tersetor' | 'Tersimpan';
  date: string;
}

export interface EducationArticle {
  id: string;
  title: string;
  icon: string; // Ionicons name or custom icon reference
  color: string;
  category: string;
  content: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private storageKey = 'ecotrace_activities';
  
  constructor() {}

  getActivities(): Activity[] {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  }

  saveActivities(activities: Activity[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(activities));
  }

  addActivity(activity: Activity) {
    const activities = this.getActivities();
    activities.unshift(activity); // Add to beginning
    this.saveActivities(activities);
  }

  deleteActivity(id: string) {
    const activities = this.getActivities().filter(a => a.id !== id);
    this.saveActivities(activities);
  }

  updateActivity(activity: Activity) {
    const activities = this.getActivities();
    const index = activities.findIndex(a => a.id === activity.id);
    if (index !== -1) {
      activities[index] = activity;
      this.saveActivities(activities);
    }
  }

  getPoints(): number {
    return this.getActivities()
      .filter(a => a.status === 'Tersetor')
      .reduce((sum, current) => sum + (current.weight * 50), 0); // Example: 50 pts per kg setang
  }

  getStats() {
    const activities = this.getActivities().filter(a => a.status === 'Tersetor');
    const totalPlastik = activities.filter(a => a.type === 'Plastik').reduce((sum, a) => sum + a.weight, 0);
    const totalKertas = activities.filter(a => a.type === 'Kertas').reduce((sum, a) => sum + a.weight, 0);
    const totalLogam = activities.filter(a => a.type === 'Logam').reduce((sum, a) => sum + a.weight, 0);
    const impact = (totalKertas * 0.05).toFixed(1); // Mock impact logic

    return { totalPlastik, totalKertas, totalLogam, impact };
  }

  getEducationArticles(): EducationArticle[] {
    return [
      { id: '1', title: 'Kenali 7 Simbol Daur Ulang Plastik', icon: 'water', color: '#c2e3fc', category: 'Plastik', content: 'Plastik memiliki 7 kode segitiga daur ulang. Nomor 1 (PET/PETE) dan 2 (HDPE) adalah yang paling mudah didaur ulang. Sedangkan no 3 (PVC) sangat berbahaya dan no 7 (Other) sulit didaur ulang.', imageUrl: 'assets/images/cover_plastic.png' },
      { id: '2', title: 'Panduan Kompos Rumahan Mudah', icon: 'leaf', color: '#dcf4c6', category: 'Kompos', content: 'Kumpulkan sampah organik (potongan sayur/buah). Siapkan wadah bertutup, cacah sisa organik, lapisi selang-seling dengan daun kering/tanah, jaga kelembapannya. Dalam 3-4 minggu kompos siap dipakai!', imageUrl: 'assets/images/cover_compost.png' },
      { id: '3', title: 'Apa Itu Sampah B3 & Bahayanya', icon: 'warning', color: '#ffecb3', category: 'B3', content: 'Sampah B3 meliputi baterai habis, lampu neon, kaleng obat nyamuk, hingga botol skincare berbahan kimia keras. Jangan campur ini ke sampah biasa karena racunnya bisa mencemari air dan tanah.', imageUrl: 'assets/images/cover_b3.png' }
    ];
  }
}
