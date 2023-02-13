import axios from '../../axios'

export default {
    namespaced: true,
    state: {
        zones: {},
    },
    getters: {
        GET_ZONES: (state) => state.zones,

    },
    mutations: {
        SET_ZONES: (state, zones) => {
            state.zones = zones
        },

    },
    actions: {
        FETCH_ZONES: async ({ commit }) => {
            const res = await axios.get('/zones')
                .then((response) => {
                    commit("SET_ZONES", response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return res;
        },
    }
}
