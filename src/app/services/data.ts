import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// interface Activity
export interface Activity {
  id: string;
  type: 'Plastik' | 'Kertas' | 'Logam' | 'B3';
  name: string;
  weight: number; // in kg
  status: 'Tersetor' | 'Tersimpan';
  date: string;
}

// interface EducationArticle
export interface EducationArticle {
  id: string;
  title: string;
  icon: string; // Ionicons name or custom icon reference
  color: string;
  category: string;
  content: string;
  imageUrl?: string;
}

// interface AppData
export interface AppData {
  activities: Activity[];
  user: {
    name: string;
    hasSetName: boolean;
  };
  dailyTip: {
    date: string;
    index: number;
  };
}

// key untuk menyimpan data
const STORAGE_KEY = 'ecotrace_data';

// data default
const DEFAULT_DATA: AppData = {
  activities: [],
  user: { name: 'Warga Bumi', hasSetName: false },
  dailyTip: { date: '', index: 0 },
};

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private cachedData: AppData | null = null;

  constructor(private http: HttpClient) {
    this.initData();
  }

  // inisialisasi data
  private initData(): void {
    // Load data sekali saat startup
    const raw = localStorage.getItem(STORAGE_KEY);

    // cek apakah data ada
    if (raw) {
      try {
        this.cachedData = { ...DEFAULT_DATA, ...JSON.parse(raw) }; // set data default
      } catch { // jika data tidak ada
        this.cachedData = { ...DEFAULT_DATA }; // set data default
      }
    } else { // jika data tidak ada
      this.cachedData = { ...DEFAULT_DATA }; // set data default
    }

    // Jalankan migrasi jika perlu
    this.migrateOldData();
  }

  // ─── Core JSON Store ───────────────────────────────────────────────────────

  // ambil data
  getData(): AppData {
    if (!this.cachedData) {
      this.initData(); // inisialisasi data
    }
    return this.cachedData!;
  }

  // simpan data
  saveData(data: AppData): void {
    this.cachedData = data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  // ─── Migrasi Data Lama ─────────────────────────────────────────────────────

  // migrasi data lama
  private migrateOldData(): void {
    const alreadyMigrated = localStorage.getItem(STORAGE_KEY);
    if (alreadyMigrated) return; // jika data sudah dimigrasi

    const data: AppData = { ...DEFAULT_DATA }; // set data default

    // Migrasi activities
    const oldActivities = localStorage.getItem('ecotrace_activities');
    if (oldActivities) { // jika data ada
      try { data.activities = JSON.parse(oldActivities); } catch {} // set data default
      localStorage.removeItem('ecotrace_activities'); // hapus data lama
    }

    // Migrasi username
    const oldName = localStorage.getItem('ecotrace_username');
    if (oldName) { // jika data ada
      data.user.name = oldName; // set data default
      localStorage.removeItem('ecotrace_username'); // hapus data lama
    }

    // Migrasi daily tip
    const oldTipDate = localStorage.getItem('ecotrace_tip_date');
    const oldTipIndex = localStorage.getItem('ecotrace_tip_index');
    if (oldTipDate) {
      data.dailyTip.date = oldTipDate;
      data.dailyTip.index = parseInt(oldTipIndex || '0', 10);
      localStorage.removeItem('ecotrace_tip_date');
      localStorage.removeItem('ecotrace_tip_index');
    }

    this.saveData(data);
  }

  // ─── Activities ───────────────────────────────────────────────────────────

  // ambil data
  getActivities(): Activity[] {
    return this.getData().activities;
  }

  // simpan data
  saveActivities(activities: Activity[]): void {
    const data = this.getData();
    data.activities = activities;
    this.saveData(data);
  }

  // tambah data
  addActivity(activity: Activity): void {
    const activities = this.getActivities();
    activities.unshift(activity);
    this.saveActivities(activities);
  }

  // hapus data
  deleteActivity(id: string): void {
    this.saveActivities(this.getActivities().filter(a => a.id !== id));
  }

  // update data
  updateActivity(activity: Activity): void {
    const activities = this.getActivities();
    const index = activities.findIndex(a => a.id === activity.id);
    if (index !== -1) {
      activities[index] = activity;
      this.saveActivities(activities);
    }
  }

  // ─── User ─────────────────────────────────────────────────────────────────

  // ambil data
  getUserName(): string {
    return this.getData().user.name;
  }

  // cek apakah data ada
  hasUserSetName(): boolean {
    return this.getData().user.hasSetName === true;
  }

  // simpan data
  saveUserName(name: string): void {
    const data = this.getData();
    data.user.name = name;
    data.user.hasSetName = true;
    this.saveData(data);
  }

  // ─── Daily Tip ────────────────────────────────────────────────────────────

  // ambil data
  getDailyTip(): { date: string; index: number } {
    return this.getData().dailyTip;
  }

  // simpan data
  saveDailyTip(date: string, index: number): void {
    const data = this.getData();
    data.dailyTip = { date, index };
    this.saveData(data);
  }

  // ─── Points & Stats ───────────────────────────────────────────────────────

  // ambil data
  getPoints(): number {
    return this.getActivities()
      .filter(a => a.status === 'Tersetor')
      .reduce((sum, current) => sum + (current.weight * 50), 0);
  }

  // ambil data
  getStats() {
    const activities = this.getActivities().filter(a => a.status === 'Tersetor');
    const totalPlastik = activities.filter(a => a.type === 'Plastik').reduce((sum, a) => sum + a.weight, 0);
    const totalKertas = activities.filter(a => a.type === 'Kertas').reduce((sum, a) => sum + a.weight, 0);
    const totalLogam = activities.filter(a => a.type === 'Logam').reduce((sum, a) => sum + a.weight, 0);
    const impact = (totalKertas * 0.05).toFixed(1);

    return { totalPlastik, totalKertas, totalLogam, impact };
  }

  // ─── Education Articles ───────────────────────────────────────────────────

  // ambil data
  getEducationArticles(): Observable<EducationArticle[]> {
    return this.http.get<EducationArticle[]>('assets/data/education.json');
  }
}
