import axios from '../../axios'

export default {
    namespaced: true,
    state: {
        officials: {},
    },
    getters: {
        GET_OFFICIAL: (state) => state.officials,

    },
    mutations: {
        SET_OFFICIAL: (state, officials) => {
            state.officials = officials
        },

    },
    actions: {
        FETCH_OFFICIAL: async ({ commit }, search) => {
            const res = await axios.get(`/barangay_officals?search=${search}`)
                .then((response) => {
                    commit("SET_OFFICIAL", response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return res;
        },
        STORE_OFFICIAL: async ({ commit }, data) => {
            const res = await axios.post('/barangay_officals', data)
                .then((response) => {
                    commit("SET_OFFICIAL", response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return res;
        },
        UPDATE_OFFICIAL: async ({ commit }, data) => {
            const res = await axios.put(`/barangay_officals/${data.id}`, data)
                .then((response) => {
                    commit("SET_OFFICIAL", response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return res;
        },
        DELETE_OFFICIAL: async ({ commit }, data) => {
            const response = await axios.delete(`/barangay_officals/${data}`)
                .then((response) => {
                    commit('SET_OFFICIAL', response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return response;
        },
    }
}
