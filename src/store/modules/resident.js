import axios from '../../axios'

export default {
    namespaced: true,
    state: {
        residents: {},
        pages:{}
    },
    getters: {
        GET_RESIDENT: (state) => state.residents,
        GET_PAGES: (state) => state.pages,

    },
    mutations: {
        SET_RESIDENT: (state, residents) => {
            state.residents = residents
        },

        SET_TOTAL_PAGES:(state, pages) =>{
            state.pages = pages
        }
    },
    actions: {
        FETCH_RESIDENT_BY_ID: async ({ commit }, search) => {
            const res = await axios.get(`/search-id?search=${search}`)
                .then((response) => {
                    commit("SET_RESIDENT", response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return res;
        },
        
        FETCH_RESIDENT: async ({ commit }, page) => {
            const res = await axios.get(`/resident?page=${page}`)
                .then((response) => {
                    commit("SET_RESIDENT", response.data);
                    commit("SET_TOTAL_PAGES", response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return res;
        },
        STORE_RESIDENT: async ({ commit }, data) => {
            const res = await axios.post('/resident', data)
                .then((response) => {
                    commit("SET_RESIDENT", response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return res;
        },
        UPDATE_RESIDENT: async ({ commit }, data) => {
            const res = await axios.put(`/resident/${data.id}`, data)
                .then((response) => {
                    commit("SET_RESIDENT", response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return res;
        },
        DELETE_RESIDENT: async ({ commit }, data) => {
            const response = await axios.delete(`/resident/${data}`)
                .then((response) => {
                    commit('SET_RESIDENT', response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return response;
        },
    }
}
