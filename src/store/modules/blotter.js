import axios from '../../axios'

export default {
    namespaced: true,
    state: {
        blotters: {},
        active_count:0,
        settled_count:0,
        scheduled_count:0
    },
    getters: {
        GET_BLOTTER: (state) => state.blotters,
        GET_ACTIVE_COUNT: (state) => state.active_count,
        GET_SETTLED_COUNT: (state) => state.settled_count,
        GET_SCHEDULED_COUNT: (state) => state.scheduled_count,

    },
    mutations: {
        SET_BLOTTER: (state, blotters) => {
            state.blotters = blotters
        },

        SET_ACTIVE_COUNT: (state, active) => {
            state.active_count = active
        },

        SET_SETTLED_COUNT: (state, settled) => {
            state.settled_count = settled
        },

        SET_SCHEDULED_COUNT: (state, scheduled) => {
            state.scheduled_count = scheduled
        },

    },
    actions: {
        FETCH_BLOTTER: async ({ commit }, search) => {
            const res = await axios.get(`/blotter?search=${search}`)
                .then((response) => {
                    commit("SET_BLOTTER", response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return res;
        },

        STORE_BLOTTER: async ({ commit }, data) => {
            const res = await axios.post('/blotter', data)
                .then((response) => {
                    commit("SET_BLOTTER", response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return res;
        },

        UPDATE_BLOTTER: async ({ commit }, data) => {
            const res = await axios.put(`/blotter/${data.id}`, data)
                .then((response) => {
                    commit("SET_BLOTTER", response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return res;
        },

        DELETE_BLOTTER: async ({ commit }, data) => {
            const response = await axios.delete(`/blotter/${data}`)
                .then((response) => {
                    commit('SET_BLOTTER', response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return response;
        },

        FETCH_ACTIVE_COUNT: async ({ commit }) => {
            const res = await axios.get('/count-active')
                .then((response) => {
                    commit("SET_ACTIVE_COUNT", response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return res;
        },

        FETCH_SETTLED_COUNT: async ({ commit }) => {
            const res = await axios.get('count-settled')
                .then((response) => {
                    commit("SET_SETTLED_COUNT", response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return res;
        },

        FETCH_SCHEDULED_COUNT: async ({ commit }) => {
            const res = await axios.get('count-scheduled')
                .then((response) => {
                    commit("SET_SCHEDULED_COUNT", response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return res;
        },
    }
}
