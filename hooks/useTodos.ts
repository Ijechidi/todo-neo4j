import { useState, useCallback } from 'react'
import { Todo, CreateTodoDTO, UpdateTodoDTO } from '../types/todo'

export const useTodos = () => {
    const [todos, setTodos] = useState<Todo[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const fetchTodos = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await fetch('/api/todos')
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            setTodos(data)
        } catch (err) {
            console.error('Fetch error:', err)
            setError(err instanceof Error ? err.message : 'Une erreur est survenue')
        } finally {
            setLoading(false)
        }
    }, [])

    const addTodo = useCallback(async (todoData: CreateTodoDTO) => {
        try {
            setError(null)
            const response = await fetch('/api/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(todoData)
            })
            
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Erreur lors de l\'ajout')
            }
            
            const newTodo = await response.json()
            setTodos(prev => [...prev, newTodo])
            return newTodo
        } catch (err) {
            console.error('Add error:', err)
            setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout')
            throw err
        }
    }, [])

    const updateTodo = useCallback(async (todoData: UpdateTodoDTO) => {
        try {
            setError(null)
            const response = await fetch('/api/todos', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(todoData)
            })
            
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Erreur lors de la mise à jour')
            }
            
            await fetchTodos()
        } catch (err) {
            console.error('Update error:', err)
            setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour')
            throw err
        }
    }, [fetchTodos])

    const deleteTodo = useCallback(async (id: string) => {
        try {
            setError(null)
            const response = await fetch(`/api/todos?id=${id}`, {
                method: 'DELETE'
            })
            
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Erreur lors de la suppression')
            }
            
            setTodos(prev => prev.filter(todo => todo.id !== id))
        } catch (err) {
            console.error('Delete error:', err)
            setError(err instanceof Error ? err.message : 'Erreur lors de la suppression')
            throw err
        }
    }, [])

    return {
        todos,
        error,
        loading,
        fetchTodos,
        addTodo,
        updateTodo,
        deleteTodo
    }
} 