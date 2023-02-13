<template>
    <div class="container">
        <div class="page-header">
            <div class="row">
                <div class="col-10">
                    <h1>Reports</h1>
                </div>
            </div>
            <div class="row">
                <div
                    class="col-3"
                    style="cursor: pointer"
                    v-for="user in users"
                    :key="user.id"
                >
                    <div
                        class="card card-round text-white"
                        style="margin-top: 10px; background-color: #459a7d"
                        @click="goToReportList(user)"
                    >
                        <card-body name="card">
                            <center>
                                <h5>{{ user.fullname }}</h5>
                                <p>
                                    {{ user.position.position_description }}
                                </p>
                            </center>
                        </card-body>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "../../../axios";
export default {
    data() {
        return {
            id: null,
            users: [],

            search: "",
            loading: false,
            permission: localStorage.getItem("permission"),
        };
    },

    methods: {
        async fetchUsers() {
            this.loading = true;
            await axios
                .get(`/getOfficials`)
                .then((response) => {
                    this.users = response.data;
                })
                .catch((error) => {
                    return error.response;
                });
            this.loading = false;
        },

        async findOfficial() {
            const data = {
                remember_token: localStorage.getItem("token"),
            };
            await axios.post(`/find-officials`, data).then((response) => {
                this.users.push(response.data.officials);
            });
        },

        async findUsers() {
            this.loading = true;
            await axios
                .get(`/getOfficials`)
                .then((response) => {
                    this.users = response.data;
                })
                .catch((error) => {
                    return error.response;
                });
            this.loading = false;
        },

        goToReportList(data) {
            this.$router.push({
                path: `/reports/list/${data.id}`,
            });
        },
    },

    mounted() {
        if (this.permission == "chairperson") {
            this.fetchUsers();
        } else {
            this.findOfficial();
        }
    },
};
</script>