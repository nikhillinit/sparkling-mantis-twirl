import { ACFData, User, DiagnosticResult, Progress } from '@/types';
import { modules } from '@/data/modules';

const STORAGE_KEY = 'acfMasteryData';

const getDefaultData = (): ACFData => ({
  user: null,
  progress: modules.map(m => ({
    moduleId: m.id,
    lessonsCompleted: 0,
    totalLessons: m.lessons.length,
    practiceCompleted: false,
    quizCompleted: false,
  })),
  diagnosticResults: [],
});

export const loadACFData = (): ACFData => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (parsedData.user && Array.isArray(parsedData.progress)) {
        return parsedData;
      }
    }
  } catch (error) {
    console.error("Failed to load data from localStorage", error);
  }
  return getDefaultData();
};

const saveData = (data: ACFData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save data to localStorage", error);
  }
};

export const updateUser = (userData: Partial<User>) => {
  const data = loadACFData();
  const updatedUser = { ...data.user, ...userData } as User;
  saveData({ ...data, user: updatedUser });
};

export const saveDiagnosticResults = (results: DiagnosticResult[]) => {
  const data = loadACFData();
  saveData({ ...data, diagnosticResults: results });
};

export const updateProgress = (moduleId: string, progressUpdate: Partial<Progress>) => {
  const data = loadACFData();
  const progressIndex = data.progress.findIndex(p => p.moduleId === moduleId);
  if (progressIndex > -1) {
    data.progress[progressIndex] = { ...data.progress[progressIndex], ...progressUpdate };
  } else {
    const module = modules.find(m => m.id === moduleId);
    if (module) {
      data.progress.push({
        moduleId: moduleId,
        lessonsCompleted: 0,
        totalLessons: module.lessons.length,
        practiceCompleted: false,
        quizCompleted: false,
        ...progressUpdate,
      });
    }
  }
  saveData(data);
};

export const clearACFData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear data from localStorage", error);
  }
};