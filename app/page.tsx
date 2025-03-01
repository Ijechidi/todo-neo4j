'use client'

import { useState, useEffect } from 'react'
import { Todo, CategoryType, CATEGORIES, CreateTodoDTO } from '../types/todo'
import { useTodos } from '../hooks/useTodos'
import { motion, AnimatePresence } from 'framer-motion'

export default function Home() {
    const {
        todos,
        loading,
        error,
        fetchTodos,
        addTodo,
        updateTodo,
        deleteTodo
    } = useTodos()

    const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all')
    const [newTodo, setNewTodo] = useState<CreateTodoDTO>({
        title: '',
        category: 'Personnel'
    })

    useEffect(() => {
        fetchTodos()
    }, [fetchTodos])

    const filteredTodos = selectedCategory === 'all'
        ? todos
        : todos.filter(todo => todo.category === selectedCategory)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newTodo.title.trim()) return

        try {
            await addTodo(newTodo)
            setNewTodo({
                title: '',
                category: 'Personnel'
            })
        } catch (err) {
            console.error('Erreur lors de l\'ajout:', err)
        }
    }

    const getCategoryColor = (category: CategoryType) => {
        return CATEGORIES.find(c => c.name === category)?.color || '#666666'
    }

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    )

    if (error) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                <p className="font-bold">Erreur</p>
                <p>{error}</p>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
                    Gestionnaire de Tâches
                </h1>

                {/* Filtres par catégorie */}
                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategory('all')}
                        className={`px-6 py-2 rounded-full transition-all duration-200 ${
                            selectedCategory === 'all'
                                ? 'bg-blue-500 text-white shadow-lg'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        Toutes
                    </motion.button>
                    {CATEGORIES.map(category => (
                        <motion.button
                            key={category.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedCategory(category.name)}
                            className={`px-6 py-2 rounded-full transition-all duration-200 ${
                                selectedCategory === category.name
                                    ? 'text-white shadow-lg'
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                            style={{
                                backgroundColor: selectedCategory === category.name ? category.color : undefined,
                                borderLeft: `4px solid ${category.color}`
                            }}
                        >
                            {category.name}
                        </motion.button>
                    ))}
                </div>

                {/* Formulaire d'ajout */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit}
                    className="mb-8 bg-white p-6 rounded-xl shadow-lg"
                >
                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            value={newTodo.title}
                            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                            className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Nouvelle tâche"
                            required
                        />
                        
                        <select
                            value={newTodo.category}
                            onChange={(e) => setNewTodo({ ...newTodo, category: e.target.value as CategoryType })}
                            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                            {CATEGORIES.map(category => (
                                <option key={category.id} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                        >
                            Ajouter
                        </motion.button>
                    </div>
                </motion.form>

                {/* Liste des tâches */}
                <motion.div layout className="space-y-4">
                    <AnimatePresence mode='popLayout'>
                        {filteredTodos.map((todo) => (
                            <motion.div
                                key={todo.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                layout
                                className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200"
                            >
                                <div className="flex items-center gap-4">
                                    <motion.input
                                        whileHover={{ scale: 1.2 }}
                                        type="checkbox"
                                        checked={todo.completed}
                                        onChange={() => updateTodo({ id: todo.id, completed: !todo.completed })}
                                        className="h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 transition-all duration-200"
                                    />
                                    
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-lg ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                                {todo.title}
                                            </span>
                                            <span
                                                className="px-3 py-1 rounded-full text-sm text-white"
                                                style={{ backgroundColor: getCategoryColor(todo.category) }}
                                            >
                                                {todo.category}
                                            </span>
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => deleteTodo(todo.id)}
                                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    )
}
