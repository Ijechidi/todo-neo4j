export type CategoryType = 'Course' | 'Personnel' | 'Travail';

export interface Category {
    id: string;
    name: CategoryType;
    color: string;
}

export interface Todo {
    id: string;
    title: string;
    completed: boolean;
    category: CategoryType;
}

export interface CreateTodoDTO {
    title: string;
    category: CategoryType;
}

export interface UpdateTodoDTO {
    id: string;
    completed?: boolean;
    title?: string;
    category?: CategoryType;
}

export const CATEGORIES: Category[] = [
    { id: '1', name: 'Course', color: '#4CAF50' },     // Vert
    { id: '2', name: 'Personnel', color: '#2196F3' },  // Bleu
    { id: '3', name: 'Travail', color: '#F44336' }     // Rouge
];
