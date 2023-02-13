import axios from '../../axios'

export default {
    namespaced: true,
    state: {
        positions: {},
        errors:{}
    },
    getters: {
        GET_POSITION: (state) => state.positions,
        GET_ERROR: (state) => state.errors,

    },
    mutations: {
        SET_POSITION: (state, positions) => {
            state.positions = positions
        },

        SET_ERROR: (state, error) => {
            state.errors = error
        },


    },
    actions: {
        FETCH_POSITION: async ({ commit }) => {
            const res = await axios.get('/position')
                .then((response) => {
                    commit("SET_POSITION", response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return res;
        },
        STORE_POSITION: async ({ commit }, data) => {
            const res = await axios.post('/position', data)
                .then((response) => {
                    commit("SET_POSITION", response.data);
                    return response;
                })
                .catch((error) => {
                    commit("SET_ERROR", error.response);
                    return error.response;
                });

            return res;
        },
        UPDATE_POSITION: async ({ commit }, data) => {
            const res = await axios.put(`/position/${data.id}`, data)
                .then((response) => {
                    commit("SET_POSITION", response.data);
                    return response;
                })
                .catch((error) => {
                    commit("SET_ERROR", error.response);
                    return error.response;
                });

            return res;
        },
        DELETE_POSITION: async ({ commit }, data) => {
            const response = await axios.delete(`/position/${data}`)
                .then((response) => {
                    commit('SET_POSITION', response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return response;
        },
    }
}
