module.exports = class Database {
    constructor() {
        this.sql = require('mssql');
        this.pool = this.sql.connect({
            server: 'cisdbss.pcc.edu',
            database: 'WebChat',
            user: 'WebChat',
            password: 'WebChat',
            options: {
                enableArithAbort: true,
                encrypt: false
            }
        });
    }

    /* Promise Version */
    fetchHistory_promise() {
        return this.pool
            .then((conn) => conn.query(
                'SELECT *\n' +
                'FROM (\n' +
                '   SELECT TOP 500 *\n' +
                '   FROM Posts\n' +
                '   ORDER BY time DESC\n' +
                ') AS R\n' +
                'ORDER BY time ASC;'
            ))
            .then(result => result.recordset)
            .catch((err) => {
                console.log(err);
                return [];
            });
    }

    /* async/await version */
    async fetchHistory() {
        let conn = await this.pool;
        let result = await conn.query(
            'SELECT *\n' +
            'FROM (\n' +
            '   SELECT TOP 500 *\n' +
            '   FROM Posts\n' +
            '   ORDER BY time DESC\n' +
            ') AS R\n' +
            'ORDER BY time ASC;'
        );
        return result.recordset;
    }

    addMessage(message) {
        this.pool
            .then((conn) => {
                return conn.request()
                    .input('name', this.sql.NVarChar('MAX'), message.name)
                    .input('type', this.sql.NVarChar('MAX'), message.type)
                    .input('time', this.sql.Numeric(19, 0), message.time)
                    .input('post', this.sql.NVarChar('MAX'), message.post)
                    .query('INSERT INTO Posts VALUES (@name, @type, @time, @post);')
                    .catch((err) => console.log(err));
            })
            .catch((err) => {
                console.log(err)
            });
    }

    close() {
        this.pool.then((pool) => pool.close());
    }
}
