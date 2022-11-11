const { response } = require("express");
const pool = require("./database");

const getPosts = async (req, res) => {
    await pool.query('SELECT * FROM public.posts', (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
}

module.exports = {
    getPosts
}