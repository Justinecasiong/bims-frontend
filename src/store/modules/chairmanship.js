import axios from "../../axios";

export default {
    namespaced: true,
    state: {
        chairmanships: {},
    },
    getters: {
        GET_CHAIRMANSHIP: (state) => state.chairmanships,
    },
    mutations: {
        SET_CHAIRMANSHIP: (state, chairmanships) => {
            state.chairmanships = chairmanships;
        },
    },
    actions: {
        FETCH_CHAIRMANSHIP: async ({ commit }) => {
            const res = await axios
                .get("/chairmanship")
                .then((response) => {
                    commit("SET_CHAIRMANSHIP", response.data.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return res;
        },
        STORE_CHAIRMANSHIP: async ({ commit }, data) => {
            const res = await axios
                .post("/chairmanship", data)
                .then((response) => {
                    commit("SET_CHAIRMANSHIP", response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return res;
        },
        UPDATE_CHAIRMANSHIP: async ({ commit }, data) => {
            const res = await axios
                .put(`/chairmanship/${data.id}`, data)
                .then((response) => {
                    commit("SET_CHAIRMANSHIP", response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return res;
        },
        DELETE_CHAIRMANSHIP: async ({ commit }, data) => {
            const response = await axios
                .delete(`/chairmanship/${data}`)
                .then((response) => {
                    commit("SET_CHAIRMANSHIP", response.data);
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });

            return response;
        },
    },
};
