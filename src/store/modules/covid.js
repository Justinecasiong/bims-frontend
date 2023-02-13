import axios from '../../axios'

export default {
    namespaced: true,
    state: {
        covids: {},
    },
    getters: {
        GET_COVID: (state) => state.covids,

    },
    mutations: {
        SET_COVID: (state, covids) => {
            state.covids = covids
        },

    },
    actions: {
        FETCH_COVID: async ({ commit }, search) => {
            const res = await axios.get(`/covid?search=${search}`)
                .then((response) => {
                    commit("SET_COVID", response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return res;
        },
        STORE_COVID: async ({ commit }, data) => {
            const res = await axios.post('/covid', data)
                .then((response) => {
                    commit("SET_COVID", response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return res;
        },
        UPDATE_COVID: async ({ commit }, data) => {
            const res = await axios.put(`/covid/${data.id}`, data)
                .then((response) => {
                    commit("SET_COVID", response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return res;
        },
        DELETE_COVID: async ({ commit }, data) => {
            const response = await axios.delete(`/covid/${data}`)
                .then((response) => {
                    commit('SET_COVID', response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return response;
        },
    }
}
