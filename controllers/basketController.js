const supabase = require("../database/supabase");
const fs = require("fs");
const path = require("path");

const createBasket = async (req, res) => {
    const { name, description } = req.body;

const userId = req.user.id;

const { data, error } = await supabase
    .from("baskets")
    .insert([
        {
            name,
            description,
            user_id: userId
        }
    ])
    .select();

    if (error) {
        return res.status(400).json({
            error: error.message
        });
    }

    res.status(201).json({
        message: "Basket created successfully",
        data
    });
};

const getBaskets = async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2;

        const search = req.query.search || "";
        const name = req.query.name || "";
    
        const sort = req.query.sort || "created_at";
        const order = req.query.order || "desc";
        
    console.log("Search:", search);
    console.log("Name Filter:", name);
    console.log("Sort:", sort);
    console.log("Order:", order);

        const start = (page - 1) * limit;
        const end = start + limit - 1;

let query = supabase
    .from("baskets")
    .select("*", { count: "exact" })
    .eq("user_id", userId);

if (search) {
    query = query.ilike("name", `%${search}%`);
}

if (name) {
    query = query.eq("name", name);
}

const { data, error, count } = await query
    .order(sort, { ascending: order === "asc" })
    .range(start, end);

console.log("Count:", count);
console.log("Data:", data);
console.log("Error:", error);
   

        if (error) {
            return res.status(400).json({ error: error.message });
        }

 const totalPages = Math.ceil(count / limit);

res.status(200).json({
    page,
    limit,
    totalRecords: count,
    totalPages,
    data
});

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteBasket = async (req, res) => {
    const { id } = req.params;

   const userId = req.user.id;

const { data, error } = await supabase
    .from("baskets")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)
    .select();

    if (error) {
        return res.status(400).json({
            error: error.message
        });
    }

   if (!data || data.length === 0) {
    return res.status(404).json({
        error: "Basket not found"
    });
}
    res.status(200).json({
        message: "Basket deleted successfully",
        data
    });
};

const updateBasket = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

  const userId = req.user.id;

const { data, error } = await supabase
    .from("baskets")
    .update({
        name,
        description
    })
    .eq("id", id)
    .eq("user_id", userId)
    .select();

    if (error) {
        return res.status(400).json({
            error: error.message
        });
    }

  
    if (!data || data.length === 0) {
    return res.status(404).json({
        error: "Basket not found"
    });
}

    res.status(200).json({
        message: "Basket updated successfully",
        data
    });
};

const uploadBasketImage = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({
                error: "No image uploaded"
            });
        }

        // Get basket details
        const { data: basket, error } = await supabase
            .from("baskets")
            .select("*")
            .eq("id", id)
            .single();

        if (error || !basket) {
            return res.status(404).json({
                error: "Basket not found"
            });
        }

        // Delete old image if it exists
        if (basket.image) {
            // Normalize path for Windows/Linux
            const normalizedImagePath = basket.image.replace(/\//g, path.sep).replace(/\\/g, path.sep);

            const oldImagePath = path.join(__dirname, "..", normalizedImagePath);

            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
                console.log("Old image deleted:", oldImagePath);
            } else {
                console.log("Old image not found:", oldImagePath);
            }
        }

        // Save new image path using forward slashes
        const imagePath = req.file.path.replace(/\\/g, "/");

        const { data, error: updateError } = await supabase
            .from("baskets")
            .update({
                image: imagePath
            })
            .eq("id", id)
            .select()
            .single();

        if (updateError) {
            return res.status(500).json({
                error: updateError.message
            });
        }

        res.status(200).json({
            message: "Image uploaded successfully",
            basket: data
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
};

const uploadBasketImages = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                error: "No images uploaded"
            });
        }

        // Convert uploaded files into an array of paths
        const imagePaths = req.files.map(file =>
            file.path.replace(/\\/g, "/")
        );

        // Check if basket exists
        const { data: basket, error } = await supabase
            .from("baskets")
            .select("*")
            .eq("id", id)
            .single();

        if (error || !basket) {
            return res.status(404).json({
                error: "Basket not found"
            });
        }

        // Update images array
        const { data, error: updateError } = await supabase
            .from("baskets")
            .update({
                images: imagePaths
            })
            .eq("id", id)
            .select()
            .single();

        if (updateError) {
            return res.status(500).json({
                error: updateError.message
            });
        }

        res.status(200).json({
            message: "Images uploaded successfully",
            basket: data
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

module.exports = {
    createBasket,
    getBaskets,
    updateBasket,
    deleteBasket,
    uploadBasketImage,
    uploadBasketImages
};