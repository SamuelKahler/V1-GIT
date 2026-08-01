/**
 * ============================================================
 * Sports Edge Intelligence Query Engine
 * ============================================================
 *
 * SINGLE SOURCE OF TRUTH
 *
 * Every customer-facing screen talks to this engine.
 *
 * Nothing else queries the database directly.
 */

export class SportsEdgeQueryEngine {

    constructor(database) {

        this.database = database;

    }

    async query(criteria = {}) {

        throw new Error(
            "Query Engine not implemented yet."
        );

    }

    async teamHistory(teamId) {

        return this.query({

            teamId

        });

    }

    async matchup(homeTeamId, awayTeamId) {

        return this.query({

            homeTeamId,

            awayTeamId

        });

    }

    async environment(criteria) {

        return this.query({

            environments: criteria

        });

    }

    async trends(criteria) {

        return this.query(criteria);

    }

}

export default SportsEdgeQueryEngine;
