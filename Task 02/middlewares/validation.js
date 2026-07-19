export const validateItemCreation = (req, res, next) => {
    const { name, description } = req.body;

    // Check basic types first (Did they actually send a string for the name?)
    if (!name || typeof name !== 'string') {
        return res.status(400).json({ error: "Hey, 'name' is required and needs to be text." });
    }

    if (description && typeof description !== 'string') {
        return res.status(400).json({ error: "If you provide a 'description', it must be text." });
    }

    // Check business logic/constraints (Is the name empty or too long?)
    if (name.trim().length === 0) {
        return res.status(400).json({ error: "The 'name' field can't be just empty spaces." });
    }

    if (name.length > 100) {
        return res.status(400).json({ error: "That name is way too long. Keep it under 100 characters." });
    }

    // All good! Move on to the route handler
    next();
};
