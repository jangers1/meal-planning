import { useState } from 'react';
import type { Ingredient, NewIngredient } from '../types/ingredient.types';

export function useIngredientManager() {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formType, setFormType] = useState<'regular' | 'equal-amounts'>('regular');
    const [hoveredIngredient, setHoveredIngredient] = useState<string | null>(null);
    const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
    const [measurementUnits, setMeasurementUnits] = useState<string[]>([]);

    const addMeasurementUnit = (unit: string) => {
        if (unit && !measurementUnits.includes(unit)) {
            setMeasurementUnits(prev => [...prev, unit]);
        }
    };

    const handleAddIngredient = (newIngredient: NewIngredient) => {
        addMeasurementUnit(newIngredient.measure);

        if (editingIngredient) {
            // Update existing ingredient
            setIngredients(prev => prev.map(ingredient =>
                ingredient.id === editingIngredient.id
                    ? { ...newIngredient, id: editingIngredient.id }
                    : ingredient
            ));
            setEditingIngredient(null);
        } else {
            // Add new ingredient
            const ingredient: Ingredient = {
                ...newIngredient,
                id: Date.now().toString()
            };
            setIngredients(prev => [...prev, ingredient]);
        }
        setShowForm(false);
    };

    const handleEditIngredient = (ingredient: Ingredient) => {
        setEditingIngredient(ingredient);
        setShowForm(true);
        setFormType(ingredient.type === 'equal-amounts-group' ? 'equal-amounts' : 'regular');
    };

    const handleCancelForm = () => {
        setEditingIngredient(null);
        setShowForm(false);
        setFormType('regular');
    };

    const handleEqualAmountsConfirm = (items: string[]) => {
        if (editingIngredient) {
            // Update existing equal amounts ingredient
            const updatedIngredient: Ingredient = {
                ...editingIngredient,
                subItems: items
            };
            setIngredients(prev => prev.map(ing =>
                ing.id === editingIngredient.id ? updatedIngredient : ing
            ));
            setEditingIngredient(null);
        } else {
            // Add new equal amounts ingredient
            const ingredient: Ingredient = {
                id: Date.now().toString(),
                name: '',
                quantity: '',
                measure: '',
                type: 'equal-amounts-group',
                subItems: items
            };
            setIngredients(prev => [...prev, ingredient]);
        }
        setShowForm(false);
        setFormType('regular');
    };

    const handleDeleteIngredient = (ingredientId: string) => {
        setIngredients(prev => prev.filter(ingredient => ingredient.id !== ingredientId));
        setEditingIngredient(null);
        setShowForm(false);
        setFormType('regular');
    };

    const showRegularForm = () => {
        setFormType('regular');
        setShowForm(true);
    };

    const showEqualAmountsForm = () => {
        setFormType('equal-amounts');
        setShowForm(true);
    };

    return {
        // State
        ingredients,
        showForm,
        formType,
        hoveredIngredient,
        editingIngredient,
        measurementUnits,

        // Actions
        handleAddIngredient,
        handleEditIngredient,
        handleCancelForm,
        handleEqualAmountsConfirm,
        handleDeleteIngredient,
        showRegularForm,
        showEqualAmountsForm,
        setHoveredIngredient,
    };
}
