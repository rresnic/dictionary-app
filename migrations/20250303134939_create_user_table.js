exports.up = function(knex) {
    return knex.schema.createTable("user", (table) => {
        table.uuid("user_id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.string("email").notNullable().unique();
        table.string("password").notNullable();
        table.string("role").notNullable().defaultTo("user");
        table.string("refresh_token").nullable();
        table.timestamps(true, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("user");
};
