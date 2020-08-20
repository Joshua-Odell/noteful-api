const NotesService = {
    getAllNotes(knex){
        return knex.select('*').from('noteful_notes')
    },

    insertNotes(knex, newFolder){
        return knex
            .insert(newFolder)
            .into('noteful_notes')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    getById(knex, id) {
        return knex
            .from('noteful_notes')
            .select('*')
            .where('id', id)
            .first()
    },

    deleteNotes( knex, id){
        return knex('noteful_notes')
        .where({ id })
        .delete()
    },

    updateNotes(knex, id, newNote){
        return knex('noteful_notes')
            .where({ id })
            .update(newNote)
    },
}

module.exports = NotesService