import axios from '../../axios'

export default {
    namespaced: true,
    state: {
        business_permits: {},
    },
    getters: {
        GET_PERMIT: (state) => state.business_permits,

    },
    mutations: {
        SET_PERMIT: (state, business_permits) => {
            state.business_permits = business_permits
        },

    },
    actions: {
        FETCH_PERMIT: async ({ commit }) => {
            const res = await axios.get('/business_permit')
                .then((response) => {
                    commit("SET_PERMIT", response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return res;
        },
        STORE_PERMIT: async ({ commit }, data) => {
            const res = await axios.post('/business_permit', data)
                .then((response) => {
                    commit("SET_PERMIT", response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return res;
        },
        UPDATE_PERMIT: async ({ commit }, data) => {
            const res = await axios.put(`/business_permit/${data.id}`, data)
                .then((response) => {
                    commit("SET_PERMIT", response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return res;
        },
        DELETE_PERMIT: async ({ commit }, data) => {
            const response = await axios.delete(`/business_permit/${data}`)
                .then((response) => {
                    commit('SET_PERMIT', response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return response;
        },
    }
}
