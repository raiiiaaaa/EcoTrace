import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

const STORAGE_KEY = 'ecotrace_data';

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

  private initData(): void {
    // Load data sekali saat startup
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        this.cachedData = { ...DEFAULT_DATA, ...JSON.parse(raw) };
      } catch {
        this.cachedData = { ...DEFAULT_DATA };
      }
    } else {
      this.cachedData = { ...DEFAULT_DATA };
    }

    // Jalankan migrasi jika perlu
    this.migrateOldData();
  }

  // ─── Core JSON Store ───────────────────────────────────────────────────────

  getData(): AppData {
    if (!this.cachedData) {
      this.initData();
    }
    return this.cachedData!;
  }

  saveData(data: AppData): void {
    this.cachedData = data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  // ─── Migrasi Data Lama ─────────────────────────────────────────────────────

  private migrateOldData(): void {
    const alreadyMigrated = localStorage.getItem(STORAGE_KEY);
    if (alreadyMigrated) return;

    const data: AppData = { ...DEFAULT_DATA };

    // Migrasi activities
    const oldActivities = localStorage.getItem('ecotrace_activities');
    if (oldActivities) {
      try { data.activities = JSON.parse(oldActivities); } catch {}
      localStorage.removeItem('ecotrace_activities');
    }

    // Migrasi username
    const oldName = localStorage.getItem('ecotrace_username');
    if (oldName) {
      data.user.name = oldName;
      localStorage.removeItem('ecotrace_username');
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

  getActivities(): Activity[] {
    return this.getData().activities;
  }

  saveActivities(activities: Activity[]): void {
    const data = this.getData();
    data.activities = activities;
    this.saveData(data);
  }

  addActivity(activity: Activity): void {
    const activities = this.getActivities();
    activities.unshift(activity);
    this.saveActivities(activities);
  }

  deleteActivity(id: string): void {
    this.saveActivities(this.getActivities().filter(a => a.id !== id));
  }

  updateActivity(activity: Activity): void {
    const activities = this.getActivities();
    const index = activities.findIndex(a => a.id === activity.id);
    if (index !== -1) {
      activities[index] = activity;
      this.saveActivities(activities);
    }
  }

  // ─── User ─────────────────────────────────────────────────────────────────

  getUserName(): string {
    return this.getData().user.name;
  }

  hasUserSetName(): boolean {
    return this.getData().user.hasSetName === true;
  }

  saveUserName(name: string): void {
    const data = this.getData();
    data.user.name = name;
    data.user.hasSetName = true;
    this.saveData(data);
  }

  // ─── Daily Tip ────────────────────────────────────────────────────────────

  getDailyTip(): { date: string; index: number } {
    return this.getData().dailyTip;
  }

  saveDailyTip(date: string, index: number): void {
    const data = this.getData();
    data.dailyTip = { date, index };
    this.saveData(data);
  }

  // ─── Points & Stats ───────────────────────────────────────────────────────

  getPoints(): number {
    return this.getActivities()
      .filter(a => a.status === 'Tersetor')
      .reduce((sum, current) => sum + (current.weight * 50), 0);
  }

  getStats() {
    const activities = this.getActivities().filter(a => a.status === 'Tersetor');
    const totalPlastik = activities.filter(a => a.type === 'Plastik').reduce((sum, a) => sum + a.weight, 0);
    const totalKertas = activities.filter(a => a.type === 'Kertas').reduce((sum, a) => sum + a.weight, 0);
    const totalLogam = activities.filter(a => a.type === 'Logam').reduce((sum, a) => sum + a.weight, 0);
    const impact = (totalKertas * 0.05).toFixed(1);

    return { totalPlastik, totalKertas, totalLogam, impact };
  }

  // ─── Education Articles ───────────────────────────────────────────────────

  getEducationArticles(): Observable<EducationArticle[]> {
    return this.http.get<EducationArticle[]>('assets/data/education.json');
  }
}
