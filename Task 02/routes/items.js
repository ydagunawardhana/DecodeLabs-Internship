import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validateItemCreation } from '../middlewares/validation.js';

const router = express.Router();

// Just keeping things simple with an in-memory array for now. 
// In a real app, this would be a database connection.
let items = [];

// Fetch all items
router.get('/', (req, res) => {
    res.json({ data: items });
});

// Create a new item (requires admin privileges)
router.post('/', authenticate, authorize('admin'), validateItemCreation, (req, res) => {
    const newItem = {
        id: Date.now(), // Quick and dirty ID generation
        name: req.body.name,
        description: req.body.description
    };
    
    items.push(newItem);
    
    // 201 tells the client a new resource was successfully created
    res.status(201).json({
        message: "Item created successfully",
        data: newItem
    });
});

// Update an existing item
router.put('/:id', authenticate, authorize('admin'), validateItemCreation, (req, res) => {
    const itemId = parseInt(req.params.id, 10);
    const index = items.findIndex(item => item.id === itemId);

    if (index === -1) {
        return res.status(404).json({ error: "Couldn't find that item to update." });
    }

    // Merge the new data with the existing item
    items[index] = {
        ...items[index],
        name: req.body.name,
        description: req.body.description
    };

    res.json({
        message: "Item updated successfully",
        data: items[index]
    });
});

// Delete an item
router.delete('/:id', authenticate, authorize('admin'), (req, res) => {
    const itemId = parseInt(req.params.id, 10);
    const initialLength = items.length;
    
    items = items.filter(item => item.id !== itemId);

    if (items.length === initialLength) {
        return res.status(404).json({ error: "Item not found, so we couldn't delete it." });
    }

    // 204 means the action succeeded, but there's no data to send back
    res.status(204).send();
});

export default router;
