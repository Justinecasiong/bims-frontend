<template>
    <div class="container">
        <div class="page-header">
            <div class="row">
                <div class="col-lg-8 col-md-5">
                    <h1>User Management</h1>
                </div>
                <div class="col search">
                    <div class="input-group">
                        <input
                            type="text"
                            class="form-control"
                            placeholder="Search"
                            v-model="search"
                            v-on:input="fetchUsers()"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="table-container table-responsive-xxl shadow">
            <div class="d-flex justify-content-center" v-if="loading">
                <div
                    class="spinner-border text-center mt-3"
                    role="status"
                ></div>
            </div>
            <table
                class="table table-striped table-hover table-sm"
                v-if="loading == false"
            >
                <thead>
                    <tr>
                        <th scope="col">Username</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user.id">
                        <td>{{ user.name }}</td>
                        <td>
                            <button
                                v-if="user.status == 'non-active'"
                                class="btn btn-success"
                                v-b-modal.modal-edit
                                @click="setOfficial(user)"
                            >
                                REACTIVATE
                            </button>
                            <button
                                v-if="user.status == 'active'"
                                class="btn btn-danger"
                                v-b-modal.modal-edit
                                @click="setOfficial(user)"
                            >
                                DEACTIVATE
                            </button>
                            <button
                                class="btn btn-secondary"
                                v-b-modal.modal-delete
                                @click="setOfficial(user)"
                            >
                                RESET
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="mt-3">
                <b-pagination
                    v-model="currentPage"
                    prev-text="Prev"
                    next-text="Next"
                    :total-rows="rows"
                    :per-page="perPage"
                    align="center"
                    v-on:input="fetchUsers()"
                    style="align-items: flex-end"
                ></b-pagination>
            </div>
        </div>

        <b-modal
            id="modal-delete"
            size="md"
            title="Reset User"
            centered
            @ok.prevent="updateUser()"
            ok-title="Reset"
        >
            Are you sure you want to reset this data?
        </b-modal>

        <b-modal
            id="modal-edit"
            size="md"
            title="User Status Update"
            centered
            @ok.prevent="activateUser()"
            ok-title="Update"
        >
            <div class="form-group">
                <label for="first-name" class="control-label"> Reason: </label>
                <input
                    type="text"
                    class="form-control"
                    placeholder="Enter Reason"
                    v-model="reason"
                />
            </div>
        </b-modal>
    </div>
</template>

<script>
import axios from "../../axios";
export default {
    data() {
        return {
            id: null,
            password: null,
            status: null,
            reason: null,

            users: [],

            search: "",
            loading: false,
            currentPage: 1,
            rows: 0,
            perPage: 0,
        };
    },

    methods: {
        async fetchUsers() {
            this.loading = true;
            await axios
                .get(`/user?page=${this.currentPage}&search=${this.search}`)
                .then((response) => {
                    this.users = response.data.data;
                    this.currentPage = response.data.current_page;
                    this.rows = response.data.total;
                    this.perPage = response.data.per_page;
                })
                .catch((error) => {
                    return error.response;
                });
            this.loading = false;
        },

        setOfficial(data) {
            this.id = data.id;
            this.status = data.status;
        },

        async updateUser() {
            const data = {
                id: this.id,
            };

            await axios.put(`/user/${data.id}`, data).then(() => {
                this.$toast.success("User has been reset.");
                this.fetchUsers();
                this.$bvModal.hide("modal-delete");
            });
        },

        async activateUser() {
            const data = {
                id: this.id,
                reason: this.reason,
                status: this.status,
            };

            await axios.post(`/updateStatus`, data).then(() => {
                this.$toast.success("User has been updated.");
                this.fetchUsers();
                this.$bvModal.hide("modal-edit");
            });
        },
    },

    mounted() {
        this.fetchUsers();
    },
};
</script>