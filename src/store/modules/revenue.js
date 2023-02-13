import axios from '../../axios'

export default {
    namespaced: true,
    state: {
        revenues: {},
    },
    getters: {
        GET_REVENUE: (state) => state.revenues,

    },
    mutations: {
        SET_REVENUE: (state, revenues) => {
            state.revenues = revenues
        },

    },
    actions: {
        FETCH_REVENUE: async ({ commit }) => {
            const res = await axios.get('/revenue')
                .then((response) => {
                    commit("SET_REVENUE", response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return res;
        },
        STORE_REVENUE: async ({ commit }, data) => {
            const res = await axios.post('/revenue', data)
                .then((response) => {
                    commit("SET_REVENUE", response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return res;
        },
        UPDATE_REVENUE: async ({ commit }, data) => {
            const res = await axios.put(`/revenue/${data.id}`, data)
                .then((response) => {
                    commit("SET_REVENUE", response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return res;
        },
        DELETE_REVENUE: async ({ commit }, data) => {
            const response = await axios.delete(`/revenue/${data}`)
                .then((response) => {
                    commit('SET_REVENUE', response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return response;
        },
    }
}
