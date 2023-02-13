<template>
    <div class="chairmanship">
        <div class="page-header">
            <div class="row">
                <div class="col-lg-8 col-md-5">
                    <h1>Chairmanship</h1>
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
                        <th scope="col">Title</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(chairmanship, index) in chairmanships"
                        :key="chairmanship.id"
                    >
                        <th scope="row">{{ index + 1 }}</th>
                        <td>{{ chairmanship.chairmanship_description }}</td>
                        <td>
                            <button
                                class="btn btn-primary"
                                v-b-modal.modal-edit
                                @click="setChairmanship(chairmanship)"
                            >
                                <i class="fas fa-edit"></i>
                            </button>
                            <button
                                class="btn btn-danger"
                                v-b-modal.modal-delete
                                @click="setChairmanship(chairmanship)"
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
                    v-on:input="fetchChairmanship()"
                    style="align-items: flex-end"
                ></b-pagination>
            </div>
        </div>

        <b-modal
            id="modal-edit"
            size="md"
            title="Edit Chairmanship"
            centered
            @ok.prevent="updateChairmanship()"
            ok-title="Update"
        >
            <div class="form-group">
                <label for="chairmanship" class="control-label">
                    Chairmanship:
                </label>
                <input
                    v-model="chairmanship_description"
                    type="text"
                    class="form-control"
                    name="chairmanship"
                    id="chairmanship"
                />
            </div>
        </b-modal>

        <b-modal
            id="modal-add"
            size="md"
            title="Add Chairmanship"
            @ok.prevent="createChairmanship()"
            ok-title="Save"
            centered
        >
            <div class="form-group">
                <label for="chairmanship" class="control-label">
                    Chairmanship:
                </label>
                <input
                    v-model="chairmanship_description"
                    type="text"
                    class="form-control"
                    name="chairmanship"
                    id="chairmanship"
                />
            </div>
        </b-modal>

        <b-modal
            id="modal-delete"
            size="md"
            title="Delete Zone"
            centered
            @ok.prevent="deleteChairmanship()"
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
            chairmanship_description: null,
            chairmanships: [],
            currentPage: 1,
            rows: 0,
            perPage: 0,
        };
    },

    methods: {
        async fetchChairmanship() {
            const res = await axios
                .get(`/chairmanship?page=${this.currentPage}`)
                .then((response) => {
                    this.chairmanships = response.data.data;
                    this.currentPage = response.data.current_page;
                    this.rows = response.data.total;
                    this.perPage = response.data.per_page;
                })
                .catch((error) => {
                    return error.response;
                });

            return res;
        },

        async createChairmanship() {
            const data = {
                chairmanship_description: this.chairmanship_description,
                remember_token: localStorage.getItem("token"),
            };

            let res = await this.$store.dispatch(
                "CHAIRMANSHIP/STORE_CHAIRMANSHIP",
                data
            );

            if (res.status == 200) {
                this.$toast.success("Chairmanship Title has been created.");
                this.fetchChairmanship();
                this.resetFields();
            } else {
                this.$toast.error("Something went wrong.");
            }

            this.$bvModal.hide("modal-add");
        },

        setChairmanship(data) {
            this.id = data.id;
            this.chairmanship_description = data.chairmanship_description;
        },

        async updateChairmanship() {
            const data = {
                id: this.id,
                chairmanship_description: this.chairmanship_description,
                remember_token: localStorage.getItem("token"),
            };

            let res = await this.$store.dispatch(
                "CHAIRMANSHIP/UPDATE_CHAIRMANSHIP",
                data
            );

            if (res.status == 200) {
                this.$toast.success("Chairmanship Title has been updated.");
                this.fetchChairmanship();
                this.resetFields();
            } else {
                this.$toast.error("Something went wrong.");
            }

            this.$bvModal.hide("modal-edit");
        },

        async deleteChairmanship() {
            await axios
                .delete(
                    `/chairmanship/${
                        this.id
                    }?remember_token=${localStorage.getItem("token")}`
                )
                .then((response) => {
                    if (response.status == 200) {
                        this.$toast.error(
                            "Chairmanship Title has been deleted."
                        );
                        this.fetchChairmanship();
                        this.resetFields();
                    } else {
                        this.$toast.error("Something went wrong.");
                    }

                    this.$bvModal.hide("modal-delete");
                });
        },

        async resetFields() {
            this.chairmanship_description = null;
        },
    },

    mounted() {
        this.fetchChairmanship();
    },
};
</script>