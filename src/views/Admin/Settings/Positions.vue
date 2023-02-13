<template>
    <div class="positions">
        <div class="page-header">
            <div class="row">
                <div class="col-lg-8 col-md-5">
                    <h1>Positions</h1>
                </div>
            </div>
        </div>
        <div class="table-container table-responsive-xxl shadow">
            <div class="other-btn">
                <div class="row">
                    <div class="col">
                        <button class="btn btn-primary" v-b-modal.modal-add>
                            A
                        </button>
                    </div>
                </div>
            </div>
            <table class="table table-striped table-hover table-sm">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Position</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(position, index) in positions"
                        :key="position.id"
                    >
                        <th scope="row">{{ index + 1 }}</th>
                        <td>{{ position.position_description }}</td>
                        <td>
                            <button
                                class="btn btn-primary"
                                v-b-modal.modal-edit
                                @click="setPosition(position)"
                            >
                                <i class="fas fa-edit"></i>
                            </button>
                            <button
                                class="btn btn-danger"
                                v-b-modal.modal-delete
                                @click="setPosition(position)"
                            >
                                <i class="fas fa-trash"></i>
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
                    v-on:input="fetchPosition()"
                    style="align-items: flex-end"
                ></b-pagination>
            </div>
        </div>

        <b-modal
            id="modal-edit"
            size="md"
            title="Edit Position"
            centered
            @ok.prevent="updatePosition()"
            @hidden="resetFields()"
            ok-title="Update"
        >
            <div class="form-group">
                <label for="position" class="control-label"> Position: </label>
                <input
                    v-model="position_description"
                    type="text"
                    class="form-control"
                    name="Position"
                    id="Position"
                />
                <div v-if="this.errors.length != 0">
                    <label style="color: red; font-weight: 500">{{
                        this.errors.position_description[0]
                    }}</label>
                </div>
            </div>
        </b-modal>

        <b-modal
            id="modal-add"
            size="md"
            title="Add Position"
            centered
            @ok.prevent="createPosition()"
            @hidden="resetFields()"
            ok-title="Save"
        >
            <div class="form-group">
                <label for="position" class="control-label"> Position: </label>
                <input
                    v-model="position_description"
                    type="text"
                    class="form-control"
                    name="position"
                    id="position"
                />
                <div v-if="this.errors.length != 0">
                    <label style="color: red; font-weight: 500">{{
                        this.errors.position_description[0]
                    }}</label>
                </div>
            </div>
        </b-modal>

        <b-modal
            id="modal-delete"
            size="md"
            title="Delete Zone"
            centered
            @hidden="resetFields()"
            @ok.prevent="deletePosition()"
            ok-title="Delete"
        >
            Are you sure you want to delete this data?
        </b-modal>
    </div>
</template>

<script>
import axios from "../../../axios";
export default {
    data() {
        return {
            id: null,
            position_description: null,
            positions: [],
            currentPage: 1,
            rows: 0,
            perPage: 0,
            errors: [],
        };
    },

    methods: {
        async fetchPosition() {
            await axios
                .get(`/position?page=${this.currentPage}`)
                .then((response) => {
                    this.positions = response.data.data;
                    this.currentPage = response.data.current_page;
                    this.rows = response.data.total;
                    this.perPage = response.data.per_page;
                });
        },

        async createPosition() {
            const data = {
                position_description: this.position_description,
                remember_token: localStorage.getItem("token"),
            };

            await axios
                .post("/position", data)
                .then((response) => {
                    console.log(response.data);
                    this.$toast.success("Position Title has been created.");
                    this.fetchPosition();
                    this.resetFields();
                    this.$bvModal.hide("modal-add");
                })
                .catch((error) => {
                    this.errors = error.response.data.errors;
                });
        },

        setPosition(data) {
            this.id = data.id;
            this.position_description = data.position_description;
        },

        async updatePosition() {
            const data = {
                id: this.id,
                position_description: this.position_description,
                remember_token: localStorage.getItem("token"),
            };

            await axios
                .put(`/position/${data.id}`, data)
                .then((response) => {
                    this.$toast.success("Position Title has been updated.");
                    this.fetchPosition();
                    this.resetFields();
                    this.$bvModal.hide("modal-edit");
                    return response;
                })
                .catch((error) => {
                    this.errors = error.response.data.errors;
                });
        },

        async deletePosition() {
            await axios
                .delete(
                    `/position/${this.id}?remember_token=${localStorage.getItem(
                        "token"
                    )}`
                )
                .then((response) => {
                    if (response.status == 200) {
                        this.$toast.error("Position Title has been deleted.");
                        this.fetchPosition();
                        this.resetFields();
                    } else {
                        this.$toast.error("Something went wrong.");
                    }

                    this.$bvModal.hide("modal-delete");
                });
        },

        async resetFields() {
            this.position_description = null;
            this.errors = [];
        },
    },

    mounted() {
        this.fetchPosition();
    },
};
</script>