import axios from '../../axios'

export default {
    namespaced: true,
    state: {
        households: {},
    },
    getters: {
        GET_HOUSEHOLD: (state) => state.households,

    },
    mutations: {
        SET_HOUSEHOLD: (state, households) => {
            state.households = households
        },

    },
    actions: {
        FETCH_HOUSEHOLD: async ({ commit }) => {
            const res = await axios.get('/household')
                .then((response) => {
                    commit("SET_HOUSEHOLD", response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return res;
        },
        STORE_HOUSEHOLD: async ({ commit }, data) => {
            const res = await axios.post('/household', data)
                .then((response) => {
                    commit("SET_HOUSEHOLD", response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return res;
        },
        UPDATE_HOUSEHOLD: async ({ commit }, data) => {
            const res = await axios.put(`/household/${data.id}`, data)
                .then((response) => {
                    commit("SET_HOUSEHOLD", response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return res;
        },
        DELETE_HOUSEHOLD: async ({ commit }, data) => {
            const response = await axios.delete(`/household/${data}`)
                .then((response) => {
                    commit('SET_HOUSEHOLD', response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return response;
        },
    }
}
