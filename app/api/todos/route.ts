import { NextResponse } from 'next/server'
import { TodoService } from '../../../services/todoService'

// Définir les types directement ici puisque nous n'avons pas accès aux types du dossier types/
type CategoryType = 'Course' | 'Personnel' | 'Travail';

interface CreateTodoDTO {
    title: string;
    category: CategoryType;
}

interface UpdateTodoDTO {
    id: string;
    completed?: boolean;
    category?: CategoryType;
}

const todoService = new TodoService();

// Initialiser les catégories au démarrage
console.log('Initialisation des catégories...');
todoService.initializeCategories()
    .then(() => console.log('Catégories initialisées avec succès'))
    .catch(error => console.error('Erreur lors de l\'initialisation des catégories:', error));

export async function GET() {
    try {
        const todos = await todoService.getAllTodos();
        return NextResponse.json(todos);
    } catch (error) {
        console.error('GET Error:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des todos' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json() as CreateTodoDTO;
        
        if (!data.title || !data.category) {
            return NextResponse.json(
                { error: 'Le titre et la catégorie sont requis' },
                { status: 400 }
            );
        }

        const newTodo = await todoService.createTodo(data);
        return NextResponse.json(newTodo, { status: 201 });
    } catch (error) {
        console.error('POST Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Erreur lors de la création du todo' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const data = await request.json() as UpdateTodoDTO;
        const updatedTodo = await todoService.updateTodo(data);
        return NextResponse.json(updatedTodo);
    } catch (error) {
        console.error('PUT Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour du todo' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json(
                { error: 'ID manquant' },
                { status: 400 }
            );
        }
        await todoService.deleteTodo(id);
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('DELETE Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Erreur lors de la suppression du todo' },
            { status: 500 }
        );
    }
} 