import { Session } from 'neo4j-driver'
import { Todo, CreateTodoDTO, UpdateTodoDTO, CategoryType } from '../types/todo'
import { DatabaseService } from './databaseService'

export class TodoService {
    private dbService: DatabaseService;

    constructor() {
        this.dbService = new DatabaseService();
    }

    async initializeCategories() {
        const session = this.dbService.getSession();
        try {
            // Vérifions d'abord les catégories existantes
            const checkResult = await session.run('MATCH (c:Category) RETURN c.name as name');
            const existingCategories = checkResult.records.map(r => r.get('name'));
            console.log('Catégories existantes:', existingCategories);

            // Créer les catégories une par une pour mieux tracer
            await session.run(`
                MERGE (c:Category {name: 'Course'})
                SET c.id = '1', c.color = '#4CAF50'
                RETURN c
            `);
            console.log('Catégorie Course créée/vérifiée');

            await session.run(`
                MERGE (c:Category {name: 'Personnel'})
                SET c.id = '2', c.color = '#2196F3'
                RETURN c
            `);
            console.log('Catégorie Personnel créée/vérifiée');

            await session.run(`
                MERGE (c:Category {name: 'Travail'})
                SET c.id = '3', c.color = '#F44336'
                RETURN c
            `);
            console.log('Catégorie Travail créée/vérifiée');

            // Vérifions après création
            const finalCheck = await session.run('MATCH (c:Category) RETURN c.name as name');
            const finalCategories = finalCheck.records.map(r => r.get('name'));
            console.log('Catégories après initialisation:', finalCategories);

        } catch (error) {
            console.error('Erreur lors de l\'initialisation des catégories:', error);
            throw error;
        } finally {
            await session.close();
        }
    }

    async getAllTodos(): Promise<Todo[]> {
        const session = this.dbService.getSession();
        try {
            const result = await session.run(`
                MATCH (t:Todo)-[r:BELONGS_TO]->(c:Category)
                RETURN t, c.name as category, r
                ORDER BY c.name, t.title
            `);
            
            console.log('Nombre de todos trouvés:', result.records.length);
            
            return result.records.map(record => ({
                ...record.get('t').properties,
                category: record.get('category')
            } as Todo));
        } finally {
            await session.close();
        }
    }

    async getTodosByCategory(category: CategoryType): Promise<Todo[]> {
        const session = this.dbService.getSession();
        try {
            const result = await session.run(`
                MATCH (t:Todo)-[:BELONGS_TO]->(c:Category {name: $category})
                RETURN t, c.name as category
                ORDER BY t.title
            `, { category });
            return result.records.map(record => ({
                ...record.get('t').properties,
                category: record.get('category')
            } as Todo));
        } finally {
            await session.close();
        }
    }

    async createTodo(todoData: CreateTodoDTO): Promise<Todo> {
        const session = this.dbService.getSession();
        try {
            // Vérifier la catégorie avec une requête insensible à la casse
            const categoryCheck = await session.run(`
                MATCH (c:Category)
                WHERE toLower(c.name) = toLower($category)
                RETURN c
            `, { category: todoData.category });

            if (categoryCheck.records.length === 0) {
                // Log pour le débogage
                console.error(`Catégorie non trouvée: ${todoData.category}`);
                const allCategories = await session.run('MATCH (c:Category) RETURN c.name');
                console.log('Catégories disponibles:', allCategories.records.map(r => r.get('c.name')));
                throw new Error(`Catégorie "${todoData.category}" non trouvée`);
            }

            // Utiliser le nom exact de la catégorie trouvée
            const correctCategoryName = categoryCheck.records[0].get('c').properties.name;

            const result = await session.run(`
                MATCH (c:Category {name: $categoryName})
                CREATE (t:Todo {
                    id: randomUUID(),
                    title: $title,
                    completed: false
                })
                CREATE (t)-[r:BELONGS_TO]->(c)
                RETURN t, c.name as category
            `, {
                title: todoData.title,
                categoryName: correctCategoryName
            });

            const record = result.records[0];
            return {
                ...record.get('t').properties,
                category: record.get('category')
            } as Todo;
        } catch (error) {
            console.error('Erreur dans createTodo:', error);
            throw error;
        } finally {
            await session.close();
        }
    }

    async updateTodo(todoData: UpdateTodoDTO): Promise<Todo> {
        const session = this.dbService.getSession();
        try {
            // 1. Vérifier si le todo existe et récupérer sa catégorie actuelle
            const result = await session.run(`
                MATCH (t:Todo {id: $id})-[:BELONGS_TO]->(c:Category)
                SET t.completed = $completed
                RETURN t, c.name as category
            `, {
                id: todoData.id,
                completed: todoData.completed
            });

            if (result.records.length === 0) {
                throw new Error('Todo non trouvé ou non associé à une catégorie');
            }

            const record = result.records[0];
            console.log('Todo mis à jour:', {
                ...record.get('t').properties,
                category: record.get('category'),
                completed: todoData.completed
            });

            return {
                ...record.get('t').properties,
                category: record.get('category')
            } as Todo;
        } catch (error) {
            console.error('Erreur lors de la mise à jour du todo:', error);
            throw error;
        } finally {
            await session.close();
        }
    }

    async deleteTodo(id: string): Promise<void> {
        const session = this.dbService.getSession();
        try {
            const result = await session.run(`
                MATCH (t:Todo {id: $id})
                OPTIONAL MATCH (t)-[r:BELONGS_TO]->(:Category)
                DELETE t, r
                RETURN count(t) as deleted
            `, { id });
            
            if (result.records[0].get('deleted').low === 0) {
                throw new Error('Todo not found');
            }
        } finally {
            await session.close();
        }
    }

    async getStatistics(): Promise<{
        totalTodos: number;
        completedTodos: number;
        todosByCategory: Record<CategoryType, number>;
    }> {
        const session = this.dbService.getSession();
        try {
            const result = await session.run(`
                MATCH (t:Todo)
                RETURN 
                    count(t) as total,
                    count(t.completed = true) as completed,
                    t.category as category,
                    count(t) as categoryCount
            `);
            
            const stats = result.records[0];
            return {
                totalTodos: stats.get('total').low,
                completedTodos: stats.get('completed').low,
                todosByCategory: stats.get('categoryCount')
            };
        } finally {
            await session.close();
        }
    }

    async getAllCategories() {
        const session = this.dbService.getSession();
        try {
            const result = await session.run('MATCH (c:Category) RETURN c');
            return result.records.map(record => record.get('c').properties);
        } finally {
            await session.close();
        }
    }
} 