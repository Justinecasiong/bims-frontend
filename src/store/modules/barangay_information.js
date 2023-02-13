import axios from '../../axios'

export default {
    namespaced: true,
    state: {
        barangay_info: {},
    },
    getters: {
        GET_INFO: (state) => state.barangay_info,

    },
    mutations: {
        SET_INFO: (state, info) => {
            state.barangay_info = info
        },

    },
    actions: {
        FETCH_INFO: async ({ commit }) => {
            const res = await axios.get('/barangay_info')
                .then((response) => {
                    commit("SET_INFO", response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return res;
        },
        STORE_INFO: async ({ commit }, data) => {
            const res = await axios.post('/barangay_info', data)
                .then((response) => {
                    commit("SET_INFO", response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return res;
        },
        UPDATE_INFO: async ({ commit }, data) => {
            const res = await axios.put(`/barangay_info/${data.id}`, data)
                .then((response) => {
                    commit("SET_INFO", response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return res;
        },
    }
}
